# New Medical Short — Remotion

A separate editing project for the uploaded vertical video. It keeps the original audio, creates Arabic word-timed captions automatically, highlights key medical words, applies a subtle lighting/color correction, and renders a 9:16 MP4.

## Source video
Upload the provided video to `new-video-project/public/input.mp4` in this repository. Keep the filename exactly `input.mp4`.

## Render in GitHub
1. Open the repository's **Actions** tab.
2. Select **Render uploaded medical short**.
3. Press **Run workflow**.
4. When it finishes, download the `medical-short-final` artifact.

The workflow transcribes Arabic speech using Whisper word timestamps, generates captions, then renders with Remotion. Captions are machine-generated and should be proofread for dialect/spelling before publishing.

## Local render
From this folder:
```bash
npm install
python -m pip install faster-whisper
python scripts/transcribe.py
npx remotion render src/index.ts MedicalShort out/medical-short.mp4
```

Output: `out/medical-short.mp4`