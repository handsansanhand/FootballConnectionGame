import React, { useRef, useState, useEffect } from "react";
import GraphNode from "./GraphNode";
import GraphEdge from "./GraphEdge";

const Graph = ({ pathJson, playerA, playerB }) => {
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
    if (!pathJson?.nodes || containerWidth === 0 || containerHeight === 0)
      return;

    const numNodes = pathJson.nodes.length;
    const spacing = containerWidth / (numNodes + 1);
    const svgMidY = containerHeight / 2;

    setNodes(
      pathJson.nodes.map((player, index) => ({
        id: player.id,
        name: player.name,
        image_url: player.image_url,
        x: spacing * (index + 1),
        y: svgMidY,
      }))
    );
  }, [pathJson, containerWidth, containerHeight]);

  if (!pathJson?.nodes || containerWidth === 0 || containerHeight === 0)
    return <div ref={containerRef} className="w-full h-full" />;

  // Build connections
  const relationships = pathJson.relationships || [];
  const connections = nodes.slice(0, -1).map((fromNode, i) => ({
    from: fromNode,
    to: nodes[i + 1],
    team: relationships[i]?.team || "",
    team_logo: relationships[i]?.team_logo || "",
    year: relationships[i]?.overlapping_years || "",
  }));

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

        {connections.map((c, i) => (
          <GraphEdge
            key={i}
            from={c.from}
            to={c.to}
            team={c.team}
            teamLogo={c.team_logo}
            years={c.year}
            strokeWidth={4}
          />
        ))}

        {/* Player nodes (with photo + name) */}
        {nodes.map((n) => {
      
          const isPlayerA = n.id === playerA;
          const isPlayerB = n.id === playerB;

          const color = isPlayerA || isPlayerB ? "gold" : "black";

          return (
            <GraphNode
              key={n.id}
              node={n}
              color={color}
              onMouseDown={handleMouseDown}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default Graph;
