import React, { useEffect, useState } from "react";

const GraphNode = ({ node, onMouseDown, color }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine size dynamically
  const isMobile = screenWidth < 640;
  const isTablet = screenWidth < 1024;

  const width = isMobile ? 55 : isTablet ? 75 : 100;
  const height = isMobile ? 80 : isTablet ? 105 : 135;
  const imageHeight = isMobile ? 50 : isTablet ? 70 : 90;
  const fontSize = isMobile ? "8px" : isTablet ? "10px" : "12px";

  const rectRadius = 12;

  // Dynamically calculate the space below the image
  const bottomSpaceHeight = height - imageHeight;

  return (
    <g onMouseDown={(e) => onMouseDown(e, node)} style={{ cursor: "grab" }}>
      <rect
        x={node.x - width / 2}
        y={node.y - height / 2}
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
                M${node.x - width / 2},${node.y - height / 2 + rectRadius}
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
            x={node.x - width / 2}
            y={node.y - height / 2}
            width={width}
            height={imageHeight}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#clip-${node.id})`}
          />
        </>
      )}

      <foreignObject
        x={node.x - width / 2 + 3}
        y={node.y - height / 2 + imageHeight}
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
