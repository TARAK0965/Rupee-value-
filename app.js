/**
 * ============================================================================
 * Campus Ledger — Comprehensive Application Logic (SmartPocket AI 2.5)
 * Pure Modern ES6+ JavaScript — Zero External Dependencies Required
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Default Seed Data & State
  // --------------------------------------------------------------------------
  const DEFAULT_PROFILES = {
    student: {
      id: 'usr-student-01',
      name: 'Mohit (Student)',
      email: 'mohit.student@campus.edu',
      role: 'Student',
      allowance: 15000,
      savingsTarget: 3000,
      passwordMasked: '••••••••',
    },
    parent: {
      id: 'usr-parent-02',
      name: 'Rajesh (Parent)',
      email: 'rajesh.parent@family.in',
      role: 'Parent',
      allowance: 25000,
      savingsTarget: 5000,
      passwordMasked: '••••••••',
    }
  };

  const DEFAULT_BUDGET_LIMITS = {
    'Food & Dining': 4500,
    'Travel & Commute': 2000,
    'Books & Academics': 2500,
    'Entertainment & Outings': 1800,
    'Shopping': 2000,
    'Bills & Utilities': 1200,
    'Emergency / Health': 1000
  };

  const DEFAULT_TRANSACTIONS = [
    { id: 'tx-1', amount: 220, category: 'Food & Dining', merchant: 'Swiggy', date: 'Today, 1:15 PM', type: 'debit', isAi: true },
    { id: 'tx-2', amount: 180, category: 'Travel & Commute', merchant: 'Uber Ride', date: 'Today, 10:30 AM', type: 'debit', isAi: true },
    { id: 'tx-3', amount: 650, category: 'Books & Academics', merchant: 'Sri Ganesh Books', date: 'Yesterday', type: 'debit', isAi: true },
    { id: 'tx-4', amount: 75, category: 'Food & Dining', merchant: 'Campus Canteen', date: 'Yesterday', type: 'debit', isAi: true },
    { id: 'tx-5', amount: 5000, category: 'Allowance', merchant: 'Parent Transfer UPI', date: '01 Oct 2026', type: 'credit', isAi: false },
    { id: 'tx-6', amount: 450, category: 'Entertainment & Outings', merchant: 'PVR Cinemas', date: '02 Oct 2026', type: 'debit', isAi: true },
    { id: 'tx-7', amount: 340, category: 'Travel & Commute', merchant: 'Metro Smart Card', date: '03 Oct 2026', type: 'debit', isAi: true },
    { id: 'tx-8', amount: 120, category: 'Food & Dining', merchant: 'Zomato Chai', date: '04 Oct 2026', type: 'debit', isAi: true }
  ];

  const DEFAULT_GOALS = [
    { id: 'g-1', title: 'Sony ANC Headphones', target: 4000, saved: 1800, icon: '🎧' },
    { id: 'g-2', title: 'Semester Exam Books & Notes', target: 2500, saved: 2100, icon: '📚' },
    { id: 'g-3', title: 'Goa Hostel Trip', target: 6000, saved: 2400, icon: '🏖️' }
  ];

  const DEFAULT_REMINDERS = [
    { id: 'r-1', title: 'Hostel Mess Fee Due', amount: 2400, date: '15th Oct' },
    { id: 'r-2', title: 'Library Book Return (No fine)', amount: 0, date: '18th Oct' },
    { id: 'r-3', title: 'Mobile Data Recharge', amount: 299, date: '22nd Oct' }
  ];

  const SAMPLE_UPI_NOTIFICATIONS = [
    { app: 'Google Pay', text: '₹240 paid to Swiggy India Ltd.', amount: 240, merchant: 'Swiggy', category: 'Food & Dining', flow: 'debit' },
    { app: 'PhonePe', text: 'Rs. 150 debited for Uber Ride via UPI', amount: 150, merchant: 'Uber Ride', category: 'Travel & Commute', flow: 'debit' },
    { app: 'Paytm', text: 'Paid ₹85 to Campus Canteen', amount: 85, merchant: 'Campus Canteen', category: 'Food & Dining', flow: 'debit' },
    { app: 'CRED', text: '₹650 spent at Sri Ganesh Books Store', amount: 650, merchant: 'Sri Ganesh Books', category: 'Books & Academics', flow: 'debit' },
    { app: 'Google Pay', text: 'You received ₹2,500 from Dad UPI', amount: 2500, merchant: 'Dad Allowance UPI', category: 'Allowance', flow: 'credit' },
    { app: 'Amazon Pay', text: '₹320 debited at Metro Smart Card Recharge', amount: 320, merchant: 'Metro Smart Card', category: 'Travel & Commute', flow: 'debit' }
  ];

  // --------------------------------------------------------------------------
  // Application State Store (Local Storage Synced)
  // --------------------------------------------------------------------------
  const state = {
    currentProfile: JSON.parse(localStorage.getItem('cl_profile') || 'null') || DEFAULT_PROFILES.student,
    isLoggedIn: localStorage.getItem('cl_isLoggedIn') !== 'false',
    balanceMode: localStorage.getItem('cl_balanceMode') || 'auto', // 'auto' | 'manual'
    manualBalance: parseFloat(localStorage.getItem('cl_manualBalance') || '12450'),
    transactions: JSON.parse(localStorage.getItem('cl_transactions') || 'null') || DEFAULT_TRANSACTIONS,
    budgetLimits: JSON.parse(localStorage.getItem('cl_budgetLimits') || 'null') || DEFAULT_BUDGET_LIMITS,
    goals: JSON.parse(localStorage.getItem('cl_goals') || 'null') || DEFAULT_GOALS,
    reminders: JSON.parse(localStorage.getItem('cl_reminders') || 'null') || DEFAULT_REMINDERS,
    activeTab: 'slide-1',
    activeFilter: 'all',
    searchQuery: '',
    isDarkMode: localStorage.getItem('cl_theme') !== 'light',
    isMobileFrame: localStorage.getItem('cl_mobileFrame') === 'true',
    ttsEnabled: true,
    unreadNotifCount: 1,
    chatMessages: [
      { sender: 'ai', text: '👋 Hi Mohit! I am your Gemini 2.5 Financial Coach. You can ask me questions like: "Can I buy dinner tonight?", "How much spent on transport?", or "Can I buy ₹4,000 headphones?"' }
    ]
  };

  function saveState() {
    localStorage.setItem('cl_profile', JSON.stringify(state.currentProfile));
    localStorage.setItem('cl_isLoggedIn', state.isLoggedIn);
    localStorage.setItem('cl_balanceMode', state.balanceMode);
    localStorage.setItem('cl_manualBalance', state.manualBalance);
    localStorage.setItem('cl_transactions', JSON.stringify(state.transactions));
    localStorage.setItem('cl_budgetLimits', JSON.stringify(state.budgetLimits));
    localStorage.setItem('cl_goals', JSON.stringify(state.goals));
    localStorage.setItem('cl_reminders', JSON.stringify(state.reminders));
    localStorage.setItem('cl_theme', state.isDarkMode ? 'dark' : 'light');
    localStorage.setItem('cl_mobileFrame', state.isMobileFrame);
  }

  // --------------------------------------------------------------------------
  // Sound Synthesis & Confetti Utilities (Pure Web APIs)
  // --------------------------------------------------------------------------
  function playAudioChime(type = 'success') {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'alert') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#F59E0B', '#10B981', '#6366F1', '#EC4899', '#3B82F6'];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 16,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    let frame = 0;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4; // gravity
        p.alpha -= 0.015;
        p.rotation += p.vr;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      }
      frame++;
      if (alive && frame < 120) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    render();
  }

  function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // --------------------------------------------------------------------------
  // Core Financial Calculation Functions
  // --------------------------------------------------------------------------
  function calculateFinancials() {
    const totalExpenses = state.transactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = state.transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);

    const allowance = state.currentProfile ? state.currentProfile.allowance : 15000;
    
    // Balance calculation
    let balance = 0;
    if (state.balanceMode === 'manual') {
      balance = state.manualBalance;
    } else {
      balance = Math.max(0, allowance + totalIncome - totalExpenses);
    }

    // Dynamic Safe Daily Limit based on remaining days in the month
    const now = new Date();
    const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysRemaining = Math.max(1, totalDays - now.getDate());
    const safeRemaining = Math.max(0, allowance - totalExpenses);
    const safeDailyLimit = Math.round(safeRemaining / daysRemaining);

    return {
      totalExpenses,
      totalIncome,
      allowance,
      balance,
      daysRemaining,
      safeDailyLimit
    };
  }

  // --------------------------------------------------------------------------
  // UI Rendering Functions
  // --------------------------------------------------------------------------
  function renderAll() {
    renderThemeAndLayout();
    renderHeader();
    renderSlide1();
    renderSlide2();
    renderSlide3();
    renderSlide4();
  }

  function renderThemeAndLayout() {
    const html = document.documentElement;
    const appContainer = document.getElementById('appContainer');
    const themeIcon = document.getElementById('themeIcon');

    if (state.isDarkMode) {
      html.classList.add('dark');
      if (themeIcon) themeIcon.textContent = '☀️';
    } else {
      html.classList.remove('dark');
      if (themeIcon) themeIcon.textContent = '🌙';
    }

    if (appContainer) {
      if (state.isMobileFrame) {
        appContainer.classList.add('mobile-frame-mode');
      } else {
        appContainer.classList.remove('mobile-frame-mode');
      }
    }
  }

  function renderHeader() {
    const userGreeting = document.getElementById('userGreeting');
    const authHeaderBtnContainer = document.getElementById('authHeaderBtnContainer');

    if (userGreeting) {
      const firstName = state.currentProfile ? state.currentProfile.name.split(' ')[0] : 'Guest';
      userGreeting.textContent = state.isLoggedIn ? `Hi, ${firstName} 👋` : 'Logged Out';
    }

    if (authHeaderBtnContainer) {
      if (state.isLoggedIn) {
        authHeaderBtnContainer.innerHTML = `
          <button id="headerLogoutBtn" class="btn-icon logout-icon" title="Log Out & Unlink Device">🚪</button>
        `;
        document.getElementById('headerLogoutBtn')?.addEventListener('click', handleLogout);
      } else {
        authHeaderBtnContainer.innerHTML = `
          <button id="headerLoginBtn" class="btn-amber" style="padding: 6px 12px; font-size: 0.75rem;">Sign In</button>
        `;
        document.getElementById('headerLoginBtn')?.addEventListener('click', () => openModal('loginModal'));
      }
    }
  }

  function renderSlide1() {
    const fin = calculateFinancials();

    // Metric Values
    const metricBalance = document.getElementById('metricBalance');
    const balanceModeLabel = document.getElementById('balanceModeLabel');
    const balanceFootText = document.getElementById('balanceFootText');
    const metricAllowance = document.getElementById('metricAllowance');
    const metricSpent = document.getElementById('metricSpent');
    const spendPctBadge = document.getElementById('spendPctBadge');
    const metricDailySafe = document.getElementById('metricDailySafe');
    const metricDaysRemaining = document.getElementById('metricDaysRemaining');

    if (metricBalance) metricBalance.textContent = fin.balance.toLocaleString('en-IN');
    if (balanceModeLabel) balanceModeLabel.textContent = state.balanceMode === 'manual' ? 'Manual' : 'Auto';
    if (balanceFootText) balanceFootText.textContent = state.balanceMode === 'manual' ? 'Custom balance set' : 'Auto-updated via ledger';
    if (metricAllowance) metricAllowance.textContent = fin.allowance.toLocaleString('en-IN');
    if (metricSpent) metricSpent.textContent = fin.totalExpenses.toLocaleString('en-IN');
    
    const spendPct = Math.round((fin.totalExpenses / fin.allowance) * 100);
    if (spendPctBadge) spendPctBadge.textContent = `${spendPct}%`;
    if (metricDailySafe) metricDailySafe.textContent = fin.safeDailyLimit.toLocaleString('en-IN');
    if (metricDaysRemaining) metricDaysRemaining.textContent = fin.daysRemaining;

    // Check category warnings for Food
    const foodSpend = state.transactions
      .filter(t => t.type === 'debit' && t.category === 'Food & Dining')
      .reduce((s, t) => s + t.amount, 0);
    const foodLimit = state.budgetLimits['Food & Dining'] || 4500;
    const foodRatio = foodSpend / foodLimit;

    const budgetWarningBanner = document.getElementById('budgetWarningBanner');
    const budgetWarningText = document.getElementById('budgetWarningText');
    if (budgetWarningBanner && budgetWarningText) {
      if (foodRatio >= 0.8) {
        budgetWarningBanner.classList.remove('hidden');
        budgetWarningText.textContent = `Food & Dining has reached ${(foodRatio * 100).toFixed(0)}% of its limit (₹${foodSpend} / ₹${foodLimit})!`;
      } else {
        budgetWarningBanner.classList.add('hidden');
      }
    }

    // Render Transaction List
    renderTransactionList();
  }

  function renderTransactionList() {
    const container = document.getElementById('txListContainer');
    if (!container) return;

    let filtered = [...state.transactions];

    if (state.activeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === state.activeFilter);
    }

    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.merchant.toLowerCase().includes(q) || 
        t.category.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--text-mute); font-size: 0.85rem;">No transactions found.</div>`;
      return;
    }

    const categoryIcons = {
      'Food & Dining': '🍔',
      'Travel & Commute': '🚕',
      'Books & Academics': '📚',
      'Entertainment & Outings': '🍿',
      'Shopping': '🛍️',
      'Bills & Utilities': '⚡',
      'Emergency / Health': '💊',
      'Allowance': '💰'
    };

    container.innerHTML = filtered.map(tx => {
      const icon = categoryIcons[tx.category] || '💸';
      const isCredit = tx.type === 'credit';
      const amountClass = isCredit ? 'text-emerald' : 'text-rose';
      const prefix = isCredit ? '+' : '-';

      return `
        <div class="tx-item">
          <div class="tx-item-left">
            <div class="tx-category-icon">${icon}</div>
            <div>
              <div class="tx-merchant">${tx.merchant} ${tx.isAi ? '<span class="badge-amber" style="font-size: 0.6rem; padding: 1px 4px;">AI</span>' : ''}</div>
              <div class="tx-meta">${tx.category} • ${tx.date}</div>
            </div>
          </div>
          <div class="tx-item-right">
            <span class="tx-amount ${amountClass}">${prefix}₹${tx.amount.toLocaleString('en-IN')}</span>
            <button class="tx-delete-btn" data-id="${tx.id}" title="Delete">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    // Attach delete listeners
    container.querySelectorAll('.tx-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        deleteTransaction(id);
      });
    });
  }

  function renderSlide2() {
    render503020Rule();
    renderDonutChart();
    renderTrendBars();
    renderCategoryBudgets();
  }

  function render503020Rule() {
    const fin = calculateFinancials();
    const needsSpend = state.transactions
      .filter(t => t.type === 'debit' && ['Food & Dining', 'Bills & Utilities', 'Books & Academics'].includes(t.category))
      .reduce((s, t) => s + t.amount, 0);

    const wantsSpend = state.transactions
      .filter(t => t.type === 'debit' && ['Entertainment & Outings', 'Shopping', 'Travel & Commute'].includes(t.category))
      .reduce((s, t) => s + t.amount, 0);

    const savingsBuffer = Math.max(0, fin.balance - fin.totalExpenses);
    const total = Math.max(1, needsSpend + wantsSpend + savingsBuffer);

    const pNeeds = Math.round((needsSpend / total) * 100);
    const pWants = Math.round((wantsSpend / total) * 100);
    const pSavings = Math.max(0, 100 - pNeeds - pWants);

    const barNeeds = document.getElementById('barNeeds');
    const barWants = document.getElementById('barWants');
    const barSavings = document.getElementById('barSavings');
    const valNeeds = document.getElementById('valNeeds');
    const valWants = document.getElementById('valWants');
    const valSavings = document.getElementById('valSavings');

    if (barNeeds) barNeeds.style.width = `${pNeeds}%`;
    if (barWants) barWants.style.width = `${pWants}%`;
    if (barSavings) barSavings.style.width = `${pSavings}%`;

    if (valNeeds) valNeeds.textContent = `₹${needsSpend.toLocaleString('en-IN')} (${pNeeds}%)`;
    if (valWants) valWants.textContent = `₹${wantsSpend.toLocaleString('en-IN')} (${pWants}%)`;
    if (valSavings) valSavings.textContent = `₹${savingsBuffer.toLocaleString('en-IN')} (${pSavings}%)`;
  }

  function renderDonutChart() {
    const svg = document.getElementById('categoryDonutSvg');
    const legend = document.getElementById('donutLegend');
    if (!svg || !legend) return;

    // Aggregate category totals
    const catMap = {};
    state.transactions.filter(t => t.type === 'debit').forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });

    const categories = Object.keys(catMap);
    const total = Object.values(catMap).reduce((s, v) => s + v, 0);

    if (total === 0) {
      svg.innerHTML = '<circle cx="50" cy="50" r="38" fill="none" stroke="var(--surface-3)" stroke-width="12" />';
      legend.innerHTML = '<div class="text-mute text-xs">No expense data yet</div>';
      return;
    }

    const colors = ['#F59E0B', '#10B981', '#6366F1', '#EC4899', '#3B82F6', '#8B5CF6', '#14B8A6'];
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    let accumulatedOffset = 0;

    let circlesSvg = '';
    let legendHtml = '';

    categories.forEach((cat, idx) => {
      const amount = catMap[cat];
      const pct = amount / total;
      const strokeDash = pct * circumference;
      const strokeDashoffset = -accumulatedOffset;
      const color = colors[idx % colors.length];

      circlesSvg += `
        <circle cx="50" cy="50" r="${radius}"
          fill="none"
          stroke="${color}"
          stroke-width="12"
          stroke-dasharray="${strokeDash} ${circumference}"
          stroke-dashoffset="${strokeDashoffset}"
          transform="rotate(-90 50 50)" />
      `;

      legendHtml += `
        <div class="legend-item">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="width:8px; height:8px; border-radius:50%; background:${color};"></span>
            <span>${cat}</span>
          </div>
          <strong>₹${amount} (${Math.round(pct * 100)}%)</strong>
        </div>
      `;

      accumulatedOffset += strokeDash;
    });

    svg.innerHTML = circlesSvg;
    legend.innerHTML = legendHtml;
  }

  function renderTrendBars() {
    const wrap = document.getElementById('trendBarChart');
    if (!wrap) return;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const values = [450, 680, 220, 890, 540, 920, 310];
    const maxVal = Math.max(...values, 1000);

    wrap.innerHTML = days.map((day, idx) => {
      const val = values[idx];
      const heightPct = Math.round((val / maxVal) * 100);
      return `
        <div class="trend-bar-col">
          <div class="trend-bar" style="height: ${heightPct}%;" title="₹${val}"></div>
          <span class="trend-bar-label">${day}</span>
        </div>
      `;
    }).join('');
  }

  function renderCategoryBudgets() {
    const container = document.getElementById('categoryBudgetsContainer');
    if (!container) return;

    const spendMap = {};
    state.transactions.filter(t => t.type === 'debit').forEach(t => {
      spendMap[t.category] = (spendMap[t.category] || 0) + t.amount;
    });

    container.innerHTML = Object.entries(state.budgetLimits).map(([cat, limit]) => {
      const spent = spendMap[cat] || 0;
      const pct = Math.min(100, Math.round((spent / limit) * 100));
      let colorClass = 'green';
      if (pct >= 85) colorClass = 'rose';
      else if (pct >= 70) colorClass = 'amber';

      return `
        <div class="cat-budget-card">
          <div class="cat-budget-header">
            <span>${cat}</span>
            <span class="text-${colorClass === 'green' ? 'emerald' : colorClass}">₹${spent} / ₹${limit}</span>
          </div>
          <div class="cat-progress-bg">
            <div class="cat-progress-fill ${colorClass}" style="width: ${pct}%;"></div>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-mute); display:flex; justify-content:space-between;">
            <span>${pct}% consumed</span>
            <span>₹${Math.max(0, limit - spent)} left</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderSlide3() {
    renderChatThread();
    renderGoals();
    renderReminders();
  }

  function renderChatThread() {
    const thread = document.getElementById('chatMessages');
    if (!thread) return;

    thread.innerHTML = state.chatMessages.map(msg => {
      return `
        <div class="chat-bubble ${msg.sender}">
          <div>${msg.text}</div>
          ${msg.card ? msg.card : ''}
        </div>
      `;
    }).join('');

    thread.scrollTop = thread.scrollHeight;
  }

  function renderGoals() {
    const container = document.getElementById('goalsContainer');
    if (!container) return;

    container.innerHTML = state.goals.map(g => {
      const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
      const remaining = Math.max(0, g.target - g.saved);

      return `
        <div class="goal-card">
          <div class="goal-header">
            <span>${g.icon} ${g.title}</span>
            <span class="text-amber">₹${g.saved} / ₹${g.target}</span>
          </div>
          <div class="cat-progress-bg" style="margin: 8px 0;">
            <div class="cat-progress-fill amber" style="width: ${pct}%;"></div>
          </div>
          <div class="goal-actions-row">
            <span style="font-size: 0.72rem; color: var(--text-mute);">${pct}% (${remaining > 0 ? `₹${remaining} to go` : 'Goal Completed! 🎉'})</span>
            <button class="btn-small-outline add-money-goal-btn" data-id="${g.id}">+ Add ₹200</button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.add-money-goal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        addMoneyToGoal(id, 200);
      });
    });
  }

  function renderReminders() {
    const container = document.getElementById('remindersContainer');
    if (!container) return;

    container.innerHTML = state.reminders.map(r => {
      return `
        <div class="reminder-item">
          <div>
            <strong>${r.title}</strong>
            <div style="font-size: 0.72rem; color: var(--text-mute);">Due: ${r.date}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            ${r.amount > 0 ? `<span class="text-amber font-bold">₹${r.amount}</span>` : '<span class="text-mute">Notice</span>'}
            <button class="tx-delete-btn delete-reminder-btn" data-id="${r.id}">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.delete-reminder-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        deleteReminder(id);
      });
    });
  }

  function renderSlide4() {
    const profName = document.getElementById('profName');
    const profEmail = document.getElementById('profEmail');
    const profRoleBadge = document.getElementById('profRoleBadge');
    const radioAutoBalance = document.getElementById('radioAutoBalance');
    const radioManualBalance = document.getElementById('radioManualBalance');
    const manualBalanceInputGroup = document.getElementById('manualBalanceInputGroup');
    const manualBalanceField = document.getElementById('manualBalanceField');

    if (state.currentProfile) {
      if (profName) profName.textContent = state.currentProfile.name;
      if (profEmail) profEmail.textContent = state.currentProfile.email;
      if (profRoleBadge) profRoleBadge.textContent = `${state.currentProfile.role} Account`;
    }

    if (state.balanceMode === 'manual') {
      if (radioManualBalance) radioManualBalance.checked = true;
      if (manualBalanceInputGroup) manualBalanceInputGroup.classList.remove('hidden');
    } else {
      if (radioAutoBalance) radioAutoBalance.checked = true;
      if (manualBalanceInputGroup) manualBalanceInputGroup.classList.add('hidden');
    }

    if (manualBalanceField) manualBalanceField.value = state.manualBalance;

    renderDatabaseViewer('users');
  }

  function renderDatabaseViewer(collection) {
    const viewer = document.getElementById('dbJsonViewer');
    if (!viewer) return;

    let data = {};
    if (collection === 'users') {
      data = {
        'users/usr-student-01': {
          uid: 'usr-student-01',
          name: 'Mohit',
          email: 'mohit.student@campus.edu',
          passwordHash: '•••••••• [Masked for Security]',
          allowance: 15000,
          balanceMode: state.balanceMode,
          deviceLinked: state.isLoggedIn
        },
        'users/usr-parent-02': {
          uid: 'usr-parent-02',
          name: 'Rajesh',
          email: 'rajesh.parent@family.in',
          passwordHash: '•••••••• [Masked for Security]',
          allowance: 25000,
          deviceLinked: false
        }
      };
    } else if (collection === 'budgetPeriods') {
      data = {
        period: 'October 2026',
        allowance: state.currentProfile?.allowance || 15000,
        limits: state.budgetLimits
      };
    } else if (collection === 'transactions') {
      data = {
        totalRecords: state.transactions.length,
        items: state.transactions.slice(0, 5)
      };
    } else if (collection === 'goals') {
      data = {
        goals: state.goals,
        reminders: state.reminders
      };
    }

    viewer.textContent = JSON.stringify(data, null, 2);
  }

  // --------------------------------------------------------------------------
  // Gemini 2.5 Financial Advisor Brain & Affordability Checking
  // --------------------------------------------------------------------------
  function evaluateUserQuery(query) {
    const q = query.toLowerCase();
    const fin = calculateFinancials();

    // 1. "Can I buy dinner tonight?"
    if (q.includes('dinner') || q.includes('food tonight') || q.includes('buy meal')) {
      const dinnerCost = 220;
      const safeLimit = fin.safeDailyLimit;
      const isSafe = dinnerCost <= safeLimit;

      const card = `
        <div class="verdict-card ${isSafe ? 'safe' : 'caution'}">
          <strong>${isSafe ? '🟢 Safe to Buy Dinner' : '🟡 Caution: Exceeds Today’s Safe Rate'}</strong>
          <p style="margin-top: 4px;">
            Estimated student dinner is <strong>₹${dinnerCost}</strong>. Today's safe rate is <strong>₹${safeLimit}/day</strong>.
            ${isSafe ? 'You can comfortably order Swiggy or dine out!' : 'Ordering ₹220 will slightly tighten your daily budget for the remaining ' + fin.daysRemaining + ' days. Consider the college canteen (₹75) instead!'}
          </p>
        </div>
      `;
      const reply = isSafe 
        ? `Yes! ₹${dinnerCost} is safely within your daily rate of ₹${safeLimit}. Go ahead!`
        : `It exceeds your daily safe limit of ₹${safeLimit}. Canteen dinner recommended!`;

      return { reply, card };
    }

    // 2. "How much money had I spent on transport?"
    if (q.includes('transport') || q.includes('travel') || q.includes('commute') || q.includes('uber')) {
      const transitTxs = state.transactions.filter(t => 
        t.type === 'debit' && (t.category === 'Travel & Commute' || t.merchant.toLowerCase().includes('uber') || t.merchant.toLowerCase().includes('metro'))
      );
      const total = transitTxs.reduce((s, t) => s + t.amount, 0);

      const card = `
        <div class="verdict-card safe">
          <strong>🚕 Transport Summary</strong>
          <p style="margin-top: 4px;">
            You have spent <strong>₹${total.toLocaleString('en-IN')}</strong> across ${transitTxs.length} rides this month.
            <br><em>💡 Pro-tip: Switching from Uber cabs to a Metro Smart card can save you ~₹700 every month!</em>
          </p>
        </div>
      `;
      const reply = `You have spent ₹${total} on transport this month across ${transitTxs.length} trips.`;
      return { reply, card };
    }

    // 3. "Can I buy 4000$ headphones?" / "Can I buy ₹4,000 headphones?"
    if (q.includes('headphones') || q.includes('4000') || q.includes('gadget') || q.includes('headphone')) {
      const itemCost = 4000;
      const balance = fin.balance;
      const canAfford = balance >= itemCost + 2000; // Keep 2000 buffer

      const card = `
        <div class="verdict-card ${canAfford ? 'safe' : 'danger'}">
          <strong>${canAfford ? '🟢 Affordability Check Passed' : '🔴 Not Recommended Right Now'}</strong>
          <p style="margin-top: 4px;">
            Cost: <strong>₹${itemCost}</strong> | Liquid Balance: <strong>₹${balance}</strong>.
            ${canAfford ? 'You have sufficient headroom without dipping into essential needs.' : 'Buying this will wipe out ' + Math.round((itemCost/balance)*100) + '% of your current balance! Add it to your <strong>Savings Goals</strong> instead to save ₹500/week.'}
          </p>
        </div>
      `;
      const reply = canAfford
        ? `You have ₹${balance}, so ₹${itemCost} is affordable while keeping a buffer.`
        : `Buying ₹${itemCost} headphones right now will deplete your balance to ₹${balance - itemCost}. I recommend creating a Savings Goal for it!`;
      return { reply, card };
    }

    // 4. "Saving suggestions" / "How to save money?"
    if (q.includes('saving') || q.includes('suggestions') || q.includes('save money')) {
      const card = `
        <div class="verdict-card safe">
          <strong>💡 Gemini 2.5 Saving Habits</strong>
          <ul style="margin-top: 6px; padding-left: 18px; line-height: 1.6;">
            <li><strong>Cut 2 food deliveries/week</strong>: Saves ~₹950/month.</li>
            <li><strong>Use Metro Smart Card</strong>: Auto-recharge gives 10% off-peak discount (saves ~₹400/mo).</li>
            <li><strong>24-Hour Cooling Period</strong>: Wait 24 hours before buying clothes or tech.</li>
            <li><strong>Protected Savings Buffer</strong>: Allocate unspent daily limit into your Goals.</li>
          </ul>
        </div>
      `;
      const reply = 'Here are 4 high-impact habits that can save you over ₹2,500 every month!';
      return { reply, card };
    }

    // 5. Generic Category Spend: e.g. "How much spent on food?"
    for (const cat of Object.keys(state.budgetLimits)) {
      const key = cat.split(' ')[0].toLowerCase();
      if (q.includes(key)) {
        const catSpent = state.transactions
          .filter(t => t.type === 'debit' && t.category === cat)
          .reduce((s, t) => s + t.amount, 0);
        const limit = state.budgetLimits[cat];

        const card = `
          <div class="verdict-card safe">
            <strong>${cat} Spend</strong>
            <p style="margin-top: 4px;">Spent: <strong>₹${catSpent}</strong> of <strong>₹${limit}</strong> monthly limit.</p>
          </div>
        `;
        const reply = `You have spent ₹${catSpent} out of your ₹${limit} budget for ${cat}.`;
        return { reply, card };
      }
    }

    // Default Fallback
    return {
      reply: `Your current balance is ₹${fin.balance.toLocaleString('en-IN')} with a safe daily limit of ₹${fin.safeDailyLimit}/day. How else can I assist your budget?`,
      card: null
    };
  }

  function handleSendChat(customQuery = null) {
    const input = document.getElementById('chatInput');
    const query = customQuery || (input ? input.value.trim() : '');
    if (!query) return;

    if (input) input.value = '';

    // Add user message
    state.chatMessages.push({ sender: 'user', text: query });
    renderChatThread();

    // AI Response simulation
    setTimeout(() => {
      const result = evaluateUserQuery(query);
      state.chatMessages.push({
        sender: 'ai',
        text: result.reply,
        card: result.card
      });
      renderChatThread();

      // Trigger Voice TTS
      if (state.ttsEnabled && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(result.reply);
        utter.rate = 1.05;
        window.speechSynthesis.speak(utter);
      }
    }, 350);
  }

  // --------------------------------------------------------------------------
  // Mobile SMS & Notification Parsing
  // --------------------------------------------------------------------------
  function classifySmsText(text) {
    const lower = text.toLowerCase();
    
    // Amount matching
    const amountMatch = text.match(/(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/i) ||
                        text.match(/(?:debited|credited|spent|paid)\s+(?:by|for|of)?\s*(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 150;

    const isCredit = lower.includes('credited') || lower.includes('received') || lower.includes('deposited');
    const type = isCredit ? 'credit' : 'debit';

    // Merchant heuristics
    let merchant = 'Unknown Merchant';
    let category = 'Shopping';

    if (lower.includes('swiggy') || lower.includes('zomato') || lower.includes('canteen') || lower.includes('food') || lower.includes('restaurant')) {
      merchant = lower.includes('swiggy') ? 'Swiggy' : lower.includes('zomato') ? 'Zomato' : 'Campus Canteen';
      category = 'Food & Dining';
    } else if (lower.includes('uber') || lower.includes('ola') || lower.includes('rapido') || lower.includes('metro')) {
      merchant = lower.includes('uber') ? 'Uber Ride' : lower.includes('ola') ? 'Ola Cabs' : 'Metro Smart Card';
      category = 'Travel & Commute';
    } else if (lower.includes('book') || lower.includes('library') || lower.includes('xerox') || lower.includes('print')) {
      merchant = 'Campus Book Store';
      category = 'Books & Academics';
    } else if (lower.includes('dad') || lower.includes('allowance') || lower.includes('salary')) {
      merchant = 'Family Allowance UPI';
      category = 'Allowance';
    }

    return { amount, merchant, category, type };
  }

  function handleIncomingNotification(app, text, amount, merchant, category, type) {
    // Show Heads Up Banner
    const banner = document.getElementById('headsUpBanner');
    const bannerApp = document.getElementById('bannerApp');
    const bannerText = document.getElementById('bannerText');

    if (banner && bannerApp && bannerText) {
      bannerApp.textContent = app;
      bannerText.textContent = text;
      banner.classList.remove('hidden');

      setTimeout(() => {
        banner.classList.add('hidden');
      }, 5000);
    }

    playAudioChime('success');

    // Add to ledger
    state.transactions.unshift({
      id: `tx-${Date.now()}`,
      amount: amount || 220,
      category: category || 'Food & Dining',
      merchant: merchant || 'UPI Payment',
      date: 'Just now',
      type: type || 'debit',
      isAi: true
    });

    saveState();
    renderAll();
    showToast(`Captured: ${text.slice(0, 32)}...`);
  }

  // --------------------------------------------------------------------------
  // Transaction & Data Mutators
  // --------------------------------------------------------------------------
  function deleteTransaction(id) {
    state.transactions = state.transactions.filter(t => t.id !== id);
    saveState();
    renderAll();
    showToast('Transaction deleted');
  }

  function addMoneyToGoal(id, amount) {
    const goal = state.goals.find(g => g.id === id);
    if (!goal) return;

    goal.saved = Math.min(goal.target, goal.saved + amount);
    saveState();
    renderSlide3();
    showToast(`Added ₹${amount} to ${goal.title}`);

    if (goal.saved >= goal.target) {
      playAudioChime('success');
      launchConfetti();
      showToast(`🎉 Goal Complete: ${goal.title}!`);
    }
  }

  function deleteReminder(id) {
    state.reminders = state.reminders.filter(r => r.id !== id);
    saveState();
    renderSlide3();
    showToast('Reminder removed');
  }

  function handleLogout() {
    state.isLoggedIn = false;
    saveState();
    renderHeader();
    renderSlide4();
    playAudioChime('alert');
    showToast('Session deleted from device. Data remains safe in database.');
  }

  function handleLogin(role = 'student') {
    state.currentProfile = DEFAULT_PROFILES[role] || DEFAULT_PROFILES.student;
    state.isLoggedIn = true;
    saveState();
    closeModal('loginModal');
    renderAll();
    playAudioChime('success');
    showToast(`Signed in as ${state.currentProfile.name}`);
  }

  // --------------------------------------------------------------------------
  // Modal Helpers
  // --------------------------------------------------------------------------
  function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  }

  // --------------------------------------------------------------------------
  // Event Listeners Binding
  // --------------------------------------------------------------------------
  function initEventListeners() {
    // Tab Navigation
    document.querySelectorAll('.nav-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget.getAttribute('data-target');
        state.activeTab = target;

        document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        document.querySelectorAll('.tab-slide').forEach(slide => slide.classList.remove('active'));
        document.getElementById(target)?.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Theme Toggle
    document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
      state.isDarkMode = !state.isDarkMode;
      saveState();
      renderThemeAndLayout();
    });

    // Mobile Frame Toggle
    document.getElementById('frameToggleBtn')?.addEventListener('click', () => {
      state.isMobileFrame = !state.isMobileFrame;
      saveState();
      renderThemeAndLayout();
    });

    // Back to Ledger button in Slide 3
    document.getElementById('aiBackBtn')?.addEventListener('click', () => {
      document.querySelector('.nav-tab[data-target="slide-1"]')?.click();
    });

    // Quick UPI Simulation Button in Header
    document.getElementById('quickUpiBtn')?.addEventListener('click', () => {
      const sim = SAMPLE_UPI_NOTIFICATIONS[Math.floor(Math.random() * SAMPLE_UPI_NOTIFICATIONS.length)];
      handleIncomingNotification(sim.app, sim.text, sim.amount, sim.merchant, sim.category, sim.flow);
    });

    // Banner dismiss
    document.getElementById('bannerDismissBtn')?.addEventListener('click', () => {
      document.getElementById('headsUpBanner')?.classList.add('hidden');
    });

    // Balance Mode edit button
    document.getElementById('editBalanceBtn')?.addEventListener('click', () => {
      document.querySelector('.nav-tab[data-target="slide-4"]')?.click();
    });

    // Radio Balance mode change in Slide 4
    document.getElementById('radioAutoBalance')?.addEventListener('change', () => {
      state.balanceMode = 'auto';
      saveState();
      renderAll();
      showToast('Switched to Automatic Ledger Balance');
    });

    document.getElementById('radioManualBalance')?.addEventListener('change', () => {
      state.balanceMode = 'manual';
      saveState();
      renderAll();
      showToast('Switched to Manual Balance Override');
    });

    document.getElementById('saveManualBalanceBtn')?.addEventListener('click', () => {
      const val = parseFloat(document.getElementById('manualBalanceField')?.value || '0');
      state.manualBalance = val;
      state.balanceMode = 'manual';
      saveState();
      renderAll();
      showToast(`Manual balance set to ₹${val.toLocaleString('en-IN')}`);
    });

    // Safe Logout in Slide 4
    document.getElementById('safeLogoutBtn')?.addEventListener('click', handleLogout);

    // Switch profile button
    document.getElementById('switchProfileBtn')?.addEventListener('click', () => openModal('loginModal'));

    // DB Tabs
    document.querySelectorAll('.db-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.db-tab').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const dbKey = e.currentTarget.getAttribute('data-db');
        renderDatabaseViewer(dbKey);
      });
    });

    document.getElementById('copyDbJsonBtn')?.addEventListener('click', () => {
      const text = document.getElementById('dbJsonViewer')?.textContent || '';
      navigator.clipboard?.writeText(text);
      showToast('Database JSON copied to clipboard');
    });

    // Filter Buttons in Ledger
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        state.activeFilter = e.currentTarget.getAttribute('data-filter');
        renderTransactionList();
      });
    });

    // Search Input in Ledger
    document.getElementById('txSearchInput')?.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderTransactionList();
    });

    // Native WebOTP API Listener
    document.getElementById('webOtpBtn')?.addEventListener('click', async () => {
      if ('credentials' in navigator && 'OTPCredential' in window) {
        showToast('Waiting for incoming Android SMS via WebOTP...');
        try {
          const content = await navigator.credentials.get({
            otp: { transport: ['sms'] },
            signal: new AbortController().signal
          });
          if (content && content.code) {
            showToast(`WebOTP SMS Captured: ${content.code}`);
          }
        } catch (err) {
          showToast('WebOTP timed out or cancelled');
        }
      } else {
        showToast('WebOTP supported on Android Chrome. Simulating demo incoming SMS...');
        setTimeout(() => {
          handleIncomingNotification('SMS Gateway', 'A/c debited by Rs 220 for Swiggy UPI ref 492102', 220, 'Swiggy', 'Food & Dining', 'debit');
        }, 1000);
      }
    });

    // 1-Tap Clipboard Reader
    document.getElementById('readClipboardBtn')?.addEventListener('click', async () => {
      try {
        if (!navigator.clipboard?.readText) throw new Error('Not supported');
        const text = await navigator.clipboard.readText();
        if (!text.trim()) {
          showToast('Clipboard is empty. Copy an SMS or alert first!');
          return;
        }
        const parsed = classifySmsText(text);
        handleIncomingNotification('Clipboard Sensor', text, parsed.amount, parsed.merchant, parsed.category, parsed.type);
      } catch (err) {
        showToast('Clipboard permission needed. Use manual paste below!');
      }
    });

    // Parse SMS Input Box
    document.getElementById('parseSmsBtn')?.addEventListener('click', () => {
      const box = document.getElementById('smsInputBox');
      const text = box?.value.trim() || '';
      if (!text) {
        showToast('Paste SMS text first!');
        return;
      }
      const parsed = classifySmsText(text);
      handleIncomingNotification('SMS Parser', text, parsed.amount, parsed.merchant, parsed.category, parsed.type);
      if (box) box.value = '';
    });

    // Preset SMS test pills
    document.querySelectorAll('.pill-tag').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const text = e.currentTarget.getAttribute('data-text');
        const parsed = classifySmsText(text);
        handleIncomingNotification('Preset SMS', text, parsed.amount, parsed.merchant, parsed.category, parsed.type);
      });
    });

    // Classifier Inspector in Slide 2
    document.getElementById('merchantTestBtn')?.addEventListener('click', () => {
      const input = document.getElementById('merchantTestInput');
      const res = document.getElementById('merchantTestResult');
      const text = input?.value.trim() || '';
      if (!text || !res) return;

      const parsed = classifySmsText(text);
      res.classList.remove('hidden');
      res.innerHTML = `
        <strong>Classification Preview:</strong><br>
        Merchant: <code>${parsed.merchant}</code><br>
        Category: <strong>${parsed.category}</strong><br>
        Confidence: <span class="text-emerald">98.4% (Gemini Match)</span>
      `;
    });

    // Microphone Voice STT in Slide 3
    let recognition = null;
    const micBtn = document.getElementById('micBtn');
    const micLabel = document.getElementById('micLabel');

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        micBtn?.classList.add('listening');
        if (micLabel) micLabel.textContent = 'Listening...';
      };

      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        if (micLabel) micLabel.textContent = `"${transcript}"`;
        handleSendChat(transcript);
      };

      recognition.onend = () => {
        micBtn?.classList.remove('listening');
        if (micLabel) micLabel.textContent = 'Tap to Speak';
      };

      recognition.onerror = () => {
        micBtn?.classList.remove('listening');
        if (micLabel) micLabel.textContent = 'Tap to Speak';
      };
    }

    micBtn?.addEventListener('click', () => {
      if (recognition) {
        try {
          recognition.start();
        } catch (e) {
          recognition.stop();
        }
      } else {
        showToast('Web Speech API not supported in this browser. Type below!');
      }
    });

    // TTS Toggle
    document.getElementById('ttsVoiceToggle')?.addEventListener('change', (e) => {
      state.ttsEnabled = e.target.checked;
    });

    // Chat Suggestion Chips
    document.querySelectorAll('.chip-btn').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const q = e.currentTarget.getAttribute('data-query');
        handleSendChat(q);
      });
    });

    // Send Chat Button & Enter key
    document.getElementById('sendChatBtn')?.addEventListener('click', () => handleSendChat());
    document.getElementById('chatInput')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSendChat();
    });

    // Modals Open / Close
    document.getElementById('openAddTxModalBtn')?.addEventListener('click', () => openModal('addTxModal'));
    document.getElementById('closeAddTxModalBtn')?.addEventListener('click', () => closeModal('addTxModal'));
    
    document.getElementById('openAddGoalModalBtn')?.addEventListener('click', () => openModal('addGoalModal'));
    document.getElementById('closeAddGoalModalBtn')?.addEventListener('click', () => closeModal('addGoalModal'));

    document.getElementById('openAddReminderModalBtn')?.addEventListener('click', () => openModal('addReminderModal'));
    document.getElementById('closeAddReminderModalBtn')?.addEventListener('click', () => closeModal('addReminderModal'));

    document.getElementById('openBridgeModalBtn')?.addEventListener('click', () => openModal('bridgeModal'));
    document.getElementById('closeBridgeModalBtn')?.addEventListener('click', () => closeModal('bridgeModal'));

    document.getElementById('loginCloseBtn')?.addEventListener('click', () => closeModal('loginModal'));
    document.getElementById('loginBackBtn')?.addEventListener('click', () => closeModal('loginModal'));

    // Preset profile select in Login Modal
    document.querySelectorAll('.profile-select-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('.profile-select-pill').forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const user = e.currentTarget.getAttribute('data-user');
        const emailInput = document.getElementById('loginEmail');
        if (emailInput && DEFAULT_PROFILES[user]) {
          emailInput.value = DEFAULT_PROFILES[user].email;
        }
      });
    });

    document.getElementById('submitLoginBtn')?.addEventListener('click', () => {
      const activePill = document.querySelector('.profile-select-pill.active');
      const user = activePill ? activePill.getAttribute('data-user') : 'student';
      handleLogin(user);
    });

    // Add Transaction Modal Save
    let activeTxType = 'debit';
    document.getElementById('txTypeDebit')?.addEventListener('click', () => {
      activeTxType = 'debit';
      document.getElementById('txTypeDebit')?.classList.add('active');
      document.getElementById('txTypeCredit')?.classList.remove('active');
    });
    document.getElementById('txTypeCredit')?.addEventListener('click', () => {
      activeTxType = 'credit';
      document.getElementById('txTypeCredit')?.classList.add('active');
      document.getElementById('txTypeDebit')?.classList.remove('active');
    });

    document.getElementById('saveTxBtn')?.addEventListener('click', () => {
      const amount = parseFloat(document.getElementById('newTxAmount')?.value || '0');
      const merchant = document.getElementById('newTxMerchant')?.value.trim() || 'Manual Entry';
      const category = document.getElementById('newTxCategory')?.value || 'Food & Dining';

      if (amount <= 0) {
        showToast('Please enter a valid amount');
        return;
      }

      state.transactions.unshift({
        id: `tx-${Date.now()}`,
        amount,
        merchant,
        category,
        date: 'Today',
        type: activeTxType,
        isAi: false
      });

      saveState();
      closeModal('addTxModal');
      renderAll();
      playAudioChime('success');
      showToast('Transaction recorded');
    });

    // Add Goal Modal Save
    document.getElementById('saveGoalBtn')?.addEventListener('click', () => {
      const title = document.getElementById('newGoalTitle')?.value.trim() || 'New Goal';
      const target = parseFloat(document.getElementById('newGoalTarget')?.value || '1000');
      const initial = parseFloat(document.getElementById('newGoalInitial')?.value || '0');

      state.goals.push({
        id: `g-${Date.now()}`,
        title,
        target,
        saved: initial,
        icon: '🎯'
      });

      saveState();
      closeModal('addGoalModal');
      renderSlide3();
      playAudioChime('success');
      showToast('Goal created');
    });

    // Add Reminder Modal Save
    document.getElementById('saveReminderBtn')?.addEventListener('click', () => {
      const title = document.getElementById('newReminderTitle')?.value.trim() || 'New Reminder';
      const amount = parseFloat(document.getElementById('newReminderAmount')?.value || '0');
      const date = document.getElementById('newReminderDate')?.value || 'Soon';

      state.reminders.push({
        id: `r-${Date.now()}`,
        title,
        amount,
        date
      });

      saveState();
      closeModal('addReminderModal');
      renderSlide3();
      playAudioChime('success');
      showToast('Reminder added');
    });

    // Simulate Webhook test from Bridge Modal
    document.getElementById('simulateBridgeTestBtn')?.addEventListener('click', () => {
      closeModal('bridgeModal');
      handleIncomingNotification('MacroDroid Webhook', 'PhonePe: Paid ₹340 to DMRC Metro Smart Card', 340, 'Metro Smart Card', 'Travel & Commute', 'debit');
    });

    // Export JSON
    document.getElementById('exportJsonBtn')?.addEventListener('click', () => {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', 'campus_ledger_export.json');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Ledger JSON exported');
    });

    // Reset Demo Data
    document.getElementById('resetDemoBtn')?.addEventListener('click', () => {
      if (confirm('Reset ledger data back to default demo data?')) {
        localStorage.clear();
        state.transactions = [...DEFAULT_TRANSACTIONS];
        state.budgetLimits = { ...DEFAULT_BUDGET_LIMITS };
        state.goals = [...DEFAULT_GOALS];
        state.reminders = [...DEFAULT_REMINDERS];
        state.balanceMode = 'auto';
        state.isLoggedIn = true;
        saveState();
        renderAll();
        showToast('Reset to default demo data');
      }
    });
  }

  // --------------------------------------------------------------------------
  // Application Entry Initialization
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    renderAll();
    console.log('🎓 Campus Ledger (SmartPocket AI 2.5) successfully initialized.');
  });

})();
