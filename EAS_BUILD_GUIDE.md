# WPN — EAS Build Qo'llanmasi

## Talablar
- Node.js 18+
- Expo account: https://expo.dev → ro'yxatdan o'ting
- EAS CLI: `npm install -g eas-cli`

## Qadam 1 — Login
```bash
eas login
```

## Qadam 2 — Loyihani ulash
```bash
cd artifacts/vpn-app
eas init
```
> "Create a new EAS project" → `wpn-app` nomini bering

## Qadam 3 — APK qurish (Preview)
```bash
eas build --platform android --profile preview
```
- Build cloud da ~10-15 daqiqa davom etadi
- Tayyor bo'lgach APK havolasi keladi — yuklab o'rnating

## Qadam 4 — Play Store uchun (ixtiyoriy)
```bash
eas build --platform android --profile production
```

## Muhim eslatmalar
- `app.json` dagi `android.package: "com.wpn.app"` — bu sizning unikal paket nomingiz
- Agar boshqa nom istasangiz, `com.wpn.app` ni o'zgartiring
- EAS bepul rejada oyiga 30 ta build mavjud

## Bot URL
Telegram botingiz manzili:
```
https://t.me/ruspn_bot
```
Botga deeplink qo'shish uchun:
```
https://t.me/ruspn_bot?start=buy
```

## APK o'rnatish
1. Android qurilmada **Noma'lum manbalar** → yoqing
2. APK faylni yuklab oling
3. O'rnating va ishga tushiring
