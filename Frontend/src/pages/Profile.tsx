import { useParams, useNavigate } from "react-router-dom";
import Hnavbar from "../components/NavbarPage/Hnavbar";
import Vnavbar from "../components/NavbarPage/Vnavbar";

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  console.log('Profile component rendered with username:', username);

  return (
    <div className="min-h-screen bg-black font-['Poppins']">
      <Vnavbar className="fixed top-0 left-0 h-[calc(100vh-0.5rem)] mt-1 ml-1" />
      <div className="ml-[16.5rem] mr-1">
        <Hnavbar className="mt-1" />
        <main className="mt-1 ml-1 mr-1 p-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Profile Page</h1>
            <p className="text-gray-300 text-lg mb-4">
              Username: {username || 'No username'}
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Profile Working!</h2>
              <p className="text-gray-300">
                The profile page is now rendering correctly.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-4 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
