// Delivery Calculator Test Suite
const assert = require('assert');

const zones = {
    Bole: { fee: 150, freeThreshold: 3000 },
    Hawassa: { fee: 550, freeThreshold: 7500 }
};

function calculateFee(zoneName, subtotal) {
    const zone = zones[zoneName] || zones.Bole;
    return subtotal >= zone.freeThreshold ? 0 : zone.fee;
}

function runTests() {
    console.log('🧪 Testing Delivery Fee Engine...');
    
    assert.strictEqual(calculateFee('Bole', 1500), 150, 'Standard delivery fee for Bole under threshold');
    assert.strictEqual(calculateFee('Bole', 3500), 0, 'Free delivery for Bole above 3,000 ETB');
    assert.strictEqual(calculateFee('Hawassa', 8000), 0, 'Free delivery for Hawassa above threshold');

    console.log('✅ Delivery tests passed!');
}

module.exports = { runTests };
if (require.main === module) runTests();
