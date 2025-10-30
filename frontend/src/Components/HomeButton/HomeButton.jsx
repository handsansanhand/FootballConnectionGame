function HomeButton() {
  return (
    <>
      <button
        onClick={() => (window.location.href = "/")} // navigate home
        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
      >
        Home
      </button>
    </>
  );
}

export default HomeButton;
