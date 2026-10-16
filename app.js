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
    adminSessionToken: null,
    currentTab: 'exams', // 'exams' | 'notes'
    selectedNotePartId: 'all',
    noteSearchQuery: '',
    // Flashcard Deck State
    notesViewMode: 'flashcards', // 'flashcards' | 'guide'
    currentFlashcardIndex: 0,
    flashcardFlipped: false,
    flashcardFilter: 'all',
    flashcardsDeck: [],
    masteredFlashcards: new Set(JSON.parse(localStorage.getItem('amt_mastered_flashcards') || '[]'))
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

    // Layer 3 Vault Self-Healing: Background recovery if storage was cleared
    if (AMT_AUTH.restoreFromVault) {
      AMT_AUTH.restoreFromVault((restored) => {
        if (restored) {
          updateUIAuthBadge();
          renderExamCards();
          if (state.currentTab === 'notes') renderNotesContent();
        }
      });
    }
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

  // Load Notes & Flashcards Database
  function loadNotesData() {
    if (window.AMT_NOTES_DATA && Array.isArray(window.AMT_NOTES_DATA)) {
      state.notes = window.AMT_NOTES_DATA;
    }
    if (window.AMT_FLASHCARDS && Array.isArray(window.AMT_FLASHCARDS)) {
      state.flashcards = window.AMT_FLASHCARDS;
    }
    initFlashcardsDeck();
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
  const TAB_ACTIVE_CLS = "w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-[#00843D] text-white shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer";
  const TAB_INACTIVE_CLS = "w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-all flex items-center justify-center gap-2 cursor-pointer";

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

    if (state.notesViewMode === 'flashcards') {
      renderFlashcardDeck();
    } else {
      renderNotesPills();
      renderNotesContent();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Render Dashboard Exam Cards
  function renderExamCards() {
    const container = document.getElementById('exam-cards-grid');
    if (!container) return;

    const examIcons = {
      'exam1': '✈️',
      'model': '📐',
      'exam3': '⚡',
      'practice': '⚙️',
      'exam2': '🧪',
      'exam4': '⚡',
      'exam5': '📖',
      'exam6': '📐'
    };

    container.innerHTML = state.exams.map(exam => {
      const savedScore = localStorage.getItem(`score_${exam.id}`);
      const icon = examIcons[exam.id] || '📝';
      
      let scoreBadge = `<span class="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Not attempted yet</span>`;
      if (savedScore !== null) {
        const numScore = parseInt(savedScore, 10);
        if (numScore >= 75) {
          scoreBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">🏆 Best: ${numScore}% (PASS)</span>`;
        } else {
          scoreBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono">📊 Best: ${numScore}%</span>`;
        }
      }

      return `
        <div class="exam-card glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 border transition-all duration-300 relative flex flex-col justify-between group">
          <div>
            <div class="flex items-center justify-between gap-2 mb-3 sm:mb-4">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <span>${icon}</span>
                <span>${exam.id.toUpperCase()}</span>
              </span>
              <span class="text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 font-mono">
                ${exam.totalQuestions} Questions
              </span>
            </div>
            
            <h3 class="text-base sm:text-xl font-black text-slate-900 dark:text-white mb-1.5 sm:mb-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              ${exam.title}
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 leading-relaxed">
              ${exam.subject}
            </p>
          </div>

          <div class="pt-3 sm:pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
            <div>
              ${scoreBadge}
            </div>
            <div class="flex items-center gap-2">
              <button 
                onclick="window.APP.selectExam('${exam.id}', true)" 
                class="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#00843D] hover:bg-[#00602c] text-white transition-all shadow-md shadow-emerald-900/20 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                title="Practice mode with instant answer explanations"
              >
                <span>⚡ Practice</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
              <button 
                onclick="window.APP.selectExam('${exam.id}', false)" 
                class="flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                title="60-minute timed entrance exam simulation"
              >
                <span>⏱️ Timed</span>
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
      let iconHtml = `<span class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 shrink-0 font-mono transition-transform group-hover:scale-105">${opt.key}</span>`;

      if (hasAnswered) {
        if (opt.key === q.correctAnswer) {
          stateClass = "correct";
          iconHtml = `<span class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm bg-emerald-500 text-white shadow-md shadow-emerald-500/30 shrink-0 font-mono">✓</span>`;
        } else if (opt.key === userAnswer) {
          stateClass = "incorrect";
          iconHtml = `<span class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm bg-rose-500 text-white shadow-md shadow-rose-500/30 shrink-0 font-mono">✕</span>`;
        }
      }

      return `
        <button 
          onclick="window.APP.selectAnswer('${q.id}', '${opt.key}')" 
          class="option-btn w-full p-2.5 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-2.5 sm:gap-4 text-left font-medium text-slate-800 dark:text-slate-100 transition-all ${stateClass} ${hasAnswered ? 'locked' : ''} group active:scale-[0.99]"
        >
          ${iconHtml}
          <span class="flex-1 text-xs sm:text-base leading-snug sm:leading-relaxed font-semibold">${escapeHtml(opt.text)}</span>
        </button>
      `;
    }).join('');

    // Question Container HTML
    container.innerHTML = `
      <div class="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 border shadow-sm transition-all duration-200">
        <!-- Badge & Category -->
        <div class="flex items-center justify-between gap-2 mb-3 pb-2.5 sm:mb-4 sm:pb-3 border-b border-slate-200/60 dark:border-slate-800/80">
          <div class="flex items-center gap-1.5 sm:gap-2">
            <span class="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              ✈️ ${escapeHtml(q.category || 'Aviation Exam')}
            </span>
            <span class="text-[11px] sm:text-xs font-mono text-slate-400 dark:text-slate-500">ID: ${escapeHtml(q.id)}</span>
          </div>
          <span class="text-[10px] uppercase font-bold tracking-widest text-slate-400">Official Past Paper</span>
        </div>

        <!-- Question Stem -->
        <h2 class="text-base sm:text-xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 leading-snug sm:leading-relaxed">
          ${escapeHtml(q.question)}
        </h2>

        <!-- Options List -->
        <div class="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
          ${optionsHtml}
        </div>

        <!-- Pop-Out Explanation Trigger (LOCKED UNTIL USER ANSWERS) -->
        <div id="explanation-container" class="mt-3 sm:mt-4">
          ${hasAnswered ? `
            <div class="border-t border-slate-200/80 dark:border-slate-800 pt-4 sm:pt-5">
              <!-- Explanation Down Arrow Accordion Trigger -->
              <button 
                id="explanation-toggle-btn" 
                onclick="window.APP.toggleExplanation()"
                class="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/25 transition-all group cursor-pointer"
              >
                <div class="flex items-center gap-2 sm:gap-2.5">
                  <span class="text-base sm:text-lg">💡</span>
                  <span class="font-bold text-xs sm:text-base">Step-by-Step Explanation</span>
                </div>
                <!-- DOWN ARROW REQUESTED BY USER -->
                <div class="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30 group-hover:border-emerald-500/50 transition-all">
                  <span id="explanation-reveal-label">Click down arrow to reveal solution 🔽</span>
                  <svg id="explanation-arrow-icon" class="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </button>

              <!-- Collapsible Explanation Drawer -->
              <div id="explanation-drawer" class="explanation-drawer">
                <div class="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div class="flex items-center gap-2 mb-2 sm:mb-3">
                    <span class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500"></span>
                    <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Correct Answer: Option ${escapeHtml(q.correctAnswer)}
                    </h4>
                  </div>
                  <p class="text-xs sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium">
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


  // FLASHCARD DECK ENGINE
  function initFlashcardsDeck() {
    let list = state.flashcards || [];
    if (state.flashcardFilter !== 'all') {
      list = list.filter(c => c.category === state.flashcardFilter);
    }
    state.flashcardsDeck = list;
    if (state.currentFlashcardIndex >= state.flashcardsDeck.length) {
      state.currentFlashcardIndex = 0;
    }
    state.flashcardFlipped = false;
  }

  function setNotesViewMode(mode) {
    audioContext.playClick();
    state.notesViewMode = mode;
    const flashcardsBtn = document.getElementById('notes-mode-flashcards-btn');
    const guideBtn = document.getElementById('notes-mode-guide-btn');
    const flashcardsView = document.getElementById('flashcards-view-container');
    const guideView = document.getElementById('notes-content-container');
    const pills = document.getElementById('notes-part-pills');
    const statsBar = document.getElementById('flashcard-stats-bar');

    if (mode === 'flashcards') {
      if (flashcardsBtn) {
        flashcardsBtn.className = "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 bg-[#00843D] text-white shadow-md shadow-emerald-900/20 cursor-pointer";
      }
      if (guideBtn) {
        guideBtn.className = "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer";
      }
      if (flashcardsView) flashcardsView.classList.remove('hidden');
      if (guideView) guideView.classList.add('hidden');
      if (pills) pills.classList.add('hidden');
      if (statsBar) statsBar.classList.remove('hidden');
      renderFlashcardDeck();
    } else {
      if (flashcardsBtn) {
        flashcardsBtn.className = "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer";
      }
      if (guideBtn) {
        guideBtn.className = "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 bg-[#00843D] text-white shadow-md shadow-emerald-900/20 cursor-pointer";
      }
      if (flashcardsView) flashcardsView.classList.add('hidden');
      if (guideView) guideView.classList.remove('hidden');
      if (pills) pills.classList.remove('hidden');
      if (statsBar) statsBar.classList.add('hidden');
      renderNotesPills();
      renderNotesContent();
    }
  }

  function setFlashcardFilter(category) {
    audioContext.playClick();
    state.flashcardFilter = category;
    initFlashcardsDeck();
    renderFlashcardDeck();
  }

  function flipCurrentFlashcard() {
    audioContext.playClick();
    state.flashcardFlipped = !state.flashcardFlipped;
    const inner = document.getElementById('active-flashcard-inner');
    if (inner) {
      if (state.flashcardFlipped) {
        inner.classList.add('is-flipped');
      } else {
        inner.classList.remove('is-flipped');
      }
    }
  }

  function nextFlashcard() {
    audioContext.playClick();
    const isActivated = AMT_AUTH.isUserActivated();
    const freeFlashcardLimit = 15;

    if (!isActivated && state.currentFlashcardIndex >= freeFlashcardLimit - 1) {
      openPaywallModal();
      return;
    }

    if (state.currentFlashcardIndex < state.flashcardsDeck.length - 1) {
      state.currentFlashcardIndex++;
      state.flashcardFlipped = false;
      renderFlashcardDeck();
    }
  }

  function prevFlashcard() {
    audioContext.playClick();
    if (state.currentFlashcardIndex > 0) {
      state.currentFlashcardIndex--;
      state.flashcardFlipped = false;
      renderFlashcardDeck();
    }
  }

  function shuffleFlashcards() {
    audioContext.playClick();
    const deck = [...state.flashcardsDeck];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    state.flashcardsDeck = deck;
    state.currentFlashcardIndex = 0;
    state.flashcardFlipped = false;
    renderFlashcardDeck();
    showToast("🔀 Flashcards shuffled randomly!", "info");
  }

  function restartFlashcardsDeck() {
    audioContext.playClick();
    state.currentFlashcardIndex = 0;
    state.flashcardFlipped = false;
    renderFlashcardDeck();
    showToast("↺ Deck reset to Card 1", "info");
  }

  function toggleMasterCurrentFlashcard() {
    audioContext.playClick();
    const currentCard = state.flashcardsDeck[state.currentFlashcardIndex];
    if (!currentCard) return;

    if (state.masteredFlashcards.has(currentCard.id)) {
      state.masteredFlashcards.delete(currentCard.id);
      showToast("Card unmarked from Mastered", "info");
    } else {
      state.masteredFlashcards.add(currentCard.id);
      showToast("⭐ Card marked as Mastered!", "success");
    }

    try {
      localStorage.setItem('amt_mastered_flashcards', JSON.stringify(Array.from(state.masteredFlashcards)));
    } catch (e) {}

    renderFlashcardDeck();
  }

  function renderFlashcardDeck() {
    const container = document.getElementById('flashcards-view-container');
    if (!container) return;

    const deck = state.flashcardsDeck || [];
    const totalInDeck = deck.length;
    const currentIndex = state.currentFlashcardIndex;
    const isActivated = AMT_AUTH.isUserActivated();
    const masteredCount = deck.filter(c => state.masteredFlashcards.has(c.id)).length;

    // Update global counter badge and stats bar
    const masteredCountEl = document.getElementById('flashcard-mastered-count');
    if (masteredCountEl) {
      masteredCountEl.innerHTML = '<span>⭐</span><span>Mastered: ' + masteredCount + '/' + totalInDeck + '</span>';
    }
    const badgeCountEl = document.getElementById('flashcard-badge-count');
    if (badgeCountEl) {
      badgeCountEl.textContent = totalInDeck;
    }

    // Categories filter buttons
    const categories = [
      { key: 'all', label: '🌟 All Cards', count: (state.flashcards || []).length },
      { key: 'math', label: '📐 Math & Probability', count: (state.flashcards || []).filter(c => c.category === 'math').length },
      { key: 'machines', label: '⚙️ Levers & Machines', count: (state.flashcards || []).filter(c => c.category === 'machines').length },
      { key: 'physics', label: '⚡ Physics & Heat', count: (state.flashcards || []).filter(c => c.category === 'physics').length },
      { key: 'circuits', label: '🔋 Circuits & Charges', count: (state.flashcards || []).filter(c => c.category === 'circuits').length },
      { key: 'magnetism', label: '🧲 Magnetism', count: (state.flashcards || []).filter(c => c.category === 'magnetism').length },
      { key: 'logic', label: '🧊 Spatial & Logic', count: (state.flashcards || []).filter(c => c.category === 'logic').length },
      { key: 'english', label: '✍️ English & Grammar', count: (state.flashcards || []).filter(c => c.category === 'english').length },
    ];

    const categoryTabsHtml = categories.map(cat => {
      const active = (state.flashcardFilter === cat.key);
      return `
        <button 
          onclick="window.APP.setFlashcardFilter('${cat.key}')" 
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${active ? 'bg-[#00843D] text-white shadow-md shadow-emerald-900/20 border border-emerald-400/40' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}"
        >
          <span>${cat.label}</span>
          <span class="ml-1.5 opacity-75 font-mono">(${cat.count})</span>
        </button>
      `;
    }).join('');

    if (totalInDeck === 0) {
      container.innerHTML = `
        <div class="rounded-3xl p-10 text-center border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <p class="text-sm font-bold text-slate-500">No flashcards found for this category.</p>
        </div>
      `;
      return;
    }

    const card = deck[currentIndex];
    const isMastered = state.masteredFlashcards.has(card.id);
    const isFlipped = state.flashcardFlipped;
    const progressPct = Math.round(((currentIndex + 1) / totalInDeck) * 100);

    // Format back text cleanly
    const formattedBack = escapeHtml(card.back)
      .replace(/\n\n/g, '<div class="my-2.5"></div>')
      .replace(/\n/g, '<br/>')
      .replace(/(⚡[^\n<]+)/g, '<strong class="text-amber-800 dark:text-amber-300 font-bold">$1</strong>')
      .replace(/(🚨[^\n<]+)/g, '<strong class="text-rose-700 dark:text-rose-400 font-bold">$1</strong>')
      .replace(/(💡[^\n<]+)/g, '<strong class="text-emerald-700 dark:text-emerald-400 font-bold">$1</strong>')
      .replace(/(✈️[^\n<]+)/g, '<strong class="text-sky-700 dark:text-sky-400 font-bold">$1</strong>')
      .replace(/(📐[^\n<]+)/g, '<div class="my-2 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-slate-800 border border-amber-300/80 font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-amber-200 shadow-sm">$1</div>');

    container.innerHTML = `
      <!-- Category Filter Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
        ${categoryTabsHtml}
      </div>

      <!-- Flashcard Deck Progress Indicator -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div class="flex items-center gap-3">
          <span class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono font-black text-xs flex items-center justify-center border border-emerald-500/20">
            ${currentIndex + 1}
          </span>
          <div>
            <div class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Card ${currentIndex + 1} of ${totalInDeck}</span>
              <span class="text-slate-300 dark:text-slate-700">•</span>
              <span class="text-emerald-700 dark:text-emerald-400 font-semibold">${card.categoryLabel}</span>
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400">
              Module M0${card.module} • Click or tap Space to flip
            </div>
          </div>
        </div>

        <!-- Progress Bar & Star Button -->
        <div class="flex items-center gap-3">
          <div class="w-28 sm:w-36 bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-200 dark:border-slate-700">
            <div class="h-full bg-gradient-to-r from-[#00843D] to-[#FCD116] transition-all duration-300" style="width: ${progressPct}%"></div>
          </div>
          <span class="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">${progressPct}%</span>

          <button 
            onclick="window.APP.toggleMasterCurrentFlashcard()" 
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${isMastered ? 'bg-amber-500 text-white border-amber-600 shadow-sm' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-amber-50 hover:text-amber-700'}"
            title="${isMastered ? 'Card Mastered' : 'Mark as Mastered'}"
          >
            <span>${isMastered ? '★' : '☆'}</span>
            <span>${isMastered ? 'Mastered' : 'Master'}</span>
          </button>
        </div>
      </div>

      <!-- INTERACTIVE 3D FLASHCARD -->
      <div class="flashcard-perspective w-full max-w-3xl mx-auto my-2">
        <div 
          id="active-flashcard-inner" 
          onclick="window.APP.flipCurrentFlashcard()" 
          class="flashcard-inner rounded-2xl sm:rounded-3xl cursor-pointer ${isFlipped ? 'is-flipped' : ''}"
        >
          <!-- FRONT FACE (QUESTION / PROMPT) -->
          <div class="flashcard-face rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 shadow-md relative overflow-hidden flex flex-col justify-between select-none">
            <!-- Top Ethiopian Ribbon Accent -->
            <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00843D] via-[#FCD116] to-[#D3122A]"></div>

            <!-- Card Top Bar -->
            <div>
              <div class="flex items-center justify-between gap-3 mb-3 sm:mb-5">
                <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                  <span>${card.icon}</span>
                  <span>${card.type}</span>
                </div>
                <span class="text-[11px] sm:text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                  Question Side
                </span>
              </div>

              <!-- Question Heading -->
              <h3 class="text-base sm:text-2xl font-black text-slate-900 dark:text-white leading-snug sm:leading-relaxed font-display">
                ${escapeHtml(card.front)}
              </h3>
            </div>

            <!-- Tap to Flip Prompt Banner -->
            <div class="pt-3.5 sm:pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-3 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
              <div class="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <span class="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center text-xs sm:text-sm">🔄</span>
                <span>Tap Card or Spacebar to Reveal Solution</span>
              </div>
              <span class="text-[10px] sm:text-[11px] font-mono text-slate-400 font-semibold">Verified EAU Syllabus</span>
            </div>
          </div>

          <!-- BACK FACE (VERIFIED ANSWER & DERIVATION) -->
          <div class="flashcard-face flashcard-face-back rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-gradient-to-br from-emerald-50/90 via-white to-amber-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-2 border-emerald-500/50 dark:border-emerald-600/50 shadow-xl relative overflow-hidden flex flex-col justify-between select-none">
            <!-- Top Ethiopian Ribbon Accent -->
            <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00843D] via-[#FCD116] to-[#D3122A]"></div>

            <!-- Back Header -->
            <div>
              <div class="flex items-center justify-between gap-3 mb-2.5 sm:mb-4">
                <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-emerald-600 text-white shadow-sm">
                  <span>✓</span>
                  <span>Verified Solution & Derivation</span>
                </div>
                <span class="text-[11px] sm:text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">
                  Answer Side
                </span>
              </div>

              <!-- Formula Box if Available -->
              ${card.formula ? `
                <div class="my-2.5 px-3.5 py-2.5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-950 border border-emerald-300 dark:border-emerald-800 font-mono font-black text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 shadow-sm flex items-center justify-between">
                  <span>${card.formula}</span>
                  <span class="text-[10px] font-sans font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Formula</span>
                </div>
              ` : ''}

              <!-- Solution Content -->
              <div class="text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-100 font-medium">
                ${formattedBack}
              </div>
            </div>

            <!-- Flip Back CTA -->
            <div class="pt-3.5 sm:pt-5 border-t border-emerald-200/60 dark:border-slate-800 mt-3 sm:mt-5 flex items-center justify-between">
              <span class="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <span>🔄</span>
                <span>Tap to flip back to question</span>
              </span>
              <span class="text-[11px] sm:text-xs font-mono text-slate-500 dark:text-slate-400 font-bold">100% Verified</span>
            </div>
          </div>
        </div>
      </div>

      <!-- DECK NAVIGATION BAR -->
      <div class="max-w-3xl mx-auto flex items-center justify-between gap-2 sm:gap-3 pt-3">
        <button 
          id="prev-flashcard-btn" 
          onclick="window.APP.prevFlashcard()" 
          ${currentIndex === 0 ? 'disabled' : ''} 
          class="flex-1 sm:flex-initial px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
          <span>Previous</span>
        </button>

        <button 
          onclick="window.APP.flipCurrentFlashcard()" 
          class="flex-1 sm:flex-initial px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-[#00843D] hover:bg-[#00602c] text-white shadow-md shadow-emerald-900/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          <span>Flip Card (Space)</span>
        </button>

        <button 
          id="next-flashcard-btn" 
          onclick="window.APP.nextFlashcard()" 
          ${currentIndex === totalInDeck - 1 ? 'disabled' : ''} 
          class="flex-1 sm:flex-initial px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <span>Next</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    `;
  }


    // NOTES VIEWER LOGIC
  function renderNotesPills() {
    const container = document.getElementById('notes-part-pills');
    if (!container) return;

    let html = `
      <button 
        onclick="window.APP.selectNotePart('all')" 
        class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${state.selectedNotePartId === 'all' ? 'bg-[#00843D] text-white shadow-md shadow-emerald-900/30 border border-emerald-400/40' : 'bg-white/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700/80'}"
      >
        <span>📚 All Modules (10)</span>
      </button>
    `;

    state.notes.forEach(p => {
      const isSelected = (state.selectedNotePartId === p.id);
      const label = `M${p.number}: ${p.shortTitle || `Part ${p.number}`}`;
      html += `
        <button 
          onclick="window.APP.selectNotePart('${p.id}')" 
          class="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${isSelected ? 'bg-[#00843D] text-white shadow-md shadow-emerald-900/30 border border-emerald-400/40' : 'bg-white/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700/80'}"
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
        <div class="glass-panel rounded-3xl p-10 text-center border bg-white dark:bg-slate-900">
          <p class="text-sm font-bold text-slate-500">No notes matched your search query.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = partsToShow.map(p => {
      // In trial mode, only part 1 is open, parts 2-10 are locked with paywall button
      const isLocked = (!isActivated && p.number > 1);

      return `
        <div class="rounded-3xl p-6 sm:p-9 border shadow-sm transition-all bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800/90 relative overflow-hidden">
          <!-- Authentic Ethiopian Tri-Color Chapter Ribbon Accent -->
          <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00843D] via-[#FCD116] to-[#D3122A]"></div>

          <div class="flex items-start justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800 mb-6 gap-3">
            <div class="flex items-center gap-3.5">
              <span class="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00843D] to-[#00602c] text-white font-black text-sm flex items-center justify-center border border-emerald-400/30 shadow-md shadow-emerald-900/20 font-mono shrink-0">
                M${p.number < 10 ? '0' + p.number : p.number}
              </span>
              <div>
                <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug font-display">
                  ${escapeHtml(p.title)}
                </h3>
                <div class="flex flex-wrap items-center gap-2 mt-1">
                  <span class="text-xs font-bold text-emerald-700 dark:text-emerald-400">✈️ ${p.shortTitle || `Module ${p.number}`}</span>
                  <span class="text-slate-300 dark:text-slate-700">•</span>
                  <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Verified EAU Curriculum</span>
                </div>
              </div>
            </div>
            ${isLocked ? `<span class="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1.5 shrink-0">🔒 Locked</span>` : `<span class="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 shrink-0">✓ Unlocked</span>`}
          </div>

          ${isLocked ? `
            <div class="p-8 rounded-3xl bg-amber-500/5 border border-amber-500/20 text-center space-y-3.5">
              <p class="text-sm text-slate-700 dark:text-slate-300 font-medium max-w-md mx-auto leading-relaxed">
                Module ${p.number} is locked in Trial Mode. Unlock Full Access (250 Birr) to access all ${state.notes.length || 10} modules of the Master Preparation Notes!
              </p>
              <button onclick="window.APP.openPaywallModal()" class="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#00843D] hover:bg-[#00602c] text-white shadow-md shadow-emerald-900/20 transition-all cursor-pointer">
                Unlock Full Access (250 ETB)
              </button>
            </div>
          ` : `
            <div class="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-normal space-y-3">
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

    // 1. Pop Quiz: 🧠 [POP QUIZ]: Question || Answer
    escaped = escaped.replace(/🧠\s*\[POP QUIZ\]:\s*([^|\n]+)\|\|\s*([^\n]+)/gi, function(match, q, a) {
      return `
        <div class="my-4.5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/70 dark:from-slate-800/90 dark:to-slate-800/60 border border-indigo-200/90 dark:border-indigo-700/60 shadow-sm space-y-2.5">
          <div class="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-extrabold text-xs uppercase tracking-wider">
            <span class="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center text-sm">🧠</span>
            <span>Rapid Hangar Challenge</span>
          </div>
          <p class="text-sm font-bold text-slate-900 dark:text-white leading-snug">${q.trim()}</p>
          <details class="cursor-pointer group mt-2">
            <summary class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all select-none shadow-sm active:scale-95">
              <span>👉 Tap to Reveal Verified Answer</span>
            </summary>
            <div class="mt-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-xs sm:text-sm font-semibold text-emerald-900 dark:text-emerald-300 shadow-inner flex items-start gap-2.5">
              <span class="text-base shrink-0">💡</span>
              <div><strong class="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">Verified Solution:</strong>${a.trim()}</div>
            </div>
          </details>
        </div>
      `;
    });

    // 2. Formulas: 📐 [FORMULA]: formula
    escaped = escaped.replace(/📐\s*\[FORMULA\]:\s*([^\n]+)/gi, function(match, formula) {
      return `
        <div class="my-3.5 p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 via-white to-amber-50/60 dark:from-slate-800/90 dark:to-slate-800/60 border border-amber-300/80 dark:border-amber-700/60 shadow-sm">
          <div class="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-1.5">
            <span>📐</span>
            <span>Essential Aviation Formula</span>
          </div>
          <div class="font-mono font-black text-sm sm:text-base text-slate-900 dark:text-amber-200 bg-white/95 dark:bg-slate-900/90 px-3.5 py-2.5 rounded-xl border border-amber-200 dark:border-slate-700 shadow-inner tracking-wide select-all">
            ${formula.trim()}
          </div>
        </div>
      `;
    });

    // 3. Trap Alerts: 🚨 [TRAP ALERT]: text
    escaped = escaped.replace(/🚨\s*\[TRAP ALERT\]:\s*([^\n]+)/gi, `
      <div class="my-3 p-4 rounded-2xl bg-rose-50/90 dark:bg-slate-800/80 border-l-4 border-rose-500 border-t border-r border-b border-rose-200/80 dark:border-rose-900/60 shadow-sm flex items-start gap-3">
        <span class="text-lg shrink-0">🚨</span>
        <div class="text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed"><strong class="font-extrabold text-rose-700 dark:text-rose-400 block mb-0.5">EXAM TRAP ALERT:</strong>$1</div>
      </div>
    `);

    // 4. Speed Shortcuts: ⚡ [SPEED SHORTCUT]: text
    escaped = escaped.replace(/⚡\s*\[SPEED SHORTCUT\]:\s*([^\n]+)/gi, `
      <div class="my-3 p-4 rounded-2xl bg-amber-50/90 dark:bg-slate-800/80 border-l-4 border-amber-500 border-t border-r border-b border-amber-200/80 dark:border-amber-900/60 shadow-sm flex items-start gap-3">
        <span class="text-lg shrink-0">⚡</span>
        <div class="text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed"><strong class="font-extrabold text-amber-700 dark:text-amber-400 block mb-0.5">SPEED SHORTCUT:</strong>$1</div>
      </div>
    `);

    // 5. Hangar Secrets: ✈️ [HANGAR SECRET]: text
    escaped = escaped.replace(/✈️\s*\[HANGAR SECRET\]:\s*([^\n]+)/gi, `
      <div class="my-3 p-4 rounded-2xl bg-sky-50/90 dark:bg-slate-800/80 border-l-4 border-sky-500 border-t border-r border-b border-sky-200/80 dark:border-sky-900/60 shadow-sm flex items-start gap-3">
        <span class="text-lg shrink-0">✈️</span>
        <div class="text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed"><strong class="font-extrabold text-sky-700 dark:text-sky-400 block mb-0.5">COCKPIT & HANGAR REALITY:</strong>$1</div>
      </div>
    `);

    // 6. Aha! Moment: 💡 [AHA! MOMENT]: text
    escaped = escaped.replace(/💡\s*\[AHA! MOMENT\]:\s*([^\n]+)/gi, `
      <div class="my-3 p-4 rounded-2xl bg-emerald-50/90 dark:bg-slate-800/80 border-l-4 border-emerald-500 border-t border-r border-b border-emerald-200/80 dark:border-emerald-900/60 shadow-sm flex items-start gap-3">
        <span class="text-lg shrink-0">💡</span>
        <div class="text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed"><strong class="font-extrabold text-emerald-700 dark:text-emerald-400 block mb-0.5">AHA! MNEMONIC:</strong>$1</div>
      </div>
    `);

    // 7. Section Headers: "10.1 Top Math Traps..." or "5.1 Probability..."
    escaped = escaped.replace(/^([0-9]+\.[0-9]+)\s+([^\n]+)/gm, `
      <div class="mt-8 mb-3.5 pt-4 border-t border-slate-200/80 dark:border-slate-800 first:mt-0 first:pt-0 first:border-0 flex items-center gap-2.5">
        <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-black bg-emerald-600 text-white shadow-sm shrink-0">§ $1</span>
        <h4 class="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">$2</h4>
      </div>
    `);

    // 8. Numbered Reference Items: "1. Title: Description"
    escaped = escaped.replace(/^([0-9]+)\.\s+([^:\n]+):\s*([^\n]+)/gm, `
      <div class="my-2.5 p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/80 shadow-sm flex items-start gap-3 hover:border-emerald-400/50 transition-all">
        <span class="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono font-black text-xs flex items-center justify-center shrink-0 border border-emerald-500/20">$1</span>
        <div class="flex-1 text-xs sm:text-sm leading-relaxed">
          <strong class="font-extrabold text-slate-900 dark:text-white">$2:</strong>
          <span class="text-slate-700 dark:text-slate-300 ml-1">$3</span>
        </div>
      </div>
    `);

    // 9. Bullet Sub-Headings: "• Subheading:"
    escaped = escaped.replace(/^•\s*([^:\n]+):/gm, `
      <div class="mt-4 mb-2 flex items-center gap-2 font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
        <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
        <span>$1:</span>
      </div>
    `);

    // 10. Dash list items: "- Step or - Item"
    escaped = escaped.replace(/^-\s+([^\n]+)/gm, `
      <div class="ml-4 my-1 flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        <span class="text-emerald-500 font-bold shrink-0">•</span>
        <span>$1</span>
      </div>
    `);

    return escaped;
  }

// Reference Card & Lightbox function permanently retired per user request

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
    const nameEl = document.getElementById('paywall-telebirr-name');
    if (nameEl) nameEl.textContent = settings.telebirrName || 'AMT Portal';

    // Load custom in-app admin notice if present
    const noticeEl = document.getElementById('paywall-admin-notice-text');
    if (noticeEl && settings.adminNotice) {
      noticeEl.textContent = settings.adminNotice;
    }

    // Prefill name & student ID (auto-restore from local persistence)
    const nameInput = document.getElementById('paywall-input-name');
    const savedName = localStorage.getItem('amt_saved_student_name') || session.name || '';
    if (nameInput) {
      if (!nameInput.value && savedName) {
        nameInput.value = savedName;
      }
    }
    updatePaywallStudentId();
    renderPendingReceiptTicket();

    modal.classList.remove('hidden');
  }

  function closePaywallModal() {
    document.getElementById('paywall-modal').classList.add('hidden');
  }

  function updatePaywallStudentId() {
    const nameInput = document.getElementById('paywall-input-name');
    const rawVal = nameInput?.value?.trim();
    if (rawVal) {
      try {
        localStorage.setItem('amt_saved_student_name', rawVal);
      } catch(e) {}
    }
    const savedName = localStorage.getItem('amt_saved_student_name');
    const name = rawVal || savedName || 'Student';
    const id = AMT_AUTH.generateStudentId(name);
    const display = document.getElementById('paywall-student-id-display');
    if (display) display.textContent = id;

    const settings = AMT_AUTH.getSettings();
    const phone = settings.phoneContact || settings.telebirrNumber || '0907862027';

    // 1. Direct SMS Link with Pre-filled draft (Anonymous)
    const smsBtn = document.getElementById('paywall-sms-link');
    if (smsBtn) {
      const smsBody = `Hello! I made the ${settings.priceBirr} ETB Telebirr payment for the AMT Exam App.\n\n👤 Name/Phone: ${name}\n🆔 Student ID: ${id}\n💰 Telebirr Txn Ref: [PASTE_TRANSACTION_ID_HERE]\n\nPlease send my 6-digit unlock code!`;
      smsBtn.href = `sms:${phone}?body=${encodeURIComponent(smsBody)}`;
    }

    // 2. Direct Call Link
    const callBtn = document.getElementById('paywall-call-link');
    if (callBtn) {
      callBtn.href = `tel:${phone}`;
    }

    // 3. Update Telegram Link with pre-filled message draft
    const tgBtn = document.getElementById('paywall-tg-link');
    if (tgBtn) {
      const draftMessage = `Hello! I made the ${settings.priceBirr} ETB Telebirr payment for the AMT Exam App.\n\n👤 Name / Phone: ${name}\n🆔 Student ID: ${id}\n\nHere is my Telebirr receipt screenshot:`;
      const cleanUsername = (settings.telegramUsername || 'Mountxhua').replace('@', '').trim();
      tgBtn.href = `https://t.me/${cleanUsername}?text=${encodeURIComponent(draftMessage)}`;
    }
  }

  // Submit and register receipt inside the app
  function submitReceiptInApp() {
    const nameInput = document.getElementById('paywall-input-name');
    const name = nameInput?.value?.trim() || 'Student';
    const id = AMT_AUTH.generateStudentId(name);
    const txnInput = document.getElementById('paywall-txn-input');
    const phoneInput = document.getElementById('paywall-phone-input');
    const txn = txnInput?.value?.trim();
    const phone = phoneInput?.value?.trim();

    if (!txn) {
      showToast("⚠️ Please enter your Telebirr Transaction ID / SMS text.", "danger");
      return;
    }

    const receipt = {
      studentId: id,
      name: name,
      phone: phone || name,
      txnId: txn,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };

    AMT_AUTH.savePendingReceipt(receipt);
    renderPendingReceiptTicket();
    showToast("✅ Receipt registered in app! Click 'Send via SMS' to notify Admin instantly.", "success");
    if (audioContext?.playCorrect) audioContext.playCorrect();
  }

  function renderPendingReceiptTicket() {
    const ticketBox = document.getElementById('paywall-receipt-ticket');
    const detailsEl = document.getElementById('paywall-ticket-details');
    const smsBtn = document.getElementById('paywall-ticket-sms-btn');
    if (!ticketBox || !detailsEl) return;

    const receipt = AMT_AUTH.getPendingReceipt();
    if (!receipt) {
      ticketBox.classList.add('hidden');
      return;
    }

    const settings = AMT_AUTH.getSettings();
    const phone = settings.phoneContact || settings.telebirrNumber || '0907862027';
    detailsEl.innerHTML = `<strong>Student ID:</strong> ${escapeHtml(receipt.studentId)}<br/><strong>Txn Ref:</strong> ${escapeHtml(receipt.txnId)}<br/><strong>Contact:</strong> ${escapeHtml(receipt.phone || 'N/A')} (${receipt.timestamp})`;
    
    if (smsBtn) {
      const smsBody = `Hello! I registered my Telebirr payment in the AMT app.\n\nStudent ID: ${receipt.studentId}\nTxn Ref: ${receipt.txnId}\nContact: ${receipt.phone}\n\nPlease send my 6-digit activation code!`;
      smsBtn.href = `sms:${phone}?body=${encodeURIComponent(smsBody)}`;
    }
    ticketBox.classList.remove('hidden');
  }

  function copyReceiptSummary() {
    const receipt = AMT_AUTH.getPendingReceipt();
    if (!receipt) {
      showToast("No submitted receipt found.", "danger");
      return;
    }
    const text = `📋 AMT Exam App Telebirr Payment Receipt\n👤 Name: ${receipt.name}\n🆔 Student ID: ${receipt.studentId}\n💰 Txn ID: ${receipt.txnId}\n📞 Phone: ${receipt.phone}\n⏳ Status: Pending Verification`;
    copyText(text, "Payment Receipt Summary");
  }

  // Copy username & Student ID specifically to clipboard
  function copyStudentDetails() {
    const nameInput = document.getElementById('paywall-input-name');
    const name = nameInput?.value?.trim() || 'Student';
    const id = AMT_AUTH.generateStudentId(name);
    const settings = AMT_AUTH.getSettings();
    const textToCopy = `👤 Name / Phone: ${name}\n🆔 Student ID: ${id}\n💰 Payment: ${settings.priceBirr} ETB (Telebirr)`;
    copyText(textToCopy, "Student ID & Payment Details");
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
    const draftMessage = `Hello! I made the ${settings.priceBirr} ETB Telebirr payment for the AMT Exam App.\n\n👤 Name / Phone: ${name}\n🆔 Student ID: ${id}\n\nHere is my Telebirr receipt screenshot:`;

    // 1. Copy immediately to clipboard
    copyText(draftMessage, `Student ID (${id})`);

    // 2. Prepare pre-filled draft URL
    const encoded = encodeURIComponent(draftMessage);
    const webUrl = `https://t.me/${cleanUsername}?text=${encoded}`;
    const tgBtn = document.getElementById('paywall-tg-link');
    if (tgBtn) {
      tgBtn.href = webUrl;
    }

    showToast(`📋 Copied "${id}" to clipboard! Opening Telegram DM with @${cleanUsername}...`, "success");
  }

  function submitActivationCode() {
    const check = AMT_AUTH.checkRateLimit('code');
    if (check.locked) {
      audioContext.playIncorrect();
      showToast(`⛔ Please wait ${check.waitSeconds}s before trying another code.`, "danger");
      return;
    }

    const codeInput = document.getElementById('paywall-activation-code-input');
    const nameInput = document.getElementById('paywall-input-name');
    const code = codeInput?.value?.trim();

    if (!code) {
      showToast("Please enter your 6-digit Activation Code", "danger");
      return;
    }

    // Gather all candidate identifiers (input, saved name, pending receipt details)
    const rawVal = nameInput?.value?.trim();
    const savedName = localStorage.getItem('amt_saved_student_name') || '';
    const pending = AMT_AUTH.getPendingReceipt();
    const pendingPhone = pending?.phone || '';
    const pendingName = pending?.name || '';
    const pendingId = pending?.studentId || '';

    const name = rawVal || savedName || pendingPhone || pendingName || 'Student';
    const studentId = AMT_AUTH.generateStudentId(name);
    const extraCandidates = [rawVal, savedName, pendingPhone, pendingName, pendingId, 'Student'];

    const res = AMT_AUTH.activateUser(code, name, studentId, extraCandidates);
    if (res.success) {
      AMT_AUTH.clearRateLimit('code');
      try {
        localStorage.setItem('amt_saved_student_name', name);
      } catch(e) {}
      audioContext.playCorrect();
      showToast("🎉 Full Access Successfully Activated! Welcome!", "success");
      closePaywallModal();
      updateUIAuthBadge();
      renderExamCards();
      if (state.currentTab === 'notes') renderNotesContent();
      if (state.currentExamId) renderCurrentQuestion();
    } else {
      AMT_AUTH.recordRateLimitFailure('code');
      audioContext.playIncorrect();
      const newCheck = AMT_AUTH.checkRateLimit('code');
      if (newCheck.locked) {
        showToast(`⛔ Too many failed attempts. Locked for ${newCheck.waitSeconds}s.`, "danger");
      } else {
        showToast(res.error || "❌ Invalid code. Please check with Admin Support via SMS or Telegram.", "danger");
      }
    }
  }

  // Anti-Intrusion Shield: Block casual source inspection while keeping Admin shortcuts
  window.addEventListener('keydown', (e) => {
    // Hidden Admin Shortcuts: Alt+A or Ctrl+Shift+A
    if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
      e.preventDefault();
      openAdminModal();
      return;
    }

    // Block F12 DevTools
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      return false;
    }

    // Block Ctrl+Shift+I (Inspector), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element Picker)
    if (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) {
      e.preventDefault();
      return false;
    }

    // Block Ctrl+U (View Source)
    if (e.ctrlKey && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      return false;
    }
  }, { capture: true });

  // Deter right-click context menu scraping on exam questions and flashcards
  document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('#exam-view') || e.target.closest('#flashcards-view-container')) {
      e.preventDefault();
    }
  });

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#admin') {
      openAdminModal();
    }
  });

  // ADMIN PORTAL (Streamlined Control Panel)
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

  let adminInactivityTimer = null;
  function resetAdminInactivityTimer() {
    clearTimeout(adminInactivityTimer);
    adminInactivityTimer = setTimeout(() => {
      if (state.adminUnlocked) {
        closeAdminModal();
        showToast("🔒 Admin session locked due to inactivity.", "info");
      }
    }, 15 * 60 * 1000); // 15-minute auto-lock
  }

  function closeAdminModal() {
    document.getElementById('admin-modal').classList.add('hidden');
    state.adminUnlocked = false;
    state.adminSessionToken = null;
    AMT_AUTH.logoutAdmin();
    clearTimeout(adminInactivityTimer);
  }

  function verifyAdminPin() {
    const check = AMT_AUTH.checkRateLimit('admin');
    if (check.locked) {
      audioContext.playIncorrect();
      showToast(`⛔ Locked out! Too many attempts. Try again in ${check.waitSeconds}s`, "danger");
      return;
    }

    const input = document.getElementById('admin-pin-input');
    const pin = input?.value?.trim();

    if (!pin) {
      showToast("Please enter Admin Password", "danger");
      return;
    }

    const authRes = AMT_AUTH.verifyAdminPin(pin);
    if (authRes && authRes.success) {
      AMT_AUTH.clearRateLimit('admin');
      audioContext.playCorrect();
      state.adminUnlocked = true;
      state.adminSessionToken = authRes.token;
      if (input) input.value = '';
      showAdminDashboard();
      resetAdminInactivityTimer();
    } else {
      AMT_AUTH.recordRateLimitFailure('admin');
      audioContext.playIncorrect();
      const newCheck = AMT_AUTH.checkRateLimit('admin');
      if (newCheck.locked) {
        showToast(`⛔ Maximum attempts exceeded. Locked for ${newCheck.waitSeconds}s.`, "danger");
      } else {
        const rl = (AMT_AUTH.recordRateLimitFailure ? null : null);
        showToast(`❌ Incorrect Admin Password. Please try again.`, "danger");
      }
    }
  }

  let lastGeneratedStudentQuery = '';
  let lastGeneratedCodeVal = '';

  function showAdminDashboard() {
    document.getElementById('admin-login-view').classList.add('hidden');
    document.getElementById('admin-dashboard-view').classList.remove('hidden');

    const settings = AMT_AUTH.getSettings();
    document.getElementById('admin-set-telebirr-num').value = settings.telebirrNumber;
    document.getElementById('admin-set-telebirr-name').value = settings.telebirrName || 'AMT Portal';
    const phoneInput = document.getElementById('admin-set-phone');
    if (phoneInput) phoneInput.value = settings.phoneContact || settings.telebirrNumber || '0907862027';
    document.getElementById('admin-set-tg-user').value = settings.telegramUsername;
    document.getElementById('admin-set-price').value = settings.priceBirr;
    const noticeInput = document.getElementById('admin-set-notice');
    if (noticeInput) noticeInput.value = settings.adminNotice || '';
    document.getElementById('admin-set-pin').value = '';
    document.getElementById('admin-set-pin').placeholder = 'Leave blank to keep current PIN';
    const vipInput = document.getElementById('admin-set-vip');
    if (vipInput) {
      vipInput.value = '';
      vipInput.placeholder = 'Leave blank to keep current key';
    }
    document.getElementById('admin-vip-key-display').textContent = AMT_AUTH.VIP_DISPLAY;

    // Update VIP slots status pill
    const vipStatus = AMT_AUTH.getVipSlotsStatus();
    const vipStatusEl = document.getElementById('admin-vip-slots-status');
    if (vipStatusEl) {
      vipStatusEl.innerHTML = '<span>🎟️ Slots: ' + vipStatus.used + ' / ' + vipStatus.max + ' Used</span>';
      vipStatusEl.className = vipStatus.isFull
        ? "px-3 py-1.5 rounded-xl font-mono text-xs font-bold bg-rose-500/20 text-rose-900 dark:text-rose-200 border border-rose-500/30 flex items-center gap-1.5"
        : "px-3 py-1.5 rounded-xl font-mono text-xs font-bold bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30 flex items-center gap-1.5";
    }
  }

  // 1-Click Code Generation for Admin (Guarded with Admin Session Token)
  function adminGenerateCode() {
    if (!state.adminUnlocked || !state.adminSessionToken) {
      showToast("⛔ Admin session expired. Please re-authenticate.", "danger");
      return;
    }

    const input = document.getElementById('admin-student-input');
    const query = input?.value?.trim();
    if (!query) {
      showToast("Please enter the student name or ID", "danger");
      return;
    }

    const code = AMT_AUTH.generateActivationCode(query, state.adminSessionToken);
    if (!code) {
      showToast("⛔ Authorization error generating code. Please log in again.", "danger");
      return;
    }

    lastGeneratedStudentQuery = query;
    lastGeneratedCodeVal = code;

    const resultBox = document.getElementById('admin-generated-code-box');
    const codeDisplay = document.getElementById('admin-generated-code');
    const replyText = document.getElementById('admin-tg-reply-text');

    codeDisplay.textContent = code;
    const currentPrice = AMT_AUTH.getSettings().priceBirr || 250;
    const msg = `✅ Hello ${query}! Your payment of ${currentPrice} ETB is approved.\nYour Activation Code: ${code}\nEnter this code in Step 4 of the app to unlock all 8 exams & 11 study modules permanently.\nGood luck on your AMT exam! ✈️`;
    replyText.value = msg;
    resultBox.classList.remove('hidden');
    audioContext.playCorrect();
    resetAdminInactivityTimer();
  }

  function sendSmsReply() {
    if (!lastGeneratedCodeVal) {
      showToast("Generate a code first.", "danger");
      return;
    }
    const digitsOnly = (lastGeneratedStudentQuery || '').replace(/\D/g, '');
    const targetPhone = (digitsOnly.length >= 9) ? digitsOnly : '';
    const currentPrice = AMT_AUTH.getSettings().priceBirr || 250;
    const msg = `✅ Ethiopian Airlines AMT Exam App Approved!\nActivation Code: ${lastGeneratedCodeVal}\nEnter this in Step 4 of the app to unlock all 361 questions & 11 modules!`;
    window.open(`sms:${targetPhone}?body=${encodeURIComponent(msg)}`);
    showToast("Opening SMS draft...", "success");
  }

  function copyTgReply() {
    const replyText = document.getElementById('admin-tg-reply-text');
    if (!replyText) return;
    navigator.clipboard.writeText(replyText.value);
    audioContext.playClick();
    showToast("📋 Message copied! Now paste it on Telegram.", "success");
  }

  function resetVipSlots() {
    audioContext.playClick();
    AMT_AUTH.resetVipSlots();
    showAdminDashboard();
    showToast("↺ VIP slots reset! 2 new activations available.", "success");
  }

  function saveAdminSettings() {
    const rawPin = document.getElementById('admin-set-pin').value.trim();
    const rawVip = document.getElementById('admin-set-vip')?.value?.trim();
    const phoneInput = document.getElementById('admin-set-phone');
    const noticeInput = document.getElementById('admin-set-notice');

    const newSettings = {
      telebirrNumber: document.getElementById('admin-set-telebirr-num').value.trim(),
      telebirrName: document.getElementById('admin-set-telebirr-name').value.trim() || 'AMT Portal',
      telegramUsername: document.getElementById('admin-set-tg-user').value.trim(),
      priceBirr: parseInt(document.getElementById('admin-set-price').value) || 250
    };
    if (phoneInput && phoneInput.value.trim()) {
      newSettings.phoneContact = phoneInput.value.trim();
    }
    if (noticeInput) {
      newSettings.adminNotice = noticeInput.value.trim();
    }
    if (rawPin) {
      newSettings.adminPin = rawPin;
    }
    if (rawVip) {
      newSettings.vipKey = rawVip;
    }

    AMT_AUTH.saveSettings(newSettings);
    showAdminDashboard();
    audioContext.playCorrect();
    showToast("✅ Settings, Admin Password, Notice & VIP Key saved successfully!", "success");
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
      // Secret Admin Shortcut: Ctrl + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        openAdminModal();
        return;
      }

      if (state.currentTab === 'notes' && state.notesViewMode === 'flashcards') {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'ArrowRight' || e.key === 'n') {
          nextFlashcard();
        } else if (e.key === 'ArrowLeft' || e.key === 'p') {
          prevFlashcard();
        } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault();
          flipCurrentFlashcard();
        }
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
    setNotesViewMode,
    setFlashcardFilter,
    flipCurrentFlashcard,
    nextFlashcard,
    prevFlashcard,
    shuffleFlashcards,
    restartFlashcardsDeck,
    toggleMasterCurrentFlashcard,
    renderFlashcardDeck,
    openPaywallModal,
    closePaywallModal,
    updatePaywallStudentId,
    submitActivationCode,
    openAdminModal,
    closeAdminModal,
    verifyAdminPin,
    adminGenerateCode,
    copyTgReply,
    resetVipSlots,
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
    handleTelegramPaymentClick,
    submitReceiptInApp,
    renderPendingReceiptTicket,
    copyReceiptSummary,
    sendSmsReply
  };

  document.addEventListener('DOMContentLoaded', () => {
    init();
    initPwa();
  });
})();

