// Receipt Generator Test Suite
const assert = require('assert');
const { generateHTMLReceipt } = require('../backend/utils/receiptGenerator');

function runTests() {
    console.log('🧪 Testing Ethiopian Tax Invoice Generator...');

    const sampleOrder = {
        id: 1042,
        customerName: 'Abebe Bikila',
        customerPhone: '+251911223344',
        address: 'Bole, Addis Ababa',
        items: [
            { name: 'Yirgacheffe Buna', price: 2500, quantity: 2 }
        ],
        subtotal: 5000,
        deliveryFee: 150
    };

    const html = generateHTMLReceipt(sampleOrder);
    assert(html.includes('TAX INVOICE'), 'Generated receipt must have TAX INVOICE header');
    assert(html.includes('TIN: 0048921847'), 'Generated receipt must have TIN number');
    assert(html.includes('VAT (15%)'), 'Generated receipt must calculate 15% VAT');
    assert(html.includes('Abebe Bikila'), 'Generated receipt must include customer name');

    console.log('✅ Receipt generator tests passed!');
}

module.exports = { runTests };
if (require.main === module) runTests();
