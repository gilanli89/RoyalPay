import React, { useState, useEffect } from 'react';

// --- İKONLAR (SVG) ---
// Harici kütüphane gerektirmemesi için SVG'leri gömdüm.
const Icons = {
  Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Transactions: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  Reports: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Cashout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Api: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Risk: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Support: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Lock: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
};

// --- MOCK VERİLER (1 Milyon Dolar Hacim) ---
const MOCK_DATA = {
  stats: {
    todayVolume: 1254300.50, // 1.2M+
    successRate: 98.4,
    activeMerchants: 1,
    pendingPayouts: 45200.00
  },
  transactions: [
    { id: 'TX-9981', type: 'Deposit', method: 'Credit Card', amount: 150000, status: 'Completed', date: '2025-12-12 10:45' },
    { id: 'TX-9982', type: 'Deposit', method: 'Crypto (USDT)', amount: 500000, status: 'Completed', date: '2025-12-12 10:42' },
    { id: 'TX-9983', type: 'Withdraw', method: 'Bank Transfer', amount: -25000, status: 'Processing', date: '2025-12-12 10:30' },
    { id: 'TX-9984', type: 'Deposit', method: 'Papara', amount: 75000, status: 'Completed', date: '2025-12-12 09:15' },
    { id: 'TX-9985', type: 'Deposit', method: 'Credit Card', amount: 250000, status: 'Completed', date: '2025-12-12 09:00' },
    { id: 'TX-9986', type: 'Withdraw', method: 'Crypto (BTC)', amount: -100000, status: 'Completed', date: '2025-12-11 23:50' },
  ],
  balance: 845000.00 // Kullanılabilir Bakiye
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Login durumuna göre ekran değiştir
  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return <DashboardLayout onLogout={() => setIsLoggedIn(false)} />;
}

// --- 1. LOGIN EKRANI ---
function LoginScreen({ onLogin }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0B0E14] text-white">
      <div className="w-full max-w-md p-8 bg-[#151A25] rounded-xl border border-gray-800 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-[#EDB95E] font-bold text-3xl tracking-wider">ROYALPAY</h1>
          <p className="text-gray-400 mt-2">Secure Merchant Portal</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Username</label>
            <input 
              type="text" 
              defaultValue="admin"
              className="w-full bg-[#0B0E14] border border-gray-700 rounded p-3 text-white focus:border-[#EDB95E] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              defaultValue="1234"
              className="w-full bg-[#0B0E14] border border-gray-700 rounded p-3 text-white focus:border-[#EDB95E] focus:outline-none"
            />
          </div>
          
          <button 
            onClick={onLogin}
            className="w-full bg-[#EDB95E] text-black font-bold py-3 rounded hover:bg-[#dca345] transition-colors mt-4"
          >
            Log In
          </button>
          
          <div className="text-center text-xs text-gray-600 mt-4">
            Test Environment: Sandbox v0.1
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 2. ANA DASHBOARD YAPISI ---
function DashboardLayout({ onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
    { id: 'transactions', label: 'Transactions', icon: Icons.Transactions },
    { id: 'reports', label: 'Reports', icon: Icons.Reports },
    { id: 'cashout', label: 'Cashout', icon: Icons.Cashout },
    { id: 'api', label: 'API & Webhooks', icon: Icons.Api },
    { id: 'risk', label: 'Risk & Limits', icon: Icons.Risk },
    { id: 'settings', label: 'Settings', icon: Icons.Settings },
    { id: 'support', label: 'Support', icon: Icons.Support },
  ];

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard': return <PageDashboard />;
      case 'reports': return <PageReports />;
      case 'cashout': return <PageCashout />;
      case 'api': return <PageApi />;
      case 'risk': return <PageRisk />;
      case 'settings': return <PageSettings />;
      case 'support': return <PageSupport />;
      default: return <PageDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0B0E14] text-gray-300 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#151A25] border-r border-gray-800 flex flex-col">
        <div className="p-6">
          <h1 className="text-[#EDB95E] font-bold text-xl tracking-wider">ROYALPAY</h1>
          <p className="text-xs text-gray-500 mt-1">Settlement & compliance rails.</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activePage === item.id 
                  ? 'bg-[#2A303C] text-[#EDB95E] border-l-4 border-[#EDB95E]' 
                  : 'text-gray-400 hover:bg-[#1F2532] hover:text-white'
              }`}
            >
              <item.icon />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 text-xs text-gray-600">
          RoyalPay by RoyalTech<br/>Sandbox v0.1
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-[#151A25] border-b border-gray-800 flex items-center justify-between px-6">
          <h2 className="text-white font-semibold capitalize text-lg">{activePage.replace('-', ' ')}</h2>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden md:block">
              <div className="text-white text-sm font-bold">Example Gaming Ltd.</div>
              <div className="text-xs text-green-400 border border-green-900 bg-green-900/20 px-2 rounded-full inline-block">KYC Approved</div>
            </div>
            <button 
              onClick={onLogout}
              className="text-gray-400 hover:text-white text-sm border border-gray-700 px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#0B0E14]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// --- ALT SAYFALAR ---

// 1. DASHBOARD OVERVIEW
function PageDashboard() {
  const formatMoney = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="space-y-6">
      <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs inline-flex items-center font-bold">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
        API System Online
      </div>

      {/* Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#151A25] p-6 rounded-xl border border-gray-800">
          <div className="text-gray-400 text-sm mb-2">Total Processed Today</div>
          <div className="text-3xl text-white font-bold">{formatMoney(MOCK_DATA.stats.todayVolume)}</div>
          <div className="text-green-500 text-xs mt-2">↑ 12% vs yesterday</div>
        </div>
        <div className="bg-[#151A25] p-6 rounded-xl border border-gray-800">
          <div className="text-gray-400 text-sm mb-2">Success Rate</div>
          <div className="text-3xl text-white font-bold">{MOCK_DATA.stats.successRate}%</div>
          <div className="text-gray-500 text-xs mt-2">All systems normal</div>
        </div>
        <div className="bg-[#151A25] p-6 rounded-xl border border-gray-800">
          <div className="text-gray-400 text-sm mb-2">Available for Cashout</div>
          <div className="text-3xl text-[#EDB95E] font-bold">{formatMoney(MOCK_DATA.balance)}</div>
        </div>
      </div>

      {/* Son İşlemler Özeti */}
      <div className="bg-[#151A25] rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800 font-bold text-white">Recent Activity</div>
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1F2532] text-gray-400">
            <tr>
              <th className="p-4">Transaction ID</th>
              <th className="p-4">Type</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {MOCK_DATA.transactions.slice(0, 3).map((tx) => (
              <tr key={tx.id} className="text-gray-300 hover:bg-[#1F2532]">
                <td className="p-4 font-mono">{tx.id}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${tx.type === 'Deposit' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                    {tx.type}
                  </span>
                </td>
                <td className="p-4 font-bold text-white">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount)}</td>
                <td className="p-4 text-green-400">{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 2. REPORTS (Yatırım / Çekim Listesi)
function PageReports() {
  const [filter, setFilter] = useState('All');
  
  const filteredData = MOCK_DATA.transactions.filter(t => filter === 'All' || t.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-white text-xl font-bold">Financial Reports</h3>
        <div className="space-x-2">
          {['All', 'Deposit', 'Withdraw'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded text-sm ${filter === f ? 'bg-[#EDB95E] text-black font-bold' : 'bg-[#151A25] border border-gray-700'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#151A25] rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1F2532] text-gray-400">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">ID</th>
              <th className="p-4">Method</th>
              <th className="p-4">Type</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredData.map((tx) => (
              <tr key={tx.id} className="text-gray-300 hover:bg-[#1F2532]">
                <td className="p-4 text-gray-500">{tx.date}</td>
                <td className="p-4 font-mono">{tx.id}</td>
                <td className="p-4">{tx.method}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${tx.type === 'Deposit' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                    {tx.type}
                  </span>
                </td>
                <td className={`p-4 font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount)}
                </td>
                <td className="p-4">
                  <span className="text-green-400">{tx.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 3. CASHOUT (Kasa Çekim)
function PageCashout() {
  const [amount, setAmount] = useState('');
  const [wallet, setWallet] = useState('');

  const handleWithdraw = () => {
    if(!amount || !wallet) return alert('Please fill all fields');
    alert(`Success! Request to withdraw $${amount} to ${wallet} has been submitted.`);
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-[#151A25] p-6 rounded-xl border border-gray-800 mb-6">
        <h3 className="text-gray-400 text-sm mb-2">Available Balance</h3>
        <div className="text-4xl text-[#EDB95E] font-bold mb-4">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(MOCK_DATA.balance)}
        </div>
        <p className="text-xs text-gray-500">Funds are ready for immediate settlement (T+0).</p>
      </div>

      <div className="bg-[#151A25] p-8 rounded-xl border border-gray-800">
        <h3 className="text-white text-lg font-bold mb-6">Request Payout</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Amount (USD)</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#0B0E14] border border-gray-700 rounded p-3 text-white focus:border-[#EDB95E] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Wallet Address (TRC20 / ERC20)</label>
            <input 
              type="text" 
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              placeholder="0x..."
              className="w-full bg-[#0B0E14] border border-gray-700 rounded p-3 text-white focus:border-[#EDB95E] focus:outline-none font-mono"
            />
          </div>

          <div className="pt-4">
            <button 
              onClick={handleWithdraw}
              className="w-full bg-[#EDB95E] text-black font-bold py-3 rounded hover:bg-[#dca345] transition-colors"
            >
              Confirm Withdrawal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. API & WEBHOOKS
function PageApi() {
  const [showSecret, setShowSecret] = useState(false);
  const apiKey = "pk_live_51MzQ2K...";
  const secretKey = "sk_live_9921XjL2...";

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-[#151A25] p-6 rounded-xl border border-gray-800">
        <h3 className="text-white text-lg font-bold mb-4">API Credentials</h3>
        <p className="text-gray-400 text-sm mb-6">Use these keys to authenticate your requests. Keep your Secret Key safe!</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Public Key</label>
            <div className="flex">
              <input readOnly value={apiKey} className="flex-1 bg-[#0B0E14] border border-gray-700 rounded-l p-3 text-gray-300 font-mono text-sm" />
              <button className="bg-[#2A303C] border border-l-0 border-gray-700 px-4 text-gray-300 hover:text-white rounded-r">Copy</button>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Secret Key</label>
            <div className="flex">
              <input 
                readOnly 
                value={showSecret ? secretKey : "••••••••••••••••••••••••••••"} 
                className="flex-1 bg-[#0B0E14] border border-gray-700 rounded-l p-3 text-gray-300 font-mono text-sm" 
              />
              <button 
                onClick={() => setShowSecret(!showSecret)}
                className="bg-[#2A303C] border border-l-0 border-gray-700 px-4 text-gray-300 hover:text-white rounded-r w-24"
              >
                {showSecret ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#151A25] p-6 rounded-xl border border-gray-800">
        <h3 className="text-white text-lg font-bold mb-4">Webhook Endpoint</h3>
        <div className="flex items-center space-x-4">
            <input placeholder="https://your-site.com/webhook" className="flex-1 bg-[#0B0E14] border border-gray-700 rounded p-3 text-white" />
            <button className="bg-green-700 text-white px-6 py-3 rounded font-bold hover:bg-green-600">Save</button>
        </div>
      </div>
    </div>
  );
}

// 5. RISK & LIMITS
function PageRisk() {
  return (
    <div className="max-w-3xl space-y-6">
       <div className="bg-yellow-900/20 border border-yellow-700 p-4 rounded text-yellow-500 text-sm mb-4">
          Changes to limits apply instantly to all new transactions.
       </div>

       <div className="bg-[#151A25] p-6 rounded-xl border border-gray-800">
         <h3 className="text-white font-bold mb-4">Transaction Limits</h3>
         <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-gray-400 text-sm mb-1">Min Deposit Amount</label>
               <input type="number" defaultValue="10" className="w-full bg-[#0B0E14] border border-gray-700 rounded p-2 text-white" />
            </div>
            <div>
               <label className="block text-gray-400 text-sm mb-1">Max Deposit Amount</label>
               <input type="number" defaultValue="50000" className="w-full bg-[#0B0E14] border border-gray-700 rounded p-2 text-white" />
            </div>
         </div>
       </div>

       <div className="bg-[#151A25] p-6 rounded-xl border border-gray-800">
         <h3 className="text-white font-bold mb-4">Daily Volume Cap</h3>
         <label className="flex items-center space-x-3 mb-4 cursor-pointer">
            <input type="checkbox" checked className="form-checkbox h-5 w-5 text-[#EDB95E]" />
            <span className="text-gray-300">Enable Daily Cap</span>
         </label>
         <input type="number" defaultValue="2000000" className="w-full bg-[#0B0E14] border border-gray-700 rounded p-2 text-white" />
         <p className="text-xs text-gray-500 mt-2">Current usage: 62%</p>
       </div>
       
       <button className="bg-[#EDB95E] text-black font-bold py-3 px-8 rounded hover:bg-[#dca345]">Save Risk Rules</button>
    </div>
  );
}

// 6. SETTINGS (Basic)
function PageSettings() {
  return (
    <div className="max-w-2xl bg-[#151A25] p-6 rounded-xl border border-gray-800">
      <h3 className="text-white text-lg font-bold mb-6">General Settings</h3>
      
      <div className="space-y-4">
        <div>
           <label className="block text-gray-400 text-sm mb-1">Company Name</label>
           <input type="text" defaultValue="Example Gaming Ltd." className="w-full bg-[#0B0E14] border border-gray-700 rounded p-3 text-white" />
        </div>
        <div>
           <label className="block text-gray-400 text-sm mb-1">Contact Email</label>
           <input type="email" defaultValue="admin@example.com" className="w-full bg-[#0B0E14] border border-gray-700 rounded p-3 text-white" />
        </div>
        <div className="pt-4 border-t border-gray-800">
            <label className="block text-gray-400 text-sm mb-1">Timezone</label>
            <select className="w-full bg-[#0B0E14] border border-gray-700 rounded p-3 text-white">
                <option>UTC (Coordinated Universal Time)</option>
                <option>TRT (Turkey Time)</option>
                <option>EST (Eastern Standard Time)</option>
            </select>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded mt-4 hover:bg-blue-500">Update Profile</button>
      </div>
    </div>
  );
}

// 7. SUPPORT
function PageSupport() {
  return (
    <div className="max-w-2xl">
      <div className="bg-[#151A25] p-6 rounded-xl border border-gray-800">
        <h3 className="text-white text-lg font-bold mb-4">Contact Support</h3>
        <p className="text-gray-400 text-sm mb-4">Having trouble? Our team is available 24/7 for high-volume merchants.</p>
        
        <textarea 
          rows="4" 
          placeholder="Describe your issue..." 
          className="w-full bg-[#0B0E14] border border-gray-700 rounded p-3 text-white mb-4 focus:border-[#EDB95E] focus:outline-none"
        ></textarea>
        
        <button className="bg-[#EDB95E] text-black font-bold py-3 px-8 rounded hover:bg-[#dca345]">
          Send Ticket
        </button>

        <div className="mt-8 pt-6 border-t border-gray-800">
            <h4 className="text-white font-bold mb-2">Direct Contact</h4>
            <p className="text-gray-400">Telegram: <span className="text-blue-400">@RoyalPaySupport</span></p>
            <p className="text-gray-400">Email: <span className="text-blue-400">support@royalpay.io</span></p>
        </div>
      </div>
    </div>
  );
}
