import React from "react";
import { AbsoluteFill, Audio, Video, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from "remotion";

type Word = { word: string; start: number; end: number; highlight?: boolean };
type Captions = { words: Word[]; duration: number };
const data = require("../public/captions.json") as Captions;

const ACCENT = "#35E0C1";
const highlightWords = /صداع|ألم|خطر|مهم|علاج|أعراض|فيروس|بكتيريا|طبيب|تنفس|حرارة|وقاية|تشخيص|مضاعفات|دواء|مضاد|القلب|المخ|الدم|العدوى|المرض|الضغط|سكر/i;

export const MedicalShort: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const active = data.words.findIndex((w) => time >= w.start && time < w.end);
  const current = active >= 0 ? data.words[active] : null;
  const line = active >= 0 ? data.words.slice(Math.max(0, active - 3), Math.min(data.words.length, active + 4)) : [];
  const pulse = interpolate(Math.sin(frame / 8), [-1, 1], [0.94, 1.04]);
  const intro = spring({ frame, fps, config: { damping: 18, stiffness: 110 } });
  const glow = interpolate(Math.sin(frame / 22), [-1, 1], [0.08, 0.22]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#07131D", fontFamily: "Arial, sans-serif" }}>
      <Video
        src={staticFile("input.mp4")}
        muted
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          filter: "brightness(1.12) contrast(1.08) saturate(1.06)",
          transform: `scale(${1.015 + 0.012 * Math.sin(frame / 90)})`
        }}
      />
      <Audio src={staticFile("input.mp4")} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(2,10,18,.10) 0%, transparent 35%, rgba(2,10,18,.08) 55%, rgba(2,10,18,.78) 100%)" }} />
      <AbsoluteFill style={{ pointerEvents: "none", border: "2px solid rgba(53,224,193,.35)", boxShadow: `inset 0 0 100px rgba(53,224,193,${glow})` }} />
      <div style={{ position: "absolute", top: 86, left: 64, right: 64, display: "flex", alignItems: "center", gap: 18, opacity: intro }}>
        <div style={{ width: 12, height: 54, borderRadius: 8, background: ACCENT, boxShadow: `0 0 28px ${ACCENT}` }} />
        <div style={{ color: "white", fontSize: 30, fontWeight: 800, letterSpacing: 2 }}>MEDICAL EXPLAINER</div>
        <div style={{ marginLeft: "auto", color: ACCENT, fontSize: 22, fontWeight: 700 }}>●</div>
      </div>
      <div style={{ position: "absolute", left: 48, right: 48, bottom: 190, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 190 }}>
        <div style={{ background: "rgba(4,15,24,.84)", border: "1px solid rgba(255,255,255,.16)", borderRadius: 28, padding: "24px 34px", maxWidth: 970, textAlign: "center", boxShadow: "0 14px 48px rgba(0,0,0,.32)", transform: `scale(${pulse})` }}>
          <div dir="rtl" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12, lineHeight: 1.65 }}>
            {line.map((w, i) => {
              const isActive = w === current;
              const isHighlight = !!w.highlight || highlightWords.test(w.word);
              return <span key={w.start + "-" + i} style={{
                color: isActive && isHighlight ? "#07131D" : isHighlight ? ACCENT : "white",
                background: isActive && isHighlight ? ACCENT : isActive ? "rgba(255,255,255,.18)" : "transparent",
                fontSize: 48, fontWeight: isActive || isHighlight ? 900 : 700,
                padding: isActive ? "0px 10px" : "0px 2px", borderRadius: 10,
                textShadow: isHighlight && !isActive ? "0 0 18px rgba(53,224,193,.25)" : "0 2px 8px rgba(0,0,0,.35)"
              }}>{w.word}</span>;
            })}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 88, left: 64, right: 64, height: 5, background: "rgba(255,255,255,.24)", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.min(100, (time / Math.max(1, data.duration)) * 100)}%`, background: ACCENT, boxShadow: `0 0 20px ${ACCENT}` }} />
      </div>
    </AbsoluteFill>
  );
};