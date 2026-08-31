# Performance Optimization & Core Web Vitals Guide

## Strategies Implemented
1. **Zero-Bundle Overhead**: Native browser ES modules eliminate Webpack/Vite runtime parsing overhead.
2. **Service Worker v3 Cache-First Hierarchy**: Static assets (images, CSS, JS) load in < 15ms from CacheStorage.
3. **Decoded Async Images**: High-resolution photos use `loading="lazy"` and `decoding="async"`.
4. **CSS Content Visibility**: Offscreen DOM elements leverage CSS containment.
