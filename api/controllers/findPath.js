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

    // --- Check if they are directly connected ---
    const connectionResult = await session.run(
      `
      MATCH (a:Player {player_id: $playerA})-[r:PLAYED_WITH]-(b:Player {player_id: $playerB})
      RETURN r.team AS team, r.overlapping_years AS years
      `,
      { playerA: Number(playerA), playerB: Number(playerB) }
    );

    // Initialize paths
    const pathA = {
      players: playerAObj ? [playerAObj] : [],
      edges: [],
      teams: [],
      overlapping_years: [],
    };
    const pathB = {
      players: playerBObj ? [playerBObj] : [],
      edges: [],
      teams: [],
      overlapping_years: [],
    };

    let winner = false;
    let winningEdges = [];

    if (connectionResult.records.length > 0) {
      // --- Immediate win ---
      winner = true;

      connectionResult.records.forEach((r) => {
        const team = r.get("team");
        const years = r.get("years");

        // Add the other player only if not already in the path
        if (!pathA.players.some((p) => p.id === playerBObj.id))
          pathA.players.push(playerBObj);
        if (!pathB.players.some((p) => p.id === playerAObj.id))
          pathB.players.push(playerAObj);

        // Add team / years info
        pathA.teams.push(team);
        pathB.teams.push(team);
        pathA.overlapping_years.push(years);
        pathB.overlapping_years.push(years);

        const edge = {
          from: playerAObj,
          to: playerBObj,
          team,
          years,
        };

        // **Add edges to path arrays so MultiGraph can render them**
        pathA.edges.push(edge);
        pathB.edges.push(edge);

        // Keep winningEdges for frontend logic
        winningEdges.push(edge);
      });
    }

    return res.json({
      success: true,
      playerA: playerAObj,
      playerB: playerBObj,
      pathA,
      pathB,
      winner,
      winningEdges,
    });
  } catch (err) {
    console.error("Error initializing path:", err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await session.close();
  }
}
async function guess(req, res) {
  const { guessedPlayer, pathA, pathB } = req.body;

  if (!guessedPlayer || (!pathA && !pathB)) {
    return res.status(400).json({ message: "Missing guessed player or paths" });
  }

  const session = driver.session();
  try {
    const allPathPlayerIDs = [
      ...(pathA?.players || []).map((p) => p.id),
      ...(pathB?.players || []).map((p) => p.id),
    ];

    if (allPathPlayerIDs.length === 0) {
      return res
        .status(400)
        .json({ message: "No players in paths to check overlap" });
    }

    // Initialize edges if missing
    pathA.edges = pathA.edges || [];
    pathB.edges = pathB.edges || [];

    // --- Query Neo4j by IDs instead of names ---
    const result = await session.run(
      `
MATCH (g:Player {player_id: $guessedPlayerId})-[r:PLAYED_WITH]-(p:Player)
WHERE p.player_id IN $pathPlayerIDs
OPTIONAL MATCH (t:Team {name: r.team})
RETURN 
    p.player_id AS overlappingPlayerId, 
    r.team AS team, 
    r.overlapping_years AS overlappingYears,
    t.logo_url AS logoUrl
      `,
      {
        guessedPlayerId: Number(guessedPlayer.id),
        pathPlayerIDs: allPathPlayerIDs.map(Number),
      }
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

    const addedTeamsA = new Set(pathA.teams);
    const addedYearsA = new Set(pathA.overlapping_years);
    const addedEdgesA = new Set(
      pathA.edges.map((e) => `${e.from}-${e.to}-${e.team}-${e.years}`)
    );

    const addedTeamsB = new Set(pathB.teams);
    const addedYearsB = new Set(pathB.overlapping_years);
    const addedEdgesB = new Set(
      pathB.edges.map((e) => `${e.from}-${e.to}-${e.team}-${e.years}`)
    );

    // Process each overlap
    result.records.forEach((r) => {
      const overlappingId =
        r.get("overlappingPlayerId").low ?? r.get("overlappingPlayerId"); // handle Neo4j int
      const team = r.get("team");
      const overlappingYears = r.get("overlappingYears");
      const logoUrl = r.get("logoUrl");

      // Find the full player object in pathA or pathB
      const overlappingPlayerA = pathA.players.find(
        (p) => p.id === overlappingId
      );
      const overlappingPlayerB = pathB.players.find(
        (p) => p.id === overlappingId
      );

      // --- Path A ---
      if (overlappingPlayerA) {
        overlapsWithA.add(overlappingId);
        if (!pathA.players.some((p) => p.id === guessedPlayer.id))
          pathA.players.push(guessedPlayer);

        if (team && !addedTeamsA.has(team)) {
          pathA.teams.push(team);
          addedTeamsA.add(team);
        }

        if (overlappingYears && !addedYearsA.has(overlappingYears)) {
          pathA.overlapping_years.push(overlappingYears);
          addedYearsA.add(overlappingYears);
        }

        const edgeKey = `${overlappingId}-${guessedPlayer.id}-${team}-${overlappingYears}`;
        if (!addedEdgesA.has(edgeKey)) {
          pathA.edges.push({
            from: overlappingPlayerA,
            to: guessedPlayer,
            team,
            logoUrl,
            years: overlappingYears,
          });
          addedEdgesA.add(edgeKey);
        }
      }

      // --- Path B ---
      if (overlappingPlayerB) {
        overlapsWithB.add(overlappingId);
        if (!pathB.players.some((p) => p.id === guessedPlayer.id))
          pathB.players.push(guessedPlayer);

        if (team && !addedTeamsB.has(team)) {
          pathB.teams.push(team);
          addedTeamsB.add(team);
        }

        if (overlappingYears && !addedYearsB.has(overlappingYears)) {
          pathB.overlapping_years.push(overlappingYears);
          addedYearsB.add(overlappingYears);
        }

        const edgeKey = `${overlappingId}-${guessedPlayer.id}-${team}-${overlappingYears}`;
        if (!addedEdgesB.has(edgeKey)) {
          pathB.edges.push({
            from: overlappingPlayerB,
            to: guessedPlayer,
            team,
            logoUrl,
            years: overlappingYears,
          });
          addedEdgesB.add(edgeKey);
        }
      }
    });

    // Determine if guessed player connects both paths
    let winner = null;
    const winningEdgesSet = new Set();
    const winningEdges = [];
    const addEdgeUnique = (e) => {
      const key = `${e.from.id}-${e.to.id}-${e.team}-${e.years}`;
      if (!winningEdgesSet.has(key)) {
        winningEdgesSet.add(key);
        winningEdges.push(e);
      }
    };

    if (overlapsWithA.size > 0 && overlapsWithB.size > 0) {
      winner = true;
      pathA.edges.forEach((e) => {
        if (e.from.id === guessedPlayer.id || e.to.id === guessedPlayer.id)
          addEdgeUnique(e);
      });
      pathB.edges.forEach((e) => {
        if (e.from.id === guessedPlayer.id || e.to.id === guessedPlayer.id)
          addEdgeUnique(e);
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
