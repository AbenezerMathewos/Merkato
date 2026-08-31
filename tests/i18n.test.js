// i18n Translation Engine Test Suite
const assert = require('assert');

const dict = {
    en: { coffee: 'Coffee', teff: 'Teff', add_to_cart: 'Add to Cart' },
    am: { coffee: 'ቡና', teff: 'ጤፍ', add_to_cart: 'ወደ ጋሪ ጨምር' },
    om: { coffee: 'Buna', teff: 'Xaafii', add_to_cart: 'Gara Gaariitti Dabali' },
    ti: { coffee: 'ቡን', teff: 'ጣፍ', add_to_cart: 'ናብ ዓረብያ ወስኽ' }
};

function translate(lang, key) {
    return (dict[lang] && dict[lang][key]) || dict.en[key] || key;
}

function runTests() {
    console.log('🧪 Testing i18n Engine...');
    
    assert.strictEqual(translate('am', 'coffee'), 'ቡና', 'Amharic translation for coffee should be ቡና');
    assert.strictEqual(translate('om', 'teff'), 'Xaafii', 'Oromo translation for teff should be Xaafii');
    assert.strictEqual(translate('ti', 'coffee'), 'ቡን', 'Tigrinya translation for coffee should be ቡን');
    assert.strictEqual(translate('fr', 'coffee'), 'Coffee', 'Fallback to English when language missing');

    console.log('✅ i18n tests passed!');
}

module.exports = { runTests };
if (require.main === module) runTests();
