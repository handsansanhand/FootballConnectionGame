const backendPort = process.env.REACT_APP_BACKEND_PORT;
const backendHost = process.env.REACT_APP_BACKEND_HOST;

export async function getShortestPath(player1, player2) {
  const encodedPlayer1 = encodeURIComponent(player1);
  const encodedPlayer2 = encodeURIComponent(player2);
  const shortestPathURL = `http://${backendHost}:${backendPort}/shortestPath?player1=${encodedPlayer1}&player2=${encodedPlayer2}`

  const response = await fetch(shortestPathURL);
  if (!response.ok) {
    throw new Error(
      `Failed to retrieve shortest path: ${response.status} ${response.statusText}`
    );
  }
  const res = await response.json();
  return res;
}
