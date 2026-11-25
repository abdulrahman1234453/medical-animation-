from pathlib import Path
import asyncio
import re
import edge_tts

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "NARRATION_AR.txt"
OUTPUT_DIR = ROOT / "public"
OUTPUT = OUTPUT_DIR / "narration-ar.mp3"
VOICE = "ar-EG-ShakirNeural"

def load_narration() -> str:
    lines = SOURCE.read_text(encoding="utf-8").splitlines()
    cleaned = []
    for line in lines:
        line = line.strip()
        if not line or line.startswith("سكريبت التعليق الصوتي") or line.startswith("ملاحظة:"):
            continue
        cleaned.append(line)
    return " ".join(cleaned)

async def main():
    text = load_narration()
    if not text:
        raise SystemExit("No narration text found in NARRATION_AR.txt")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    communicate = edge_tts.Communicate(
        text,
        VOICE,
        rate="-5%",
        volume="+0%",
        pitch="+0Hz",
    )
    await communicate.save(str(OUTPUT))
    print(f"Arabic narration saved to: {OUTPUT}")

if __name__ == "__main__":
    asyncio.run(main())
