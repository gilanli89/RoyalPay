const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

/**
 * Dashboard layout
 * section: hangi menünün aktif olacağını belirleyen string (dashboard, tx, reports, cashout, api, risk, settings, support)
 */
function dashboardLayout({ title, section, content }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: stretch;
      justify-content: center;
      background: radial-gradient(circle at top, #1b2140, #050711 60%);
      color: #f7f9ff;
    }
    a { color: inherit; }

    .app-shell {
      display: flex;
      max-width: 1280px;
      width: 100%;
      margin: 32px 20px;
      border-radius: 22px;
      overflow: hidden;
      box-shadow: 0 24px 60px rgba(0,0,0,0.55);
      border: 1px solid rgba(120,130,200,0.3);
      background: rgba(4,7,20,0.96);
    }

    /* Sidebar */
    .sidebar {
      width: 230px;
      background: radial-gradient(circle at top, #141a3a, #070b20 55%);
      padding: 18px 16px 18px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      border-right: 1px solid rgba(120,130,200,0.3);
    }
    .brand {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .brand-title {
      font-size: 17px;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #f5d06f;
    }
    .brand-sub {
      font-size: 11px;
      opacity: 0.7;
    }

    .nav-section-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .12em;
      opacity: 0.55;
      margin-bottom: 4px;
    }

    .nav-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .nav-item {
      font-size: 13px;
      padding: 7px 10px;
      border-radius: 10px;
      opacity: 0.78;
      cursor: pointer;
      text-decoration: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid transparent;
    }
    .nav-item span {
      pointer-events: none;
    }
    .nav-item:hover {
      opacity: 1;
      border-color: rgba(120,130,200,0.6);
      background: rgba(16,22,60,0.9);
    }
    .nav-item.active {
      opacity: 1;
      background: linear-gradient(135deg,#f5d06f1c,#f0b34125);
      border-color: rgba(245,208,111,0.8);
      color: #f5d06f;
    }

    .sidebar-footer {
      margin-top: auto;
      font-size: 11px;
      opacity: 0.6;
    }

    /* Main area */
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: radial-gradient(circle at top left, #131933, #050712 60%);
    }

    .topbar {
      padding: 14px 20px 10px;
      border-bottom: 1px solid rgba(120,130,200,0.25);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }
    .top-left-title {
      font-size: 15px;
      font-weight: 500;
    }
    .top-left-sub {
      font-size: 11px;
      opacity: 0.7;
    }

    .top-right {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 12px;
    }
    .merchant-pill {
      padding: 6px 10px;
      border-radius: 999px;
      border: 1px solid rgba(120,130,200,0.6);
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(6,10,30,0.95);
    }
    .merchant-name {
      font-weight: 500;
    }
    .badge-ok {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 999px;
      border: 1px solid #54e1a3;
      color: #54e1a3;
    }
    .logout-link {
      font-size: 12px;
      opacity: 0.75;
      text-decoration: none;
    }
    .logout-link:hover { opacity: 1; text-decoration: underline; }

    .content {
      padding: 18px 20px 20px;
      overflow-y: auto;
    }

    .cards-row {
      display: grid;
      grid-template-columns: repeat(auto-fit,minmax(180px,1fr));
      gap: 12px;
      margin-bottom: 18px;
    }
    .card {
      background: rgba(7,11,30,0.9);
      border-radius: 16px;
      padding: 14px 14px 12px;
      border: 1px solid rgba(120,130,200,0.35);
      box-shadow: 0 12px 30px rgba(0,0,0,0.45);
    }
    .card-title {
      font-size: 12px;
      opacity: 0.75;
      margin-bottom: 4px;
    }
    .card-value {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 2px;
    }
    .card-sub {
      font-size: 11px;
      opacity: 0.6;
    }

    .status-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      padding: 4px 9px;
      border-radius: 999px;
      background: rgba(40,180,120,0.17);
      color: #54e1a3;
      margin-bottom: 12px;
    }
    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #54e1a3;
      box-shadow: 0 0 10px #54e1a3;
    }

    h1 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .subtitle {
      font-size: 13px;
      opacity: 0.78;
      margin-bottom: 14px;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    .table thead {
      background: rgba(17,23,60,0.95);
    }
    .table th,
    .table td {
      padding: 8px 8px;
      border-bottom: 1px solid rgba(60,70,120,0.6);
      text-align: left;
    }
    .table th {
      opacity: 0.8;
      font-weight: 500;
      font-size: 11px;
    }
    .table tr:last-child td {
      border-bottom: none;
    }
    .status-badge {
      font-size: 11px;
      padding: 2px 7px;
      border-radius: 999px;
      border: 1px solid rgba(120,130,200,0.7);
      display: inline-block;
    }
    .status-badge.success {
      border-color:#54e1a3;
      color:#54e1a3;
    }
    .status-badge.failed {
      border-color:#ff7676;
      color:#ff9b9b;
    }
    .status-badge.pending {
      border-color:#f5d06f;
      color:#f5d06f;
    }

    .filters-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 10px;
      font-size: 11px;
      opacity: 0.85;
    }
    .filter-pill {
      padding: 5px 10px;
      border-radius: 999px;
      border: 1px solid rgba(120,130,200,0.6);
      background: rgba(9,12,32,0.9);
    }

    .section-title {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 6px;
      margin-top: 4px;
    }
    .section-sub {
      font-size: 11px;
      opacity: 0.7;
      margin-bottom: 10px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit,minmax(200px,1fr));
      gap: 10px 14px;
      margin-bottom: 12px;
      font-size: 12px;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    label { opacity: 0.8; font-size: 12px; }
    input, select, textarea {
      background: rgba(12,16,40,0.95);
      border-radius: 10px;
      border: 1px solid rgba(102,114,190,0.8);
      padding: 7px 9px;
      font-size: 12px;
      color: #f7f9ff;
      outline: none;
      resize: vertical;
    }
    input:focus, select:focus, textarea:focus {
      border-color: #f5d06f;
      box-shadow: 0 0 0 1px rgba(245,208,111,0.4);
    }
    .hint {
      font-size: 11px;
      opacity: 0.6;
    }
    .btn-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      margin-top: 6px;
    }
    .btn {
      border-radius: 999px;
      border: none;
      padding: 7px 14px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-primary {
      background: linear-gradient(135deg,#f5d06f,#f0b341);
      color:#1b122c;
    }
    .btn-ghost {
      background: transparent;
      border: 1px solid rgba(120,130,200,0.7);
      color:#dbe3ff;
    }

    .two-col {
      display:grid;
      grid-template-columns: minmax(0,2.1fr) minmax(0,1.7fr);
      gap:14px;
    }
    @media (max-width: 960px) {
      .app-shell { margin: 16px 8px; flex-direction: column; }
      .sidebar { width: 100%; flex-direction: row; align-items: center; gap: 14px; }
      .nav-section-title { display:none; }
      .nav-list { flex-direction: row; flex-wrap: wrap; }
      .main { min-height: 60vh; }
      .two-col { grid-template-columns:minmax(0,1fr); }
    }
  </style>
</head>
<body>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-title">ROYALPAY</div>
        <div class="brand-sub">Settlement & compliance rails for regulated gaming.</div>
      </div>

      <div>
        <div class="nav-section-title">Overview</div>
        <ul class="nav-list">
          <li><a href="/dashboard" class="nav-item ${section === 'dashboard' ? 'active' : ''}"><span>Dashboard</span></a></li>
          <li><a href="/transactions" class="nav-item ${section === 'tx' ? 'active' : ''}"><span>Transactions</span></a></li>
          <li><a href="/reports" class="nav-item ${section === 'reports' ? 'active' : ''}"><span>Reports</span></a></li>
          <li><a href="/cashout" class="nav-item ${section === 'cashout' ? 'active' : ''}"><span>Cashout</span></a></li>
        </ul>
      </div>

      <div>
        <div class="nav-section-title">Configuration</div>
        <ul class="nav-list">
          <li><a href="/api" class="nav-item ${section === 'api' ? 'active' : ''}"><span>API & Webhooks</span></a></li>
          <li><a href="/risk" class="nav-item ${section === 'risk' ? 'active' : ''}"><span>Risk & Limits</span></a></li>
          <li><a href="/settings" class="nav-item ${section === 'settings' ? 'active' : ''}"><span>Settings</span></a></li>
          <li><a href="/support" class="nav-item ${section === 'support' ? 'active' : ''}"><span>Support</span></a></li>
        </ul>
      </div>

      <div class="sidebar-footer">
        <div>RoyalPay by RoyalTech</div>
        <div style="opacity:0.6;">Sandbox v0.1</div>
      </div>
    </aside>

    <div class="main">
      <header class="topbar">
        <div>
          <div class="top-left-title">${title}</div>
          <div class="top-left-sub">Local sandbox • Port ${PORT}</div>
        </div>
        <div class="top-right">
          <div class="merchant-pill">
            <div>
              <div class="merchant-name">Example Gaming Ltd.</div>
              <div style="font-size:10px; opacity:0.7;">Merchant ID: mrc_test_12345</div>
            </div>
            <span class="badge-ok">KYC approved</span>
          </div>
          <a href="/login" class="logout-link">Logout</a>
        </div>
      </header>
      <section class="content">
        ${content}
      </section>
    </div>
  </div>
</body>
</html>`;
}

/** Simple auth-style layout for login/register */
function authLayout({ title, content }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at top, #1b2140, #050711 60%);
      color: #f7f9ff;
    }
    .shell {
      max-width: 420px;
      width: 100%;
      padding: 24px 20px;
    }
    .logo {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #f5d06f;
      margin-bottom: 2px;
    }
    .logo-sub {
      font-size: 11px;
      opacity: 0.7;
      margin-bottom: 16px;
    }
    .card {
      background: rgba(7,11,30,0.96);
      border-radius: 18px;
      padding: 20px 20px 18px;
      border: 1px solid rgba(120,130,200,0.4);
      box-shadow: 0 18px 45px rgba(0,0,0,0.55);
    }
    .title { font-size: 18px; font-weight: 600; margin-bottom: 6px; }
    .subtitle { font-size: 12px; opacity: 0.7; margin-bottom: 16px; }

    .field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; font-size: 12px; }
    label { opacity: 0.8; }
    input, select {
      background: rgba(12,16,40,0.95);
      border-radius: 10px;
      border: 1px solid rgba(102,114,190,0.8);
      padding: 8px 10px;
      font-size: 13px;
      color: #f7f9ff;
      outline: none;
    }
    input:focus, select:focus {
      border-color: #f5d06f;
      box-shadow: 0 0 0 1px rgba(245,208,111,0.4);
    }
    .hint { font-size: 11px; opacity: 0.6; }
    .btn-row { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:12px; flex-wrap:wrap;}
    .btn {
      border-radius: 999px;
      border: none;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-primary {
      background: linear-gradient(135deg,#f5d06f,#f0b341);
      color: #1b122c;
    }
    .link-inline {
      font-size: 12px;
      opacity: 0.8;
    }
    .link-inline a {
      color:#f5d06f;
      text-decoration:none;
    }
    .link-inline a:hover { text-decoration:underline; }
  </style>
</head>
<body>
  <div class="shell">
    <div class="logo">ROYALPAY</div>
    <div class="logo-sub">Operator access • Local sandbox</div>
    <div class="card">
      ${content}
    </div>
  </div>
</body>
</html>`;
}

// ---------------- ROUTES ----------------

// Root -> dashboard
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

// Dashboard
app.get('/dashboard', (req, res) => {
  const content = `
    <div class="status-chip">
      <span class="dot"></span><span>API is online</span>
    </div>
    <h1>Overview dashboard</h1>
    <p class="subtitle">High-level snapshot of today&#39;s performance for Example Gaming Ltd.</p>

    <div class="cards-row">
      <div class="card">
        <div class="card-title">Today volume</div>
        <div class="card-value">€ 42,500</div>
        <div class="card-sub">Across 1,284 successful transactions</div>
      </div>
      <div class="card">
        <div class="card-title">Approval rate</div>
        <div class="card-value">96.4%</div>
        <div class="card-sub">Declines reduced vs. 7-day average</div>
      </div>
      <div class="card">
        <div class="card-title">Current wallet balance</div>
        <div class="card-value">€ 68,900</div>
        <div class="card-sub">Ready for next settlement / cashout</div>
      </div>
      <div class="card">
        <div class="card-title">Open cashouts</div>
        <div class="card-value">3</div>
        <div class="card-sub">Expected completion T+1</div>
      </div>
    </div>

    <div class="two-col">
      <div class="card">
        <div class="section-title">Today&#39;s traffic</div>
        <div class="section-sub">Distribution of successful vs failed / pending transactions (dummy data).</div>
        <table class="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Count</th>
              <th>Volume</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Deposits</td>
              <td>980</td>
              <td>€ 37,200</td>
              <td>87.5%</td>
            </tr>
            <tr>
              <td>Withdrawals</td>
              <td>210</td>
              <td>€ 9,600</td>
              <td>22.6%</td>
            </tr>
            <tr>
              <td>Adjustments / refunds</td>
              <td>14</td>
              <td>€ -4,300</td>
              <td>-9.1%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="section-title">Quick navigation</div>
        <div class="section-sub">Jump into key operational views.</div>
        <div class="cards-row" style="grid-template-columns:1fr;">
          <div class="card" style="background:rgba(10,16,48,0.95);">
            <div class="card-title">Transactions</div>
            <div class="card-sub" style="margin-bottom:6px;">Inspect today&#39;s transaction list with filters.</div>
            <a href="/transactions" class="btn btn-primary" style="text-decoration:none; margin-top:4px; display:inline-flex;">Open transactions</a>
          </div>
          <div class="card" style="background:rgba(10,16,48,0.95);">
            <div class="card-title">Cashout</div>
            <div class="card-sub" style="margin-bottom:6px;">Request a payout from your wallet balance.</div>
            <a href="/cashout" class="btn btn-ghost" style="text-decoration:none; margin-top:4px; display:inline-flex;">Go to cashout</a>
          </div>
        </div>
      </div>
    </div>
  `;
  res.send(dashboardLayout({ title: 'Dashboard', section: 'dashboard', content }));
});

// Transactions
app.get('/transactions', (req, res) => {
  const content = `
    <h1>Transactions</h1>
    <p class="subtitle">View and filter today&#39;s transaction activity. Data below is sample sandbox data.</p>

    <div class="cards-row">
      <div class="card">
        <div class="card-title">Today volume</div>
        <div class="card-value">€ 42,500</div>
        <div class="card-sub">1,284 total transactions</div>
      </div>
      <div class="card">
        <div class="card-title">Success rate</div>
        <div class="card-value">96.4%</div>
        <div class="card-sub">Failed: 46 • Pending: 12</div>
      </div>
      <div class="card">
        <div class="card-title">Chargebacks</div>
        <div class="card-value">0.21%</div>
        <div class="card-sub">Rolling 30-day window</div>
      </div>
    </div>

    <div class="filters-row">
      <div class="filter-pill">Date: Today</div>
      <div class="filter-pill">Type: All</div>
      <div class="filter-pill">Status: All</div>
      <div class="filter-pill">Currency: EUR</div>
    </div>

    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Txn ID</th>
            <th>Player</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Method</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>09:12</td>
            <td>tx_001234</td>
            <td>player_8891</td>
            <td>Deposit</td>
            <td>€ 120.00</td>
            <td><span class="status-badge success">Completed</span></td>
            <td>Card</td>
          </tr>
          <tr>
            <td>09:27</td>
            <td>tx_001235</td>
            <td>player_9042</td>
            <td>Withdrawal</td>
            <td>€ 60.00</td>
            <td><span class="status-badge pending">Pending</span></td>
            <td>Bank transfer</td>
          </tr>
          <tr>
            <td>09:41</td>
            <td>tx_001236</td>
            <td>player_1134</td>
            <td>Deposit</td>
            <td>€ 250.00</td>
            <td><span class="status-badge failed">Failed</span></td>
            <td>Card</td>
          </tr>
          <tr>
            <td>10:05</td>
            <td>tx_001237</td>
            <td>player_2278</td>
            <td>Deposit</td>
            <td>€ 80.00</td>
            <td><span class="status-badge success">Completed</span></td>
            <td>Crypto</td>
          </tr>
          <tr>
            <td>10:18</td>
            <td>tx_001238</td>
            <td>player_4482</td>
            <td>Refund</td>
            <td>€ -40.00</td>
            <td><span class="status-badge success">Completed</span></td>
            <td>Adjustment</td>
          </tr>
        </tbody>
      </table>
      <div class="hint" style="margin-top:8px;">In a real integration this table would be fed by your Postgres transaction log with server-side filtering & pagination.</div>
    </div>
  `;
  res.send(dashboardLayout({ title: 'Transactions', section: 'tx', content }));
});

// Reports
app.get('/reports', (req, res) => {
  const content = `
    <h1>Reports</h1>
    <p class="subtitle">Summary KPIs for your chosen period. Below is static demo data for the sandbox environment.</p>

    <div class="cards-row">
      <div class="card">
        <div class="card-title">Last 7 days volume</div>
        <div class="card-value">€ 286,400</div>
        <div class="card-sub">Up 12.4% vs previous week</div>
      </div>
      <div class="card">
        <div class="card-title">Net settlement</div>
        <div class="card-value">€ 74,900</div>
        <div class="card-sub">After fees and adjustments</div>
      </div>
      <div class="card">
        <div class="card-title">RoyalPay fee share</div>
        <div class="card-value">€ 6,420</div>
        <div class="card-sub">Based on blended fee structure</div>
      </div>
      <div class="card">
        <div class="card-title">Chargeback ratio</div>
        <div class="card-value">0.18%</div>
        <div class="card-sub">Within agreed risk thresholds</div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">Period selection</div>
      <div class="section-sub">When wired to the backend, this view will support exporting CSV / PDF reports for your finance team.</div>
      <div class="form-grid">
        <div class="field">
          <label>From</label>
          <input type="date" />
        </div>
        <div class="field">
          <label>To</label>
          <input type="date" />
        </div>
        <div class="field">
          <label>Grouping</label>
          <select>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>
        <div class="field">
          <label>Export format</label>
          <select>
            <option>On-screen summary</option>
            <option>CSV</option>
            <option>PDF</option>
          </select>
        </div>
      </div>
      <div class="btn-row">
        <button class="btn btn-primary" type="button">Update report (demo)</button>
        <button class="btn btn-ghost" type="button">Export (demo)</button>
      </div>
    </div>
  `;
  res.send(dashboardLayout({ title: 'Reports', section: 'reports', content }));
});

// Cashout
app.get('/cashout', (req, res) => {
  const content = `
    <h1>Cashout</h1>
    <p class="subtitle">Request a payout from your RoyalPay wallet balance to your bank or crypto account.</p>

    <div class="cards-row">
      <div class="card">
        <div class="card-title">Available balance</div>
        <div class="card-value">€ 68,900</div>
        <div class="card-sub">EUR settlement wallet</div>
      </div>
      <div class="card">
        <div class="card-title">Pending cashouts</div>
        <div class="card-value">3</div>
        <div class="card-sub">Total: € 24,000 in progress</div>
      </div>
    </div>

    <div class="two-col">
      <div class="card">
        <div class="section-title">New cashout request</div>
        <div class="section-sub">Sandbox-only UX. Submission does not move real funds.</div>
        <div class="form-grid">
          <div class="field">
            <label>Amount</label>
            <input type="number" placeholder="25000" />
            <div class="hint">Minimum € 1,000 per cashout.</div>
          </div>
          <div class="field">
            <label>Destination</label>
            <select>
              <option>Bank account (EUR IBAN)</option>
              <option>Bank account (GBP)</option>
              <option>Crypto wallet (USDT)</option>
            </select>
          </div>
          <div class="field">
            <label>Reference</label>
            <input type="text" placeholder="January settlement" />
          </div>
          <div class="field">
            <label>Notify finance team</label>
            <select>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" type="button">Submit cashout (demo)</button>
          <span class="hint">In production this would create a settlement order against your wallet balance.</span>
        </div>
      </div>

      <div class="card">
        <div class="section-title">Recent cashouts</div>
        <table class="table">
          <thead>
            <tr>
              <th>Date</th><th>Amount</th><th>Destination</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-12-10</td>
              <td>€ 15,000</td>
              <td>Bank • CYxx 1234</td>
              <td><span class="status-badge success">Completed</span></td>
            </tr>
            <tr>
              <td>2025-12-09</td>
              <td>€ 6,000</td>
              <td>USDT wallet</td>
              <td><span class="status-badge success">Completed</span></td>
            </tr>
            <tr>
              <td>2025-12-08</td>
              <td>€ 3,000</td>
              <td>Bank • CYxx 5678</td>
              <td><span class="status-badge pending">Pending</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
  res.send(dashboardLayout({ title: 'Cashout', section: 'cashout', content }));
});

// API & Webhooks
app.get('/api', (req, res) => {
  const content = `
    <h1>API & Webhooks</h1>
    <p class="subtitle">Developer-facing settings for integrating RoyalPay into your cashier and back-office.</p>

    <div class="two-col">
      <div class="card">
        <div class="section-title">API keys</div>
        <div class="section-sub">In production these values would be unique per merchant and environment.</div>
        <div class="form-grid">
          <div class="field">
            <label>Publishable key</label>
            <input type="text" value="pk_test_royalpay_public_123456789" readonly />
            <div class="hint">Safe to use in front-end integrations.</div>
          </div>
          <div class="field">
            <label>Secret key</label>
            <input type="text" value="sk_test_royalpay_secret_987654321" readonly />
            <div class="hint">Keep this secret; server-side only.</div>
          </div>
        </div>
        <div class="btn-row">
          <button class="btn btn-ghost" type="button">Rotate keys (demo)</button>
        </div>
      </div>

      <div class="card">
        <div class="section-title">Webhook configuration</div>
        <div class="section-sub">RoyalPay notifies your platform about payment and settlement events.</div>
        <div class="form-grid">
          <div class="field">
            <label>Webhook URL</label>
            <input type="text" value="https://examplegaming.com/royalpay/webhook" />
          </div>
          <div class="field">
            <label>Signing secret</label>
            <input type="text" value="whsec_test_123456789" readonly />
          </div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" type="button">Send test event (demo)</button>
          <span class="hint">Example: payment.completed, payment.failed, settlement.created …</span>
        </div>
      </div>
    </div>
  `;
  res.send(dashboardLayout({ title: 'API & Webhooks', section: 'api', content }));
});

// Risk & Limits
app.get('/risk', (req, res) => {
  const content = `
    <h1>Risk & limits</h1>
    <p class="subtitle">Configure basic risk controls and velocity limits for your merchant account.</p>

    <div class="two-col">
      <div class="card">
        <div class="section-title">Transaction limits</div>
        <div class="form-grid">
          <div class="field">
            <label>Max single transaction amount</label>
            <input type="number" value="2500" />
            <div class="hint">RoyalPay will automatically decline larger attempts.</div>
          </div>
          <div class="field">
            <label>Daily volume cap</label>
            <input type="number" value="100000" />
          </div>
          <div class="field">
            <label>Max tx per minute (velocity)</label>
            <input type="number" value="60" />
          </div>
          <div class="field">
            <label>Auto-freeze if chargeback ratio above</label>
            <input type="number" value="1.5" />
            <div class="hint">Percentage over rolling 30-day window.</div>
          </div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" type="button">Save limits (demo)</button>
        </div>
      </div>

      <div class="card">
        <div class="section-title">Risk engine notes</div>
        <div class="section-sub">In a full implementation this page would connect to:</div>
        <ul class="hint" style="margin-left:16px; display:grid; gap:4px;">
          <li>Device fingerprinting & IP reputation scoring</li>
          <li>Sanctions / PEP screening results</li>
          <li>Rule-based blocking (BINs, regions, MCCs)</li>
          <li>Machine-learning fraud scores per transaction</li>
        </ul>
      </div>
    </div>
  `;
  res.send(dashboardLayout({ title: 'Risk & limits', section: 'risk', content }));
});

// Settings
app.get('/settings', (req, res) => {
  const content = `
    <h1>Settings</h1>
    <p class="subtitle">Basic merchant profile and team settings for the RoyalPay sandbox.</p>

    <div class="two-col">
      <div class="card">
        <div class="section-title">Merchant profile</div>
        <div class="form-grid">
          <div class="field">
            <label>Legal entity name</label>
            <input type="text" value="Example Gaming Ltd." />
          </div>
          <div class="field">
            <label>Trading name</label>
            <input type="text" value="ExampleGaming" />
          </div>
          <div class="field">
            <label>Primary contact email</label>
            <input type="email" value="ops@examplegaming.com" />
          </div>
          <div class="field">
            <label>Timezone</label>
            <select><option>UTC+2 (Cyprus)</option><option>UTC</option><option>UTC+3</option></select>
          </div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" type="button">Save profile (demo)</button>
        </div>
      </div>

      <div class="card">
        <div class="section-title">Team access</div>
        <div class="section-sub">Example users with access to this merchant.</div>
        <table class="table">
          <thead>
            <tr><th>Name</th><th>Role</th><th>Email</th></tr>
          </thead>
          <tbody>
            <tr><td>Sinan G.</td><td>Owner</td><td>sinan@examplegaming.com</td></tr>
            <tr><td>Naşide T.</td><td>Finance</td><td>naside@examplegaming.com</td></tr>
            <tr><td>Halil K.</td><td>Tech</td><td>halil@examplegaming.com</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
  res.send(dashboardLayout({ title: 'Settings', section: 'settings', content }));
});

// Support
app.get('/support', (req, res) => {
  const content = `
    <h1>Support</h1>
    <p class="subtitle">How to reach the RoyalPay team during integration and operations.</p>

    <div class="two-col">
      <div class="card">
        <div class="section-title">Contact channels</div>
        <ul class="hint" style="margin-left:16px; display:grid; gap:4px; font-size:13px; opacity:0.85;">
          <li>🟢 Slack: <strong>#royalpay-integration</strong></li>
          <li>📧 Email: support@royalpay.test</li>
          <li>📞 Phone (ops): +357 000 000</li>
        </ul>
        <div class="section-title" style="margin-top:14px;">Incident procedure</div>
        <div class="section-sub">For outages or critical payment issues, escalation directly to on-call engineer and risk lead.</div>
      </div>

      <div class="card">
        <div class="section-title">Send a message</div>
        <div class="form-grid">
          <div class="field">
            <label>Subject</label>
            <input type="text" placeholder="Settlement question" />
          </div>
          <div class="field">
            <label>Urgency</label>
            <select><option>Normal</option><option>High</option><option>Critical</option></select>
          </div>
        </div>
        <div class="field">
          <label>Message</label>
          <textarea rows="4" placeholder="Describe your question or issue…"></textarea>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" type="button">Submit ticket (demo)</button>
        </div>
      </div>
    </div>
  `;
  res.send(dashboardLayout({ title: 'Support', section: 'support', content }));
});

// Login
app.get('/login', (req, res) => {
  const content = `
    <div class="title">Operator login</div>
    <div class="subtitle">Sign in to access your RoyalPay dashboard, transactions and reports.</div>
    <div class="field">
      <label for="email">Work email</label>
      <input id="email" type="email" placeholder="you@casino-operator.com" />
    </div>
    <div class="field">
      <label for="password">Password</label>
      <input id="password" type="password" placeholder="••••••••" />
      <div class="hint">In this sandbox the form is visual only.</div>
    </div>
    <div class="btn-row">
      <button class="btn btn-primary" type="button" onclick="window.location.href='/dashboard'">Sign in (demo)</button>
      <div class="link-inline">No account? <a href="/register">Create a merchant</a></div>
    </div>
  `;
  res.send(authLayout({ title: 'RoyalPay Login', content }));
});

// Register
app.get('/register', (req, res) => {
  const content = `
    <div class="title">Register a new merchant</div>
    <div class="subtitle">Create a sandbox merchant profile to explore the RoyalPay portal.</div>
    <div class="field">
      <label>Company / brand name</label>
      <input type="text" placeholder="Example Gaming Ltd." />
    </div>
    <div class="field">
      <label>Website</label>
      <input type="text" placeholder="https://examplegaming.com" />
    </div>
    <div class="field">
      <label>Contact email</label>
      <input type="email" placeholder="ops@examplegaming.com" />
    </div>
    <div class="field">
      <label>Base currency</label>
      <select><option>EUR</option><option>USD</option><option>GBP</option></select>
    </div>
    <div class="field">
      <label>Password</label>
      <input type="password" placeholder="Choose a secure password" />
    </div>
    <div class="btn-row">
      <button class="btn btn-primary" type="button" onclick="window.location.href='/dashboard'">Create sandbox merchant</button>
      <div class="link-inline">Already onboarded? <a href="/login">Back to login</a></div>
    </div>
  `;
  res.send(authLayout({ title: 'RoyalPay Register', content }));
});

// Health JSON
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'RoyalPay Local API',
    environment: 'local',
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`RoyalPay API listening on port ${PORT}`);
});
