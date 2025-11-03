import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import GraphNode from "./GraphNode";
import { findWinningPath } from "./graphUtils";

const MultiGraph = ({ pathA, pathB, winner, onWin, playerA, playerB }) => {
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
  const [winningPath, setWinningPath] = useState([]);

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

    const getRandomOffset = () => {
      const radiusX = width * 0.2;
      const radiusY = height * 0.2;
      const angle = Math.random() * 2 * Math.PI;
      return { dx: Math.cos(angle) * radiusX, dy: Math.sin(angle) * radiusY };
    };

    const addNodes = (prev, path, isA) => {
      const existing = new Set(prev.map((n) => n.id));
      const spacing = width / 2 / (path.players.length + 1);

      const newNodes = path.players
        .filter((p) => !existing.has(p))
        .map((p, i) => {
          const connectedEdge = (path.edges || []).find(
            (e) => e.to === p || e.from === p
          );
          const connectedId = connectedEdge
            ? connectedEdge.from === p
              ? connectedEdge.to
              : connectedEdge.from
            : null;
          const connectedNode = prev.find((n) => n.id === connectedId);

          if (connectedNode) {
            const { dx, dy } = getRandomOffset();
            return {
              id: p,
              x: clamp(connectedNode.x + dx, 0, width),
              y: clamp(connectedNode.y + dy, 0, height),
            };
          }

          return {
            id: p,
            x: isA ? spacing * (i + 1) : width - spacing * (i + 1),
            y: isA ? midY - 50 : midY + 50,
          };
        });

      return [...prev, ...newNodes];
    };

    setNodesA((prev) => addNodes(prev, pathA, true));
    setNodesB((prev) => addNodes(prev, pathB, false));
  }, [pathA, pathB, containerSize]);

  // --- Compute Winning Path ---
  useEffect(() => {
    if (!pathA || !pathB || !playerA || !playerB) return;

    const allEdges = [...(pathA.edges || []), ...(pathB.edges || [])];
    const path = findWinningPath(playerA, playerB, allEdges);
    setWinningPath(path);

  }, [pathA, pathB, playerA, playerB]);

  const winningPathKeys = new Set(
    winningPath.map((e) => `${e.from}-${e.to}-${e.team}-${e.years}`)
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

    if (dragging.source === "A") setNodesA((prev) => updateNodes(prev, "A"));
    else setNodesB((prev) => updateNodes(prev, "B"));
  };

  const handleMouseUp = () =>
    setDragging({ id: null, source: null, offset: { x: 0, y: 0 } });

  // --- Render ---
  const allNodesExist =
    pathA.players.every((p) => nodesA.some((n) => n.id === p)) &&
    pathB.players.every((p) => nodesB.some((n) => n.id === p));

  if (containerSize.width === 0 || containerSize.height === 0)
    return <div ref={containerRef} className="w-full h-full" />;

  return (
    <div
      ref={containerRef}
      className="w-full h-[500px] bg-gray-100 rounded-lg shadow-inner"
    >
      <svg
        width="100%"
        height="100%"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* --- Render Edges --- */}
        {allNodesExist &&
          [...pathA.edges, ...pathB.edges].map((edge, i) => {
            const from = getNodePosition(edge.from);
            const to = getNodePosition(edge.to);
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            const angle =
              Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);
            const flip = to.x - from.x < 0;
            const textRotation = flip ? angle + 180 : angle;

            const edgeKey = `${edge.from}-${edge.to}-${edge.team}-${edge.years}`;
            const color = winningPathKeys.has(edgeKey)
              ? "gold"
              : pathA.edges.includes(edge)
              ? "red"
              : "blue";

            return (
              <g key={`edge-${i}`}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={color}
                  strokeWidth={3}
                />
                <g transform={`rotate(${textRotation}, ${midX}, ${midY})`}>
                  <text
                    x={midX}
                    y={midY - 10}
                    textAnchor="middle"
                    fontSize="12"
                    fill="black"
                  >
                    {edge.team}
                  </text>
                  <text
                    x={midX}
                    y={midY + 15}
                    textAnchor="middle"
                    fontSize="12"
                    fill="black"
                  >
                    {edge.years}
                  </text>
                </g>
              </g>
            );
          })}

        {/* --- Render Nodes --- */}
        {(() => {
          const seen = new Set();
          const mergedNodes = [...nodesA, ...nodesB].filter((n) => {
            if (seen.has(n.id)) return false;
            seen.add(n.id);
            return true;
          });

          return mergedNodes.map((n) => {
            const color = nodesA.some((a) => a.id === n.id) ? "red" : "blue";
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
