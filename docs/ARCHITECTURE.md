# MERKATO Architecture & System Design

```mermaid
graph TD
    Client[Web Browser / PWA Client] --> |HTTPS / JSON| CDN[Cloudflare / Fastly CDN]
    CDN --> |Static Assets| Frontend[Frontend HTML / CSS / JS Vanilla Core]
    CDN --> |API Reverse Proxy| Backend[Express.js Node.js Server]
    
    Backend --> DB[(MongoDB / In-Memory Store)]
    Backend --> Telebirr[Ethio Telecom Telebirr API]
    Backend --> CBE[Commercial Bank of Ethiopia API]
    Backend --> SMS[Ethio Telecom SMS Gateway]

    subgraph Frontend Architecture
        Frontend --> I18n[i18n Multi-Language Engine]
        Frontend --> Currency[Multi-Currency Converter]
        Frontend --> Analytics[Local Analytics Tracker]
        Frontend --> SW[Service Worker v3 / PWA Cache]
    end
```

## System Highlights
- **Zero Heavy Bundler Dependency**: Pure semantic HTML5, modern CSS3 variables, and vanilla ES6+ for maximum load speed on Ethiopian networks.
- **Service Worker v3 Cache-First Architecture**: Instant loading across slow 3G/4G connections.
- **Privacy-First Analytics**: Completely local event tracking without invasive third-party cookies.
