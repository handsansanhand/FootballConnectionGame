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
 // console.log(`making winning path...`);
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
 // console.log("win path in format:", JSON.stringify(winningPath, null, 2));
  let from = winningPath[0].from;
  let to = winningPath[0].to;
  for (let i = 1; i < winningPath.length; i++) {
    //are they reversed? i.e the previous to is also a to
    let inst = winningPath[i];
    if (inst.to === to) {
   //   console.log(`${to} is the wrong way around`);
      //swap them
      let tmp = inst.from;
      inst.from = inst.to;
      inst.to = tmp;
    }
    to = inst.to;
  }
  //console.log(`final json: `, JSON.stringify(winningPath, null, 2));
}

// edges = path.edges (or pathA.edges / pathB.edges)
export const findConnectedNode = (playerId, edges, existingNodes) => {
  // find an edge where playerId is 'to' and 'from' exists in existing nodes
  const edge = edges.find(
    (e) => e.to === playerId && existingNodes.some((n) => n.id === e.from)
  );
  if (edge) {
    return existingNodes.find((n) => n.id === edge.from);
  }
  return null;
};

export const placeNearNode = (node, containerWidth, containerHeight, minSpacing = 50, maxSpacing = 120) => {
  const angle = Math.random() * 2 * Math.PI;
  const radius = minSpacing + Math.random() * (maxSpacing - minSpacing);

  let x = node.x + radius * Math.cos(angle);
  let y = node.y + radius * Math.sin(angle);

  // Clamp to container bounds
  x = Math.min(Math.max(x, 0), containerWidth);
  y = Math.min(Math.max(y, 0), containerHeight);

  return { x, y };
};

/**
 * Converts an array of edges to the format Graph expects:
 * {
 *   players: [...],
 *   teams: [...],
 *   overlapping_years: [...]
 * }
 *
 * Assumes edges are in order from playerA -> playerB.
 */
export function edgesToGraphFormat(edges) {
  if (!edges || edges.length === 0) return { players: [], teams: [], overlapping_years: [] };

  const players = [edges[0].from]; // start with first 'from'
  const teams = [];
  const overlapping_years = [];

  edges.forEach((edge) => {
    // ensure edge is in correct direction
    if (players[players.length - 1] !== edge.from) {
      // swap if needed
      const tmp = edge.from;
      edge.from = edge.to;
      edge.to = tmp;
    }

    players.push(edge.to);
    teams.push(edge.team || "");
    overlapping_years.push(edge.years || "");
  });

  return { players, teams, overlapping_years };
}