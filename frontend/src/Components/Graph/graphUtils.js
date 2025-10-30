export const formatYear = (yearStr) => {
  if (!yearStr) return "";
  const years = yearStr.split("-");
  if (years.length === 2 && years[0] === years[1]) return years[1];
  return yearStr;
};

export const buildConnections = (nodes, pathJson) => {
  return nodes.slice(1).map((node, index) => ({
    from: nodes[index],
    to: node,
    team: pathJson.teams[index] || "",
    year: pathJson.overlapping_years[index] || "",
  }));
};

export function simplifyPathJSON(json) {
  const result = {};
  if (json.pathA) result.pathA = json.pathA;
  else result.pathA = { players: [], teams: [], overlapping_years: [] };

  if (json.pathB) result.pathB = json.pathB;
  else result.pathB = { players: [], teams: [], overlapping_years: [] };

  return result;
}