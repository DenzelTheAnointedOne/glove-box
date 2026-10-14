# Glovebox

A proof-of-concept mobile app that helps people plan and manage the move from an apartment or house into living in their car.

Built with Expo (React Native) and TypeScript.

## Features

- **Plan:** move-out date, vehicle type, who's coming, and climate. Shows a countdown, the next three tasks, and tips for the user's situation.
- **Checklist:** 19 tasks grouped by timing (3–4 weeks out through the first month). Safety items are flagged.
- **Budget:** compares monthly housing costs with car-life costs and estimates how long it takes to save a move-in fund.
- **Tonight:** a nightly safety routine that resets each day, plus tips on choosing where to park.
- **Help:** 211, 988, the domestic violence hotline and 911, with Call, Text and Copy buttons.

All data is stored on the device with AsyncStorage. There is no backend or account system.

## Run it

Requires Node 18 or newer.

```bash
npm install
npx expo install --fix   # aligns package versions with your installed Expo SDK
npx expo start
```

Scan the QR code with the Expo Go app on your phone, or press `i` / `a` for the iOS simulator or Android emulator.

## Project layout

```
App.tsx                  App shell: header, tab bar, fonts, splash, toast
index.ts                 Entry point
src/theme.ts             Light and dark color tokens, font names
src/data.ts              Checklist, nightly routine, hotlines, tailored tips
src/state.tsx            App state context, persisted to AsyncStorage
src/components.tsx       Card, Chip, Button, CheckRow, Tip, Bar, text styles
src/screens/             One file per tab
```

To change checklist items, tips or hotlines, edit `src/data.ts`.

## Before a store release

- Add an app icon and splash image to `assets/` and reference them in `app.json`.
- Change `bundleIdentifier` and `package` in `app.json` to your own.
- Have someone with lived experience and a local homeless-services provider review the content.
- Consider replacing the free-text date field with `@react-native-community/datetimepicker`.

## Ideas for next versions

- Map of safe parking lots, gyms, showers and libraries
- Accounts and cloud sync so data follows the user across devices
- Push reminders for the nightly routine and check-in texts
