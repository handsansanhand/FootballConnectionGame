import React, { useRef, useState, useEffect } from "react";

const Graph = ({ pathJson }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [nodes, setNodes] = useState([]);
  const [draggingNode, setDraggingNode] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const handleResize = () =>
      setContainerWidth(containerRef.current.offsetWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!pathJson?.players || containerWidth === 0) return;
    const svgHeight = 400;
    const numNodes = pathJson.players.length;
    const spacing = containerWidth / (numNodes + 1);
    setNodes(
      pathJson.players.map((player, index) => ({
        id: player,
        x: spacing * (index + 1),
        y: svgHeight / 2,
      }))
    );
  }, [pathJson, containerWidth]);

  if (!pathJson?.players || containerWidth === 0)
    return <div ref={containerRef} className="w-full h-96" />;

  const svgHeight = 400;

  const connections = nodes.slice(1).map((node, index) => ({
    from: nodes[index],
    to: node,
    team: pathJson.teams[index] || "",
    year: pathJson.overlapping_years[index] || "",
  }));

  const pathPlayers = pathJson.players || [];

  // helper function
  const formatYear = (yearStr) => {
    if (!yearStr) return "";
    const years = yearStr.split("-");
    if (years.length === 2 && years[0] === years[1]) return years[1];
    return yearStr;
  };

  // mouse events
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

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  return (
    <div ref={containerRef} className="w-full">
      <svg
        width="100%"
        height={svgHeight}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Edges */}
        {connections.map((c, i) => {
          const midX = (c.from.x + c.to.x) / 2;
          const midY = (c.from.y + c.to.y) / 2;
          const dx = c.to.x - c.from.x;
          const dy = c.to.y - c.from.y;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI); // convert radians → degrees
          const lineColor =
            pathPlayers.includes(c.from.id) && pathPlayers.includes(c.to.id)
              ? "red"
              : "gray";
          const lineWidth =
            pathPlayers.includes(c.from.id) && pathPlayers.includes(c.to.id)
              ? 4
              : 2;

          return (
            <g key={i}>
              <line
                x1={c.from.x}
                y1={c.from.y}
                x2={c.to.x}
                y2={c.to.y}
                stroke={lineColor}
                strokeWidth={lineWidth}
              />

              {/* Rotated group around midpoint */}
              <g transform={`rotate(${angle}, ${midX}, ${midY})`}>
                {/* Team above the line (offset along the perpendicular) */}
                <text
                  x={midX}
                  y={midY - 10}
                  textAnchor="middle"
                  fontSize="12"
                  fill="black"
                >
                  {c.team}
                </text>

                {/* Overlapping years below the line */}
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
        {nodes.map((n) => {
          const paddingX = 12;
          const paddingY = 8;
          const width = Math.max(100, n.id.length * 8);
          const height = 40;

          return (
            <g
              key={n.id}
              onMouseDown={(e) => handleMouseDown(e, n)}
              cursor="grab"
            >
              <rect
                x={n.x - width / 2}
                y={n.y - height / 2}
                width={width}
                height={height}
                rx={15}
                ry={15}
                fill="blue"
              />
              <foreignObject
                x={n.x - width / 2 + paddingX / 2}
                y={n.y - height / 2 + paddingY / 2}
                width={width - paddingX}
                height={height - paddingY}
              >
                <div
                  xmlns="http://www.w3.org/1999/xhtml"
                  style={{
                    color: "white",
                    fontSize: "13px",
                    fontWeight: "bold",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    lineHeight: "1.2",
                    overflowWrap: "break-word",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {n.id}
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default Graph;
