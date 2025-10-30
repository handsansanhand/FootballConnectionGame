const driver = require("../config/neo4j");

/**
 * POST /guess
 * Body: {
 *   playerA: string,
 *   playerB: string,
 *   guessedPlayer: string,
 *   pathA: { players: [], teams: [], overlapping_years: [] },
 *   pathB: { players: [], teams: [], overlapping_years: [] }
 * }
 */
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

    // find overlaps in Neo4j
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

    // Track which paths this guessed player overlaps with
    const overlapsWithA = new Set();
    const overlapsWithB = new Set();

    // Prepare sets to avoid duplicates in teams/years
    const addedTeamsA = new Set(pathA.teams);
    const addedYearsA = new Set(pathA.overlapping_years);
    const addedTeamsB = new Set(pathB.teams);
    const addedYearsB = new Set(pathB.overlapping_years);

    // Process each overlap record
    result.records.forEach((r) => {
      const overlappingPlayer = r.get("overlappingPlayer");
      const team = r.get("team");
      const overlappingYears = r.get("overlappingYears");

      if (pathA.players.includes(overlappingPlayer)) overlapsWithA.add(overlappingPlayer);
      if (pathB.players.includes(overlappingPlayer)) overlapsWithB.add(overlappingPlayer);

      // Append guessed player + connection info to the first matched path
      if (pathA.players.includes(overlappingPlayer)) {
        if (!pathA.players.includes(guessedPlayer)) pathA.players.push(guessedPlayer);
        if (team && !addedTeamsA.has(team)) {
          pathA.teams.push(team);
          addedTeamsA.add(team);
        }
        if (overlappingYears && !addedYearsA.has(overlappingYears)) {
          pathA.overlapping_years.push(overlappingYears);
          addedYearsA.add(overlappingYears);
        }
      }
      if (pathB.players.includes(overlappingPlayer)) {
        if (!pathB.players.includes(guessedPlayer)) pathB.players.push(guessedPlayer);
        if (team && !addedTeamsB.has(team)) {
          pathB.teams.push(team);
          addedTeamsB.add(team);
        }
        if (overlappingYears && !addedYearsB.has(overlappingYears)) {
          pathB.overlapping_years.push(overlappingYears);
          addedYearsB.add(overlappingYears);
        }
      }
    });

    // Determine if this guessed player connects both paths
    const winner = overlapsWithA.size > 0 && overlapsWithB.size > 0 ? true : null;

    res.json({ success: true, pathA, pathB, winner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await session.close();
  }
}

module.exports = { guess };
