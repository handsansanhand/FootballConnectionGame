import React, { useRef, useState, useEffect } from "react";
import GraphNode from "./GraphNode";
import { buildConnections, formatYear } from "./graphUtils";

const Graph = ({ pathJson }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [nodes, setNodes] = useState([]);
  const [draggingNode, setDraggingNode] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Handle container resize
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

  // Compute initial node positions
  useEffect(() => {
    if (!pathJson?.players || containerWidth === 0 || containerHeight === 0) return;

    const numNodes = pathJson.players.length;
    const spacing = containerWidth / (numNodes + 1);
    const svgMidY = containerHeight / 2; // dynamic vertical center

    setNodes(
      pathJson.players.map((player, index) => ({
        id: player,
        x: spacing * (index + 1),
        y: svgMidY,
      }))
    );
  }, [pathJson, containerWidth, containerHeight]);

  // Return early if not ready
  if (!pathJson?.players || containerWidth === 0 || containerHeight === 0)
    return <div ref={containerRef} className="w-full h-full" />;

  // Build connections
  const connections = buildConnections(nodes, pathJson);
  const pathPlayers = pathJson.players || [];

  // Drag handlers
  const handleMouseDown = (e, node) => {
    e.stopPropagation();
    const svg = e.currentTarget.closest("svg");
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM().inverse());
    setDraggingNode(node.id);
    setOffset({ x: cursor.x - node.x, y: cursor.y - node.y });
  };

  const handleMouseMove = (e) => {
    if (!draggingNode) return;
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM().inverse());

    setNodes((prev) =>
      prev.map((n) =>
        n.id === draggingNode
          ? { ...n, x: cursor.x - offset.x, y: cursor.y - offset.y }
          : n
      )
    );
  };

  const handleMouseUp = () => setDraggingNode(null);

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg
        width="100%"
        height="100%"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Edges */}
        {connections.map((c, i) => {
          const midX = (c.from.x + c.to.x) / 2;
          const midY = (c.from.y + c.to.y) / 2;
          const dx = c.to.x - c.from.x;
          const dy = c.to.y - c.from.y;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          const isActive =
            pathPlayers.includes(c.from.id) && pathPlayers.includes(c.to.id);

          return (
            <g key={i}>
              <line
                x1={c.from.x}
                y1={c.from.y}
                x2={c.to.x}
                y2={c.to.y}
                stroke={isActive ? "red" : "gray"}
                strokeWidth={isActive ? 4 : 2}
              />
              <g transform={`rotate(${angle}, ${midX}, ${midY})`}>
                <text
                  x={midX}
                  y={midY - 10}
                  textAnchor="middle"
                  fontSize="12"
                  fill="black"
                >
                  {c.team}
                </text>
                <text
                  x={midX}
                  y={midY + 15}
                  textAnchor="middle"
                  fontSize="12"
                  fill="black"
                >
                  {formatYear(c.year)}
                </text>
              </g>
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((n) => (
          <GraphNode key={n.id} node={n} onMouseDown={handleMouseDown} />
        ))}
      </svg>
    </div>
  );
};

export default Graph;
