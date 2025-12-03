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
  const isMobile = window.innerWidth < 768;

  const MIN_SPAWN = isMobile ? 80 : 200;
  const MAX_SPAWN = isMobile ? 140 : 350;
  const CENTER_SPACING = isMobile ? 120 : 300;
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

    // Helper to add new nodes if they don't exist
    const addMissingNodes = (existingNodes, path, edges, isA) => {
      const midX = containerSize.width / 2;
      const midY = containerSize.height / 2;

      const allNodes = [...nodesA, ...nodesB, ...existingNodes];

      const newNodes = path.players
        .filter((p) => !existingNodes.some((n) => n.id === p.id || n.id === p))
        .map((p, i) => {
          const playerObj =
            typeof p === "object"
              ? p
              : { id: p, name: String(p), image_url: null };

          const connectedNode = findConnectedNode(
            playerObj.id,
            edges,
            existingNodes
          );

          let pos;
          if (connectedNode) {
            // Increase min/max spacing to spawn further away from connected node
            pos = placeNearNode(
              connectedNode,
              allNodes,
              containerSize.width,
              containerSize.height,
              MIN_SPAWN, // min spacing
              MAX_SPAWN // max spacing
            );
          } else {
            // fallback near center if no connected node
            const startingSpacing = 300; // adjust as needed
            pos = {
              x: isA
                ? midX - CENTER_SPACING + Math.random() * 60 - 30
                : midX + CENTER_SPACING + Math.random() * 60 - 30,
              y: midY + Math.random() * 40 - 20,
            };
          }

          const newNode = {
            id: playerObj.id,
            name: playerObj.name,
            image_url: playerObj.image_url,
            ...pos,
          };

          // Add to allNodes so future nodes avoid it
          allNodes.push(newNode);

          return newNode;
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

    const path = findWinningPath(playerA, playerB, allEdges);

    if (onWinningPathFound && path.length > 0) {
      // This call is now correctly guarded by the length check above.
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

  // Create a Set of canonical keys (sorted ID strings) using the PROP
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
  const handleTouchMove = (e) => {
    if (!dragging.id) return;

    const touch = e.touches[0];
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();

    pt.x = touch.clientX;
    pt.y = touch.clientY;

    const cursor = pt.matrixTransform(svg.getScreenCTM().inverse());

    const { width, height } = containerSize;
    const clampedX = clamp(cursor.x - dragging.offset.x, 0, width);
    const clampedY = clamp(cursor.y - dragging.offset.y, 0, height);

    const updateNodes = (nodes, source) =>
      nodes.map((n) =>
        n.id === dragging.id ? { ...n, x: clampedX, y: clampedY } : n
      );

    if (dragging.source === "A") {
      const updated = updateNodes(nodesA);
      setNodesA(updated);
      localStorage.setItem("nodesA", JSON.stringify(updated));
    } else {
      const updated = updateNodes(nodesB);
      setNodesB(updated);
      localStorage.setItem("nodesB", JSON.stringify(updated));
    }
  };
  const handleTouchStart = (e, node) => {
    const touch = e.touches[0];
    const svg = e.currentTarget.closest("svg");

    const pt = svg.createSVGPoint();
    pt.x = touch.clientX;
    pt.y = touch.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM().inverse());

    const source = nodesA.some((n) => n.id === node.id) ? "A" : "B";

    setDragging({
      id: node.id,
      source,
      offset: { x: cursor.x - node.x, y: cursor.y - node.y },
    });
  };
  return (
    <div
      ref={containerRef}
      className="  w-full h-full bg-grey-100 rounded-lg shadow-inner
  overflow-x-hidden                // disable scrolling on medium+ screens"
  style={{ touchAction: "none" }} 
    >
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={(e) => {
          handleTouchMove(e);
        }}
        onTouchEnd={handleMouseUp}
        style={{ touchAction: "none" }} // <-- add this too
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
                  onTouchStart={handleTouchStart}
                />
              );
            });
          })()}
      </svg>
    </div>
  );
};

export default MultiGraph;
