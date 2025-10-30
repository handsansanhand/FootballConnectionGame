
import React, { useRef, useState, useEffect } from "react";
import GraphNode from "./GraphNode";
import { buildConnections, formatYear } from "./graphUtils";

const MultiGraph = ({ pathA, pathB }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [nodesA, setNodesA] = useState([]);
  const [nodesB, setNodesB] = useState([]);

  // --- Track container size ---
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

  // --- Compute node positions for each path ---
  useEffect(() => {
    if (!pathA?.players || !pathB?.players || containerWidth === 0) return;

    const midY = containerHeight / 2;
    const halfWidth = containerWidth / 2;

    const spacingA = halfWidth / (pathA.players.length + 1);
    const spacingB = halfWidth / (pathB.players.length + 1);

    // Path A goes from left → center
    setNodesA(
      pathA.players.map((player, i) => ({
        id: player,
        x: spacingA * (i + 1),
        y: midY - 50, // offset slightly upward
      }))
    );

    // Path B goes from right → center
    setNodesB(
      pathB.players.map((player, i) => ({
        id: player,
        x: containerWidth - spacingB * (i + 1),
        y: midY + 50, // offset slightly downward
      }))
    );
  }, [pathA, pathB, containerWidth, containerHeight]);

  if (containerWidth === 0 || containerHeight === 0)
    return <div ref={containerRef} className="w-full h-full" />;

  const connectionsA = buildConnections(nodesA, pathA);
  const connectionsB = buildConnections(nodesB, pathB);

  return (
    <div ref={containerRef} className="w-full h-[500px] bg-gray-100 rounded-lg shadow-inner">
      <svg width="100%" height="100%">
        {/* Path A (left, red) */}
        {connectionsA.map((c, i) => (
          <g key={`A-${i}`}>
            <line
              x1={c.from.x}
              y1={c.from.y}
              x2={c.to.x}
              y2={c.to.y}
              stroke="red"
              strokeWidth={3}
            />
            <text
              x={(c.from.x + c.to.x) / 2}
              y={(c.from.y + c.to.y) / 2 - 10}
              textAnchor="middle"
              fontSize="12"
            >
              {c.team}
            </text>
          </g>
        ))}

        {/* Path B (right, blue) */}
        {connectionsB.map((c, i) => (
          <g key={`B-${i}`}>
            <line
              x1={c.from.x}
              y1={c.from.y}
              x2={c.to.x}
              y2={c.to.y}
              stroke="blue"
              strokeWidth={3}
            />
            <text
              x={(c.from.x + c.to.x) / 2}
              y={(c.from.y + c.to.y) / 2 + 20}
              textAnchor="middle"
              fontSize="12"
            >
              {c.team}
            </text>
          </g>
        ))}

        {/* Nodes A */}
        {nodesA.map((n) => (
          <GraphNode key={n.id} node={n} color="red" />
        ))}

        {/* Nodes B */}
        {nodesB.map((n) => (
          <GraphNode key={n.id} node={n} color="blue" />
        ))}
      </svg>
    </div>
  );
};

export default MultiGraph;

