function ViewShortestPathButton({ playerA, playerB, path }) {
  const handleClick = () => {
    // store the current path in sessionStorage
    sessionStorage.setItem(
      "existingPath",
      JSON.stringify(path)
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
      View Shortest Path (length {path?.length - 1})
    </button>
  );
}

export default ViewShortestPathButton;
