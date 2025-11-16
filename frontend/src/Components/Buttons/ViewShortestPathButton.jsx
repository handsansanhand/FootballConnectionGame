function ViewShortestPathButton({ playerA, playerB, path }) {
  const handleClick = () => {

    console.log(`PLAYER A IS ` , JSON.stringify(playerA, null, 2))
    // store the current path in sessionStorage
    sessionStorage.setItem(
      "existingPath",
      JSON.stringify({
        edges: path, // only the edges array
        playerA,
        playerB,
      })
    );

    const url = `/shortestPath?playerA=${encodeURIComponent(
      playerA
    )}&playerB=${encodeURIComponent(playerB)}`;

    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="inline-block text-black bg-white hover:bg-black hover:text-white hover:border-white font-medium text-sm px-5 py-2.5 text-center transition-colors duration-300 border-4 border-black rounded-none focus:outline-none"
    >
      View Shortest Path
    </button>
  );
}

export default ViewShortestPathButton;
