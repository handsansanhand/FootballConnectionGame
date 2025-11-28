function HomeButton() {
  return (
    <>
      <button
        onClick={() => (window.location.href = "/")} // navigate home
        className="w-full inline-block text-black bg-white hover:bg-black hover:text-white hover:border-white font-medium text-sm px-5 py-2.5 text-center transition-colors duration-300 border-2 border-black rounded-lg focus:outline-none"   >
        Home
      </button>
    </>
  );
}

export default HomeButton;
