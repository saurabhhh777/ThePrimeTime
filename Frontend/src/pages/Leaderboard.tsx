import Hnavbar from "../components/NavbarPage/Hnavbar";
import Vnavbar from "../components/NavbarPage/Vnavbar";




const Leaderboard = () => {

  return (
    <div className="min-h-screen bg-black font-['Poppins']">
      <Vnavbar className="fixed top-0 left-0 h-[calc(100vh-0.5rem)] mt-1 ml-1" />
      <div className="ml-[16.5rem] mr-1">
        <Hnavbar className="mt-1" />
        <main className="mt-1 ml-1 mr-1 p-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-white text-xl text-center">
              <div className="mb-4">Leaderboard Component</div>
              <p className="text-gray-400 text-sm">Real-time leaderboard coming soon...</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Leaderboard;