import React, { useEffect } from "react";

const GraphNode = ({ node, onMouseDown, color }) => {
  const width = 90;
  const height = 115;
  const rectRadius = 12;
  const imageHeight = 75;
  const nameHeight = 40; // bottom area for name

  return (
    <g onMouseDown={(e) => onMouseDown(e, node)} style={{ cursor: "grab" }}>
      {/* Node background */}
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
        filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.5))"
      />

      {/* Player image */}
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

      {/* Player name */}
      <foreignObject
        x={node.x - width / 2 + 3}
        y={node.y - height / 2 + imageHeight} // below image
        width={width - 6}
        height={nameHeight}
        style={{ overflow: "hidden" }}
        
      >
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            color: "black",
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
          {node.name}
        </div>
      </foreignObject>
    </g>
  );
};

export default GraphNode;