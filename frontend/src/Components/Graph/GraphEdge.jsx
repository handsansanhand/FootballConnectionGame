import React, { useEffect } from "react";
import { formatYear } from "./graphUtils";

const GraphEdge = ({
  from,
  to,
  team,
  years,
  teamLogo,
  color = "black",
  strokeWidth = 4,
}) => {
  // Midpoint for label/logo
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const flip = dx < 0;
  const textRotation = flip ? angle + 180 : angle;

  useEffect(() => {}, []);
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

      <g transform={`rotate(${textRotation}, ${midX}, ${midY})`}>
        {/* Background rectangle */}
        <rect
          x={midX - 50} // wider box
          y={midY - 45} // more top padding
          width={100} // wider for long names
          height={70} // taller to fit logo + 2 lines
          rx={8}
          ry={8}
          fill="white"
          stroke="black"
          strokeWidth={1}
        />

        {/* Logo */}
        {teamLogo && (
          <image
            href={teamLogo}
            x={midX - 12} // centered horizontally
            y={midY - 35} // move logo higher
            width="24"
            height="24"
            clipPath="circle(50%)"
          />
        )}

        {/* Team name */}
        <text
          x={midX}
          y={midY} // below logo
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill="black"
        >
          {team}
        </text>

        {/* Years */}
        <text
          x={midX}
          y={midY + 18} // more spacing below team name
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
