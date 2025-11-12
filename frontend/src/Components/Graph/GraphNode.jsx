// src/Components/Graph/GraphNode.jsx
import React, { useEffect } from "react";

const GraphNode = ({ node, onMouseDown }) => {
  const paddingX = 12;
  const paddingY = 8;
  const width = Math.max(100, String(node.id).length * 8);
  const label = node.name || String(node.id);
  const height = 40;
  useEffect(() => {
    console.log(`w: ${width}`)
    console.log(`node being recieved: `, JSON.stringify(node, 2, null))
  }, [])
  return (
    <g onMouseDown={(e) => onMouseDown(e, node)} cursor="grab">
      <rect
        x={node.x - width / 2}
        y={node.y - height / 2}
        width={width}
        height={height}
        rx={15}
        ry={15}
        fill="blue"
      />
      <foreignObject
        x={node.x - width / 2 + paddingX / 2}
        y={node.y - height / 2 + paddingY / 2}
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
          {label}
        </div>
      </foreignObject>
    </g>
  );
};

export default GraphNode;
