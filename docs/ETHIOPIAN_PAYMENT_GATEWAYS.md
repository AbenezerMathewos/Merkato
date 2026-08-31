# Ethiopian Payment Gateways Integration Guide

This guide describes how MERKATO interfaces with local Ethiopian fintech providers.

---

## 1. Telebirr (ቴሌብር - Ethio Telecom)
Telebirr is Ethiopia's dominant mobile money solution.

### Integration Workflow
1. Client submits cart payload to `/api/telebirr/create-payment`.
2. Backend generates a unique `outTradeNo` and signs the request using the merchant private key.
3. Client is redirected to the Telebirr payment H5 page or app deep-link (`telebirr://`).
4. Ethio Telecom posts encrypted transaction feedback to `/api/telebirr/webhook`.
5. Backend verifies SHA256withRSA signature and updates order status to `PAID`.

---

## 2. CBE Birr (የኢትዮጵያ ንግድ ባንክ)
Commercial Bank of Ethiopia direct payment verification.

### Verification Flow
1. User receives a transaction reference code via SMS upon completing CBE transfer.
2. User enters transaction code in checkout or orders portal.
3. Backend validates reference format (`CBE[A-Z0-9]{8,12}`) and confirms funds with CBE settlement ledger.

---

## 3. Chapa (ቻፓ)
Unified gateway supporting Ethiopian and International debit/credit cards (Visa, Mastercard) alongside Telebirr and Awash Birr.
