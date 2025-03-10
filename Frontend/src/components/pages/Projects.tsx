import Vnavbar from "../NavbarPage/Vnavbar";
import Hnavbar from "../NavbarPage/Hnavbar";

const Projects = () => {
  return (
    <div>
      <div className="min-h-screen bg-gray-100">
        <Vnavbar className="fixed top-0 left-0 h-[calc(100vh-0.5rem)] mt-1 ml-1" />
        <div className="ml-[16.5rem] mr-1">
          <Hnavbar className="mt-1" />
          <main className="mt-1 ml-1 mr-1">
            <div className="h-screen mb-1 w-full bg-black rounded-lg p-4 text-white">
              <h2>hello</h2>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default Projects;
