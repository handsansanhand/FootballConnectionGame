import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import GraphNode from "./GraphNode";
import {
  findWinningPath,
  findConnectedNode,
  placeNearNode,
} from "./graphUtils";
import GraphEdge from "./GraphEdge";

const MultiGraph = ({
  pathA,
  pathB,
  winner,
  onWin,
  playerA,
  playerB,
  onWinningPathFound,
  winningPath,
}) => {
  // --- Refs & State ---
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [nodesA, setNodesA] = useState([]);
  const [nodesB, setNodesB] = useState([]);
  const [dragging, setDragging] = useState({
    id: null,
    source: null,
    offset: { x: 0, y: 0 },
  });
  const [winnerAlerted, setWinnerAlerted] = useState(false);
  const [layoutReady, setLayoutReady] = useState(false);
  // --- Helpers ---
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getNodePosition = (id) =>
    nodesA.find((n) => n.id === id) ||
    nodesB.find((n) => n.id === id) || { x: 0, y: 0 };

  // --- Handle Container Resize ---
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      setContainerSize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Compute Initial Node Positions ---
  useEffect(() => {
    const { width, height } = containerSize;
    if (!pathA || !pathB || width === 0 || height === 0) return;
    const midY = height / 2;
    const spacing = width / 2;
    //console.log(`path is this: `, JSON.stringify(pathA, null, 2));
    // Helper to add new nodes if they don't exist
    const addMissingNodes = (existingNodes, path, edges, isA) => {
      const midX = containerSize.width / 2;
      const midY = containerSize.height / 2;

      const baseSpacing = 160;
      const shiftAmount = 60;
      const minDistance = 120; // 🆕 how far apart nodes must be

      // Combine all known nodes so we can check overlaps globally
      const allNodes = [...nodesA, ...nodesB, ...existingNodes];

      const newNodes = path.players
        .filter((p) => !existingNodes.some((n) => n.id === p.id || n.id === p))
        .map((p, i) => {
          let playerObj =
            typeof p === "object"
              ? p
              : { id: p, name: String(p), image_url: null };
          let x, y;
          const connectedNode = findConnectedNode(
            playerObj.id,
            edges,
            existingNodes
          );

          if (connectedNode) {
            const horizontal = Math.random() > 0.3;
            const direction = Math.random() > 0.5 ? 1 : -1;

            if (horizontal) {
              connectedNode.x += direction * shiftAmount;
              connectedNode.y += Math.random() * 40 - 20;

              x = connectedNode.x - direction * (baseSpacing + shiftAmount);
              y = connectedNode.y + (Math.random() * 80 - 40);
            } else {
              connectedNode.y += direction * shiftAmount;
              connectedNode.x += Math.random() * 40 - 20;

              x = connectedNode.x + (Math.random() * 40 - 20);
              y = connectedNode.y - direction * (baseSpacing + shiftAmount);
            }
          } else {
            // fallback near center
            x = isA ? midX - baseSpacing * i : midX + baseSpacing * i;
            y = isA ? midY - 60 : midY + 60;
          }

          // --- Collision avoidance ---
          const repel = (x, y) => {
            let safe = false;
            let tries = 0;
            while (!safe && tries < 50) {
              safe = true;
              for (const other of allNodes) {
                const dx = x - other.x;
                const dy = y - other.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < minDistance) {
                  // too close — push further away
                  const angle = Math.atan2(dy, dx);
                  x += Math.cos(angle) * (minDistance - dist);
                  y += Math.sin(angle) * (minDistance - dist);
                  safe = false;
                }
              }
              tries++;
            }
            return { x, y };
          };

          const adjusted = repel(x, y);
          x = adjusted.x;
          y = adjusted.y;
          const normalizedNode = {
            id: playerObj.id,
            name: playerObj.name,
            image_url: playerObj.image_url,
            x,
            y,
          };
          // Add this new node to allNodes so future nodes avoid it
          allNodes.push(normalizedNode);

          return normalizedNode;
        });

      return [...existingNodes, ...newNodes];
    };

    // Load stored nodes or initialize empty
    let storedNodesA = JSON.parse(localStorage.getItem("nodesA") || "[]");
    let storedNodesB = JSON.parse(localStorage.getItem("nodesB") || "[]");

    storedNodesA = addMissingNodes(storedNodesA, pathA, pathA.edges, true);
    storedNodesB = addMissingNodes(storedNodesB, pathB, pathB.edges, false);

    setNodesA(storedNodesA);
    setNodesB(storedNodesB);

    setLayoutReady(true);

    // Persist updated nodes
    localStorage.setItem("nodesA", JSON.stringify(storedNodesA));
    localStorage.setItem("nodesB", JSON.stringify(storedNodesB));
  }, [pathA, pathB, containerSize]); // Keep this useEffect to set the WINNER FLAG and CALL onWinningPathFound // but it no longer needs to update its own local 'winningPath' state.

  // --- Compute Winning Path ---
  useEffect(() => {
    if (
      !pathA ||
      !pathB ||
      !playerA ||
      !playerB ||
      !pathA.edges ||
      !pathB.edges
    )
      return;

    const allEdges = [...(pathA.edges || []), ...(pathB.edges || [])];

    if (allEdges.length === 0) return;

    // NEW GUARD: If the current winningPath prop is already length 2, stop recalculating.
    if (winningPath.length > 0 && winningPath.length <= 2) {
      console.log(
        "MultiGraph: Shortest path already found. Skipping recalculation."
      );
      return;
    }

    const path = findWinningPath(playerA, playerB, allEdges);
    console.log(`MY RETURNED WINNING PATH IS OF LENGTH ${path.length}`);
    if (onWinningPathFound && path.length > 0) {
      // This call is now correctly guarded by the length check above.
      console.log(
        `IN MULTI GRAPH I HAVE FOUND A WINNING PATH `,
        JSON.stringify(path, null, 2)
      );
      onWinningPathFound(path);
    }
  }, [
    pathA.edges,
    pathB.edges,
    playerA,
    playerB,
    onWinningPathFound,
    winningPath.length,
  ]);

  // 1. Create a Set of canonical keys (sorted ID strings) using the PROP
  const winningEdgeKeys = new Set(
    winningPath.map((edge) => [edge.from.id, edge.to.id].sort().join("_"))
  );
  // --- Handle Win Condition ---
  useLayoutEffect(() => {
    if (!winner || winnerAlerted) return;
    const allNodes = [...nodesA, ...nodesB];
    if (allNodes.length === 0) return;
    if (!allNodes.every((n) => n.x !== 0 || n.y !== 0)) return;

    if (onWin) onWin(true);
    setWinnerAlerted(true);
  }, [winner, nodesA, nodesB, winnerAlerted, onWin]);

  // --- Drag Handlers ---
  const handleMouseDown = (e, node) => {
    e.stopPropagation();
    const svg = e.currentTarget.closest("svg");
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM().inverse());
    const source = nodesA.some((n) => n.id === node.id) ? "A" : "B";

    setDragging({
      id: node.id,
      source,
      offset: { x: cursor.x - node.x, y: cursor.y - node.y },
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging.id) return;
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM().inverse());

    const { width, height } = containerSize;
    const clampedX = clamp(cursor.x - dragging.offset.x, 0, width);
    const clampedY = clamp(cursor.y - dragging.offset.y, 0, height);

    const updateNodes = (nodes, source) =>
      nodes.map((n) =>
        n.id === dragging.id ? { ...n, x: clampedX, y: clampedY } : n
      );

    if (dragging.source === "A") {
      const updated = updateNodes(nodesA, "A");
      setNodesA(updated);
      localStorage.setItem("nodesA", JSON.stringify(updated)); // persist
    } else {
      const updated = updateNodes(nodesB, "B");
      setNodesB(updated);
      localStorage.setItem("nodesB", JSON.stringify(updated)); // persist
    }
  };

  const handleMouseUp = () =>
    setDragging({ id: null, source: null, offset: { x: 0, y: 0 } });

  // --- Render ---
  const allNodesExist =
    pathA.players.every((p) => nodesA.some((n) => n.id === p.id)) &&
    pathB.players.every((p) => nodesB.some((n) => n.id === p.id));

  if (
    containerSize.width === 0 ||
    containerSize.height === 0 ||
    !layoutReady ||
    nodesA.length === 0 ||
    nodesB.length === 0
  )
    return <div ref={containerRef} className="w-full h-full" />;
  // Combine and deduplicate edges
  const combinedEdges = [...pathA.edges, ...pathB.edges];
  const isMobile = window.innerWidth < 768;
  // Create a unique set based on from/to ids (direction-agnostic)
  const uniqueEdges = combinedEdges.filter((edge, index, self) => {
    const key1 = `${edge.from.id}-${edge.to.id}`;
    const key2 = `${edge.to.id}-${edge.from.id}`;
    return (
      index ===
      self.findIndex(
        (e) =>
          (e.from.id === edge.from.id && e.to.id === edge.to.id) ||
          (e.from.id === edge.to.id && e.to.id === edge.from.id)
      )
    );
  });
  return (
    <div
      ref={containerRef}
      className="  w-full h-full bg-grey-100 rounded-lg shadow-inner
  overflow-x-auto overflow-y-hidden   // default (mobile)
  md:overflow-x-hidden                // disable scrolling on medium+ screens"
    >
      <svg
        width={isMobile ? "1200" : "100%"}
        height="100%"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* --- Render Edges --- */}
        {layoutReady &&
          uniqueEdges.map((edge, i) => {
            const from = getNodePosition(edge.from.id);
            const to = getNodePosition(edge.to.id);
            const currentKey = [edge.from.id, edge.to.id].sort().join("_");
            const isWinningEdge = winningEdgeKeys.has(currentKey);
            const edgeColor = isWinningEdge ? "gold" : "black"; // <- Determine the color
            const edgeKey = `${edge.from.id}-${edge.to.id}-${edge.team}-${edge.years}`;

            //console.log(`EDGE BEING PASSED IS `, JSON.stringify(edge, null, 2))
            return (
              <GraphEdge
                key={i}
                from={from}
                to={to}
                team={edge.team}
                teamLogo={edge.logoUrl}
                years={edge.years}
                color={edgeColor}
              />
            );
          })}
        {/* --- Render Nodes --- */}
        {layoutReady &&
          (() => {
            const seen = new Set();
            const mergedNodes = [...nodesA, ...nodesB].filter((n) => {
              if (seen.has(n.id)) return false;
              seen.add(n.id);
              return true;
            });

            return mergedNodes.map((n) => {
              const nodeIdString = String(n.id);
              const normalizedPlayerA = String(playerA);
              const normalizedPlayerB = String(playerB);
              const isPlayerA = nodeIdString === normalizedPlayerA;
              const isPlayerB = nodeIdString === normalizedPlayerB;

              const color = isPlayerA || isPlayerB ? "gold" : "black";
              return (
                <GraphNode
                  key={n.id}
                  node={n}
                  color={color}
                  onMouseDown={handleMouseDown}
                />
              );
            });
          })()}
      </svg>
    </div>
  );
};

export default MultiGraph;
