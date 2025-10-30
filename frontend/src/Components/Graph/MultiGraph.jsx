import React, { useRef, useState, useEffect } from "react";
import GraphNode from "./GraphNode";

const MultiGraph = ({ pathA, pathB }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [nodesA, setNodesA] = useState([]);
  const [nodesB, setNodesB] = useState([]);
  const [draggingNode, setDraggingNode] = useState(null);
  const [dragSource, setDragSource] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // --- Clamp helper ---
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  // --- Handle container resize ---
  useEffect(() => {
    if (!containerRef.current) return;
    const handleResize = () => {
      setContainerWidth(containerRef.current.offsetWidth);
      setContainerHeight(containerRef.current.offsetHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Compute initial node positions ---
  useEffect(() => {
    if (!pathA || !pathB || containerWidth === 0 || containerHeight === 0)
      return;
    
    const midY = containerHeight / 2;
    const halfWidth = containerWidth / 2;

    const getRandomOffset = () => {
      const radiusX = containerWidth * 0.2; // 10% of width
      const radiusY = containerHeight * 0.2; // 10% of height
      const angle = Math.random() * 2 * Math.PI;
      return {
        dx: Math.cos(angle) * radiusX,
        dy: Math.sin(angle) * radiusY,
      };
    };

    const addNodes = (prevNodes, path, isPathA = true) => {
      const existingIds = new Set(prevNodes.map((n) => n.id));
      const spacing = (containerWidth / 2) / (path.players.length + 1);

      const newNodes = path.players
        .filter((player) => !existingIds.has(player))
        .map((player, i) => {
          // Check for connected node
          const edge = (path.edges || []).find(
            (e) => e.to === player || e.from === player
          );
          if (edge) {
            const connectedId = edge.from === player ? edge.to : edge.from;
            const connectedNode = prevNodes.find((n) => n.id === connectedId);
            if (connectedNode) {
              const { dx, dy } = getRandomOffset();
              return {
                id: player,
                x: clamp(connectedNode.x + dx, 0, containerWidth),
                y: clamp(connectedNode.y + dy, 0, containerHeight),
              };
            }
          }

          // Fallback default position
          return {
            id: player,
            x: isPathA ? spacing * (i + 1) : containerWidth - spacing * (i + 1),
            y: isPathA ? midY - 50 : midY + 50,
          };
        });

      return [...prevNodes, ...newNodes];
    };

    setNodesA((prev) => addNodes(prev, pathA, true));
    setNodesB((prev) => addNodes(prev, pathB, false));
  }, [pathA, pathB, containerWidth, containerHeight]);

  if (containerWidth === 0 || containerHeight === 0)
    return <div ref={containerRef} className="w-full h-full" />;

  // --- Drag handlers ---
  const handleMouseDown = (e, node) => {
    e.stopPropagation();
    const svg = e.currentTarget.closest("svg");
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM().inverse());
    const source = nodesA.some((n) => n.id === node.id) ? "A" : "B";

    setDraggingNode(node.id);
    setDragSource(source);
    setOffset({ x: cursor.x - node.x, y: cursor.y - node.y });
  };

  const handleMouseMove = (e) => {
    if (!draggingNode) return;
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM().inverse());

    const clampedX = clamp(cursor.x - offset.x, 0, containerWidth);
    const clampedY = clamp(cursor.y - offset.y, 0, containerHeight);

    if (dragSource === "A") {
      setNodesA((prev) =>
        prev.map((n) =>
          n.id === draggingNode ? { ...n, x: clampedX, y: clampedY } : n
        )
      );
    } else {
      setNodesB((prev) =>
        prev.map((n) =>
          n.id === draggingNode ? { ...n, x: clampedX, y: clampedY } : n
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
    setDragSource(null);
  };

  // --- Helper to get node positions by id ---
  const getNodePosition = (id) => {
    return (
      nodesA.find((n) => n.id === id) ||
      nodesB.find((n) => n.id === id) || { x: 0, y: 0 }
    );
  };

  // --- Render ---
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
        {/* Render edges */}
        {[...pathA.edges, ...pathB.edges].map((edge, i) => {
          const from = getNodePosition(edge.from);
          const to = getNodePosition(edge.to);
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          const flip = dx < 0;
          const textRotation = flip ? angle + 180 : angle;

          const color = pathA.edges.includes(edge) ? "red" : "blue";

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
                <text x={midX} y={midY - 10} textAnchor="middle" fontSize="12" fill="black">
                  {edge.team}
                </text>
                <text x={midX} y={midY + 15} textAnchor="middle" fontSize="12" fill="black">
                  {edge.years}
                </text>
              </g>
            </g>
          );
        })}

        {/* Render nodes */}
        {nodesA.map((n) => (
          <GraphNode key={n.id} node={n} color="red" onMouseDown={handleMouseDown} />
        ))}
        {nodesB.map((n) => (
          <GraphNode key={n.id} node={n} color="blue" onMouseDown={handleMouseDown} />
        ))}
      </svg>
    </div>
  );
};

export default MultiGraph;
