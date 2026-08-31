// Sliding Window Rate Limiter Middleware
const requestCounts = new Map();

function rateLimiter(options = {}) {
    const windowMs = options.windowMs || 60 * 1000; // 1 minute
    const maxRequests = options.max || 100;

    return (req, res, next) => {
        const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
        const now = Date.now();

        let record = requestCounts.get(ip);
        if (!record) {
            record = { timestamps: [] };
            requestCounts.set(ip, record);
        }

        // Filter timestamps within window
        record.timestamps = record.timestamps.filter(ts => now - ts < windowMs);

        if (record.timestamps.length >= maxRequests) {
            const retryAfterSec = Math.ceil((record.timestamps[0] + windowMs - now) / 1000);
            res.setHeader('Retry-After', retryAfterSec);
            return res.status(429).json({
                error: 'Too Many Requests',
                message: `Rate limit exceeded. Please try again in ${retryAfterSec} seconds.`
            });
        }

        record.timestamps.push(now);
        res.setHeader('X-RateLimit-Limit', maxRequests);
        res.setHeader('X-RateLimit-Remaining', maxRequests - record.timestamps.length);
        next();
    };
}

module.exports = rateLimiter;
