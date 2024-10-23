import { useState, useEffect } from 'react';
import { User, Trophy, Users, CheckSquare } from 'lucide-react';

type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

// Leaderboard Section
const Leaderboard = () => (
  <div className="p-4 font-chakra">
    <h2 className="text-2xl font-bold mb-4 text-white">Leaderboard</h2>
    <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
      {[1, 2, 3, 4, 5].map((rank) => (
        <div key={rank} className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <span className="font-bold text-gray-200">{rank}</span>
            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
            <span className="text-gray-200">User {rank}</span>
          </div>
          <span className="font-semibold text-gray-200">{100 - rank * 10} pts</span>
        </div>
      ))}
    </div>
  </div>
)

// Friends Section
const Friends = () => (
  <div className="p-4 font-chakra">
    <h2 className="text-2xl font-bold mb-4 text-white">Friends</h2>
    <div className="bg-gray-800 rounded-lg shadow">
      {[1, 2, 3, 4, 5].map((friend) => (
        <div key={friend} className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
            <span className="text-gray-200">Friend {friend}</span>
          </div>
          <button className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">Invite</button>
        </div>
      ))}
    </div>
  </div>
)

// Tasks Section
const Tasks = () => (
  <div className="p-4 font-chakra">
    <h2 className="text-2xl font-bold mb-4 text-white">Tasks</h2>
    <div className="bg-gray-800 rounded-lg shadow">
      {['Invite 5 friends', 'Complete profile', 'Share on social media', 'Refer 10 users', 'Daily login'].map((task, index) => (
        <div key={index} className="flex items-center justify-between p-4 border-b border-gray-700">
          <span className="text-gray-200">{task}</span>
          <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 bg-gray-700 border-gray-600" />
        </div>
      ))}
    </div>
  </div>
)

// Profile Section (with Telegram User Integration)
const Profile = ({ telegramUser }: { telegramUser: TelegramUser | null }) => (
  <div className="p-4 font-chakra">
    <h2 className="text-2xl font-bold mb-4 text-white">Profile</h2>
    <div className="bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-600 rounded-full">
          {telegramUser && telegramUser.photo_url && (
            <img
              src={telegramUser.photo_url}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            {telegramUser ? telegramUser.first_name : 'John Doe'}
          </h3>
          <p className="text-gray-400">
            {telegramUser && telegramUser.username ? `@${telegramUser.username}` : '@johndoe'}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-400">
        Referral Link: {telegramUser ? `${telegramUser.id}` : 'Your Ref Link'}
        </p>
        <p className="text-sm text-gray-400">Total Referrals: 15</p>
      </div>
    </div>
  </div>
);

// Main App Component
export default function Component() {
  const [activeTab, setActiveTab] = useState('profile');
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);

  // Telegram WebApp Initialization
  useEffect(() => {
    try {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand(); // Expand the web app to full height
        setTelegramUser(tg.initDataUnsafe.user); // Fetch Telegram user info if available
      }
    } catch (e) {
      console.error('Error initializing Telegram WebApp:', e);
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile telegramUser={telegramUser} />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'friends':
        return <Friends />;
      case 'tasks':
        return <Tasks />;
      default:
        return <Profile telegramUser={telegramUser} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      <footer className="bg-gray-800 border-t border-gray-700">
        <nav className="flex justify-around">
          {[
            { name: 'Profile', icon: User, key: 'profile' },
            { name: 'Leaderboard', icon: Trophy, key: 'leaderboard' },
            { name: 'Friends', icon: Users, key: 'friends' },
            { name: 'Tasks', icon: CheckSquare, key: 'tasks' },
          ].map((item) => (
            <button
              key={item.key}
              className={`flex flex-col items-center justify-center p-2 w-full ${
                activeTab === item.key ? 'text-gray-200' : 'text-gray-400'
              }`}
              onClick={() => setActiveTab(item.key)}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.name}</span>
            </button>
          ))}
        </nav>
      </footer>
    </div>
  );
}