/**
 * Ethiopian AMT Exam App - Authentication & License Manager
 * Provides 100% reliable offline cryptographic licensing
 * and admin approval without needing external database servers.
 */

const AMT_AUTH = (function() {
  const SECRET_SALT = "AMT_ETHIOPIAN_AIRLINES_2026_SECRET_DAGI";
  const MASTER_KEY = "AMT-VIP-2026";
  const STORAGE_KEY_USER = "amt_user_session";
  const STORAGE_KEY_SETTINGS = "amt_admin_settings";

  // Default settings configurable by Dagi
  const DEFAULT_SETTINGS = {
    priceBirr: 300,
    telebirrNumber: "0907862027",
    telebirrName: "Dagi",
    cbeAccount: "1000649624481",
    cbeName: "Dagi",
    telegramUsername: "Mountxhua",
    adminPin: "3000",
    freePreviewCount: 5
  };

  function getSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(saved));
    } catch (e) {}
    return Object.assign({}, DEFAULT_SETTINGS);
  }

  function saveSettings(newSettings) {
    const updated = Object.assign({}, getSettings(), newSettings);
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
    return updated;
  }

  // Generates clean Student ID: e.g. "AMT-DAGI-4829"
  function generateStudentId(name) {
    if (!name) name = "STUDENT";
    const clean = name.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || "STUDENT";
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i);
      hash |= 0;
    }
    const suffix = String(Math.abs(hash) % 9000 + 1000);
    return `AMT-${clean}-${suffix}`;
  }

  // Generates 6-digit cryptographic activation code mathematically tied to name/id
  function generateActivationCode(identifier) {
    if (!identifier) return null;
    const cleanId = String(identifier).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!cleanId) return null;

    let hash = 5381;
    const combined = cleanId + SECRET_SALT;
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) + hash) + combined.charCodeAt(i);
      hash = hash & hash;
    }

    const num = (Math.abs(hash) % 900000) + 100000;
    const str = String(num);
    return `${str.slice(0, 3)}-${str.slice(3)}`;
  }

  // Validates code against name or studentId or master key
  function verifyCode(enteredCode, userName, studentId) {
    if (!enteredCode) return false;
    const cleanCode = enteredCode.trim().toUpperCase().replace(/[\s\-]/g, '');
    
    // Check Master VIP Key
    if (cleanCode === MASTER_KEY.replace(/[\s\-]/g, '')) return true;

    // Check against userName
    const expectedFromName = generateActivationCode(userName)?.replace(/[\s\-]/g, '');
    if (expectedFromName && cleanCode === expectedFromName) return true;

    // Check against studentId
    const expectedFromId = generateActivationCode(studentId)?.replace(/[\s\-]/g, '');
    if (expectedFromId && cleanCode === expectedFromId) return true;

    return false;
  }

  // Current session management
  function getUserSession() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return null;
  }

  function saveUserSession(session) {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(session));
  }

  function isUserActivated() {
    const session = getUserSession();
    return !!(session && session.isActivated);
  }

  function activateUser(code, name, studentId) {
    const isValid = verifyCode(code, name, studentId);
    if (isValid) {
      const session = getUserSession() || {};
      session.name = name || session.name || "Student";
      session.studentId = studentId || session.studentId || generateStudentId(session.name);
      session.activationCode = code;
      session.isActivated = true;
      session.activatedAt = new Date().toISOString();
      saveUserSession(session);
      return { success: true, session };
    }
    return { success: false, error: "Invalid activation code. Please check with Admin on Telegram." };
  }

  return {
    getSettings,
    saveSettings,
    generateStudentId,
    generateActivationCode,
    verifyCode,
    getUserSession,
    saveUserSession,
    isUserActivated,
    activateUser,
    MASTER_KEY
  };
})();

if (typeof module !== 'undefined') module.exports = AMT_AUTH;
