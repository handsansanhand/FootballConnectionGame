import { API_BASE } from "../config/api";


export async function initializeGuessPath(playerA, playerB) {
  const initURL = `${API_BASE}/findPath/initialize`;
  try {
    const response = await fetch(initURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerA, playerB }),
    });
    if (!response.ok) throw new Error("Failed to initialize path");
    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Initialization failed:", err);
    return {
      playerA,
      playerB,
      pathA: { players: [playerA], edges: [], teams: [], overlapping_years: [] },
      pathB: { players: [playerB], edges: [], teams: [], overlapping_years: [] },
      winner: null,
    };
  }
}
export async function makeGuess(currentJSON, guessedPlayer) {
  const playerGuessURL = `${API_BASE}/findPath`;
  const updatedJSON = {
    ...currentJSON,
    guessedPlayer: guessedPlayer,
  };
  try {
    const response = await fetch(playerGuessURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedJSON),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error making guess:", error);
    return null;
  }
}
