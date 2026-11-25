# Breastfeeding in Newborns — Remotion video

A 75-second, 9:16 educational medical motion-graphics composition with 20 animated scenes, Egyptian Arabic male narration, transitions, and on-screen captions.

## Requirements
- Node.js and npm
- Python 3
- Internet connection for Microsoft Edge TTS (no API key required)

## Run preview
```bash
npm install
npm run start
```

## Render final MP4 with generated Egyptian Arabic male narration
```bash
npm run build
```

The build generates `public/narration-ar.mp3` using Edge TTS voice `ar-EG-ShakirNeural`, then renders `out/breastfeeding-newborn.mp4`.

Composition: `BreastfeedingNewborn` — 1080×1920, 30 fps, 2250 frames (75 seconds).

Educational content only. Individual feeding plans and newborn assessment should follow clinical assessment and local protocols.
