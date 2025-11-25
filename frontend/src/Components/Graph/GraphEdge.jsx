import React, { useEffect } from "react";
import { formatYear } from "./graphUtils";

const GraphEdge = ({
  from,
  to,
  team,
  years,
  teamLogo,
  color = "black",
  strokeWidth = 3,
}) => {
  const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth < 640;
  const isTablet = screenWidth < 1024;

  const rectWidth = isMobile ? 70 : isTablet ? 90 : 110;
  const logoSize = isMobile ? 20 : isTablet ? 25 : 30;
  const fontSize = isMobile ? 8 : isTablet ? 10 : 12;

  // Spacing between elements inside the rect
  const spacing = 6;

  // Dynamically compute rect height: logo + team text + years + padding
  const rectHeight = logoSize + fontSize * 2 + spacing * 4;

  // Midpoint for label/logo
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const flip = dx < 0;
  const textRotation = flip ? angle + 180 : angle;

  const paddingTop = spacing;
  const extraLogoSpacing = 3;

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

      {/* Label + Logo */}
      <g transform={`rotate(${textRotation}, ${midX}, ${midY})`}>
        <rect
          x={midX - rectWidth / 2}
          y={midY - rectHeight / 2}
          width={rectWidth}
          height={rectHeight}
          rx={8}
          ry={8}
          fill="white"
          stroke="black"
          strokeWidth={strokeWidth}
        />

        {teamLogo && (
          <image
            href={teamLogo}
            x={midX - logoSize / 2}
            y={midY - rectHeight / 2 + paddingTop}
            width={logoSize}
            height={logoSize}
           
          />
        )}

        <text
          x={midX}
          y={
            midY -
            rectHeight / 2 +
            spacing +
            logoSize +
            spacing +
            extraLogoSpacing
          }
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="bold"
          fill="black"
        >
          {team}
        </text>

        <text
          x={midX}
          y={
            midY -
            rectHeight / 2 +
            spacing +
            logoSize +
            spacing +
            extraLogoSpacing +
            fontSize +
            spacing
          }
          textAnchor="middle"
          fontSize={fontSize}
          fill="black"
        >
          {formatYear(years)}
        </text>
      </g>
    </g>
  );
};

export default GraphEdge;
