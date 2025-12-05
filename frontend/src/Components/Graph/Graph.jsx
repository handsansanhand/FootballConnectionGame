import React, { useRef, useState, useEffect } from "react";
import GraphNode from "./GraphNode";
import GraphEdge from "./GraphEdge";

const Graph = ({ pathJson, playerA, playerB, isMobile }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [nodes, setNodes] = useState([]);
  const [draggingNode, setDraggingNode] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Resize Listener
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

  // Initial Node Layout
  useEffect(() => {
    if (!pathJson?.nodes || containerWidth === 0 || containerHeight === 0)
      return;

    const numNodes = pathJson.nodes.length;

    if (isMobile) {
      const spacingY = containerHeight / (numNodes + 1);

      const leftX = containerWidth * 0.25;
      const rightX = containerWidth * 0.75;

      setNodes(
        pathJson.nodes.map((p, i) => ({
          id: p.id,
          name: p.name,
          image_url: p.image_url,
          x: i % 2 === 0 ? leftX : rightX, // EVEN index left, ODD index right
          y: spacingY * (i + 1),
        }))
      );
    } else {
      // DESKTOP HORIZONTAL
      const spacingX = containerWidth / (numNodes + 1);
      const midY = containerHeight / 2;

      setNodes(
        pathJson.nodes.map((p, i) => ({
          id: p.id,
          name: p.name,
          image_url: p.image_url,
          x: spacingX * (i + 1),
          y: midY,
        }))
      );
    }
  }, [pathJson, containerWidth, containerHeight, isMobile]);

  if (!pathJson?.nodes || containerWidth === 0 || containerHeight === 0)
    return <div ref={containerRef} className="w-full h-full" />;

  // Build edges
  const relationships = pathJson.relationships || [];
  const connections = nodes.slice(0, -1).map((fromNode, i) => ({
    from: fromNode,
    to: nodes[i + 1],
    team: relationships[i]?.team || "",
    team_logo: relationships[i]?.team_logo || "",
    year: relationships[i]?.overlapping_years || "",
  }));

  // ------------------------------------
  // DESKTOP DRAG
  // ------------------------------------
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

  // ------------------------------------
  // MOBILE TOUCH DRAG
  // ------------------------------------
  const handleTouchStart = (e, node) => {
    const touch = e.touches[0];
    const svg = e.currentTarget.closest("svg");

    const pt = svg.createSVGPoint();
    pt.x = touch.clientX;
    pt.y = touch.clientY;

    const cursor = pt.matrixTransform(svg.getScreenCTM().inverse());

    setDraggingNode(node.id);
    setOffset({ x: cursor.x - node.x, y: cursor.y - node.y });
  };

  const handleTouchMove = (e) => {
    if (!draggingNode) return;
      e.preventDefault();  
    const touch = e.touches[0];
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();

    pt.x = touch.clientX;
    pt.y = touch.clientY;

    const cursor = pt.matrixTransform(svg.getScreenCTM().inverse());

    setNodes((prev) =>
      prev.map((n) =>
        n.id === draggingNode
          ? { ...n, x: cursor.x - offset.x, y: cursor.y - offset.y }
          : n
      )
    );
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
    >
      <svg
        width="100%"
        height="100%"
          style={{ touchAction: draggingNode ? "none" : "auto" }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
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
            strokeWidth={3.5}
          />
        ))}

        {/* Player Nodes */}
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
              onTouchStart={handleTouchStart} // <-- added here
            />
          );
        })}
      </svg>
    </div>
  );
};

export default Graph;
