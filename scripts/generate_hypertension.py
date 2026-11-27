from pathlib import Path
import asyncio, json
from mutagen.mp3 import MP3
import edge_tts

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "NARRATION_HYPERTENSION_AR.txt"
OUT = ROOT / "public" / "hypertension-audio"
TIMING = ROOT / "src" / "hypertension-timing.ts"
FPS = 60
VOICE = "ar-EG-ShakirNeural"

async def main():
    lines = [x.strip() for x in SOURCE.read_text(encoding="utf-8").splitlines() if x.strip()]
    if len(lines) != 20:
        raise ValueError(f"Expected exactly 20 narration lines, got {len(lines)}")
    OUT.mkdir(parents=True, exist_ok=True)
    durations = []
    for i, line in enumerate(lines, 1):
        path = OUT / f"scene-{i:02d}.mp3"
        await edge_tts.Communicate(line, VOICE, rate="-4%", volume="+0%", pitch="+0Hz").save(str(path))
        seconds = MP3(path).info.length
        frames = max(90, int(seconds * FPS + 0.999) + 24)
        durations.append(frames)
        print(f"Scene {i}/20: {seconds:.1f}s, voice={VOICE}")
    data = "export const HYPERTENSION_SCENE_DURATIONS = " + json.dumps(durations) + " as const;\n"
    data += "export const HYPERTENSION_NARRATION = " + json.dumps(lines, ensure_ascii=False) + " as const;\n"
    data += f"export const HYPERTENSION_TOTAL_FRAMES = {sum(durations)};\n"
    TIMING.write_text(data, encoding="utf-8")
    def stamp(sec):
        ms=int(round(sec*1000)); h,ms=divmod(ms,3600000); m,ms=divmod(ms,60000); s,ms=divmod(ms,1000)
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"
    cursor=0; subs=[]
    for i,(line,frames) in enumerate(zip(lines,durations),1):
        subs.append(f"{i}\n{stamp(cursor/FPS)} --> {stamp((cursor+frames)/FPS)}\n{line}")
        cursor += frames
    (ROOT/"public"/"hypertension-captions.srt").write_text("\n\n".join(subs)+"\n",encoding="utf-8")
    print(f"Ready: 20 scenes, {sum(durations)/FPS:.1f}s, 60fps, male Egyptian voice {VOICE}")

if __name__ == "__main__":
    asyncio.run(main())
