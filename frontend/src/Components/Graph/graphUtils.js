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

  start = typeof start === "object" ? start.id : start;
  end = typeof end === "object" ? end.id : end;

  start = Number(start); 
  end = Number(end); 

  // Build adjacency list
  const graph = {};
  for (const edge of edges) {
    const fromId = typeof edge.from === "object" ? edge.from.id : edge.from;
    const toId = typeof edge.to === "object" ? edge.to.id : edge.to;

    if (!graph[fromId]) graph[fromId] = [];
    if (!graph[toId]) graph[toId] = [];

    graph[fromId].push({ node: toId, edge });
    graph[toId].push({ node: fromId, edge }); // Undirected
  }


  // BFS
  const queue = [[start, []]];
  const visited = new Set([start]);

  while (queue.length > 0) {
    const [current, path] = queue.shift();
    if (current === end) return path;

    for (const neighbor of graph[current] || []) {
      if (!visited.has(neighbor.node)) {
        visited.add(neighbor.node);
        queue.push([neighbor.node, [...path, neighbor.edge]]);
      }
    }
  }

  return [];
}
//function which should format the winning path from playerA -> playerB
//presume that playerA is always 'from' in the first entry of the JSON
export function formatWinningPath(winningPath) {

  if (!winningPath || winningPath.length === 0) return winningPath;

  for (let i = 1; i < winningPath.length; i++) {
    const prev = winningPath[i - 1];
    const curr = winningPath[i];

    // If the previous "to" player doesn't match this "from" player
    // it means this edge is reversed
    if (curr.to.id === prev.to.id || curr.to.name === prev.to.name) {
      // swap the direction
      const tmp = curr.from;
      curr.from = curr.to;
      curr.to = tmp;
    }
  }

  return winningPath;
}

// edges = path.edges (or pathA.edges / pathB.edges)
export const findConnectedNode = (playerId, edges, existingNodes) => {
  // find an edge where playerId is 'to' and 'from' exists in existing nodes
  const edge = edges.find(
    (e) => e.to.id === playerId && existingNodes.some((n) => n.id === e.from.id)
  );

  if (edge) {
    // return the 'from' node from existingNodes
    return existingNodes.find((n) => n.id === edge.from.id);
  }
  return null;
};

/**
 * Place a node near a connected node without overlapping others
 * @param {Object} node - The node to place near (must have x, y)
 * @param {Array} allNodes - Array of all existing nodes ({x, y, id})
 * @param {number} containerWidth
 * @param {number} containerHeight
 * @param {number} minSpacing - Minimum distance from other nodes
 * @param {number} maxSpacing - Max distance from connected node
 * @returns {Object} - {x, y}
 */
export const placeNearNode = (
  node,
  allNodes,
  containerWidth,
  containerHeight,
  minSpacing = 80,
  maxSpacing = 120
) => {
  let tries = 0;
  let x, y;

  while (tries < 50) {
    const angle = Math.random() * 2 * Math.PI;
    const radius = minSpacing + Math.random() * (maxSpacing - minSpacing);

    x = node.x + radius * Math.cos(angle);
    y = node.y + radius * Math.sin(angle);

    // Clamp to container bounds
    x = Math.min(Math.max(x, 0), containerWidth);
    y = Math.min(Math.max(y, 0), containerHeight);

    // Check for overlaps
    let safe = true;
    for (const other of allNodes) {
      const dx = x - other.x;
      const dy = y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minSpacing) {
        safe = false;
        break;
      }
    }

    if (safe) return { x, y };
    tries++;
  }

  // fallback: return last computed position (even if overlaps)
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
  if (!edges || edges.length === 0)
    return { players: [], teams: [], overlapping_years: [] };

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
