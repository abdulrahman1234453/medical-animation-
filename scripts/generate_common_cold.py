from pathlib import Path
import asyncio, json, edge_tts
from mutagen.mp3 import MP3

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "NARRATION_COMMON_COLD_AR.txt"
OUT = ROOT / "public" / "common-cold-audio"
TIMING = ROOT / "src" / "common-cold-timing.ts"
VOICE = "ar-EG-ShakirNeural"
FPS = 60

async def main():
    lines = [x.strip() for x in SOURCE.read_text(encoding="utf-8").splitlines() if x.strip()]
    OUT.mkdir(parents=True, exist_ok=True)
    durations = []
    for i, line in enumerate(lines, 1):
        path = OUT / f"scene-{i:02d}.mp3"
        await edge_tts.Communicate(line, VOICE, rate="-4%", volume="+0%", pitch="+0Hz").save(str(path))
        seconds = MP3(path).info.length
        frames = max(60, int(seconds * FPS + 0.999) + 18)
        durations.append(frames)
        print(f"Common Cold voice {i}/{len(lines)}: {seconds:.1f}s")
    data = "export const COLD_SCENE_DURATIONS = " + json.dumps(durations) + " as const;\n"
    data += "export const COLD_SCENE_NARRATION = " + json.dumps(lines, ensure_ascii=False) + " as const;\n"
    data += f"export const COLD_TOTAL_FRAMES = {sum(durations)};\n"
    TIMING.write_text(data, encoding="utf-8")
    def stamp(sec):
        ms=int(round(sec*1000)); h,ms=divmod(ms,3600000); m,ms=divmod(ms,60000); s,ms=divmod(ms,1000)
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"
    cursor=0; subs=[]
    for i,(line,frames) in enumerate(zip(lines,durations),1):
        subs.append(f"{i}\n{stamp(cursor/FPS)} --> {stamp((cursor+frames)/FPS)}\n{line}")
        cursor += frames
    (ROOT/"public"/"common-cold-captions.srt").write_text("\n\n".join(subs)+"\n",encoding="utf-8")
    print(f"Ready: {len(lines)} scenes, {sum(durations)/FPS:.1f}s, 60fps")

if __name__ == "__main__":
    asyncio.run(main())
