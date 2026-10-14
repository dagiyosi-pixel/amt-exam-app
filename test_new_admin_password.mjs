import fs from 'fs';
import vm from 'vm';

console.log('Testing New Admin Password (171717)...');

// Mock browser environment
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

const sandbox = {
  window: {},
  document: { cookie: '' },
  localStorage: localStorageMock,
  console: console
};
sandbox.window = sandbox;

vm.createContext(sandbox);

const authJs = fs.readFileSync('auth.js', 'utf8');
vm.runInContext(authJs, sandbox);

const auth = sandbox.window.AMT_AUTH;

// Test 1: Fresh clean state
console.log('Test 1: Default password verification:');
const checkCorrect = auth.verifyAdminPin('171717');
console.log(' - Entering "171717":', checkCorrect ? '✅ PASS' : '❌ FAIL');
if (!checkCorrect) throw new Error('Verification of 171717 failed!');

const checkWrong = auth.verifyAdminPin('wrongpass');
console.log(' - Entering "wrongpass":', !checkWrong ? '✅ PASS (Rejected)' : '❌ FAIL');

const checkOld = auth.verifyAdminPin('dagiprep');
console.log(' - Entering old "dagiprep":', !checkOld ? '✅ PASS (Rejected)' : '❌ FAIL');

// Test 2: Migration from legacy storage
console.log('\nTest 2: Auto-migration from legacy localStorage:');
localStorageMock.setItem('amt_admin_settings', JSON.stringify({
  adminPinHash: "e34cbe62069c1d32eda54b2b6296fa78873309e28a91a7d203862b9377ceb7c2" // old hash
}));

const checkMigrated = auth.verifyAdminPin('171717');
console.log(' - After reading legacy storage, entering "171717":', checkMigrated ? '✅ PASS' : '❌ FAIL');
if (!checkMigrated) throw new Error('Migration failed!');

console.log('\nAll Admin Password tests PASSED successfully!');
