/**
 * Ethiopian AMT Exam Master - Core Application Engine
 * Includes interactive exam engine, pop-out explanations,
 * offline licensing, and complete study notes hub.
 */

(function() {
  'use strict';

  // Application State
  const state = {
    exams: [],
    notes: [],
    currentExamId: null,
    currentQuestionIndex: 0,
    userAnswers: {},   // { questionId: 'A' }
    flaggedQuestions: new Set(),
    activeFilter: 'all', // 'all' | 'incorrect' | 'flagged'
    isStudyMode: true,   // true = Study (instant feedback), false = Exam (timed)
    examTimerSeconds: 60 * 60,
    timerInterval: null,
    soundEnabled: true,
    theme: 'light',
    userSession: null,
    adminUnlocked: false,
    currentTab: 'exams', // 'exams' | 'notes'
    selectedNotePartId: 'all',
    noteSearchQuery: ''
  };

  // Web Audio Synthesizer for instant, zero-dependency feedback
  const audioContext = (function() {
    let ctx = null;
    function getCtx() {
      if (!ctx && (window.AudioContext || window.webkitAudioContext)) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      return ctx;
    }

    function playTone(freq, type, duration, delay = 0) {
      if (!state.soundEnabled) return;
      try {
        const c = getCtx();
        if (!c) return;
        if (c.state === 'suspended') c.resume();
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, c.currentTime + delay);
        gain.gain.setValueAtTime(0.12, c.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(c.currentTime + delay);
        osc.stop(c.currentTime + delay + duration);
      } catch (e) {}
    }

    return {
      playCorrect: () => {
        playTone(523.25, 'sine', 0.12, 0);    // C5
        playTone(659.25, 'sine', 0.18, 0.08); // E5
        playTone(783.99, 'sine', 0.25, 0.16); // G5
      },
      playIncorrect: () => {
        playTone(280, 'triangle', 0.18, 0);
        playTone(220, 'triangle', 0.25, 0.12);
      },
      playClick: () => {
        playTone(800, 'sine', 0.04, 0);
      }
    };
  })();

  // Initialize App
  function init() {
    loadTheme();
    loadExamsData();
    loadNotesData();
    checkUserAuth();
    setupEventListeners();
    updateUIAuthBadge();
  }

  // Load Exam Database
  function loadExamsData() {
    if (window.AMT_EXAMS_DATA && window.AMT_EXAMS_DATA.exams) {
      state.exams = window.AMT_EXAMS_DATA.exams;
      renderExamCards();
    } else {
      fetch('data/exams.json')
        .then(r => r.json())
        .then(data => {
          state.exams = data.exams || [];
          renderExamCards();
        })
        .catch(err => {
          console.error("Failed to load exam data:", err);
          showToast("Failed to load exam data. Please reload.", "danger");
        });
    }
  }

  // Load Notes Database
  function loadNotesData() {
    if (window.AMT_NOTES_DATA && Array.isArray(window.AMT_NOTES_DATA)) {
      state.notes = window.AMT_NOTES_DATA;
    }
  }

  function checkUserAuth() {
    state.userSession = AMT_AUTH.getUserSession();
    if (!state.userSession) {
      const defaultName = "Student";
      const studentId = AMT_AUTH.generateStudentId(defaultName);
      state.userSession = {
        name: defaultName,
        studentId: studentId,
        isActivated: false
      };
      AMT_AUTH.saveUserSession(state.userSession);
    }
  }

  function updateUIAuthBadge() {
    const isActivated = AMT_AUTH.isUserActivated();
    const badge = document.getElementById('user-auth-badge');
    const heroBtn = document.getElementById('hero-unlock-btn');
    const lockIcons = document.querySelectorAll('.exam-lock-icon');
    
    if (badge) {
      if (isActivated) {
        badge.innerHTML = `<span class="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
          <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <span class="hidden sm:inline">Full Access • </span><span>Verified</span>
        </span>`;
      } else {
        badge.innerHTML = `<button onclick="window.APP.openPaywallModal()" class="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-colors whitespace-nowrap">
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          <span class="hidden sm:inline">Trial • </span><span>Unlock (250 ETB)</span>
        </button>`;
      }
    }

    if (heroBtn) {
      if (isActivated) {
        heroBtn.className = "px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center gap-2 select-none pointer-events-none shadow-sm";
        heroBtn.innerHTML = `<svg class="w-4 h-4 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg><span>✓ Device Verified • Full Access</span>`;
      } else {
        heroBtn.className = "px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-600 via-amber-500 to-rose-600 hover:opacity-90 text-white shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer";
        heroBtn.innerHTML = `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg><span>Unlock Full Access (250 Birr)</span>`;
      }
    }

    lockIcons.forEach(icon => {
      icon.style.display = isActivated ? 'none' : 'inline-block';
    });
  }

  // TAB NAVIGATION: EXAMS VS NOTES
  const TAB_ACTIVE_CLS = "w-full sm:w-auto px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-sky-600 text-white shadow-sm flex items-center justify-center gap-1.5 transition-all";
  const TAB_INACTIVE_CLS = "w-full sm:w-auto px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5";

  function showExamsTab() {
    state.currentTab = 'exams';
    document.getElementById('dashboard-view')?.classList.remove('hidden');
    document.getElementById('notes-view')?.classList.add('hidden');
    document.getElementById('exam-view')?.classList.add('hidden');

    const tabExams = document.getElementById('nav-tab-exams');
    const tabNotes = document.getElementById('nav-tab-notes');
    if (tabExams) tabExams.className = TAB_ACTIVE_CLS;
    if (tabNotes) tabNotes.className = TAB_INACTIVE_CLS;
  }

  function showNotesTab() {
    state.currentTab = 'notes';
    document.getElementById('dashboard-view')?.classList.add('hidden');
    document.getElementById('notes-view')?.classList.remove('hidden');
    document.getElementById('exam-view')?.classList.add('hidden');

    const tabExams = document.getElementById('nav-tab-exams');
    const tabNotes = document.getElementById('nav-tab-notes');
    if (tabExams) tabExams.className = TAB_INACTIVE_CLS;
    if (tabNotes) tabNotes.className = TAB_ACTIVE_CLS;

    renderNotesPills();
    renderNotesContent();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Render Dashboard Exam Cards
  function renderExamCards() {
    const container = document.getElementById('exam-cards-grid');
    if (!container) return;

    container.innerHTML = state.exams.map(exam => {
      const savedScore = localStorage.getItem(`score_${exam.id}`);
      return `
        <div class="exam-card glass-panel rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border relative flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between mb-4">
              <span class="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-${exam.color}-500/10 text-${exam.color}-600 dark:text-${exam.color}-400 border border-${exam.color}-500/20">
                ${exam.id.toUpperCase()}
              </span>
              <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
                ${exam.totalQuestions} Questions
              </span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-snug">
              ${exam.title}
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-6">
              ${exam.subject}
            </p>
          </div>

          <div class="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3">
            <div>
              ${savedScore ? `<span class="text-xs font-medium text-emerald-600 dark:text-emerald-400 font-mono">Best Score: ${savedScore}%</span>` : `<span class="text-xs text-slate-400">Not attempted yet</span>`}
            </div>
            <div class="flex items-center gap-2">
              <button onclick="window.APP.selectExam('${exam.id}', true)" class="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500 transition-colors shadow-sm flex items-center gap-1.5">
                Practice Mode
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Select Exam & Start
  function selectExam(examId, isStudy) {
    state.currentExamId = examId;
    state.isStudyMode = isStudy;
    state.currentQuestionIndex = 0;
    state.userAnswers = {};
    state.flaggedQuestions = new Set();
    state.activeFilter = 'all';

    // Show Exam View, Hide others
    document.getElementById('dashboard-view')?.classList.add('hidden');
    document.getElementById('notes-view')?.classList.add('hidden');
    document.getElementById('exam-view')?.classList.remove('hidden');

    const exam = getCurrentExam();
    document.getElementById('exam-header-title').textContent = exam.title;

    if (!isStudy) {
      startTimer();
    } else {
      stopTimer();
      document.getElementById('exam-timer-display').textContent = 'Study Mode';
    }

    renderCurrentQuestion();
    renderQuestionGridDrawer();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function getCurrentExam() {
    return state.exams.find(e => e.id === state.currentExamId) || state.exams[0];
  }

  function getQuestionsList() {
    const exam = getCurrentExam();
    if (!exam || !exam.questions) return [];
    
    const isActivated = AMT_AUTH.isUserActivated();
    let list = exam.questions;

    // If not activated, restrict to free preview count
    if (!isActivated) {
      const freeCount = AMT_AUTH.getSettings().freePreviewCount || 5;
      list = list.slice(0, freeCount);
    }

    // Apply Active Filter
    if (state.activeFilter === 'flagged') {
      list = list.filter(q => state.flaggedQuestions.has(q.id));
    } else if (state.activeFilter === 'incorrect') {
      list = list.filter(q => {
        const userAns = state.userAnswers[q.id];
        return userAns && userAns !== q.correctAnswer;
      });
    }

    return list;
  }

  // Render Current Question
  function renderCurrentQuestion() {
    const questions = getQuestionsList();
    const container = document.getElementById('question-container');
    if (!container) return;

    if (questions.length === 0) {
      container.innerHTML = `
        <div class="glass-panel rounded-2xl p-12 text-center border">
          <p class="text-lg font-medium text-slate-600 dark:text-slate-400 mb-4">No questions match the current filter.</p>
          <button onclick="window.APP.setFilter('all')" class="px-5 py-2.5 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-500 transition-colors">
            Show All Questions
          </button>
        </div>
      `;
      return;
    }

    // Bounds check
    if (state.currentQuestionIndex >= questions.length) {
      state.currentQuestionIndex = questions.length - 1;
    }
    if (state.currentQuestionIndex < 0) {
      state.currentQuestionIndex = 0;
    }

    const q = questions[state.currentQuestionIndex];
    const totalQ = questions.length;
    const userAnswer = state.userAnswers[q.id];
    const hasAnswered = !!userAnswer;
    const isFlagged = state.flaggedQuestions.has(q.id);

    // Update progress numbers
    document.getElementById('current-q-num').textContent = `Question ${state.currentQuestionIndex + 1} of ${totalQ}`;
    const progressPct = Math.round(((state.currentQuestionIndex + 1) / totalQ) * 100);
    document.getElementById('exam-progress-bar').style.width = `${progressPct}%`;

    // Flag button state
    const flagBtn = document.getElementById('flag-question-btn');
    if (flagBtn) {
      flagBtn.className = isFlagged 
        ? "p-2 rounded-xl text-amber-500 bg-amber-500/10 border border-amber-500/30 transition-colors"
        : "p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors";
    }

    // Options HTML
    const optionsHtml = q.options.map(opt => {
      let stateClass = "";
      let iconHtml = `<span class="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">${opt.key}</span>`;

      if (hasAnswered) {
        if (opt.key === q.correctAnswer) {
          stateClass = "correct";
          iconHtml = `<span class="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs bg-emerald-500 text-white shadow-sm">✓</span>`;
        } else if (opt.key === userAnswer) {
          stateClass = "incorrect";
          iconHtml = `<span class="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs bg-red-500 text-white shadow-sm">✕</span>`;
        }
      }

      return `
        <button 
          onclick="window.APP.selectAnswer('${q.id}', '${opt.key}')" 
          class="option-btn w-full p-4 rounded-2xl flex items-center gap-4 text-left font-medium text-slate-800 dark:text-slate-100 transition-all ${stateClass} ${hasAnswered ? 'locked' : ''}"
        >
          ${iconHtml}
          <span class="flex-1 text-base leading-relaxed">${escapeHtml(opt.text)}</span>
        </button>
      `;
    }).join('');

    // Question Container HTML
    container.innerHTML = `
      <div class="glass-panel rounded-3xl p-6 sm:p-8 border shadow-sm transition-all duration-200">
        <!-- Badge & Category -->
        <div class="flex items-center justify-between mb-4">
          <span class="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            ${escapeHtml(q.category || 'Aviation Exam')}
          </span>
          <span class="text-xs font-mono text-slate-400">ID: ${escapeHtml(q.id)}</span>
        </div>

        <!-- Question Stem -->
        <h2 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-6 leading-relaxed">
          ${escapeHtml(q.question)}
        </h2>

        <!-- Options List -->
        <div class="space-y-3 mb-6">
          ${optionsHtml}
        </div>

        <!-- Pop-Out Explanation Trigger (LOCKED UNTIL USER ANSWERS) -->
        <div id="explanation-container" class="mt-4">
          ${hasAnswered ? `
            <div class="border-t border-slate-200/80 dark:border-slate-800 pt-5">
              <!-- Explanation Down Arrow Accordion Trigger -->
              <button 
                id="explanation-toggle-btn" 
                onclick="window.APP.toggleExplanation()"
                class="w-full flex items-center justify-between p-4 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 font-semibold border border-sky-500/20 transition-all group"
              >
                <div class="flex items-center gap-2.5">
                  <svg class="w-5 h-5 text-sky-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span class="font-bold">Step-by-Step Derivation & Explanation</span>
                </div>
                <!-- DOWN ARROW REQUESTED BY USER -->
                <div class="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-sky-500/15 group-hover:bg-sky-500/25 border border-sky-500/20 transition-all">
                  <span id="explanation-reveal-label">Click down arrow to reveal solution 🔽</span>
                  <svg id="explanation-arrow-icon" class="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </button>

              <!-- Collapsible Explanation Drawer -->
              <div id="explanation-drawer" class="explanation-drawer">
                <div class="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <h4 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Correct Answer: Option ${escapeHtml(q.correctAnswer)}
                    </h4>
                  </div>
                  <p class="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium">
                    ${escapeHtml(q.explanation)}
                  </p>
                </div>
              </div>
            </div>
          ` : `
            <div class="text-center py-3 text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-2">
              <svg class="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              <span>Choose your answer above to unlock the explanation down arrow</span>
            </div>
          `}
        </div>
      </div>
    `;

    // Navigation buttons state
    document.getElementById('prev-q-btn').disabled = (state.currentQuestionIndex === 0);
    document.getElementById('next-q-btn').disabled = (state.currentQuestionIndex === totalQ - 1);
  }

  // Answer Selection
  function selectAnswer(questionId, selectedKey) {
    if (state.userAnswers[questionId]) return;

    const questions = getQuestionsList();
    const q = questions.find(item => item.id === questionId);
    if (!q) return;

    state.userAnswers[questionId] = selectedKey;

    if (selectedKey === q.correctAnswer) {
      audioContext.playCorrect();
    } else {
      audioContext.playIncorrect();
    }

    renderCurrentQuestion();
    renderQuestionGridDrawer();

    // If user has not paid and completed free preview questions
    const isActivated = AMT_AUTH.isUserActivated();
    const freeCount = AMT_AUTH.getSettings().freePreviewCount || 5;
    if (!isActivated && Object.keys(state.userAnswers).length >= freeCount) {
      setTimeout(() => {
        openPaywallModal();
      }, 1500);
    }
  }

  // Toggle Explanation Accordion
  function toggleExplanation() {
    const drawer = document.getElementById('explanation-drawer');
    const arrow = document.getElementById('explanation-arrow-icon');
    const label = document.getElementById('explanation-reveal-label');
    if (!drawer) return;

    audioContext.playClick();
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      if (arrow) arrow.classList.remove('rotate-180');
      if (label) label.textContent = 'Click down arrow to reveal solution 🔽';
    } else {
      drawer.classList.add('open');
      if (arrow) arrow.classList.add('rotate-180');
      if (label) label.textContent = 'Hide solution 🔼';
    }
  }

  // Next / Prev Navigation
  function nextQuestion() {
    audioContext.playClick();
    const list = getQuestionsList();
    if (state.currentQuestionIndex < list.length - 1) {
      state.currentQuestionIndex++;
      renderCurrentQuestion();
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  }

  function prevQuestion() {
    audioContext.playClick();
    if (state.currentQuestionIndex > 0) {
      state.currentQuestionIndex--;
      renderCurrentQuestion();
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  }

  function jumpToQuestion(index) {
    audioContext.playClick();
    state.currentQuestionIndex = index;
    renderCurrentQuestion();
    closeDrawer();
    window.scrollTo({ top: 100, behavior: 'smooth' });
  }

  function toggleFlagCurrent() {
    audioContext.playClick();
    const list = getQuestionsList();
    const q = list[state.currentQuestionIndex];
    if (!q) return;

    if (state.flaggedQuestions.has(q.id)) {
      state.flaggedQuestions.delete(q.id);
      showToast("Question unflagged", "info");
    } else {
      state.flaggedQuestions.add(q.id);
      showToast("Question flagged for revision", "info");
    }
    renderCurrentQuestion();
    renderQuestionGridDrawer();
  }

  function setFilter(filterType) {
    state.activeFilter = filterType;
    state.currentQuestionIndex = 0;
    renderCurrentQuestion();
    renderQuestionGridDrawer();
  }

  // Question Grid Drawer (Quick Jump)
  function renderQuestionGridDrawer() {
    const grid = document.getElementById('question-grid-items');
    if (!grid) return;

    const list = getQuestionsList();
    grid.innerHTML = list.map((q, idx) => {
      const ans = state.userAnswers[q.id];
      const isCurrent = (idx === state.currentQuestionIndex);
      const isFlagged = state.flaggedQuestions.has(q.id);

      let colorClass = "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700";
      if (ans) {
        if (ans === q.correctAnswer) {
          colorClass = "bg-emerald-500 text-white border-emerald-600";
        } else {
          colorClass = "bg-red-500 text-white border-red-600";
        }
      }

      if (isCurrent) {
        colorClass += " ring-2 ring-sky-500 ring-offset-2";
      }

      return `
        <button 
          onclick="window.APP.jumpToQuestion(${idx})" 
          class="w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center relative border transition-transform hover:scale-110 ${colorClass}"
        >
          ${idx + 1}
          ${isFlagged ? `<span class="w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-1"></span>` : ''}
        </button>
      `;
    }).join('');
  }

  function openDrawer() {
    document.getElementById('question-drawer-modal').classList.remove('hidden');
  }

  function closeDrawer() {
    document.getElementById('question-drawer-modal').classList.add('hidden');
  }

  // Timer functionality
  function startTimer() {
    stopTimer();
    state.examTimerSeconds = 60 * 60; // 60 minutes
    updateTimerDisplay();
    state.timerInterval = setInterval(() => {
      state.examTimerSeconds--;
      updateTimerDisplay();
      if (state.examTimerSeconds <= 0) {
        stopTimer();
        finishExam();
      }
    }, 1000);
  }

  function stopTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  }

  function updateTimerDisplay() {
    const display = document.getElementById('exam-timer-display');
    if (!display) return;
    const mins = Math.floor(state.examTimerSeconds / 60);
    const secs = state.examTimerSeconds % 60;
    display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  // Finish & Score Report
  function finishExam() {
    stopTimer();
    const exam = getCurrentExam();
    const questions = exam.questions || [];
    let correctCount = 0;
    let answeredCount = 0;

    questions.forEach(q => {
      const userAns = state.userAnswers[q.id];
      if (userAns) {
        answeredCount++;
        if (userAns === q.correctAnswer) correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / questions.length) * 100);
    localStorage.setItem(`score_${exam.id}`, scorePct);

    // Show Results Modal
    document.getElementById('results-modal').classList.remove('hidden');
    document.getElementById('results-score-pct').textContent = `${scorePct}%`;
    document.getElementById('results-status-text').textContent = scorePct >= 75 ? "PASSED (CONGRATULATIONS!)" : "NEEDS PRACTICE (PASS MARK: 75%)";
    document.getElementById('results-status-text').className = scorePct >= 75 ? "text-emerald-500 font-bold" : "text-amber-500 font-bold";
    document.getElementById('results-correct-count').textContent = correctCount;
    document.getElementById('results-total-count').textContent = questions.length;
    document.getElementById('results-incorrect-count').textContent = answeredCount - correctCount;
  }

  function closeResultsModal() {
    document.getElementById('results-modal').classList.add('hidden');
  }

  function returnToDashboard() {
    stopTimer();
    document.getElementById('exam-view')?.classList.add('hidden');
    if (state.currentTab === 'notes') {
      showNotesTab();
    } else {
      showExamsTab();
    }
    renderExamCards();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // NOTES VIEWER LOGIC
  function renderNotesPills() {
    const container = document.getElementById('notes-part-pills');
    if (!container) return;

    let html = `
      <button 
        onclick="window.APP.selectNotePart('all')" 
        class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${state.selectedNotePartId === 'all' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}"
      >
        All ${state.notes.length || 10} Modules
      </button>
    `;

    state.notes.forEach(p => {
      const isSelected = (state.selectedNotePartId === p.id);
      const label = p.shortTitle || `Part ${p.number}`;
      html += `
        <button 
          onclick="window.APP.selectNotePart('${p.id}')" 
          class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${isSelected ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}"
        >
          ${label}
        </button>
      `;
    });

    container.innerHTML = html;
  }

  function selectNotePart(partId) {
    audioContext.playClick();
    state.selectedNotePartId = partId;
    renderNotesPills();
    renderNotesContent();
  }

  function selectNotePartAndTab(partId) {
    showNotesTab();
    selectNotePart(partId);
    setTimeout(() => {
      const container = document.getElementById('notes-view');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  }

  function filterNotes(query) {
    state.noteSearchQuery = (query || '').toLowerCase().trim();
    renderNotesContent();
  }

  function renderNotesContent() {
    const container = document.getElementById('notes-content-container');
    if (!container) return;

    const isActivated = AMT_AUTH.isUserActivated();
    let partsToShow = state.notes;

    if (state.selectedNotePartId !== 'all') {
      partsToShow = partsToShow.filter(p => p.id === state.selectedNotePartId);
    }

    if (state.noteSearchQuery) {
      partsToShow = partsToShow.filter(p => 
        p.title.toLowerCase().includes(state.noteSearchQuery) || 
        p.content.toLowerCase().includes(state.noteSearchQuery)
      );
    }

    if (partsToShow.length === 0) {
      container.innerHTML = `
        <div class="glass-panel rounded-2xl p-8 text-center border">
          <p class="text-sm font-semibold text-slate-500">No notes matched your search query.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = partsToShow.map(p => {
      // In trial mode, only part 1 is open, parts 2-10 are locked with paywall button
      const isLocked = (!isActivated && p.number > 1);

      return `
        <div class="glass-panel rounded-3xl p-6 sm:p-8 border shadow-sm transition-all hover:border-emerald-500/30">
          <div class="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800 mb-4">
            <div class="flex items-center gap-3">
              <span class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/20 shadow-sm">
                P${p.number}
              </span>
              <div>
                <h3 class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                  ${escapeHtml(p.title)}
                </h3>
                <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">${p.shortTitle || `Module ${p.number}`}</span>
              </div>
            </div>
            ${isLocked ? `<span class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/30 flex items-center gap-1">🔒 Locked</span>` : `<span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">✓ Available</span>`}
          </div>

          ${isLocked ? `
            <div class="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-center space-y-3">
              <p class="text-sm text-slate-700 dark:text-slate-300 font-medium">
                Part ${p.number} is locked in Trial Mode. Unlock Full Access (250 Birr) to access all ${state.notes.length || 10} modules of the Master Preparation Notes!
              </p>
              <button onclick="window.APP.openPaywallModal()" class="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md transition-all">
                Unlock Full Access (250 ETB)
              </button>
            </div>
          ` : `
            <div class="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-line space-y-2">
              ${formatNotesText(p.content, state.noteSearchQuery)}
            </div>
          `}
        </div>
      `;
    }).join('');
  }

  function formatNotesText(text, query) {
    if (!text) return '';
    let escaped = escapeHtml(text);

    // 1. Interactive Pop Quiz: 🧠 [POP QUIZ]: Question || Answer
    escaped = escaped.replace(/🧠\s*\[POP QUIZ\]:\s*([^|\n]+)\|\|\s*([^\n]+)/gi, function(match, q, a) {
      return `<div class="my-3.5 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-800 shadow-sm space-y-2.5">
        <div class="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider">
          <span class="text-base">🧠</span>
          <span>Quick Hangar Challenge</span>
        </div>
        <p class="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">${q.trim()}</p>
        <details class="cursor-pointer group">
          <summary class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 select-none flex items-center gap-1.5 transition-colors">
            <span>👉 Tap to Reveal Verified Answer</span>
          </summary>
          <div class="mt-2.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-400 shadow-inner">
            💡 <strong>Verified Answer:</strong> ${a.trim()}
          </div>
        </details>
      </div>`;
    });

    // 2. 🚨 [TRAP ALERT]: text
    escaped = escaped.replace(/🚨\s*\[TRAP ALERT\]:\s*([^\n]+)/gi, `
      <div class="my-3 p-3.5 rounded-2xl bg-rose-500/10 border-l-4 border-rose-500 text-rose-900 dark:text-rose-200 text-xs sm:text-sm font-medium flex items-start gap-2.5">
        <span class="text-base shrink-0">🚨</span>
        <div><strong class="font-bold text-rose-700 dark:text-rose-400 block mb-0.5">EXAM TRAP ALERT:</strong>$1</div>
      </div>
    `);

    // 3. ⚡ [SPEED SHORTCUT]: text
    escaped = escaped.replace(/⚡\s*\[SPEED SHORTCUT\]:\s*([^\n]+)/gi, `
      <div class="my-3 p-3.5 rounded-2xl bg-amber-500/10 border-l-4 border-amber-500 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-medium flex items-start gap-2.5">
        <span class="text-base shrink-0">⚡</span>
        <div><strong class="font-bold text-amber-700 dark:text-amber-400 block mb-0.5">SPEED SHORTCUT:</strong>$1</div>
      </div>
    `);

    // 4. ✈️ [HANGAR SECRET]: text
    escaped = escaped.replace(/✈️\s*\[HANGAR SECRET\]:\s*([^\n]+)/gi, `
      <div class="my-3 p-3.5 rounded-2xl bg-sky-500/10 border-l-4 border-sky-500 text-sky-900 dark:text-sky-200 text-xs sm:text-sm font-medium flex items-start gap-2.5">
        <span class="text-base shrink-0">✈️</span>
        <div><strong class="font-bold text-sky-700 dark:text-sky-400 block mb-0.5">COCKPIT & HANGAR REALITY:</strong>$1</div>
      </div>
    `);

    // 5. 💡 [AHA! MOMENT]: text
    escaped = escaped.replace(/💡\s*\[AHA! MOMENT\]:\s*([^\n]+)/gi, `
      <div class="my-3 p-3.5 rounded-2xl bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-medium flex items-start gap-2.5">
        <span class="text-base shrink-0">💡</span>
        <div><strong class="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">AHA! MNEMONIC:</strong>$1</div>
      </div>
    `);

    // 6. 📐 [FORMULA]: text
    escaped = escaped.replace(/📐\s*\[FORMULA\]:\s*([^\n]+)/gi, `
      <div class="my-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900 dark:bg-black text-amber-300 border border-slate-700 font-mono text-xs sm:text-sm font-bold flex items-center justify-between shadow-sm">
        <span>$1</span>
        <span class="text-[10px] text-slate-400 font-sans uppercase font-bold tracking-wider">Formula</span>
      </div>
    `);

    // Section subheaders: 5.1 ... or 9.2 ...
    escaped = escaped.replace(/(\d+\.\d+\s+[^\n]+)/gi, '<div class="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-6 mb-2 pb-1.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>$1</div>');

    // Bullet headers: • Something:
    escaped = escaped.replace(/(•\s+[^:\n]+:)/g, '<strong class="text-slate-900 dark:text-slate-100 font-bold block mt-3 mb-1">$1</strong>');

    return escaped;
  }

  // View Original Card in Lightbox
  function viewOriginalCard(imageSrc) {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-image');
    if (!modal || !img) return;
    img.src = imageSrc;
    modal.classList.remove('hidden');
  }

  function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (modal) modal.classList.add('hidden');
  }

  // PAYWALL / ACCESS / APPROVAL MODAL
  function openPaywallModal() {
    if (AMT_AUTH.isUserActivated()) {
      showToast("✅ This device is already permanently verified with Full Access!", "success");
      return;
    }
    const modal = document.getElementById('paywall-modal');
    if (!modal) return;

    const settings = AMT_AUTH.getSettings();
    const session = AMT_AUTH.getUserSession() || {};

    document.getElementById('paywall-price').textContent = `${settings.priceBirr} ETB`;
    document.getElementById('paywall-telebirr-num').textContent = settings.telebirrNumber;
    document.getElementById('paywall-telebirr-name').textContent = settings.telebirrName;
    document.getElementById('paywall-cbe-acc').textContent = settings.cbeAccount;
    document.getElementById('paywall-cbe-name').textContent = settings.cbeName;

    // Prefill name & student ID
    const nameInput = document.getElementById('paywall-input-name');
    if (nameInput) nameInput.value = session.name || '';
    updatePaywallStudentId();

    modal.classList.remove('hidden');
  }

  function closePaywallModal() {
    document.getElementById('paywall-modal').classList.add('hidden');
  }

  function updatePaywallStudentId() {
    const nameInput = document.getElementById('paywall-input-name');
    const name = nameInput?.value?.trim() || 'Student';
    const id = AMT_AUTH.generateStudentId(name);
    const display = document.getElementById('paywall-student-id-display');
    if (display) display.textContent = id;

    // Update Telegram Link with pre-filled message draft
    const settings = AMT_AUTH.getSettings();
    const tgBtn = document.getElementById('paywall-tg-link');
    if (tgBtn) {
      const draftMessage = `Hi Dagi! I made the ${settings.priceBirr} ETB payment for the Ethiopian Airlines AMT Exam App.\n\n👤 Name / Username: ${name}\n🆔 Student ID: ${id}\n\nHere is my payment receipt screenshot:`;
      const cleanUsername = (settings.telegramUsername || 'Mountxhua').replace('@', '').trim();
      tgBtn.href = `https://t.me/${cleanUsername}?text=${encodeURIComponent(draftMessage)}`;
    }
  }

  // Copy username & Student ID specifically to clipboard
  function copyStudentDetails() {
    const nameInput = document.getElementById('paywall-input-name');
    const name = nameInput?.value?.trim() || 'Student';
    const id = AMT_AUTH.generateStudentId(name);
    const settings = AMT_AUTH.getSettings();
    const textToCopy = `👤 Name / Username: ${name}\n🆔 Student ID: ${id}\n💰 Payment: ${settings.priceBirr} ETB`;
    copyText(textToCopy, "Username & Student ID");
  }

  // When clicking Telegram account link: copies username & ID to clipboard and drafts message in DM
  function handleTelegramPaymentClick(e) {
    const nameInput = document.getElementById('paywall-input-name');
    let name = nameInput?.value?.trim();
    if (!name) {
      name = 'Student';
      if (nameInput) nameInput.value = name;
    }
    const id = AMT_AUTH.generateStudentId(name);
    const settings = AMT_AUTH.getSettings();
    const cleanUsername = (settings.telegramUsername || 'Mountxhua').replace('@', '').trim();

    // Full draft message with username & student ID
    const draftMessage = `Hi Dagi! I made the ${settings.priceBirr} ETB payment for the Ethiopian Airlines AMT Exam App.\n\n👤 Name / Username: ${name}\n🆔 Student ID: ${id}\n\nHere is my payment receipt screenshot:`;

    // 1. Copy immediately to clipboard
    copyText(draftMessage, `Username (${name}) & Student ID (${id})`);

    // 2. Prepare pre-filled draft URL
    const encoded = encodeURIComponent(draftMessage);
    const webUrl = `https://t.me/${cleanUsername}?text=${encoded}`;
    const tgBtn = document.getElementById('paywall-tg-link');
    if (tgBtn) {
      tgBtn.href = webUrl;
    }

    showToast(`📋 Copied "${id}" to clipboard! Opening Telegram DM with @${cleanUsername}...`, "success");
  }

  let codeAttempts = 0;
  let codeLockoutUntil = 0;

  function submitActivationCode() {
    const now = Date.now();
    if (now < codeLockoutUntil) {
      const waitSec = Math.ceil((codeLockoutUntil - now) / 1000);
      audioContext.playIncorrect();
      showToast(`⛔ Please wait ${waitSec}s before trying another code.`, "danger");
      return;
    }

    const codeInput = document.getElementById('paywall-activation-code-input');
    const nameInput = document.getElementById('paywall-input-name');
    const code = codeInput?.value?.trim();
    const name = nameInput?.value?.trim() || 'Student';
    const studentId = AMT_AUTH.generateStudentId(name);

    if (!code) {
      showToast("Please enter your 6-digit Activation Code", "danger");
      return;
    }

    const res = AMT_AUTH.activateUser(code, name, studentId);
    if (res.success) {
      codeAttempts = 0;
      audioContext.playCorrect();
      showToast("🎉 Full Access Successfully Activated! Welcome!", "success");
      closePaywallModal();
      updateUIAuthBadge();
      renderExamCards();
      if (state.currentTab === 'notes') renderNotesContent();
      if (state.currentExamId) renderCurrentQuestion();
    } else {
      codeAttempts++;
      audioContext.playIncorrect();
      if (codeAttempts >= 5) {
        codeLockoutUntil = Date.now() + 60000;
        showToast("⛔ Too many failed attempts. Locked for 60 seconds.", "danger");
      } else {
        showToast(res.error || "❌ Invalid code. Please check with Admin on Telegram.", "danger");
      }
    }
  }

  // Hidden Secret Triggers for Dagi
  let logoClickCount = 0;
  let logoClickTimer = null;
  function handleSecretLogoClick(e) {
    if (e) e.stopPropagation();
    logoClickCount++;
    clearTimeout(logoClickTimer);
    if (logoClickCount >= 3) {
      logoClickCount = 0;
      openAdminModal();
    } else {
      logoClickTimer = setTimeout(() => {
        logoClickCount = 0;
      }, 1200);
    }
  }

  // Global hidden shortcuts (Ctrl+Shift+A or Alt+A) & #admin hash
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
      e.preventDefault();
      openAdminModal();
    }
  });

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#admin') {
      openAdminModal();
    }
  });

  // ADMIN PORTAL (Made Super Simple for Dagi)
  function openAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (!modal) return;

    if (!state.adminUnlocked) {
      document.getElementById('admin-login-view').classList.remove('hidden');
      document.getElementById('admin-dashboard-view').classList.add('hidden');
    } else {
      showAdminDashboard();
    }
    modal.classList.remove('hidden');
  }

  function closeAdminModal() {
    document.getElementById('admin-modal').classList.add('hidden');
  }

  let adminAttempts = 0;
  let adminLockoutUntil = 0;

  function verifyAdminPin() {
    const now = Date.now();
    if (now < adminLockoutUntil) {
      const waitSec = Math.ceil((adminLockoutUntil - now) / 1000);
      audioContext.playIncorrect();
      showToast(`⛔ Locked out! Too many attempts. Try again in ${waitSec}s`, "danger");
      return;
    }

    const input = document.getElementById('admin-pin-input');
    const pin = input?.value?.trim();

    if (!pin) {
      showToast("Please enter Admin Password", "danger");
      return;
    }

    if (AMT_AUTH.verifyAdminPin(pin)) {
      adminAttempts = 0;
      audioContext.playCorrect();
      state.adminUnlocked = true;
      if (input) input.value = '';
      showAdminDashboard();
    } else {
      adminAttempts++;
      audioContext.playIncorrect();
      if (adminAttempts >= 5) {
        adminLockoutUntil = Date.now() + 300000; // 5 min lockout
        showToast("⛔ Maximum attempts exceeded. Locked for 5 minutes.", "danger");
      } else if (adminAttempts >= 3) {
        adminLockoutUntil = Date.now() + 60000; // 1 min lockout
        showToast("⛔ 3 failed attempts. Locked for 60 seconds.", "danger");
      } else {
        showToast(`❌ Incorrect Admin Password (${3 - adminAttempts} attempts left)`, "danger");
      }
    }
  }

  function showAdminDashboard() {
    document.getElementById('admin-login-view').classList.add('hidden');
    document.getElementById('admin-dashboard-view').classList.remove('hidden');

    const settings = AMT_AUTH.getSettings();
    document.getElementById('admin-set-telebirr-num').value = settings.telebirrNumber;
    document.getElementById('admin-set-telebirr-name').value = settings.telebirrName;
    document.getElementById('admin-set-cbe-acc').value = settings.cbeAccount;
    document.getElementById('admin-set-cbe-name').value = settings.cbeName;
    document.getElementById('admin-set-tg-user').value = settings.telegramUsername;
    document.getElementById('admin-set-price').value = settings.priceBirr;
    document.getElementById('admin-set-pin').value = '';
    document.getElementById('admin-set-pin').placeholder = 'Leave blank to keep current PIN';
    document.getElementById('admin-vip-key-display').textContent = AMT_AUTH.VIP_DISPLAY;
  }

  // 1-Click Code Generation for Dagi
  function adminGenerateCode() {
    const input = document.getElementById('admin-student-input');
    const query = input?.value?.trim();
    if (!query) {
      showToast("Please enter the student name or ID", "danger");
      return;
    }

    const code = AMT_AUTH.generateActivationCode(query);
    const resultBox = document.getElementById('admin-generated-code-box');
    const codeDisplay = document.getElementById('admin-generated-code');
    const replyText = document.getElementById('admin-tg-reply-text');

    codeDisplay.textContent = code;
    const currentPrice = AMT_AUTH.getSettings().priceBirr || 250;
    const msg = `✅ Hello ${query}! Your payment of ${currentPrice} ETB is approved.\nYour Activation Code: ${code}\nEnter this code in the app to unlock all 5 exams permanently.\nGood luck on your AMT exam! ✈️`;
    replyText.value = msg;
    resultBox.classList.remove('hidden');
    audioContext.playCorrect();
  }

  function copyTgReply() {
    const replyText = document.getElementById('admin-tg-reply-text');
    if (!replyText) return;
    navigator.clipboard.writeText(replyText.value);
    audioContext.playClick();
    showToast("📋 Message copied! Now paste it on Telegram.", "success");
  }

  function saveAdminSettings() {
    const rawPin = document.getElementById('admin-set-pin').value.trim();
    const newSettings = {
      telebirrNumber: document.getElementById('admin-set-telebirr-num').value.trim(),
      telebirrName: document.getElementById('admin-set-telebirr-name').value.trim(),
      cbeAccount: document.getElementById('admin-set-cbe-acc').value.trim(),
      cbeName: document.getElementById('admin-set-cbe-name').value.trim(),
      telegramUsername: document.getElementById('admin-set-tg-user').value.trim(),
      priceBirr: parseInt(document.getElementById('admin-set-price').value) || 250
    };
    if (rawPin) {
      newSettings.adminPin = rawPin;
    }

    AMT_AUTH.saveSettings(newSettings);
    audioContext.playCorrect();
    showToast("Settings saved successfully!", "success");
  }

  // Fallback Copy helper for older mobile browsers
  function fallbackCopy(text, label) {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      audioContext.playClick();
      showToast(`✅ ${label} copied to clipboard!`, "success");
    } catch (err) {
      showToast(`Copied ${label}`, "info");
    }
  }

  // Copy helper
  function copyText(text, label) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          audioContext.playClick();
          showToast(`✅ ${label} copied to clipboard!`, "success");
        })
        .catch(() => fallbackCopy(text, label));
    } else {
      fallbackCopy(text, label);
    }
  }

  // Open external URL safely without popup blocker issues
  function openExternalUrl(url) {
    try {
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (e) {
      window.open(url, '_blank');
    }
  }

  // Universal App Share (Direct Telegram Share + Clipboard Copy)
  function shareApp(e) {
    audioContext.playClick();
    const shareUrl = "https://dagiyosi-pixel.github.io/amt-exam-app/";
    const shareText = "✈️ Ethiopian AMT Exam Master (Official 276 Questions & Study Notes)\n\nPass the Ethiopian Airlines & ECAA Aircraft Maintenance Technician Exams with real past papers, instant scoring, and formulas!\n\nTry the free exams:";
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

    // 1. Copy link to clipboard
    copyText(shareUrl, "Exam App Link");

    // 2. Open Telegram share if not already handled by a native anchor tag
    if (!e || !e.currentTarget || e.currentTarget.tagName !== 'A') {
      openExternalUrl(tgUrl);
    }
  }

  // Share Exam Score on Telegram
  function shareScoreOnTelegram() {
    audioContext.playClick();
    const exam = getCurrentExam();
    const scorePct = document.getElementById('results-score-pct')?.textContent || '85%';
    const shareUrl = "https://dagiyosi-pixel.github.io/amt-exam-app/";
    const text = `✈️ I scored ${scorePct} on the Ethiopian AMT Exam Simulator (${exam.title})!\nCan you beat my score? Practice 276 official exam questions here:`;
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;

    copyText(shareUrl, "Exam App Link");
    openExternalUrl(tgUrl);
  }

  // Toast Notification
  function showToast(message, type = "info") {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-emerald-600' : type === 'danger' ? 'bg-red-600' : 'bg-slate-800';
    toast.className = `${bgClass} text-white px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2 transform transition-all duration-300 translate-y-4 opacity-0`;
    toast.textContent = message;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Theme Management
  function loadTheme() {
    const saved = localStorage.getItem('amt_theme') || 'light';
    setTheme(saved);
  }

  function toggleTheme() {
    setTheme(state.theme === 'dark' ? 'light' : 'dark');
  }

  function setTheme(theme) {
    state.theme = theme;
    localStorage.setItem('amt_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    const btn = document.getElementById('sound-toggle-btn');
    if (btn) {
      btn.innerHTML = state.soundEnabled 
        ? `<svg class="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>`
        : `<svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>`;
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Keyboard navigation shortcuts
  function setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      // Secret Admin Shortcut for Dagi: Ctrl + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        openAdminModal();
        return;
      }

      if (document.getElementById('exam-view').classList.contains('hidden')) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === 'n') {
        nextQuestion();
      } else if (e.key === 'ArrowLeft' || e.key === 'p') {
        prevQuestion();
      } else if (e.key === 'f') {
        toggleFlagCurrent();
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const keys = ['A', 'B', 'C', 'D'];
        const list = getQuestionsList();
        const q = list[state.currentQuestionIndex];
        if (q && !state.userAnswers[q.id]) {
          selectAnswer(q.id, keys[parseInt(e.key) - 1]);
        }
      }
    });
  }

  // PWA Installation & Download Center
  let deferredPwaPrompt = null;

  function initPwa() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js?v=2026.4.1').then((reg) => {
        reg.update();
      }).catch(() => {});
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPwaPrompt = e;
      const btn = document.getElementById('pwa-install-header-btn');
      if (btn) btn.classList.remove('hidden');
    });
  }

  function triggerPwaInstall() {
    if (deferredPwaPrompt) {
      deferredPwaPrompt.prompt();
      deferredPwaPrompt.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
          showToast("App installed to your device!", "success");
        }
        deferredPwaPrompt = null;
      });
    } else {
      showToast("To install: Open browser menu (⋮ or Share) and tap 'Add to Home screen'", "info");
    }
  }

  function openDownloadModal() {
    document.getElementById('download-modal')?.classList.remove('hidden');
  }

  function closeDownloadModal() {
    document.getElementById('download-modal')?.classList.add('hidden');
  }

  function downloadOfflineFile(filename) {
    showToast(`Preparing ${filename}...`, "info");
    fetch(filename)
      .then(res => {
        if (!res.ok) throw new Error("File not found");
        return res.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 1500);
        audioContext.playCorrect();
        showToast(`✅ ${filename} downloaded to your device!`, "success");
      })
      .catch(() => {
        const a = document.createElement('a');
        a.href = filename;
        a.download = filename;
        a.click();
      });
  }

  // Expose global controller
  window.APP = {
    init,
    showExamsTab,
    showNotesTab,
    renderNotesPills,
    selectNotePart,
    selectNotePartAndTab,
    filterNotes,
    selectExam,
    returnToDashboard,
    selectAnswer,
    toggleExplanation,
    nextQuestion,
    prevQuestion,
    jumpToQuestion,
    toggleFlagCurrent,
    setFilter,
    openDrawer,
    closeDrawer,
    finishExam,
    closeResultsModal,
    viewOriginalCard,
    closeLightbox,
    openPaywallModal,
    closePaywallModal,
    updatePaywallStudentId,
    submitActivationCode,
    openAdminModal,
    closeAdminModal,
    handleSecretLogoClick,
    verifyAdminPin,
    adminGenerateCode,
    copyTgReply,
    saveAdminSettings,
    copyText,
    toggleTheme,
    toggleSound,
    triggerPwaInstall,
    openDownloadModal,
    closeDownloadModal,
    downloadOfflineFile,
    shareApp,
    shareScoreOnTelegram,
    copyStudentDetails,
    handleTelegramPaymentClick
  };

  document.addEventListener('DOMContentLoaded', () => {
    init();
    initPwa();
  });
})();

