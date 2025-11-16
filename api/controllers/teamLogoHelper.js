// --- teamLogoHelper.js ---
const driver = require("../config/neo4j");

// In-memory cache: teamName -> logo_url
const teamLogoCache = new Map();

/**
 * Get the logo_url for a team.
 * First checks the cache; if missing, queries Neo4j.
 * @param {string} teamName
 * @returns {Promise<string|null>} logo_url or null if not found
 */
async function getTeamLogo(teamName) {
  if (!teamName) return null;

  // Check cache first
  if (teamLogoCache.has(teamName)) {
    return teamLogoCache.get(teamName);
  }

  const session = driver.session();
  try {
    const result = await session.run(
      `
      MATCH (t:Team {name: $teamName})
      RETURN t.logo_url AS logo_url
      `,
      { teamName }
    );

    if (result.records.length > 0) {
      const logoUrl = result.records[0].get("logo_url") || null;
      teamLogoCache.set(teamName, logoUrl); // store in cache
      return logoUrl;
    }
    return null;
  } catch (err) {
    console.error("Error fetching team logo:", err);
    return null;
  } finally {
    await session.close();
  }
}

module.exports = { getTeamLogo };