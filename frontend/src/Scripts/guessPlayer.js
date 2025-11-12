const backendPort = process.env.REACT_APP_BACKEND_PORT;
const backendHost = process.env.REACT_APP_BACKEND_HOST;

export async function initializeGuessPath(playerA, playerB) {
  const initURL = `http://${backendHost}:${backendPort}/findPath/initialize`;
  try {
    const response = await fetch(initURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerA, playerB }),
    });
    if (!response.ok) throw new Error("Failed to initialize path");
    const result = await response.json();
    console.log(`INITIALIZATION FROM API: `, JSON.stringify(result,null,2))
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
  const playerGuessURL = `http://${backendHost}:${backendPort}/findPath`;
  const updatedJSON = {
    ...currentJSON,
    guessedPlayer: guessedPlayer,
  };
  try {
    console.log("Posting to backend:", JSON.stringify(updatedJSON, null, 2));
    const response = await fetch(playerGuessURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedJSON),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    console.log(`GUESS RESULT FROM API: `, JSON.stringify(result,2,null))
    return result;
  } catch (error) {
    console.error("Error making guess:", error);
    return null;
  }
}
