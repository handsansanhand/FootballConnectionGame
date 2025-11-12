import React, { useRef, useState, useEffect } from "react";
import GraphNode from "./GraphNode";
import { formatYear } from "./graphUtils";

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
    if (!pathJson?.nodes || containerWidth === 0 || containerHeight === 0)
      return;

    const numNodes = pathJson.nodes.length;
    const spacing = containerWidth / (numNodes + 1);
    const svgMidY = containerHeight / 2;

    setNodes(
      pathJson.nodes.map((player, index) => ({
        id: player.name,
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
        {connections.map((c, i) => {
          const midX = (c.from.x + c.to.x) / 2;
          const midY = (c.from.y + c.to.y) / 2;
          const dx = c.to.x - c.from.x;
          const dy = c.to.y - c.from.y;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          const flip = dx < 0;
          const textRotation = flip ? angle + 180 : angle;

          return (
            <g key={i}>
              <line
                x1={c.from.x}
                y1={c.from.y}
                x2={c.to.x}
                y2={c.to.y}
                stroke="red"
                strokeWidth={4}
              />
              <g transform={`rotate(${textRotation}, ${midX}, ${midY})`}>
                {/* Team logo */}
                {c.team_logo && (
                  <image
                    href={c.team_logo}
                    x={midX - 12}
                    y={midY - 40}
                    width="24"
                    height="24"
                    clipPath="circle(50%)"
                  />
                )}
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

        {/* Player nodes (with photo + name) */}
        {nodes.map((n) => (
  <g
    key={n.id}
    onMouseDown={(e) => handleMouseDown(e, n)}
    style={{ cursor: "grab" }}
  >
    {/* Node background box */}
    <rect
      x={n.x - 45}
      y={n.y - 75}
      width="90"
      height="115"
      rx="12"
      ry="12"
      fill="black"
      stroke="white"
      strokeWidth="2"
      opacity="0.95"
      filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.5))"
    />

    {/* Top-rounded image */}
    {n.image_url && (
      <>
        <clipPath id={`clip-${n.id}`}>
          <path
            d={`
              M${n.x - 45},${n.y - 75 + 12}               /* move to bottom-left of top corner */
              a12,12 0 0 1 12,-12                          /* top-left corner */
              h66                                           /* top edge */
              a12,12 0 0 1 12,12                            /* top-right corner */
              v50                                           /* down to leave space for text */
              h-90                                          /* left to starting x */
              z
            `}
          />
        </clipPath>
        <image
          href={n.image_url}
          x={n.x - 45}
          y={n.y - 75}
          width="90"
          height="75"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#clip-${n.id})`}
        />
      </>
    )}

    {/* Player name (wraps at bottom) */}
    <foreignObject
      x={n.x - 42}
      y={n.y - 5}
      width="84"
      height="45"
      style={{ overflow: "hidden" }}
    >
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          color: "white",
          fontSize: "12px",
          fontWeight: "bold",
          textAlign: "center",
          wordWrap: "break-word",
          overflow: "hidden",
          lineHeight: "1.1em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "0 4px",
        }}
      >
        {n.name}
      </div>
    </foreignObject>
  </g>
))}
      </svg>
    </div>
  );
};

export default Graph;
