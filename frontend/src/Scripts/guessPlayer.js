const backendPort = process.env.REACT_APP_BACKEND_PORT;
const backendHost = process.env.REACT_APP_BACKEND_HOST;

export async function initializeGuessPath(playerA, playerB) {
    console.log(`pA ${playerA}, pB ${playerB}`)
  return {
    playerA: playerA,
    playerB: playerB,
    pathA: {
      players: [playerA],
      teams: [],
      overlapping_years: []
    },
    pathB: {
      players: [playerB],
      teams: [],
      overlapping_years: []
    }
  };
}
export async function makeGuess(guessedPlayer) {
    const playerGuessURL = `http://${backendHost}:${backendPort}/findPath`;
}