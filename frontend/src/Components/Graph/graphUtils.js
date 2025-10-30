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

export function simplifyPathJSON(path) {
  return {
    pathA: {
      players: path.pathA.players || [],
      teams: path.pathA.teams || [],
      overlapping_years: path.pathA.overlapping_years || [],
      edges: path.pathA.edges || [],
    },
    pathB: {
      players: path.pathB.players || [],
      teams: path.pathB.teams || [],
      overlapping_years: path.pathB.overlapping_years || [],
      edges: path.pathB.edges || [],
    },
    winner: path.winner || null, 
    winningEdges: path.winningEdges || []
  };
}