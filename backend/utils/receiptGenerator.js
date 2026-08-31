// Ethiopian Tax-Compliant Receipt & Invoice Generator (HTML / Text)
function generateHTMLReceipt(order) {
    const itemsHtml = (order.items || []).map(item => `
        <tr>
            <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity || 1}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${(item.price || 0).toLocaleString()} ETB</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${((item.price || 0) * (item.quantity || 1)).toLocaleString()} ETB</td>
        </tr>
    `).join('');

    const subtotal = order.subtotal || 0;
    const vat = Math.round(subtotal * 0.15); // 15% Ethiopian VAT
    const delivery = order.deliveryFee || 0;
    const total = subtotal + vat + delivery;

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>MERKATO Tax Invoice #${order.id}</title>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #333; }
            .header { border-bottom: 3px solid #0a5c36; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; }
            .brand { color: #0a5c36; font-size: 26px; font-weight: bold; }
            .tin { font-size: 12px; color: #666; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #0a5c36; color: #fff; padding: 10px 8px; text-align: left; }
            .summary { width: 300px; margin-left: auto; }
            .summary td { padding: 6px; }
        </style>
    </head>
    <body>
        <div class="header">
            <div>
                <div class="brand">MERKATO ሱፐርማርኬት</div>
                <div class="tin">TIN: 0048921847 | VAT Reg No: 1290384</div>
                <div>Addis Ababa, Bole Sub-City, Ethiopia</div>
            </div>
            <div style="text-align:right;">
                <h2>TAX INVOICE</h2>
                <div>Invoice #: MKT-${order.id}</div>
                <div>Date: ${new Date().toLocaleDateString('en-GB')}</div>
            </div>
        </div>
        <div>
            <strong>Bill To:</strong> ${order.customerName || 'Customer'}<br>
            <strong>Phone:</strong> ${order.customerPhone || 'N/A'}<br>
            <strong>Delivery Address:</strong> ${order.address || 'Addis Ababa'}
        </div>
        <table>
            <thead>
                <tr>
                    <th>Item Description</th>
                    <th style="text-align:center;">Qty</th>
                    <th style="text-align:right;">Unit Price</th>
                    <th style="text-align:right;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
        </table>
        <table class="summary">
            <tr><td>Subtotal:</td><td style="text-align:right;">${subtotal.toLocaleString()} ETB</td></tr>
            <tr><td>VAT (15%):</td><td style="text-align:right;">${vat.toLocaleString()} ETB</td></tr>
            <tr><td>Delivery:</td><td style="text-align:right;">${delivery.toLocaleString()} ETB</td></tr>
            <tr style="font-weight:bold;font-size:16px;border-top:2px solid #0a5c36;">
                <td>Total Due:</td><td style="text-align:right;color:#0a5c36;">${total.toLocaleString()} ETB</td>
            </tr>
        </table>
        <div style="text-align:center;margin-top:40px;color:#888;font-size:12px;">
            Thank you for shopping at MERKATO! አመሰግናለሁ!
        </div>
    </body>
    </html>
    `;
}

module.exports = { generateHTMLReceipt };
