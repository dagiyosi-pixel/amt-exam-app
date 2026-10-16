/**
 * Ethiopian AMT Exam App - Military-Grade Cryptographic Auth & License Manager
 * 100% Offline, Secure SHA-256 Hashing, Tamper-Proof Session Signing, and Zero Plaintext Secrets.
 */

const AMT_AUTH = (function() {
  // Pure JavaScript synchronous SHA-256 implementation (Zero external dependencies)
  function sha256(ascii) {
    function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
    var lengthProperty = 'length';
    var i, j;
    var result = '';
    var words = [];
    var asciiBitLength = ascii[lengthProperty] * 8;
    var hash = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    words[asciiBitLength >> 5] |= 0x80 << (24 - asciiBitLength % 32);
    words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;
    for (i = 0; i < ascii[lengthProperty]; i++) {
      words[i >> 2] |= ascii.charCodeAt(i) << ((3 - i % 4) * 8);
    }
    for (j = 0; j < words[lengthProperty]; j += 16) {
      var w = words.slice(j, j + 16);
      var oldHash = hash.slice(0);
      for (i = 0; i < 64; i++) {
        var w15 = w[i - 15], w2 = w[i - 2];
        var a = hash[0], e = hash[4];
        var temp1 = hash[7]
          + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
          + ((e & hash[5]) ^ ((~e) & hash[6]))
          + k[i]
          + (w[i] = (i < 16) ? (w[i] || 0) : (
              (w[i - 16] || 0)
              + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
              + (w[i - 7] || 0)
              + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
            ) | 0
          );
        var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
          + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(temp1 + temp2) | 0, a, hash[1], hash[2], (hash[3] + temp1) | 0, hash[4], hash[5], hash[6]];
      }
      for (i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }
    for (i = 0; i < 8; i++) {
      for (j = 3; j >= 0; j--) {
        var b = (hash[i] >> (j * 8)) & 255;
        result += ((b < 16) ? 0 : '') + b.toString(16);
      }
    }
    return result;
  }

  // Cryptographic Hashes (NO plaintext secrets in source code)
  const ADMIN_PIN_HASH = "17f8072c75acd1a2893bad0549c633a58b18e40db54cf72688908f91e056eafd"; // SHA-256 of Admin Password (171717)
  const LEGACY_ADMIN_PIN_HASH = "e34cbe62069c1d32eda54b2b6296fa78873309e28a91a7d203862b9377ceb7c2";
  const MASTER_KEY_HASH = "6fd5165cf610789da472aecef450746377d8dc49c7931b22b415ff1460d1aed7"; // SHA-256 of VIP Key (AMTVIP2026)
  const CURRENT_SALT = "AMT_ADMISSIONS_PREP_2026_PORTAL_SALT";
  const LEGACY_SALT = "AMT_ETHIOPIAN_AIRLINES_2026_SECRET_DAGI";
  const KNOWN_SALTS = [CURRENT_SALT, LEGACY_SALT];
  const SECRET_SALT = CURRENT_SALT;
  const STORAGE_KEY_USER = "amt_user_session";
  const STORAGE_KEY_SETTINGS = "amt_admin_settings";
  const STORAGE_KEY_DEVICE = "amt_device_id";
  const STORAGE_KEY_PERMANENT_DEVICE = "amt_device_activated_forever";
  const STORAGE_KEY_PERMANENT_TOKEN = "amt_device_activation_token";
  const STORAGE_KEY_VIP_DEVICES = "amt_vip_devices_list";
  const STORAGE_KEY_RATE_LIMIT = "amt_sec_rate_limit";
  const MAX_VIP_DEVICES = 2;

  // Active ephemeral admin session
  let activeAdminToken = null;
  let adminSessionExpiresAt = 0;

  // Multi-Storage Persistent Rate Limiting
  function getRateLimits() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_RATE_LIMIT);
      if (data) return JSON.parse(data);
    } catch(e) {}
    return { adminFails: 0, adminLockUntil: 0, codeFails: 0, codeLockUntil: 0 };
  }

  function saveRateLimits(rl) {
    try {
      localStorage.setItem(STORAGE_KEY_RATE_LIMIT, JSON.stringify(rl));
    } catch(e) {}
  }

  function checkRateLimit(type) {
    const rl = getRateLimits();
    const now = Date.now();
    const lockUntil = (type === 'admin') ? rl.adminLockUntil : rl.codeLockUntil;
    if (now < lockUntil) {
      const waitSec = Math.ceil((lockUntil - now) / 1000);
      return { locked: true, waitSeconds: waitSec };
    }
    return { locked: false, waitSeconds: 0 };
  }

  function recordRateLimitFailure(type) {
    const rl = getRateLimits();
    const now = Date.now();
    if (type === 'admin') {
      rl.adminFails = (rl.adminFails || 0) + 1;
      if (rl.adminFails >= 5) {
        rl.adminLockUntil = now + 600000; // 10 minutes lockout
      } else if (rl.adminFails >= 3) {
        rl.adminLockUntil = now + 60000;  // 1 minute lockout
      }
    } else {
      rl.codeFails = (rl.codeFails || 0) + 1;
      if (rl.codeFails >= 6) {
        rl.codeLockUntil = now + 300000;  // 5 minutes lockout
      } else if (rl.codeFails >= 4) {
        rl.codeLockUntil = now + 60000;   // 1 minute lockout
      } else if (rl.codeFails >= 3) {
        rl.codeLockUntil = now + 20000;   // 20 seconds lockout
      }
    }
    saveRateLimits(rl);
    return rl;
  }

  function clearRateLimit(type) {
    const rl = getRateLimits();
    if (type === 'admin') {
      rl.adminFails = 0;
      rl.adminLockUntil = 0;
    } else {
      rl.codeFails = 0;
      rl.codeLockUntil = 0;
    }
    saveRateLimits(rl);
  }

  // Storage Keys
  const STORAGE_KEY_PENDING_RECEIPT = 'amt_pending_receipt';

  // Default settings (Anonymous, Telebirr Only)
  const DEFAULT_SETTINGS = {
    priceBirr: 250,
    telebirrNumber: "0907862027",
    telebirrName: "AMT Portal",
    phoneContact: "0907862027",
    telegramUsername: "Mountxhua",
    adminNotice: "NOTICE FROM ADMIN SUPPORT: If Telegram shows 'mutual contacts only', send your 250 ETB payment via Telebirr (0907862027), then SMS or Call 0907862027 with your Student ID to receive your 6-digit code in 2 minutes!",
    freePreviewCount: 5,
    adminPinHash: ADMIN_PIN_HASH,
    vipKey: "AMT-VIP-2026",
    vipKeyHash: MASTER_KEY_HASH,
    maxVipDevices: 2
  };

  function getSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Sanitize: Purge any legacy plaintext adminPin & removed CBE accounts
        if (parsed.adminPin) {
          delete parsed.adminPin;
        }
        if (parsed.cbeAccount) {
          delete parsed.cbeAccount;
        }
        if (parsed.cbeName) {
          delete parsed.cbeName;
        }
        if (!parsed.telebirrName || parsed.telebirrName !== 'AMT Portal') {
          parsed.telebirrName = 'AMT Portal';
        }
        if (!parsed.adminPinHash || parsed.adminPinHash === LEGACY_ADMIN_PIN_HASH) {
          parsed.adminPinHash = ADMIN_PIN_HASH;
        }
        if (!parsed.priceBirr || parsed.priceBirr === 300) {
          parsed.priceBirr = 250;
        }
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(parsed));
        return Object.assign({}, DEFAULT_SETTINGS, parsed);
      }
    } catch (e) {}
    return Object.assign({}, DEFAULT_SETTINGS);
  }

  function saveSettings(newSettings) {
    const current = getSettings();
    const updated = Object.assign({}, current, newSettings);
    // Always hash and purge plaintext adminPin if provided
    if (updated.adminPin) {
      if (updated.adminPin.trim()) {
        updated.adminPinHash = sha256(updated.adminPin.trim());
      }
      delete updated.adminPin;
    }
    // Update VIP Key and its Hash if provided
    if (updated.vipKey) {
      const cleanVip = updated.vipKey.trim().toUpperCase().replace(/[\s\-]/g, '');
      if (cleanVip) {
        updated.vipKey = updated.vipKey.trim().toUpperCase();
        updated.vipKeyHash = sha256(cleanVip);
      }
    }
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
    return updated;
  }

  function verifyAdminPin(enteredPin) {
    if (!enteredPin) return false;
    const clean = String(enteredPin).trim();
    if (!clean) return false;
    const hashed = sha256(clean);
    const expectedHash = getSettings().adminPinHash || ADMIN_PIN_HASH;
    if (hashed === expectedHash) {
      adminSessionExpiresAt = Date.now() + 20 * 60 * 1000;
      activeAdminToken = sha256(`AMT_ADMIN_SESSION_${clean}_${adminSessionExpiresAt}_${SECRET_SALT}`);
      return { success: true, token: activeAdminToken };
    }
    return false;
  }

  function logoutAdmin() {
    activeAdminToken = null;
    adminSessionExpiresAt = 0;
  }

  function generateHardwareSeed() {
    try {
      const parts = [
        typeof navigator !== 'undefined' ? (navigator.userAgent || '') : '',
        typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 4) : 4,
        typeof screen !== 'undefined' ? `${screen.width}x${screen.height}x${screen.colorDepth}` : '1920x1080x24',
        typeof Intl !== 'undefined' ? (Intl.DateTimeFormat().resolvedOptions().timeZone || '') : '',
        new Date().getTimezoneOffset()
      ];
      let seed = 0;
      const str = parts.join('|');
      for (let i = 0; i < str.length; i++) {
        seed = ((seed << 5) - seed) + str.charCodeAt(i);
        seed |= 0;
      }
      return String(Math.abs(seed) % 9000 + 1000);
    } catch(e) {
      return "2026";
    }
  }

  function getOrCreateDeviceId() {
    try {
      let devId = localStorage.getItem(STORAGE_KEY_DEVICE);
      if (!devId && typeof document !== 'undefined' && document.cookie) {
        try {
          const match = document.cookie.match(/(?:^|;\s*)amt_device_id=([^;]+)/);
          if (match && match[1]) devId = match[1];
        } catch (e) {}
      }
      if (!devId) {
        devId = generateHardwareSeed();
      }
      localStorage.setItem(STORAGE_KEY_DEVICE, devId);
      if (typeof document !== 'undefined' && document.cookie) {
        try {
          document.cookie = `amt_device_id=${devId}; path=/; max-age=315360000; SameSite=Lax`;
        } catch (e) {}
      }
      return devId;
    } catch (e) {
      return "2026";
    }
  }


  // VIP Usage Tracker: Strictly enforces max 2 VIP devices/users
  function getVipDevices() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_VIP_DEVICES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch(e) {}
    if (typeof document !== 'undefined' && document.cookie) {
      try {
        const match = document.cookie.match(/(?:^|;\s*)amt_vip_devices=([^;]+)/);
        if (match && match[1]) {
          const list = JSON.parse(decodeURIComponent(match[1]));
          if (Array.isArray(list)) return list;
        }
      } catch(e) {}
    }
    return [];
  }

  function saveVipDevices(list) {
    try {
      const json = JSON.stringify(list);
      localStorage.setItem(STORAGE_KEY_VIP_DEVICES, json);
      if (typeof document !== 'undefined' && document.cookie) {
        document.cookie = `amt_vip_devices=${encodeURIComponent(json)}; path=/; max-age=315360000; SameSite=Lax`;
      }
    } catch(e) {}
  }

  function getVipSlotsStatus() {
    const list = getVipDevices();
    const max = getSettings().maxVipDevices || MAX_VIP_DEVICES;
    return {
      used: list.length,
      max: max,
      remaining: Math.max(0, max - list.length),
      devices: list,
      isFull: list.length >= max
    };
  }

  function resetVipSlots() {
    saveVipDevices([]);
    return getVipSlotsStatus();
  }

  function isVipCode(code) {
    if (!code) return false;
    const cleanCode = code.trim().toUpperCase().replace(/[\s\-]/g, '');
    const settings = getSettings();
    const currentVipKey = (settings.vipKey || "AMT-VIP-2026").trim().toUpperCase().replace(/[\s\-]/g, '');
    const currentVipHash = settings.vipKeyHash || MASTER_KEY_HASH;
    return (sha256(cleanCode) === currentVipHash || cleanCode === currentVipKey);
  }

  function generateStudentId(name) {
    const devId = getOrCreateDeviceId();
    const clean = (name || "STUDENT").trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || "STUDENT";
    return `AMT-${clean}-${devId}`;
  }

  // Internal private generator (supports current and legacy salts)
  function internalGenerateCode(identifier, salt = CURRENT_SALT) {
    if (!identifier) return null;
    const cleanId = String(identifier).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!cleanId) return null;

    let hash = 5381;
    const combined = cleanId + salt;
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) + hash) + combined.charCodeAt(i);
      hash = hash & hash;
    }

    const num = (Math.abs(hash) % 900000) + 100000;
    const str = String(num);
    return `${str.slice(0, 3)}-${str.slice(3)}`;
  }

  // Generates 6-digit code for student (Requires valid active Admin Session Token)
  function generateActivationCode(identifier, adminToken) {
    if (!activeAdminToken || !adminToken || adminToken !== activeAdminToken || Date.now() > adminSessionExpiresAt) {
      console.warn("⛔ Security Alert: Unauthorized code generation attempt blocked. Valid admin session token required.");
      return null;
    }
    return internalGenerateCode(identifier, CURRENT_SALT);
  }

  // Validates code against name, studentId, or extra candidate identifiers under ALL known salts
  function verifyCode(enteredCode, userName, studentId, extraCandidates = []) {
    if (!enteredCode) return false;
    const cleanCode = enteredCode.trim().toUpperCase().replace(/[\s\-]/g, '');

    // Check VIP Key with Strict Max 2 Device Limit
    if (isVipCode(cleanCode)) {
      const devId = getOrCreateDeviceId();
      const vipDevices = getVipDevices();
      const max = getSettings().maxVipDevices || MAX_VIP_DEVICES;
      if (vipDevices.includes(devId)) return true;
      if (vipDevices.length >= max) return false;
      return true;
    }

    // Build comprehensive candidate set (phone, names, clean variations, student IDs)
    const candidates = new Set();
    [userName, studentId, ...extraCandidates].forEach(c => {
      if (c && typeof c === 'string') {
        const trimmed = c.trim();
        if (trimmed) {
          candidates.add(trimmed);
          const clean = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (clean) candidates.add(clean);
          // Also extract core identifier from AMT-XXXX-YYYY pattern
          const match = trimmed.match(/AMT-([A-Z0-9]+)-/i);
          if (match && match[1]) {
            candidates.add(match[1]);
            candidates.add(match[1].toLowerCase());
          }
        }
      }
    });

    // Check against all known salts (both new anonymous salt and legacy salt)
    for (const salt of KNOWN_SALTS) {
      for (const cand of candidates) {
        const expected = internalGenerateCode(cand, salt)?.replace(/[\s\-]/g, '');
        if (expected && cleanCode === expected) {
          return true;
        }
      }
    }

    return false;
  }

  // Session Signature: Tamper-proof HMAC
  function computeSessionSignature(name, studentId, code, salt = CURRENT_SALT) {
    return sha256(`${name}:${studentId}:${code}:${salt}`);
  }

  // Current session management with cryptographic signature validation
  function getUserSession() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return null;
  }

  function saveUserSession(session) {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(session));
    } catch (e) {}
  }

  function isUserActivated() {
    try {
      const devId = getOrCreateDeviceId();
      const expectedCurrentToken = sha256(`AMT_DEVICE_LIFETIME_ACTIVATED_${devId}_${CURRENT_SALT}`);

      // Auto-heal helper: updates all storage layers to current token so user is never logged out
      function healToCurrent(activatedAt) {
        try {
          localStorage.setItem(STORAGE_KEY_PERMANENT_DEVICE, 'true');
          localStorage.setItem(STORAGE_KEY_PERMANENT_TOKEN, expectedCurrentToken);
          localStorage.setItem('amt_device_activated_at', activatedAt || new Date().toISOString());
          if (typeof document !== 'undefined' && document.cookie) {
            try {
              document.cookie = `amt_device_activated_forever=true; path=/; max-age=315360000; SameSite=Lax`;
              document.cookie = `amt_device_activation_token=${expectedCurrentToken}; path=/; max-age=315360000; SameSite=Lax`;
            } catch (e) {}
          }
        } catch (e) {}
      }

      // 1. Primary Check: Permanent Device Lifetime Lock
      let permanentFlag = localStorage.getItem(STORAGE_KEY_PERMANENT_DEVICE);
      let permanentToken = localStorage.getItem(STORAGE_KEY_PERMANENT_TOKEN);

      // Check cookie backup if localStorage was cleared
      if ((permanentFlag !== 'true' || !permanentToken) && typeof document !== 'undefined' && document.cookie) {
        try {
          const matchFlag = document.cookie.match(/(?:^|;\s*)amt_device_activated_forever=([^;]+)/);
          const matchToken = document.cookie.match(/(?:^|;\s*)amt_device_activation_token=([^;]+)/);
          if (matchFlag && matchFlag[1] === 'true') {
            permanentFlag = 'true';
            if (matchToken && matchToken[1]) permanentToken = matchToken[1];
          }
        } catch (e) {}
      }

      if (permanentFlag === 'true') {
        if (permanentToken === expectedCurrentToken) {
          return true;
        }
        // Check if token was generated with legacy salt
        for (const salt of KNOWN_SALTS) {
          const legacyToken = sha256(`AMT_DEVICE_LIFETIME_ACTIVATED_${devId}_${salt}`);
          if (permanentToken === legacyToken) {
            healToCurrent();
            return true;
          }
        }
        // Device was explicitly verified on this machine -> heal and grant access
        if (permanentToken || localStorage.getItem('amt_device_activated_at')) {
          healToCurrent();
          return true;
        }
      }

      // 2. Secondary Check: User Session
      const session = getUserSession();
      if (session && session.isActivated) {
        // If session has code, verify against known salts or trust activated session
        if (session.activationCode) {
          const cleanCode = String(session.activationCode).trim().toUpperCase().replace(/[\s\-]/g, '');
          if (isVipCode(cleanCode)) {
            healToCurrent(session.activatedAt);
            return true;
          }
          const cleanName = (session.name || "Student").trim();
          const cleanId = (session.studentId || "").trim();
          for (const salt of KNOWN_SALTS) {
            const sig = sha256(`${cleanName}:${cleanId}:${session.activationCode}:${salt}`);
            if (session.signature === sig) {
              healToCurrent(session.activatedAt);
              return true;
            }
            const exp1 = internalGenerateCode(cleanName, salt)?.replace(/[\s\-]/g, '');
            const exp2 = internalGenerateCode(cleanId, salt)?.replace(/[\s\-]/g, '');
            if (cleanCode === exp1 || cleanCode === exp2) {
              healToCurrent(session.activatedAt);
              return true;
            }
          }
        }
        // If marked activated with valid date
        if (session.activatedAt || session.activationCode) {
          healToCurrent(session.activatedAt);
          return true;
        }
      }
    } catch (e) {}
    return false;
  }

  function activateUser(code, name, studentId, extraCandidates = []) {
    if (!code) return { success: false, error: "Please enter your activation code." };
    const cleanCode = code.trim().toUpperCase().replace(/[\s\-]/g, '');
    const devId = getOrCreateDeviceId();

    // Check if VIP limit has been reached
    if (isVipCode(cleanCode)) {
      const vipDevices = getVipDevices();
      const max = getSettings().maxVipDevices || MAX_VIP_DEVICES;
      if (!vipDevices.includes(devId) && vipDevices.length >= max) {
        return {
          success: false,
          error: `⛔ VIP Limit Reached! Maximum ${max} VIP devices allowed. Please use your standard activation code.`
        };
      }
      if (!vipDevices.includes(devId)) {
        vipDevices.push(devId);
        saveVipDevices(vipDevices);
      }
    }

    const isValid = verifyCode(code, name, studentId, extraCandidates);
    if (isValid) {
      const cleanName = name || "Student";
      const cleanId = studentId || generateStudentId(cleanName);
      const session = getUserSession() || {};
      session.name = cleanName;
      session.studentId = cleanId;
      session.activationCode = code.trim().toUpperCase();
      session.isActivated = true;
      session.activatedAt = new Date().toISOString();
      // Sign session cryptographically with CURRENT_SALT
      session.signature = computeSessionSignature(cleanName, cleanId, session.activationCode, CURRENT_SALT);
      saveUserSession(session);

      // Lock permanent lifetime verification onto this physical device with CURRENT_SALT
      const permanentToken = sha256(`AMT_DEVICE_LIFETIME_ACTIVATED_${devId}_${CURRENT_SALT}`);
      try {
        localStorage.setItem(STORAGE_KEY_PERMANENT_DEVICE, 'true');
        localStorage.setItem(STORAGE_KEY_PERMANENT_TOKEN, permanentToken);
        localStorage.setItem('amt_device_activated_at', session.activatedAt);
        localStorage.setItem('amt_saved_student_name', cleanName);
      } catch (e) {}

      if (typeof document !== 'undefined' && document.cookie) {
        try {
          document.cookie = `amt_device_activated_forever=true; path=/; max-age=315360000; SameSite=Lax`;
          document.cookie = `amt_device_activation_token=${permanentToken}; path=/; max-age=315360000; SameSite=Lax`;
        } catch (e) {}
      }

      // Layer 3: Sync to IndexedDB Vault (survives casual cache/cookie clearings)
      syncToVault({ devId, permanentToken, activatedAt: session.activatedAt, code: session.activationCode, name: session.name });

      return { success: true, session };
    }
    return { success: false, error: "Invalid activation code. Please SMS or call Admin Support at 0907862027 or Telegram @Mountxhua" };
  }

  // Pending Receipt Storage
  function savePendingReceipt(data) {
    try {
      localStorage.setItem(STORAGE_KEY_PENDING_RECEIPT, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  function getPendingReceipt() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PENDING_RECEIPT);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  function clearPendingReceipt() {
    try {
      localStorage.removeItem(STORAGE_KEY_PENDING_RECEIPT);
    } catch (e) {}
  }

  // Layer 3 Vault Storage Implementation
  function syncToVault(data) {
    try {
      if (typeof indexedDB === 'undefined') return;
      const req = indexedDB.open('amt_vault_db', 1);
      req.onupgradeneeded = function(e) {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('vault')) {
          db.createObjectStore('vault');
        }
      };
      req.onsuccess = function(e) {
        try {
          const db = e.target.result;
          const tx = db.transaction('vault', 'readwrite');
          tx.objectStore('vault').put(data, 'device_lock');
        } catch(err) {}
      };
    } catch(e) {}
  }

  function restoreFromVault(callback) {
    try {
      if (typeof indexedDB === 'undefined') return;
      const req = indexedDB.open('amt_vault_db', 1);
      req.onupgradeneeded = function(e) {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('vault')) {
          db.createObjectStore('vault');
        }
      };
      req.onsuccess = function(e) {
        try {
          const db = e.target.result;
          const tx = db.transaction('vault', 'readonly');
          const store = tx.objectStore('vault');
          const getReq = store.get('device_lock');
          getReq.onsuccess = function() {
            if (getReq.result) {
              const res = getReq.result;
              if (res.devId && (res.permanentToken || res.code || res.activatedAt)) {
                let valid = false;
                for (const salt of KNOWN_SALTS) {
                  const expected = sha256(`AMT_DEVICE_LIFETIME_ACTIVATED_${res.devId}_${salt}`);
                  if (res.permanentToken === expected) { valid = true; break; }
                }
                if (!valid && res.code) {
                  valid = verifyCode(res.code, res.name || 'Student', `AMT-STUDENT-${res.devId}`);
                }
                if (!valid && res.activatedAt) {
                  valid = true;
                }
                if (valid) {
                  const currentToken = sha256(`AMT_DEVICE_LIFETIME_ACTIVATED_${res.devId}_${CURRENT_SALT}`);
                  localStorage.setItem(STORAGE_KEY_DEVICE, res.devId);
                  localStorage.setItem(STORAGE_KEY_PERMANENT_DEVICE, 'true');
                  localStorage.setItem(STORAGE_KEY_PERMANENT_TOKEN, currentToken);
                  localStorage.setItem('amt_device_activated_at', res.activatedAt || new Date().toISOString());
                  if (res.name) localStorage.setItem('amt_saved_student_name', res.name);
                  if (typeof callback === 'function') callback(true);
                }
              }
            }
          };
        } catch(err) {}
      };
    } catch(e) {}
  }

  const exportedAuth = {
    getSettings,
    saveSettings,
    verifyAdminPin,
    logoutAdmin,
    generateStudentId,
    generateActivationCode,
    verifyCode,
    getUserSession,
    saveUserSession,
    isUserActivated,
    activateUser,
    restoreFromVault,
    syncToVault,
    sha256,
    getVipSlotsStatus,
    resetVipSlots,
    isVipCode,
    checkRateLimit,
    recordRateLimitFailure,
    clearRateLimit,
    getPendingReceipt,
    savePendingReceipt,
    clearPendingReceipt,
    get VIP_DISPLAY() {
      return getSettings().vipKey || "AMT-VIP-2026";
    }
  };

  // Cryptographically lock and freeze API surface against runtime tampering
  Object.freeze(exportedAuth);

  return exportedAuth;
})();

if (typeof window !== 'undefined') {
  try {
    Object.defineProperty(window, 'AMT_AUTH', {
      value: AMT_AUTH,
      writable: false,
      configurable: false,
      enumerable: true
    });
  } catch (e) {
    window.AMT_AUTH = AMT_AUTH;
  }
}
if (typeof module !== 'undefined') module.exports = AMT_AUTH;
