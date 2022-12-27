function App() {
  return (
    <>
      <div className="bg-blue-800 w-screen h-screen">

        <div className="z-10 absolute">
          <form class="w-full max-w-lg">
              <div class="w-full">
                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="Name" />
              </div>
              <div class="w-full">
                <button class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 hover:bg-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="submit">
                  Add Location
                </button>
              </div>
          </form>
          <form class="w-full max-w-lg">

            <div class="w-full">
              <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="number" placeholder="Radius (km)" defaultValue={3} />
            </div>

            <div class="w-full">
              <button class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 hover:bg-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="submit">
                Get Markers
              </button>
            </div>

          </form>
        </div>

        <div className="absolute flex justify-center items-center w-screen h-screen font-extrabold">
          O
        </div>
        
      </div>
      
    </>
  );
}

export default App;
