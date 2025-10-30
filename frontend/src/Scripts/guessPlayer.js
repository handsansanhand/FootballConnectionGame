const backendPort = process.env.REACT_APP_BACKEND_PORT;
const backendHost = process.env.REACT_APP_BACKEND_HOST;

export async function initializeGuessPath(playerA, playerB) {
  console.log(`pA ${playerA}, pB ${playerB}`);
  return {
    playerA: playerA,
    playerB: playerB,
    pathA: {
      players: [playerA],
      teams: [],
      overlapping_years: [],
    },
    pathB: {
      players: [playerB],
      teams: [],
      overlapping_years: [],
    },
  };
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
    return result;
  } catch (error) {
    console.error("Error making guess:", error);
    return null;
  }
}
