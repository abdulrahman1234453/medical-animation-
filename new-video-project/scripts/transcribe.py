import json, os, sys
from faster_whisper import WhisperModel

video = "public/input.mp4"
if not os.path.exists(video):
    raise SystemExit("Missing public/input.mp4. Upload your source video to this path first.")

model = WhisperModel("small", device="cpu", compute_type="int8")
segments, info = model.transcribe(video, language="ar", word_timestamps=True, vad_filter=True, beam_size=5)
words = []
for seg in segments:
    if seg.words:
        for item in seg.words:
            token = item.word.strip()
            if token:
                words.append({
                    "word": token,
                    "start": round(float(item.start), 3),
                    "end": round(float(item.end), 3)
                })
    else:
        words.append({"word": seg.text.strip(), "start": round(seg.start,3), "end": round(seg.end,3)})
duration = max((w["end"] for w in words), default=19.03)
os.makedirs("public", exist_ok=True)
with open("public/captions.json", "w", encoding="utf-8") as f:
    json.dump({"words": words, "duration": duration}, f, ensure_ascii=False, indent=2)
print(f"Transcribed {len(words)} words; duration={duration:.2f}s")