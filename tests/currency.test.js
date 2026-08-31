// Currency Engine Test Suite
const assert = require('assert');

// Mock currency converter logic
const rates = { USD: 1.0, ETB: 125.50, EUR: 0.92, GBP: 0.78 };

function convert(amountETB, targetCurrency) {
    if (targetCurrency === 'ETB') return amountETB;
    const usd = amountETB / rates.ETB;
    return usd * (rates[targetCurrency] || 1.0);
}

function runTests() {
    console.log('🧪 Testing Currency Conversion...');
    
    // 1. Same currency ETB -> ETB
    assert.strictEqual(convert(2500, 'ETB'), 2500, 'ETB to ETB should match exact value');
    
    // 2. ETB to USD
    const usd = convert(2510, 'USD');
    assert.strictEqual(Math.round(usd), 20, '2,510 ETB should equal ~20 USD');

    // 3. Zero check
    assert.strictEqual(convert(0, 'EUR'), 0, '0 ETB should equal 0 EUR');

    console.log('✅ Currency tests passed!');
}

module.exports = { runTests };
if (require.main === module) runTests();
