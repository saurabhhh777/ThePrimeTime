import Hnavbar from "../components/NavbarPage/Hnavbar";
import Vnavbar from "../components/NavbarPage/Vnavbar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Vnavbar className="fixed top-0 left-0 h-[calc(100vh-0.5rem)] mt-1 ml-1" />
      <div className="ml-[16.5rem] mr-1">
        <Hnavbar className="mt-1" />
        <main className="mt-1 ml-1 mr-1">
          <div className="text-2xl font-bold">{"12 hours in Last 7 days"}</div>
          <div className="flex gap-1 h-90">
            <div className="w-1/2 bg-black rounded-lg p-4 text-white">
              <h2>hello</h2>
            </div>
            <div className="w-1/2 bg-black rounded-lg p-4 text-white">
              <h2>hello</h2>
            </div>
          </div>
          <div className="flex mt-1 gap-1 h-96">
            <div className="w-1/2 bg-black rounded-lg p-4 text-white">
              <h2>hello</h2>
            </div>
            <div className="w-1/2 bg-black rounded-lg p-4 text-white">
              <h2>hello</h2>
            </div>
          </div>
          <div className="flex gap-1 mt-1 h-96 mb-1">
            <div className="w-1/2 bg-black rounded-lg p-4 text-white">
              <h2>hello</h2>
            </div>
            <div className="w-1/2 bg-black rounded-lg p-4 text-white">
              <h2>hello</h2>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard;
