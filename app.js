/* ═══════════════════════════════════════════
   TOP.GG SELLER DASHBOARD — APP JS
═══════════════════════════════════════════ */

/* ── Sidebar Toggle (Mobile) ── */
const sidebar  = document.getElementById('sidebar');
const overlay  = document.getElementById('overlay');
const menuBtn  = document.getElementById('menuBtn');

menuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
});

/* ── Nav Active State ── */
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    if (window.innerWidth < 768) {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    }
  });
});

/* ── Bid Progress Bar ── */
const ASKING_PRICE  = 1200;
const STARTING_BID  = 560;
const CURRENT_BID   = 755;
const RANGE         = ASKING_PRICE - STARTING_BID;
const PROGRESS      = ((CURRENT_BID - STARTING_BID) / RANGE) * 100;

const bidProgressEl = document.getElementById('bidProgress');
const bidMarkerEl   = document.getElementById('bidMarker');

// Animate on load
setTimeout(() => {
  bidProgressEl.style.width  = `${PROGRESS}%`;
  bidMarkerEl.style.left     = `${PROGRESS}%`;
}, 400);

/* ── Countdown Timer ── */
let totalSeconds = 23 * 3600 + 41 * 60 + 8;

function formatTime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map(v => String(v).padStart(2, '0')).join(':');
}

const countdownEl = document.getElementById('countdown');

setInterval(() => {
  if (totalSeconds > 0) {
    totalSeconds--;
    countdownEl.textContent = formatTime(totalSeconds);
  }
}, 1000);

/* ── Chart.js Defaults ── */
Chart.defaults.color = '#4a5a70';
Chart.defaults.font.family = "'DM Mono', monospace";
Chart.defaults.font.size   = 11;

/* ── Revenue / Sales Chart ── */
const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

const revenueData = [1200, 2100, 3400, 2800, 4500, 5100, 4780];
const salesData   = [2, 3, 6, 4, 3, 2, 1];

const mainCtx = document.getElementById('mainChart').getContext('2d');

// Gradient fill
const gradient = mainCtx.createLinearGradient(0, 0, 0, 220);
gradient.addColorStop(0,   'rgba(0,229,195,0.22)');
gradient.addColorStop(0.6, 'rgba(0,229,195,0.05)');
gradient.addColorStop(1,   'rgba(0,229,195,0)');

const mainChart = new Chart(mainCtx, {
  type: 'line',
  data: {
    labels: months,
    datasets: [{
      label: 'Revenue ($)',
      data: revenueData,
      borderColor: '#00e5c3',
      borderWidth: 2,
      backgroundColor: gradient,
      pointBackgroundColor: '#00e5c3',
      pointBorderColor: '#111827',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: true
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0e1220',
        borderColor: '#1e2d47',
        borderWidth: 1,
        titleColor: '#7a8fa8',
        bodyColor: '#e8edf5',
        padding: 10,
        callbacks: {
          label: ctx => ` $${ctx.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(30,45,71,0.6)', drawTicks: false },
        border: { display: false },
        ticks: { color: '#4a5a70', padding: 6 }
      },
      y: {
        grid: { color: 'rgba(30,45,71,0.6)', drawTicks: false },
        border: { display: false },
        ticks: {
          color: '#4a5a70',
          padding: 6,
          callback: v => `$${(v/1000).toFixed(v >= 1000 ? 0 : 1)}k`
        }
      }
    },
    interaction: { mode: 'index', intersect: false }
  }
});

/* ── Category Doughnut Chart ── */
const catColors = ['#00e5c3', '#4d9fff', '#b482ff', '#f5a623'];
const catLabels = ['Discord Bots', 'Prebuilt Websites', 'Chatbots', 'Other'];
const catValues = [42, 28, 23, 7];

const catCtx = document.getElementById('categoryChart').getContext('2d');

new Chart(catCtx, {
  type: 'doughnut',
  data: {
    labels: catLabels,
    datasets: [{
      data: catValues,
      backgroundColor: catColors.map(c => c + '30'),
      borderColor: catColors,
      borderWidth: 2,
      hoverBackgroundColor: catColors.map(c => c + '50'),
      hoverBorderWidth: 2
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0e1220',
        borderColor: '#1e2d47',
        borderWidth: 1,
        titleColor: '#7a8fa8',
        bodyColor: '#e8edf5',
        padding: 10,
        callbacks: {
          label: ctx => ` ${ctx.label}: ${ctx.parsed}%`
        }
      }
    }
  }
});

/* ── Build Legend ── */
const legendEl = document.getElementById('categoryLegend');

catLabels.forEach((label, i) => {
  const item = document.createElement('div');
  item.className = 'legend-item';
  item.innerHTML = `
    <div class="legend-left">
      <div class="legend-dot" style="background:${catColors[i]}"></div>
      <span class="legend-name">${label}</span>
    </div>
    <span class="legend-val">${catValues[i]}%</span>
  `;
  legendEl.appendChild(item);
});

/* ── Analytics Tab Switching ── */
const tabs       = document.querySelectorAll('.tab-btn');
const labelEl    = document.getElementById('mainChartLabel');

const tabConfigs = {
  revenue: {
    label: 'Revenue Over Time',
    data: revenueData,
    color: '#00e5c3',
    prefix: '$',
    yFmt: v => `$${(v/1000).toFixed(v >= 1000 ? 0 : 1)}k`
  },
  sales: {
    label: 'Sales Trend',
    data: salesData,
    color: '#4d9fff',
    prefix: '',
    yFmt: v => `${v}`
  }
};

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const key = tab.dataset.tab;
    if (key === 'category') {
      labelEl.textContent = 'Category Performance';
      mainChart.data.datasets[0].data = revenueData; // keep chart, show category note
      return;
    }

    const cfg = tabConfigs[key];
    if (!cfg) return;

    labelEl.textContent = cfg.label;

    // Swap gradient
    const newGrad = mainCtx.createLinearGradient(0, 0, 0, 220);
    newGrad.addColorStop(0,   cfg.color + '38');
    newGrad.addColorStop(0.6, cfg.color + '0d');
    newGrad.addColorStop(1,   cfg.color + '00');

    mainChart.data.datasets[0].data            = cfg.data;
    mainChart.data.datasets[0].borderColor     = cfg.color;
    mainChart.data.datasets[0].pointBackgroundColor = cfg.color;
    mainChart.data.datasets[0].backgroundColor = newGrad;
    mainChart.options.scales.y.ticks.callback  = cfg.yFmt;
    mainChart.options.plugins.tooltip.callbacks.label =
      ctx => ` ${cfg.prefix}${ctx.parsed.y.toLocaleString()}`;

    mainChart.update('active');
  });
});

/* ── Action Button Feedback ── */
document.querySelectorAll('.action-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.style.transform = 'scale(0.96)';
    setTimeout(() => { btn.style.transform = ''; }, 120);
  });
});
