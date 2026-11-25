from pathlib import Path
import asyncio, json, edge_tts, math, wave, struct
from mutagen.mp3 import MP3

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "NARRATION_COMMON_COLD_AR.txt"
OUT = ROOT / "public" / "common-cold-audio"
TIMING = ROOT / "src" / "common-cold-timing.ts"
VOICE = "ar-EG-ShakirNeural"
FPS = 60

def make_tone(path, freqs, seconds, volume=0.16, sweep=False):
    rate = 44100
    count = int(rate * seconds)
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1); wav.setsampwidth(2); wav.setframerate(rate)
        frames = bytearray()
        for n in range(count):
            t = n / rate
            fade = min(1.0, t / 0.035, (seconds - t) / 0.08)
            if sweep:
                freq = freqs[0] + (freqs[-1] - freqs[0]) * (t / seconds)
            else:
                freq = freqs[int((t / seconds) * len(freqs)) % len(freqs)]
            sample = math.sin(2 * math.pi * freq * t) * volume * max(0, fade)
            frames.extend(struct.pack("<h", int(sample * 32767)))
        wav.writeframes(frames)

async def main():
    lines = [x.strip() for x in SOURCE.read_text(encoding="utf-8").splitlines() if x.strip()]
    OUT.mkdir(parents=True, exist_ok=True)
    make_tone(OUT / "whoosh.wav", [180, 950], 0.42, 0.10, sweep=True)
    make_tone(OUT / "tick.wav", [1250], 0.10, 0.08)
    make_tone(OUT / "alert.wav", [740, 520], 0.48, 0.12)
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
