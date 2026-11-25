# Common Cold — Arabic Medical Motion Graphics

A separate Remotion composition in this repository. It does not replace the existing breastfeeding video.

## Included
- 15 Arabic educational scenes
- Egyptian Arabic male narration generated automatically with Edge TTS
- Word-by-word Arabic captions with highlighted medical terms
- Cyan medical highlights and red warning scenes
- Original generated whoosh and alert sound effects
- Cairo typography, RTL layout, 1080x1920, 60 fps
- SRT subtitle file

## Render on GitHub (no terminal commands)
1. Open the repository's **Actions** tab:
   https://github.com/abdulrahman1234453/medical-animation-/actions/workflows/render-common-cold.yml
2. Select **Render Common Cold Video**.
3. Press **Run workflow**, then press the green **Run workflow** button.
4. Wait for the workflow to finish successfully.
5. Open the completed run and download the **common-cold-video** artifact. It contains the MP4 and SRT captions.

## Render in a Codespace
Run:
```bash
npm install
npm run common-cold:render
```

The output is `out/common-cold.mp4`. The narration and sound effects are generated automatically before rendering.
