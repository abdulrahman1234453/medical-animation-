import React from "react";
import {
  AbsoluteFill, Audio, Video, useCurrentFrame, useVideoConfig,
  interpolate, spring, staticFile
} from "remotion";

type Word = { word: string; start: number; end: number; highlight?: boolean };
type Captions = { words: Word[]; duration: number };
const data = require("../public/captions.json") as Captions;

const mint = "#45E6C5";
const gold = "#FFD166";
const highlights = /صداع|ألم|خطر|مهم|علاج|أعراض|فيروس|بكتيريا|طبيب|تنفس|حرارة|وقاية|تشخيص|مضاعفات|دواء|مضاد|القلب|المخ|الدم|العدوى|المرض|الضغط|سكر|رضاعة|لبن|طفل|مناعة|الأم/i;

const MedicalMark: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = 1 + 0.08 * Math.sin(frame / 9);
  return (
    <svg width="104" height="104" viewBox="0 0 104 104" style={{ overflow: "visible" }}>
      <circle cx="52" cy="52" r="43" fill="rgba(69,230,197,.08)" stroke="rgba(69,230,197,.65)" strokeWidth="2" />
      <circle cx="52" cy="52" r="32" fill="none" stroke="rgba(69,230,197,.25)" strokeDasharray="5 7" />
      <g transform={`translate(52 52) scale(${pulse}) translate(-52 -52)`}>
        <path d="M52 74 27 51C9 31 37 14 52 34 67 14 95 31 77 51Z" fill="rgba(69,230,197,.18)" stroke={mint} strokeWidth="3" />
        <path d="M20 52h17l7-12 11 25 8-15h21" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const MedicalShort: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const active = data.words.findIndex((w) => time >= w.start && time < w.end);
  const current = active >= 0 ? data.words[active] : null;
  const line = active >= 0 ? data.words.slice(Math.max(0, active - 3), Math.min(data.words.length, active + 4)) : [];
  const intro = spring({ frame, fps, config: { damping: 18, stiffness: 105 } });
  const outro = interpolate(frame, [Math.max(0, data.duration * fps - 24), data.duration * fps], [1, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const progress = Math.min(100, (time / Math.max(1, data.duration)) * 100);
  const sweep = (frame * 2.2) % 420;
  const glow = interpolate(Math.sin(frame / 24), [-1, 1], [0.06, 0.2]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#07131D", fontFamily: "Arial, sans-serif" }}>
      <Video
        src={staticFile("input.mp4")}
        muted
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          filter: "brightness(1.16) contrast(1.10) saturate(1.08)",
          transform: `scale(${1.025 + 0.012 * Math.sin(frame / 100)})`
        }}
      />
      <Audio src={staticFile("input.mp4")} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(3,13,22,.46) 0%, rgba(3,13,22,0) 24%, rgba(3,13,22,0) 55%, rgba(3,13,22,.84) 100%)" }} />
      <AbsoluteFill style={{ border: "2px solid rgba(69,230,197,.42)", boxShadow: `inset 0 0 110px rgba(69,230,197,${glow})`, pointerEvents: "none" }} />

      {/* Header / identity */}
      <div style={{ position: "absolute", top: 74, left: 58, right: 58, display: "flex", alignItems: "center", gap: 16, opacity: intro }}>
        <div style={{ width: 9, height: 54, borderRadius: 10, background: mint, boxShadow: `0 0 24px ${mint}` }} />
        <div>
          <div dir="rtl" style={{ color: "white", fontSize: 33, fontWeight: 900, letterSpacing: .2 }}>معلومة طبية</div>
          <div style={{ color: mint, fontSize: 15, fontWeight: 800, letterSpacing: 3, marginTop: 4 }}>MEDICAL • EXPLAINED</div>
        </div>
        <div style={{ marginLeft: "auto", background: "rgba(4,18,28,.62)", border: "1px solid rgba(69,230,197,.48)", borderRadius: 30, padding: "10px 17px", color: mint, fontSize: 17, fontWeight: 800 }}>HEALTH</div>
      </div>

      {/* Animated medical HUD, kept near the edges to preserve the speaker */}
      <div style={{ position: "absolute", top: 310, left: 30, opacity: .82, transform: `translateY(${Math.sin(frame / 28) * 9}px) scale(${intro})` }}>
        <MedicalMark frame={frame} />
      </div>
      <div style={{ position: "absolute", top: 490, right: 42, width: 126, padding: "13px 12px", borderRadius: 18, background: "rgba(5,20,31,.56)", border: "1px solid rgba(69,230,197,.36)", opacity: .82, transform: `translateY(${Math.cos(frame / 31) * 10}px)` }}>
        <div style={{ color: mint, fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>LIVE DATA</div>
        <svg width="100%" height="42" viewBox="0 0 120 42">
          <path d="M0 22h18l8-12 12 24 10-18 9 6h15l8-14 10 24 8-10h22" fill="none" stroke={mint} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ height: 3, borderRadius: 5, background: "rgba(255,255,255,.15)", overflow: "hidden" }}>
          <div style={{ width: `${35 + 30 * (0.5 + 0.5 * Math.sin(frame / 18))}%`, height: "100%", background: mint }} />
        </div>
      </div>

      {/* Small animated scanning line */}
      <div style={{ position: "absolute", top: 245 + (sweep % 360), left: 54, right: 54, height: 1, background: "linear-gradient(90deg, transparent, rgba(69,230,197,.6), transparent)", opacity: .32 }} />

      {/* Arabic word-by-word subtitles */}
      <div style={{ position: "absolute", left: 42, right: 42, bottom: 190, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 210, transform: `scale(${outro})` }}>
        <div style={{ background: "rgba(3,15,25,.88)", border: "1px solid rgba(69,230,197,.48)", borderRadius: 28, padding: "22px 28px", maxWidth: 990, width: "100%", textAlign: "center", boxShadow: "0 16px 55px rgba(0,0,0,.42)" }}>
          <div style={{ width: 58, height: 4, margin: "0 auto 15px", borderRadius: 4, background: mint, boxShadow: `0 0 15px ${mint}` }} />
          <div dir="rtl" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 10, lineHeight: 1.65 }}>
            {line.map((w, i) => {
              const isActive = w === current;
              const isHighlight = !!w.highlight || highlights.test(w.word);
              return <span key={w.start + "-" + i} style={{
                color: isActive && isHighlight ? "#07131D" : isHighlight ? mint : "white",
                background: isActive && isHighlight ? mint : isActive ? "rgba(255,255,255,.18)" : "transparent",
                fontSize: 45, fontWeight: isActive || isHighlight ? 900 : 700,
                padding: isActive ? "0px 10px" : "0px 2px", borderRadius: 10,
                textShadow: isHighlight && !isActive ? "0 0 18px rgba(69,230,197,.25)" : "0 2px 8px rgba(0,0,0,.35)"
              }}>{w.word}</span>;
            })}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ position: "absolute", bottom: 92, left: 58, right: 58 }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,.78)", fontSize: 14, fontWeight: 700, marginBottom: 9 }}>
          <span>MEDICAL SHORT</span><span>{Math.floor(time)}s</span>
        </div>
        <div style={{ height: 5, background: "rgba(255,255,255,.22)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${mint}, ${gold})`, boxShadow: `0 0 18px ${mint}` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
