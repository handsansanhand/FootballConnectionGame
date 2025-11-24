import React, { useEffect, useState, useRef } from "react";

const GraphNode = ({ node, onMouseDown, color }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const [offset, setOffset] = useState({ dx: 0, dy: 0 });
  const animRef = useRef();

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Liquidy float animation
  useEffect(() => {
    let t = 0;

    const animate = () => {
      t += 0.05;
      const dx = Math.sin(t + node.id) * 2; // horizontal sway
      const dy = Math.cos(t * 1.3 + node.id) * 2; // vertical sway
      setOffset({ dx, dy });
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [node.id]);

  // Determine size dynamically
  const isMobile = screenWidth < 640;
  const isTablet = screenWidth < 1024;

  const width = isMobile ? 55 : isTablet ? 75 : 100;
  const height = isMobile ? 80 : isTablet ? 105 : 135;
  const imageHeight = isMobile ? 50 : isTablet ? 70 : 90;
  const fontSize = isMobile ? "8px" : isTablet ? "10px" : "12px";

  const rectRadius = 12;
  const bottomSpaceHeight = height - imageHeight;

  const x = node.x + offset.dx;
  const y = node.y + offset.dy;

  return (
    <g onMouseDown={(e) => onMouseDown(e, node)} style={{ cursor: "grab" }}>
      <rect
        x={x - width / 2}
        y={y - height / 2}
        width={width}
        height={height}
        rx={rectRadius}
        ry={rectRadius}
        fill="white"
        stroke={color}
        strokeWidth={2}
        opacity={0.95}
      />

      {node.image_url && (
        <>
          <clipPath id={`clip-${node.id}`}>
            <path
              d={`
                M${x - width / 2},${y - height / 2 + rectRadius}
                a${rectRadius},${rectRadius} 0 0 1 ${rectRadius},-${rectRadius}
                h${width - rectRadius * 2}
                a${rectRadius},${rectRadius} 0 0 1 ${rectRadius},${rectRadius}
                v${imageHeight - rectRadius}
                h-${width}
                z
              `}
            />
          </clipPath>
          <image
            href={node.image_url}
            x={x - width / 2}
            y={y - height / 2}
            width={width}
            height={imageHeight}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#clip-${node.id})`}
          />
        </>
      )}

      <foreignObject
        x={x - width / 2 + 3}
        y={y - height / 2 + imageHeight}
        width={width - 6}
        height={bottomSpaceHeight}
        style={{ overflow: "hidden" }}
      >
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            color: "black",
            fontSize,
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
          {node.name}
        </div>
      </foreignObject>
    </g>
  );
};

export default GraphNode;
