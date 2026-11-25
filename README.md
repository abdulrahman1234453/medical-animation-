# Neonatal Respiratory Distress — Remotion video

A 75-second, 9:16 educational medical motion-graphics composition with 20 animated scenes and Arabic narration.

## Requirements
- Node.js and npm
- Python 3
- Internet connection for the free Microsoft Edge TTS voice service (no API key required)

## Run the preview
```bash
npm install
npm run start
```

## Render the final MP4 with generated Arabic narration
```bash
npm run build
```

The build command installs the Python `edge-tts` package if needed, reads `NARRATION_AR.txt`, generates an Egyptian Arabic male narration using `ar-EG-ShakirNeural`, saves it to `public/narration-ar.mp3`, and then renders the video with the audio track.

Composition: `NeonatalRespiratoryDistress` — 1080×1920, 30 fps, 2250 frames (75 seconds).

If Python blocks a user-level package install in your environment, install `edge-tts` in a Python virtual environment and rerun `npm run build`.

Educational content only. Clinical management must follow local neonatal protocols and specialist assessment.
