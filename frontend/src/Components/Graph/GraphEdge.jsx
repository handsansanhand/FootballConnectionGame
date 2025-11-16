import React, { useEffect } from "react";
import { formatYear } from "./graphUtils";

const GraphEdge = ({ from, to, team, years, teamLogo, color = "black", strokeWidth = 4 }) => {
  // Midpoint for label/logo
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const flip = dx < 0;
  const textRotation = flip ? angle + 180 : angle;

  useEffect(() => {
  }, []) 
  return (
    <g>
      {/* Edge line */}
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={color}
        strokeWidth={strokeWidth}
      />

      {/* Labels and logo */}
      <g transform={`rotate(${textRotation}, ${midX}, ${midY})`}>
        {teamLogo && (
          <image
            href={teamLogo}
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
          {team}
        </text>
        <text
          x={midX}
          y={midY + 15}
          textAnchor="middle"
          fontSize="12"
          fill="black"
        >
          {formatYear(years)}
        </text>
      </g>
    </g>
  );
};

export default GraphEdge;