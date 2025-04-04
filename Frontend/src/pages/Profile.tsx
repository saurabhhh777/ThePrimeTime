import Hnavbar from "../components/NavbarPage/Hnavbar";
import { ActivityCalendar } from "react-activity-calendar";

const Profile = () => {
  const data: Array<{ date: string; count: number; level: number }> = [
    {
      date: "2024-03-25",
      count: 2,
      level: 1,
    },
    {
      date: "2024-08-02",
      count: 16,
      level: 4,
    },
    {
      date: "2025-03-25",
      count: 11,
      level: 3,
    },
  ];

  return (
    <div>
      <Hnavbar className="m-1" />
      <div className="h-screen w-[calc(100%-0.5rem)] bg-black m-1 rounded-lg">
        <div className="ml-30 mr-30 box-border">
          <h2 className="text-white text-2xl font-bold pt-10">
            Saurabh Maurya
          </h2>
          <div className="flex flex-row justify-evenly">
            <div className="mt-7">
              <img
                src="https://res.cloudinary.com/dongxnnnp/image/upload/v1739618128/urlShortner/rgwojzux26zzl2tc4rmm.webp"
                className="w-60 h-60 rounded-xl "
                alt="authorImg"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-60 mt-5 hover:bg-blue-600">
                Edit Profile
              </button>
              <h2 className="font-poppins text-white font-semibold text-xl mt-5 h-10 w-60">Saurabh Maurya</h2>
              <h2 className="font-poppins text-white font-semibold text-xl text-[#E1E7EF] h-10 w-60">@saurabhhh777</h2>
            </div>
            <div className="mt-7 text-white ">
              <ActivityCalendar data={data} />
              <hr className="border-white border-1 mt-11" />
              <div className="flex flex-row justify-between">
                <div className="font-poppins text-white font-semibold text-xl mt-5 h-10 w-60">Last Week 15 hours</div>
                <div className="font-poppins text-white font-semibold text-xl mt-5 h-10 w-60">Last Month 100 hours</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
