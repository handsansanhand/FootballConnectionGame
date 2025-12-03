import { API_BASE } from "../config/api";

export async function searchPlayer(playerName) {
  const playerSearchUrl = `${API_BASE}/players?query=${playerName}`;

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
  const randomPlayerSearchUrl = `${API_BASE}/players/random`;

  const response = await fetch(randomPlayerSearchUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to get random player: ${response.status} ${response.statusText}`
    );
  }
  const playerList = await response.json();
  return playerList;
}
