// Admin and Security Event Audit Logger
function auditLogger(action) {
    return (req, res, next) => {
        const user = req.user ? req.user.email : (req.body && req.body.email) || 'Anonymous';
        const timestamp = new Date().toISOString();
        const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';

        console.log(`[🔒 AUDIT LOG] ${timestamp} | User: ${user} | Action: ${action} | IP: ${ip} | Path: ${req.originalUrl}`);
        next();
    };
}

module.exports = auditLogger;
