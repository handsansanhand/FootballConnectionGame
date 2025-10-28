const backendPort = process.env.REACT_APP_BACKEND_PORT;
const backendHost = process.env.REACT_APP_BACKEND_HOST;

export async function searchPlayer(playerName) {
  const playerSearchUrl = `http://${backendHost}:${backendPort}/players?query=${playerName}`;

  const response = await fetch(playerSearchUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to search for player: ${response.status} ${response.statusText}`
    );
  }
  const playerList = await response.json();
  return playerList;
}

export async function getRandomPlayer() {
  const randomPlayerSearchUrl = `http://${backendHost}:${backendPort}/players/random`;
  const response = await fetch(randomPlayerSearchUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to get random player: ${response.status} ${response.statusText}`
    );
  }
  const playerList = await response.json();
  return playerList;
}
