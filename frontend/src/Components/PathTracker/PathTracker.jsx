import { useEffect, useState } from "react";

function PathTracker({ winningPath, resetTrigger }) {
  const [bestConnections, setBestConnections] = useState(Infinity);

  useEffect(() => {
    if (
      !winningPath ||
      !Array.isArray(winningPath) ||
      winningPath.length === 0
    ) {
      return; // skip empty or invalid paths
    }

    //console.log("Winning path:", JSON.stringify(winningPath, null, 2));
    const newScore = winningPath.length - 1;

    setBestConnections((prev) => Math.min(prev, newScore));
  }, [winningPath]);

  //set the best connections back to infinity
  useEffect(() => {
    setBestConnections(Infinity);
  }, [resetTrigger])

  return (
    <div className="text-center text-xl">
      Best Path: {bestConnections === Infinity ? "N/A" : bestConnections}
    </div>
  );
}

export default PathTracker;
