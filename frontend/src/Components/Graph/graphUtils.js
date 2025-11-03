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
    winningEdges: path.winningEdges || [],
  };
}

export function findWinningPath(start, end, edges) {
  console.log(`making winning path...`);
  // Build adjacency list
  const graph = {};
  for (const edge of edges) {
    const { from, to } = edge;
    if (!graph[from]) graph[from] = [];
    if (!graph[to]) graph[to] = [];
    graph[from].push({ node: to, edge });
    graph[to].push({ node: from, edge }); // Undirected
  }

  // BFS queue
  const queue = [[start, []]];
  const visited = new Set([start]);

  while (queue.length > 0) {
    const [current, path] = queue.shift();
    if (current === end) return path; // found path!

    for (const neighbor of graph[current] || []) {
      if (!visited.has(neighbor.node)) {
        visited.add(neighbor.node);
        queue.push([neighbor.node, [...path, neighbor.edge]]);
      }
    }
  }

  // No path found
  return [];
}

//function which should format the winning path from playerA -> playerB
//presume that playerA is always 'from' in the first entry of the JSON
export function formatWinningPath(winningPath) {
  console.log("win path in format:", JSON.stringify(winningPath, null, 2));
  let from = winningPath[0].from;
  let to = winningPath[0].to;
  for (let i = 1; i < winningPath.length; i++) {
    //are they reversed? i.e the previous to is also a to
    let inst = winningPath[i];
    if(inst.to === to) {
      console.log(`${to} is the wrong way around`);
      //swap them
      let tmp = inst.from;
      inst.from = inst.to;
      inst.to = tmp;
    }
    to = inst.to;
  }
  console.log(`final json: `, JSON.stringify(winningPath, null, 2))
}
