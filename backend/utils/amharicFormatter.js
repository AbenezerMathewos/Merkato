// Ethiopian Geez Calendar Converter & Currency Formatter
const ETHIOPIC_MONTHS = [
    'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት',
    'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'
];

function toEthiopianDate(gregorianDate = new Date()) {
    const d = new Date(gregorianDate);
    const grYear = d.getFullYear();
    const grMonth = d.getMonth() + 1; // 1-12
    const grDay = d.getDate();

    // Simplified conversion approximation for 2026/2018 E.C.
    let ethYear = grYear - 8;
    if (grMonth < 9 || (grMonth === 9 && grDay < 11)) {
        ethYear = grYear - 8;
    }

    let ethMonthIndex = (grMonth + 3) % 12;
    let ethDay = grDay;

    return {
        year: ethYear,
        monthIndex: ethMonthIndex,
        monthName: ETHIOPIC_MONTHS[ethMonthIndex] || 'መስከረም',
        day: ethDay,
        formatted: `${ETHIOPIC_MONTHS[ethMonthIndex]} ${ethDay} ቀን ${ethYear} ዓ.ም.`
    };
}

function formatBirr(amount) {
    const num = parseFloat(amount) || 0;
    return `${num.toLocaleString('en-US', { minimumFractionDigits: 2 })} ብር`;
}

module.exports = { toEthiopianDate, formatBirr, ETHIOPIC_MONTHS };
