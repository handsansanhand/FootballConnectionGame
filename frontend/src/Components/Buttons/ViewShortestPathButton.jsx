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
      className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
    >
      View Shortest Path (length {path?.length - 1})
    </button>
  );
}

export default ViewShortestPathButton;
