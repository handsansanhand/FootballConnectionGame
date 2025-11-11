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
      MATCH (p1:Player {name: 'Xabi Alonso'}), (p2:Player {name: 'Roy Keane'})
MATCH path = shortestPath((p1)-[:PLAYED_WITH*]-(p2))
UNWIND relationships(path) AS r
OPTIONAL MATCH (t:Team {name: r.team})
WITH path, collect({
  team: r.team,
  overlapping_years: r.overlapping_years,
  team_logo: t.logo_url
}) AS rels_with_team_logos
RETURN 
  [n IN nodes(path) | 
    CASE 
      WHEN n:Player THEN { name: n.name, image_url: n.image_url }
      WHEN n:Team THEN { name: n.name, logo_url: n.logo_url }
    END
  ] AS nodes_in_path,
  rels_with_team_logos AS rels_in_path;
    `;

    const result = await session.run(query, { player1, player2 });

    if (result.records.length === 0) {
      return res
        .status(404)
        .json({ message: "No path found or there was an error finding path." });
    }

    const record = result.records[0];
    const nodes = record.get("nodes_in_path");
    const relationships = record.get("rels_in_path");

    // Extract just the players & teams separately if you want structured JSON
    const players = nodes.filter((n) => n.image_url).map((n) => n);
    const teams = relationships.map((r) => r.team);
    const overlapping_years = relationships.map((r) => r.overlapping_years);

    res.json({ nodes, relationships });
  } catch (error) {
    console.error("Neo4j query error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
}

module.exports = { getShortestPath };
