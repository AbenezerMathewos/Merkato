// Amharic Calendar and Currency Formatter Test Suite
const assert = require('assert');
const { toEthiopianDate, formatBirr, ETHIOPIC_MONTHS } = require('../backend/utils/amharicFormatter');

function runTests() {
    console.log('🧪 Testing Ethiopian Geez Calendar & Birr Formatter...');
    
    assert(ETHIOPIC_MONTHS.includes('መስከረም'), 'Should contain Meskerem');
    assert.strictEqual(ETHIOPIC_MONTHS.length, 13, 'Ethiopian calendar has 13 months');

    const formattedBirr = formatBirr(2500);
    assert(formattedBirr.includes('ብር'), 'Formatted currency must include Birr symbol');

    const ethDate = toEthiopianDate(new Date('2026-08-30'));
    assert(ethDate.formatted.length > 5, 'Should generate valid formatted Geez date');

    console.log('✅ Amharic formatter tests passed!');
}

module.exports = { runTests };
if (require.main === module) runTests();
