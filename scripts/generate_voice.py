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

def split_text(text: str, limit: int = 260):
    sentences = re.split(r"(?<=[.!؟])\s+", text)
    chunks, current = [], ""
    for sentence in sentences:
        if len(sentence) > limit:
            words = sentence.split()
            sentence_parts, part = [], ""
            for word in words:
                candidate = f"{part} {word}".strip()
                if len(candidate) > limit and part:
                    sentence_parts.append(part)
                    part = word
                else:
                    part = candidate
            if part:
                sentence_parts.append(part)
        else:
            sentence_parts = [sentence]
        for item in sentence_parts:
            candidate = f"{current} {item}".strip()
            if len(candidate) > limit and current:
                chunks.append(current)
                current = item
            else:
                current = candidate
    if current:
        chunks.append(current)
    return chunks

async def synthesize_chunk(text: str, index: int) -> bytes:
    last_error = None
    for attempt in range(3):
        try:
            communicate = edge_tts.Communicate(
                text, VOICE, rate="-5%", volume="+0%", pitch="+0Hz"
            )
            audio = bytearray()
            async for message in communicate.stream():
                if message["type"] == "audio":
                    audio.extend(message["data"])
            if audio:
                return bytes(audio)
            raise RuntimeError("The voice service returned an empty audio chunk")
        except Exception as exc:
            last_error = exc
            if attempt < 2:
                await asyncio.sleep(2 * (attempt + 1))
    raise RuntimeError(f"Could not synthesize narration chunk {index}: {last_error}")

async def main():
    narration = load_narration()
    if not narration:
        raise SystemExit("No narration text found in NARRATION_AR.txt")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    chunks = split_text(narration)
    combined = bytearray()
    for index, chunk in enumerate(chunks, start=1):
        audio = await synthesize_chunk(chunk, index)
        combined.extend(audio)
        print(f"Synthesized narration chunk {index}/{len(chunks)}")
        await asyncio.sleep(0.25)
    OUTPUT.write_bytes(combined)
    print(f"Arabic narration saved to: {OUTPUT} ({len(combined)} bytes)")

if __name__ == "__main__":
    asyncio.run(main())
