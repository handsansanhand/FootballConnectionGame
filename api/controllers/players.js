const driver = require("../config/neo4j");

//helper api call to retrieve players where
async function searchPlayers(req, res) {
  const { query } = req.query;
  if (!query || query.trim().length < 2) {
    return res.json([]); // require at least 2 characters before searching
  }
  const session = driver.session();
  try {
    const cypher = `
MATCH (p:Player)
WHERE toLower(p.name) CONTAINS toLower($query)
WITH p,
  CASE
    WHEN toLower(p.name) = toLower($query) THEN 0          // exact match
    WHEN toLower(p.name) STARTS WITH toLower($query) THEN 1 // prefix match
    ELSE 2                                                 // substring match
  END AS priority
RETURN p.player_id AS id, p.name AS name, p.image_url AS image_url
ORDER BY priority, p.name
LIMIT 20
    `;
    const result = await session.run(cypher, { query });
    const players = result.records.map((record) => ({
      id: record.get("id").low ?? record.get("id"), // extract .low if integer
      name: record.get("name"),
      image_url: record.get("image_url"),
    }));
    res.json(players);
  } catch (error) {
    console.error("Neo4j player search error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
}

async function getRandomPlayer(req, res) {
  const session = driver.session();
  try {
    const cypher = `
      MATCH (p:Player)
      WITH p, rand() AS r
      RETURN p.player_id AS id, p.name AS name, p.image_url as image_url
      ORDER BY r
      LIMIT 1
    `;
    const result = await session.run(cypher);
    if (result.records.length === 0) {
      return res.status(404).json({ error: "No players found" });
    }

    const record = result.records[0];
    res.json({
      id: record.get("id").low ?? record.get("id"),
      name: record.get("name"),
      image_url: record.get("image_url"),
    });
  } catch (error) {
    console.error("Neo4j random player error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
}

module.exports = { searchPlayers, getRandomPlayer };
