import React, { useState, useEffect } from 'react';
import { User, Mail, Database, Building2, Cpu, ArrowLeft } from 'lucide-react';

// Types Definitions

type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

type Service = {
  name: string;
  limits: string;
  price: string;
};

type CryptoOption = {
  name: string;
  address: string;
};

// Dummy Data Definitions

const servicesSMTP: Service[] = [
  { name: 'AMAZON SES', limits: '50,000 DAILY LIMITS', price: '$100.00' },
  { name: 'AMAZON SES', limits: '100,000 DAILY LIMITS', price: '$150.00' },
  { name: 'AMAZON SES', limits: '200,000 DAILY LIMITS', price: '$300.00' },
  { name: 'AMAZON SES', limits: '500,000 DAILY LIMITS', price: '$400.00' },
];

const servicesDatabase: Service[] = [
  { name: 'MYSQL DATABASE', limits: '100,000 RECORDS', price: '$200.00' },
  { name: 'POSTGRESQL DATABASE', limits: '200,000 RECORDS', price: '$300.00' },
  { name: 'MONGODB', limits: '500,000 RECORDS', price: '$400.00' },
  { name: 'FIREBASE', limits: '1,000,000 RECORDS', price: '$500.00' },
];

const servicesLogs: Service[] = [
  { name: 'APPLICATION LOGS', limits: '1,000 LOGS', price: '$50.00' },
  { name: 'SYSTEM LOGS', limits: '5,000 LOGS', price: '$100.00' },
  { name: 'NETWORK LOGS', limits: '10,000 LOGS', price: '$200.00' },
  { name: 'SECURITY LOGS', limits: '50,000 LOGS', price: '$300.00' },
];

const servicesTools: Service[] = [
  { name: 'API TOOLKIT', limits: '100 CALLS/DAY', price: '$100.00' },
  { name: 'DATA ANALYSIS TOOL', limits: '500 CALLS/DAY', price: '$200.00' },
  { name: 'WEB SCRAPER', limits: '1,000 CALLS/DAY', price: '$300.00' },
  { name: 'AUTOMATION SCRIPT', limits: '5,000 CALLS/DAY', price: '$400.00' },
];

const cryptoOptions: CryptoOption[] = [
  { name: 'BTC', address: '1FgcFiHT4aFX9kp8ZVvKqFnniC6PsbzX2B' },
  { name: 'ETH', address: '0xe7e1b1fc19fd43fc1bfb81c9cc1a7765bd26c6ba' },
  { name: 'USDT', address: 'TQVVecHnTuco74sWtEXe2RbLX4Mfdbtesx' },
  { name: 'SOL', address: 'EotJppSSeBn69hbbAf21AdpbKJhHN23gkNBBSNv3CCrT' },
  { name: 'LTC', address: 'ltc1q5zazz7qs5n23dnmasglrt425k56va7s9405fcr' },
  { name: 'XMR', address: '85nq842gQzSAzbbpsD63BxBA8MxwKCg1d2XRjTbt45SpSyXbCQjRMpS6CDitVUiiTqB5NF9iY9HtMM3etYKaqqDEQ93w8Be' },
];

// Window declaration for Telegram API

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

// Main Component

const TelegramEcommerceApp: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    const fetchTelegramUser = async () => {
      const allowedAdminIds = [6251439446]; // Replace with actual allowed admin user IDs
      if (window.Telegram?.WebApp) {
        const webApp = window.Telegram.WebApp;
        webApp.ready();
        const user = webApp.initDataUnsafe?.user;
        if (user) {
          if (allowedAdminIds.includes(user.id)) {
            setIsAdmin(true);
          }
          setTelegramUser({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            photo_url: user.photo_url,
          });
        }
      }
    };

    fetchTelegramUser();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setActiveSection('crypto');
  };

  const handleCryptoSelect = (crypto: CryptoOption) => {
    setSelectedCrypto(crypto);
    setActiveSection('payment');
    setCountdown(300); // 5 minutes countdown
  };

  const handleBack = () => {
    if (activeSection === 'crypto') {
      setActiveSection('smtp');
      setSelectedService(null);
    } else if (activeSection === 'payment') {
      setActiveSection('crypto');
      setSelectedCrypto(null);
      setCountdown(0);
    }
  };

  const renderHeader = () => {
    return (
      <header className="bg-gray-900 p-4 text-white text-center">
        <h1 className="text-2xl font-bold uppercase">{activeSection}</h1>
      </header>
    );
  };

  const renderProfile = () => (
    <div className="p-4 text-white">
      {telegramUser ? (
        <div className="flex items-center space-x-4">
          {telegramUser.photo_url && (
            <img src={telegramUser.photo_url} alt="Profile" className="w-16 h-16 rounded-full" />
          )}
          <div>
            <p className="font-bold">{`${telegramUser.first_name} ${telegramUser.last_name || ''}`}</p>
            <p>@{telegramUser.username}</p>
            <p>User ID: {telegramUser.id}</p>
            <p>Total Orders: 0</p>
          </div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );

  const renderServices = (services: Service[]) => (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
        {services.map((service, index) => (
          <button
            key={index}
            className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-left flex flex-col justify-between h-full shadow-lg hover:bg-gray-700 transition-transform transform hover:scale-105"
            onClick={() => handleServiceSelect(service)}
          >
            <h3 className="text-base font-bold text-yellow-500 mb-1">{service.name}</h3>
            <p className="text-sm text-gray-300 mb-1">{service.limits}</p>
            <p className="text-lg font-bold text-yellow-500">{service.price}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderCryptoOptions = () => (
    <div className="p-4">
      <button onClick={handleBack} className="text-white mb-4 flex items-center">
        <ArrowLeft className="mr-2" /> Back
      </button>
      <div className="grid grid-cols-2 gap-4">
        {cryptoOptions.map((crypto, index) => (
          <button
            key={index}
            className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-left shadow-lg hover:bg-gray-700 transition-transform transform hover:scale-105"
            onClick={() => handleCryptoSelect(crypto)}
          >
            <h3 className="text-lg font-bold text-yellow-500">{crypto.name}</h3>
          </button>
        ))}
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="p-4 text-white">
      <button onClick={handleBack} className="mb-4 flex items-center">
        <ArrowLeft className="mr-2" /> Back
      </button>
      {selectedCrypto && (
        <>
          <p className="mb-2">Send payment to this address:</p>
          <p className="bg-gray-800 p-2 rounded mb-4 break-all">{selectedCrypto.address}</p>
          <div className="flex justify-center mb-4">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedCrypto.address}`}
              alt="Payment QR Code"
              className="w-40 h-40"
            />
          </div>
          <p className="text-center">Time remaining: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</p>
        </>
      )}
    </div>
  );

  const renderAdminPanel = () => (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <form className="flex flex-col space-y-4">
        <label className="flex flex-col">
          <span className="font-bold mb-1">Product Name</span>
          <input type="text" className="p-2 rounded bg-gray-800 text-white border border-gray-700" />
        </label>
        <label className="flex flex-col">
          <span className="font-bold mb-1">Description</span>
          <textarea className="p-2 rounded bg-gray-800 text-white border border-gray-700"></textarea>
        </label>
        <label className="flex flex-col">
          <span className="font-bold mb-1">Price ($)</span>
          <input type="number" className="p-2 rounded bg-gray-800 text-white border border-gray-700" />
        </label>
        <button type="submit" className="bg-yellow-500 p-2 rounded text-black font-bold hover:bg-yellow-600">Add Product</button>
      </form>
    </div>
  );

  const renderContent = () => {
    if (isAdmin && activeSection === 'admin') {
      return renderAdminPanel();
    }
    switch (activeSection) {
      case 'profile':
        return renderProfile();
      case 'smtp':
        return renderServices(servicesSMTP);
      case 'database':
        return renderServices(servicesDatabase);
      case 'logs':
        return renderServices(servicesLogs);
      case 'tools':
        return renderServices(servicesTools);
      case 'database':
        return renderServices();
      case 'logs':
        return renderServices();
      case 'tools':
        return renderServices();
      case 'crypto':
        return renderCryptoOptions();
      case 'payment':
        return renderPayment();
      default:
        return <div className="p-4 text-white">Content for {activeSection}</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {isAdmin ? (
        <button onClick={() => setActiveSection('admin')} className="bg-yellow-500 p-2 m-4 rounded text-black font-bold hover:bg-yellow-600">
          Go to Admin Panel
        </button>
      ) : null}
      {renderHeader()}
      <main className="flex-1 overflow-y-auto pb-20">
        {renderContent()}
      </main>
      <nav className="bg-gray-900 py-2 fixed bottom-0 left-0 right-0 z-10">
        <div className="flex justify-around">
          {[
            { icon: User, key: 'profile' },
            { icon: Mail, key: 'smtp' },
            { icon: Database, key: 'database' },
            { icon: Building2, key: 'logs' },
            { icon: Cpu, key: 'tools' },
          ].map((item) => (
            <button
              key={item.key}
              className={`flex flex-col items-center justify-center p-2 ${
                activeSection === item.key ? 'text-yellow-500' : 'text-gray-400'
              }`}
              onClick={() => setActiveSection(item.key)}
            >
              <item.icon className="h-6 w-6" />
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default TelegramEcommerceApp;
