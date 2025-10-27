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
     RETURN p.name AS name
     LIMIT 20
    `;
    const result = await session.run(cypher, { query });
    const names = result.records.map(record => record.get('name'));
    res.json(names);
  } catch (error) {
    console.error('Neo4j player search error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await session.close();
  }
}


module.exports = { searchPlayers };