// Central Master Test Runner
const currencyTests = require('./currency.test');
const i18nTests = require('./i18n.test');
const deliveryTests = require('./delivery.test');
const amharicTests = require('./amharicFormatter.test');
const receiptTests = require('./receiptGenerator.test');

console.log('====================================================');
console.log('🇪🇹 MERKATO Automated Verification & Test Suite');
console.log('====================================================\n');

try {
    currencyTests.runTests();
    i18nTests.runTests();
    deliveryTests.runTests();
    amharicTests.runTests();
    receiptTests.runTests();
    console.log('\n🎉 ALL MERKATO TEST SUITES COMPLETED WITH 100% SUCCESS!');
} catch (err) {
    console.error('\n❌ Test suite failure:', err.message);
    process.exit(1);
}
