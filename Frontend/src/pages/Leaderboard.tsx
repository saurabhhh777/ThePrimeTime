import Hnavbar from "../components/NavbarPage/Hnavbar";
import Vnavbar from "../components/NavbarPage/Vnavbar";
import { Trophy, Users, BarChart3, Crown } from 'lucide-react';

const Leaderboard = () => {

  const mockLeaders = [
    { rank: 1, name: 'You', hours: '42h 15m', languages: ['TypeScript', 'Python'], score: 9820 },
    { rank: 2, name: 'Dev Pro', hours: '39h 48m', languages: ['Go', 'Rust'], score: 9340 },
    { rank: 3, name: 'CodeNinja', hours: '37h 22m', languages: ['JavaScript', 'TS'], score: 9012 },
    { rank: 4, name: 'AlgoAce', hours: '33h 10m', languages: ['Python'], score: 8421 },
    { rank: 5, name: 'PixelPioneer', hours: '31h 56m', languages: ['Kotlin', 'Java'], score: 8190 },
  ];

  return (
    <div className="min-h-screen bg-black font-['Poppins']">
      <Vnavbar className="fixed top-0 left-0 h-[calc(100vh-0.5rem)] mt-1 ml-1" />
      <div className="ml-[16.5rem] mr-1">
        <Hnavbar className="mt-1" />
        <main className="mt-1 ml-1 mr-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Leaderboard</h1>
                <p className="text-gray-400">Compete with the best. Track your weekly coding score.</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                Global
              </div>
              <div className="px-4 py-2 bg-white text-black rounded-lg font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Weekly
              </div>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
            <div className="grid grid-cols-12 px-4 py-3 text-xs uppercase tracking-wider text-gray-400">
              <div className="col-span-1">Rank</div>
              <div className="col-span-5">Developer</div>
              <div className="col-span-3">Languages</div>
              <div className="col-span-2">Coding Time</div>
              <div className="col-span-1 text-right">Score</div>
            </div>
            <div className="divide-y divide-white/10">
              {mockLeaders.map((u) => (
                <div key={u.rank} className="grid grid-cols-12 px-4 py-4 items-center hover:bg-white/5">
                  <div className="col-span-1">
                    {u.rank <= 3 ? (
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${u.rank === 1 ? 'bg-yellow-500/20' : u.rank === 2 ? 'bg-gray-400/20' : 'bg-orange-500/20'}`}>
                        <Crown className={`h-5 w-5 ${u.rank === 1 ? 'text-yellow-400' : u.rank === 2 ? 'text-gray-300' : 'text-orange-400'}`} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-semibold">
                        {u.rank}
                      </div>
                    )}
                  </div>
                  <div className="col-span-5">
                    <div className="text-white font-medium">{u.name}</div>
                    <div className="text-xs text-gray-400">Consistent coder • 7-day streak</div>
                  </div>
                  <div className="col-span-3">
                    <div className="flex flex-wrap gap-2">
                      {u.languages.map((lang) => (
                        <span key={lang} className="px-2 py-1 text-xs rounded bg-white/10 border border-white/10 text-gray-200">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2 text-gray-200">{u.hours}</div>
                  <div className="col-span-1 text-right font-semibold text-white">{u.score.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Leaderboard;