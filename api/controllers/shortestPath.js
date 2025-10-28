/* Controller responsible for finding the shortest route/path between two players
 */
const driver = require("../config/neo4j");

async function getShortestPath(req, res) {
  const { player1, player2 } = req.query;
  if (!player1 || !player2) {
    return res
      .status(400)
      .json({ error: "Both player1 and player2 are required." });
  }
  const session = driver.session();
  console.log("Running shortest path query for " + player1 + " and " + player2);
  try {
    const query = `
      MATCH (p1:Player {name: $player1}), (p2:Player {name: $player2})
      MATCH path = shortestPath((p1)-[:PLAYED_WITH*]-(p2))
      RETURN 
        [n IN nodes(path) | n.name] AS players_in_path,
        [r IN relationships(path) | r.team] AS teams_in_path,
        [r IN relationships(path) | r.overlapping_years] AS overlapping_years_in_path;
    `;
    const result = await session.run(query, { player1, player2 });
    
    if (result.records.length === 0) {
      return res.status(404).json({ message: 'No path found or there was an error finding path.' });
    }
    const record = result.records[0];
    const players = record.get('players_in_path');
    const teams = record.get('teams_in_path');
    const overlapping_years = record.get('overlapping_years_in_path');
    res.json({ players, teams, overlapping_years });
  } catch (error) {
    console.error('Neo4j query error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await session.close();
  }
  res.json();
}

module.exports = { getShortestPath };
