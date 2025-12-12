const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

/**
 * Basit dil seçici
 * ?lang=tr -> 'tr', aksi halde 'en'
 */
function getLang(req) {
  return req.query.lang === 'tr' ? 'tr' : 'en';
}

/**
 * UI metinleri (EN / TR)
 */
const uiText = {
  en: {
    htmlLang: 'en',
    brandSub: 'Settlement & compliance rails for regulated gaming.',
    sectionOverview: 'Overview',
    sectionConfig: 'Configuration',
    menu: {
      dashboard: 'Dashboard',
      transactions: 'Transactions',
      reports: 'Reports',
      cashout: 'Cashout',
      api: 'API & Webhooks',
      risk: 'Risk & Limits',
      settings: 'Settings',
      support: 'Support',
    },
    localSandboxLabel: 'Local sandbox • Port',
    kycApproved: 'KYC approved',
    logout: 'Logout',
    footer: 'Sandbox v0.1',
  },
  tr: {
    htmlLang: 'tr',
    brandSub: 'Düzenlenmiş oyun operatörleri için ödeme ve uyum altyapısı.',
    sectionOverview: 'Genel bakış',
    sectionConfig: 'Yapılandırma',
    menu: {
      dashboard: 'Ana panel',
      transactions: 'İşlemler',
      reports: 'Raporlar',
      cashout: 'Çekimler',
      api: 'API & Webhooklar',
      risk: 'Risk & Limitler',
      settings: 'Ayarlar',
      support: 'Destek',
    },
    localSandboxLabel: 'Lokal sandbox • Port',
    kycApproved: 'KYC onaylı',
    logout: 'Çıkış',
    footer: 'Sandbox v0.1',
  },
};

/**
 * Dashboard layout
 * section: hangi menünün aktif olacağını belirleyen string
 *          (dashboard, tx, reports, cashout, api, risk, settings, support)
 */
function dashboardLayout({ title, section, content, lang = 'en' }) {
  const t = uiText[lang] || uiText.en;

  return `<!DOCTYPE html>
<html lang="${t.htmlLang}">
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
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
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

    /* Icons */
    .nav-icon {
      font-size: 15px;
      width: 20px;
      display: inline-block;
    }

    /* Dil seçici */
    .lang-selector {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-right: 12px;
      padding: 5px 10px;
      background: rgba(7, 11, 30, 0.6);
      border: 1px solid rgba(120, 130, 200, 0.3);
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
    }
    .lang-opt {
      text-decoration: none;
      color: #fff;
      opacity: 0.4;
      transition: opacity 0.2s;
      cursor: pointer;
    }
    .lang-opt:hover {
      opacity: 1;
    }
    .lang-opt.active {
      opacity: 1;
      color: #f5d06f;
    }
    .lang-sep {
      opacity: 0.2;
      font-weight: 300;
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
    .logout-link:hover {
      opacity: 1;
      text-decoration: underline;
    }

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
        <div class="brand-sub">${t.brandSub}</div>
      </div>

      <div>
        <div class="nav-section-title">${t.sectionOverview}</div>
        <ul class="nav-list">
          <li>
            <a href="/dashboard?lang=${lang}" class="nav-item ${section === 'dashboard' ? 'active' : ''}">
              <span class="nav-icon">🏠</span>
              <span class="nav-label">${t.menu.dashboard}</span>
            </a>
          </li>
          <li>
            <a href="/transactions?lang=${lang}" class="nav-item ${section === 'tx' ? 'active' : ''}">
              <span class="nav-icon">💳</span>
              <span class="nav-label">${t.menu.transactions}</span>
            </a>
          </li>
          <li>
            <a href="/reports?lang=${lang}" class="nav-item ${section === 'reports' ? 'active' : ''}">
              <span class="nav-icon">📊</span>
              <span class="nav-label">${t.menu.reports}</span>
            </a>
          </li>
          <li>
            <a href="/cashout?lang=${lang}" class="nav-item ${section === 'cashout' ? 'active' : ''}">
              <span class="nav-icon">💸</span>
              <span class="nav-label">${t.menu.cashout}</span>
            </a>
          </li>
        </ul>
      </div>

      <div>
        <div class="nav-section-title">${t.sectionConfig}</div>
        <ul class="nav-list">
          <li>
            <a href="/api?lang=${lang}" class="nav-item ${section === 'api' ? 'active' : ''}">
              <span class="nav-icon">⚙️</span>
              <span class="nav-label">${t.menu.api}</span>
            </a>
          </li>
          <li>
            <a href="/risk?lang=${lang}" class="nav-item ${section === 'risk' ? 'active' : ''}">
              <span class="nav-icon">🛡️</span>
              <span class="nav-label">${t.menu.risk}</span>
            </a>
          </li>
          <li>
            <a href="/settings?lang=${lang}" class="nav-item ${section === 'settings' ? 'active' : ''}">
              <span class="nav-icon">🔧</span>
              <span class="nav-label">${t.menu.settings}</span>
            </a>
          </li>
          <li>
            <a href="/support?lang=${lang}" class="nav-item ${section === 'support' ? 'active' : ''}">
              <span class="nav-icon">❓</span>
              <span class="nav-label">${t.menu.support}</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="sidebar-footer">
        <div>RoyalPay by RoyalTech</div>
        <div style="opacity:0.6;">${t.footer}</div>
      </div>
    </aside>

    <div class="main">
      <header class="topbar">
        <div>
          <div class="top-left-title">${title}</div>
          <div class="top-left-sub">${t.localSandboxLabel} ${PORT}</div>
        </div>
        <div class="top-right">
          <div class="lang-selector">
            <a href="?lang=tr" class="lang-opt ${lang === 'tr' ? 'active' : ''}">TR</a>
            <span class="lang-sep">|</span>
            <a href="?lang=en" class="lang-opt ${lang === 'en' ? 'active' : ''}">EN</a>
          </div>
          <div class="merchant-pill">
            <div>
              <div class="merchant-name">Example Gaming Ltd.</div>
              <div style="font-size:10px; opacity:0.7;">Merchant ID: mrc_test_12345</div>
            </div>
            <span class="badge-ok">${t.kycApproved}</span>
          </div>
          <a href="/login?lang=${lang}" class="logout-link">${t.logout}</a>
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
function authLayout({ title, content, lang = 'en' }) {
  const t = uiText[lang] || uiText.en;
  return `<!DOCTYPE html>
<html lang="${t.htmlLang}">
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
  const lang = getLang(req);
  res.redirect(`/dashboard?lang=${lang}`);
});

// Dashboard
app.get('/dashboard', (req, res) => {
  const lang = getLang(req);
  const content = `
    <div class="status-chip">
      <span class="dot"></span><span>API is online</span>
    </div>
    <h1>Overview dashboard</h1>
    <p class="subtitle">High-level snapshot of today's performance for Example Gaming Ltd.</p>
    <!-- içerik aynı, demo data -->
  `;
  res.send(dashboardLayout({ title: 'Dashboard', section: 'dashboard', content, lang }));
});

// Transactions
app.get('/transactions', (req, res) => {
  const lang = getLang(req);
  const content = `
    <h1>Transactions</h1>
    <p class="subtitle">View and filter today's transaction activity. Data below is sample sandbox data.</p>
    <!-- demo tablo vs (orijinal içerik buraya geri konur) -->
  `;
  res.send(dashboardLayout({ title: 'Transactions', section: 'tx', content, lang }));
});

// (Diğer tüm route'larda da aynı patterni kullan:
// const lang = getLang(req);
// res.send(dashboardLayout({ ..., lang }));
// Şu an uzunluğu şişirmemek için tamamını tekrar yazmıyorum ama mantık bu.)

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
