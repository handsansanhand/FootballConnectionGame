import { useEffect, useState } from "react";

function PathTracker({ winningPath, resetTrigger }) {
  const [bestConnections, setBestConnections] = useState(() => {
    const stored = localStorage.getItem("bestConnections");
    if (stored) return Number(stored);

    // fallback: infer from saved winningPath
    const pathStored = localStorage.getItem("winningPath");
    if (pathStored) {
      const parsed = JSON.parse(pathStored);
      return parsed.length > 0 ? parsed.length - 1 : Infinity;
    }

    return Infinity;
  });

  useEffect(() => {
    if (
      !winningPath ||
      !Array.isArray(winningPath) ||
      winningPath.length === 0
    ) {
      return;
    }

    const newScore = winningPath.length - 1;
    setBestConnections((prev) => {
      const best = Math.min(prev, newScore);
      localStorage.setItem("bestConnections", best); // persist
      return best;
    });
  }, [winningPath]);

  //set the best connections back to infinity
  useEffect(() => {
    if (resetTrigger > 0) {
      setBestConnections(Infinity);
      localStorage.removeItem("bestConnections"); // clear on reset
    }
  }, [resetTrigger]);
  return (
    <div className="text-center text-xl">
      Best Path: {bestConnections === Infinity ? "??" : bestConnections}
    </div>
  );
}

export default PathTracker;
