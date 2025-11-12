const driver = require("../config/neo4j");

/**
 * POST /guess
 * Body: {
 *   playerA: string,
 *   playerB: string,
 *   guessedPlayer: string,
 *   pathA: { players: [], edges: [], teams: [], overlapping_years: [] },
 *   pathB: { players: [], edges: [], teams: [], overlapping_years: [] }
 * }
 */

async function initializePath(req, res) {
  const { playerA, playerB } = req.body;

  if (!playerA || !playerB) {
    return res.status(400).json({ message: "Missing playerA or playerB" });
  }

  const session = driver.session();
  try {
    // --- Fetch full player info ---
    const playersResult = await session.run(
      `
      MATCH (p:Player)
      WHERE p.player_id IN [$playerA, $playerB]
      RETURN p.player_id AS id, p.name AS name, p.image_url AS image_url
      `,
      { playerA: Number(playerA), playerB: Number(playerB) }
    );

    const players = {};
    playersResult.records.forEach((r) => {
      const id = r.get("id").low ?? r.get("id"); // handle Neo4j integers
      players[id] = {
        id,
        name: r.get("name"),
        image_url: r.get("image_url"),
      };
    });

    const playerAObj = players[playerA];
    const playerBObj = players[playerB];

    // --- Initialize empty paths ---
    const pathA = { players: [playerAObj], edges: [], teams: [], overlapping_years: [] };
    const pathB = { players: [playerBObj], edges: [], teams: [], overlapping_years: [] };

    return res.json({
      success: true,
      playerA: playerAObj,
      playerB: playerBObj,
      pathA,
      pathB,
      winner: false,
      winningEdges: [],
    });
  } catch (err) {
    console.error("Error initializing path:", err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await session.close();
  }
}
async function guess(req, res) {
  const { playerA, playerB, guessedPlayer, pathA, pathB } = req.body;

  if (!guessedPlayer || (!pathA && !pathB)) {
    return res.status(400).json({ message: "Missing guessed player or paths" });
  }

  const session = driver.session();

  try {
    const allPathPlayers = [
      ...(pathA?.players || []),
      ...(pathB?.players || []),
    ];

    if (allPathPlayers.length === 0) {
      return res
        .status(400)
        .json({ message: "No players in paths to check overlap" });
    }

    // Initialize edges if missing
    pathA.edges = pathA.edges || [];
    pathB.edges = pathB.edges || [];

    // Query Neo4j for overlaps
    const result = await session.run(
      `
MATCH (g:Player {name: $guessedPlayer})-[r:PLAYED_WITH]-(p:Player)
WHERE p.name IN $pathPlayers
RETURN p.name AS overlappingPlayer, r.team AS team, r.overlapping_years AS overlappingYears
      `,
      { guessedPlayer, pathPlayers: allPathPlayers }
    );

    if (result.records.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Guessed player does not overlap with any path player",
      });
    }

    // Track overlaps per path
    const overlapsWithA = new Set();
    const overlapsWithB = new Set();

    // Prepare sets to avoid duplicates in teams/years
    const addedTeamsA = new Set(pathA.teams);
    const addedYearsA = new Set(pathA.overlapping_years);
    const addedTeamsB = new Set(pathB.teams);
    const addedYearsB = new Set(pathB.overlapping_years);
    // Process each overlap record
    const addedEdgesA = new Set(
      pathA.edges.map((e) => `${e.from}-${e.to}-${e.team}-${e.years}`)
    );
    const addedEdgesB = new Set(
      pathB.edges.map((e) => `${e.from}-${e.to}-${e.team}-${e.years}`)
    );

    result.records.forEach((r) => {
      const overlappingPlayer = r.get("overlappingPlayer");
      const team = r.get("team");
      const overlappingYears = r.get("overlappingYears");

      // --- Path A ---
      if (pathA.players.includes(overlappingPlayer)) {
        overlapsWithA.add(overlappingPlayer);
        if (!pathA.players.includes(guessedPlayer))
          pathA.players.push(guessedPlayer);

        // Add team if not already present
        if (team && !addedTeamsA.has(team)) {
          pathA.teams.push(team);
          addedTeamsA.add(team);
        }

        // Add overlappingYears if not already present
        if (overlappingYears && !addedYearsA.has(overlappingYears)) {
          pathA.overlapping_years.push(overlappingYears);
          addedYearsA.add(overlappingYears);
        }

        const edgeKey = `${overlappingPlayer}-${guessedPlayer}-${team}-${overlappingYears}`;
        if (!addedEdgesA.has(edgeKey)) {
          pathA.edges.push({
            from: overlappingPlayer,
            to: guessedPlayer,
            team,
            years: overlappingYears,
          });
          addedEdgesA.add(edgeKey);
        }
      }

      // --- Path B ---
      if (pathB.players.includes(overlappingPlayer)) {
        overlapsWithB.add(overlappingPlayer);
        if (!pathB.players.includes(guessedPlayer))
          pathB.players.push(guessedPlayer);

        if (team && !addedTeamsB.has(team)) {
          pathB.teams.push(team);
          addedTeamsB.add(team);
        }

        if (overlappingYears && !addedYearsB.has(overlappingYears)) {
          pathB.overlapping_years.push(overlappingYears);
          addedYearsB.add(overlappingYears);
        }

        const edgeKey = `${overlappingPlayer}-${guessedPlayer}-${team}-${overlappingYears}`;
        if (!addedEdgesB.has(edgeKey)) {
          pathB.edges.push({
            from: overlappingPlayer,
            to: guessedPlayer,
            team,
            years: overlappingYears,
          });
          addedEdgesB.add(edgeKey);
        }
      }
    });
    console.log(overlapsWithA);
    console.log(overlapsWithB);
    // Determine if guessed player connects both paths
    // --- Now determine winner and winningEdges ---
    let winner = null;
    const winningEdgesSet = new Set();
    const winningEdges = [];
    function addEdgeUnique(e) {
      const key = `${e.from}-${e.to}-${e.team}-${e.years}`;
      if (!winningEdgesSet.has(key)) {
        winningEdgesSet.add(key);
        winningEdges.push(e);
      }
    }
    if (overlapsWithA.size > 0 && overlapsWithB.size > 0) {
      winner = true;

      // find edges connecting guessedPlayer to overlaps in both paths
      pathA.edges.forEach((e) => {
        if (
          e.to === guessedPlayer ||
          e.from === guessedPlayer ||
          overlapsWithA.has(e.from) ||
          overlapsWithA.has(e.to)
        ) {
          addEdgeUnique(e);
        }
      });
      pathB.edges.forEach((e) => {
        if (
          e.to === guessedPlayer ||
          e.from === guessedPlayer ||
          overlapsWithB.has(e.from) ||
          overlapsWithB.has(e.to)
        ) {
          addEdgeUnique(e);
        }
      });
    }

    res.json({ success: true, pathA, pathB, winner, winningEdges });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await session.close();
  }
}

module.exports = { guess, initializePath };
