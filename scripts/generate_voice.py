from pathlib import Path
import asyncio
import json
import edge_tts
from mutagen.mp3 import MP3

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "NARRATION_AR.txt"
OUTPUT_DIR = ROOT / "public" / "narration"
TIMING_FILE = ROOT / "src" / "generated-timing.ts"
VOICE = "ar-EG-ShakirNeural"
FPS = 30

def load_lines():
    lines = []
    for line in SOURCE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("سكريبت التعليق الصوتي") or line.startswith("ملاحظة:"):
            continue
        lines.append(line)
    if len(lines) != 20:
        raise RuntimeError(f"Expected 20 narration lines for 20 scenes, got {len(lines)}")
    return lines

async def make_audio(text, index):
    last_error = None
    for attempt in range(3):
        try:
            communicate = edge_tts.Communicate(text, VOICE, rate="-5%", volume="+0%", pitch="+0Hz")
            path = OUTPUT_DIR / f"scene-{index:02d}.mp3"
            await communicate.save(str(path))
            if path.exists() and path.stat().st_size > 1000:
                return path
            raise RuntimeError("Audio file is empty")
        except Exception as exc:
            last_error = exc
            if attempt < 2:
                await asyncio.sleep(2 * (attempt + 1))
    raise RuntimeError(f"Voice generation failed for scene {index}: {last_error}")

async def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    lines = load_lines()
    durations = []
    for index, line in enumerate(lines, start=1):
        path = await make_audio(line, index)
        seconds = MP3(path).info.length
        frames = max(30, int(seconds * FPS + 0.999) + 8)
        durations.append(frames)
        print(f"Scene {index}/20 audio: {seconds:.2f}s ({frames} frames)")
        await asyncio.sleep(0.2)
    total = sum(durations)
    timing_source = (
        "export const SCENE_DURATIONS = " + json.dumps(durations, ensure_ascii=False) + " as const;\n"
        + "export const SCENE_NARRATION = " + json.dumps(lines, ensure_ascii=False) + " as const;\n"
        + f"export const TOTAL_DURATION_FRAMES = {total};\n"
    )
    TIMING_FILE.write_text(timing_source, encoding="utf-8")
    def stamp(seconds):
        ms = int(round(seconds * 1000))
        h, ms = divmod(ms, 3600000)
        m, ms = divmod(ms, 60000)
        s, ms = divmod(ms, 1000)
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"
    cursor = 0
    subtitles = []
    for index, (line, frames) in enumerate(zip(lines, durations), start=1):
        start = cursor / FPS
        end = (cursor + frames) / FPS
        subtitles.append(f"{index}\n{stamp(start)} --> {stamp(end)}\n{line}")
        cursor += frames
    (ROOT / "public" / "captions-ar.srt").write_text("\n\n".join(subtitles) + "\n", encoding="utf-8")
    print(f"Generated 20 synced audio clips and subtitles. Total duration: {total / FPS:.1f}s")

if __name__ == "__main__":
    asyncio.run(main())
