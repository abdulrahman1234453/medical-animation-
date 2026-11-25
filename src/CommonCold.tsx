import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {COLD_SCENE_DURATIONS, COLD_SCENE_NARRATION} from './common-cold-timing';

const C = {bg:'#061522', panel:'#0B2638', cyan:'#00D9FF', white:'#F7FBFF', muted:'#A9C3D2', red:'#FF4545', green:'#5DE0C0'};
const scenes = [
 {tag:'HOOK', title:'نَزْلَةُ البَرْد', sub:'هَلْ تَحْتَاجُ دَائِمًا إِلَى مُضَادٍّ حَيَوِيّ؟', key:'hook', hi:['مُضَادٍّ حَيَوِيّ']},
 {tag:'WHAT IS IT?', title:'عَدْوَى فَيْرُوسِيَّة', sub:'تُصِيبُ الجِهَازَ التَّنَفُّسِيَّ العُلْوِيَّ', key:'virus', hi:['فَيْرُوسِيَّة']},
 {tag:'THE CAUSE', title:'الرَّايْنُوفَايْرَس', sub:'مِن أَشْهَر الفَيْرُوسَات المُسَبِّبَة لِنَزْلَة البَرْد', key:'virus', hi:['الرَّايْنُوفَايْرَس']},
 {tag:'TRANSMISSION', title:'كَيْفَ تَنْتَقِل؟', sub:'رَذَاذُ العُطَاس وَالكُحَّة، وَالأَسْطُح المُلَوَّثَة', key:'spread', hi:['رَذَاذُ','الأَسْطُح']},
 {tag:'SYMPTOMS', title:'الأَعْرَاض الشَّائِعَة', sub:'رَشْح • عُطَاس • احْتِقَان • أَلَم الحَلْق • كُحَّة', key:'symptoms', hi:['العُطَاس','الكُحَّة']},
 {tag:'TIMELINE', title:'مَتَى تَتَحَسَّن؟', sub:'غَالِبًا خِلَال 7 إِلَى 10 أَيَّام', key:'timeline', hi:['7 إِلَى 10 أَيَّام']},
 {tag:'DIAGNOSIS', title:'التَّشْخِيص', sub:'غَالِبًا مِن الأَعْرَاض وَالكَشْف الطِّبِّيّ', key:'check', hi:['الأَعْرَاض']},
 {tag:'CARE', title:'العِنَايَة المَنْزِلِيَّة', sub:'رَاحَة • سَوَائِل • مَحْلُول مِلْحِيّ لِلأَنْف', key:'care', hi:['رَاحَة','سَوَائِل']},
 {tag:'SYMPTOM RELIEF', title:'تَخْفِيف الأَعْرَاض', sub:'خَافِض حَرَارَة أَو مُسَكِّن مُنَاسِب عِنْد اللُّزُوم', key:'relief', hi:['مُنَاسِب']},
 {tag:'IMPORTANT FACT', title:'المُضَادّ الحَيَوِيّ؟', sub:'لَا يُعَالِج الفَيْرُوسَات', key:'antibiotic', hi:['لَا يُعَالِج'], danger:true},
 {tag:'PREVENTION', title:'احْمِ نَفْسَك', sub:'اغْسِل إِيدَك • غَطِّ العُطَاس • لَا تُشَارِك أَدَوَاتَك', key:'prevention', hi:['اغْسِل إِيدَك']},
 {tag:'RED FLAGS', title:'عَلَامَات خَطَر', sub:'ضِيق التَّنَفُّس أَو أَلَم الصَّدْر', key:'warning', hi:['ضِيق التَّنَفُّس','أَلَم الصَّدْر'], danger:true},
 {tag:'WHEN TO SEEK HELP', title:'اطْلُب تَقْيِيمًا طِبِّيًّا', sub:'إِذَا سَاءَت الأَعْرَاض أَو اسْتَمَرَّت الحَرَارَة', key:'doctor', hi:['تَقْيِيمًا طِبِّيًّا']},
 {tag:'HIGHER RISK', title:'مَنْ يَحْتَاج مُتَابَعَة؟', sub:'الرُّضَّع • كِبَار السِّن • أَصْحَاب الأَمْرَاض المُزْمِنَة', key:'people', hi:['الرُّضَّع','كِبَار السِّن']},
 {tag:'TAKE HOME', title:'الخُلَاصَة', sub:'غَالِبًا تَتَحَسَّن بِالعِنَايَة الدَّاعِمَة، لَا بِالمُضَادّ الحَيَوِيّ', key:'summary', hi:['العِنَايَة الدَّاعِمَة']}
];

const IconArt:React.FC<{kind:string; frame:number; danger?:boolean}> = ({kind,frame,danger}) => {
 const accent=danger?C.red:C.cyan, pulse=1+Math.sin(frame/10)*.035;
 const common={stroke:accent,strokeWidth:12,strokeLinecap:'round' as const,strokeLinejoin:'round' as const,fill:'none'};
 return <svg viewBox="0 0 700 560" width="100%" height="100%">
  <defs><radialGradient id="halo"><stop stopColor={accent} stopOpacity=".26"/><stop offset="1" stopColor={accent} stopOpacity="0"/></radialGradient></defs>
  <circle cx="350" cy="280" r="250" fill="url(#halo)"/>
  <g transform={`translate(350 280) scale(${pulse}) translate(-350 -280)`}>
  {kind==='hook'||kind==='virus'||kind==='antibiotic' ? <g>
   <circle cx="350" cy="280" r="115" fill="#123B52" stroke={accent} strokeWidth="9"/>
   {Array.from({length:12},(_,i)=><g key={i} transform={`rotate(${i*30} 350 280)`}><path d="M350 155v-45" {...common}/><circle cx="350" cy="99" r="15" fill={accent}/></g>)}
   <circle cx="310" cy="250" r="18" fill={accent}/><circle cx="390" cy="300" r="24" fill={accent}/><circle cx="330" cy="340" r="12" fill={accent}/>
   {kind==='antibiotic'&&<path d="M230 165l240 230" stroke={C.red} strokeWidth="25" strokeLinecap="round"/>}
  </g> :
  kind==='spread'?<g {...common}><circle cx="170" cy="280" r="65"/><circle cx="530" cy="280" r="65"/><path d="M250 280h180m-45-45 45 45-45 45"/>{Array.from({length:6},(_,i)=><circle key={i} cx={270+i*34} cy={210+(i%2)*140} r={8+i%3*3} fill={accent} stroke="none"/>)}</g>:
  kind==='symptoms'?<g {...common}><path d="M350 100c-70 0-100 65-100 130v70c0 95 45 155 100 155s100-60 100-155v-70c0-65-30-130-100-130z"/><path d="M280 245q70 45 140 0M315 335q35 30 70 0"/><path d="M200 190l-45-35m390 35 45-35M205 370l-55 25m395-25 55 25"/></g>:
  kind==='timeline'?<g {...common}><path d="M120 300h460"/>{[0,1,2,3,4].map(i=><g key={i}><circle cx={130+i*110} cy="300" r="25" fill={accent}/><path d={`M${130+i*110} 260v-80`}/></g>)}<path d="M130 390q110-130 220-100t220-70" strokeWidth="16"/></g>:
  kind==='check'||kind==='doctor'?<g {...common}><rect x="210" y="110" width="280" height="350" rx="35"/><path d="M275 205h150M275 270h150M275 335h80"/><path d="M300 400l35 35 75-85" stroke={C.green}/></g>:
  kind==='care'||kind==='relief'?<g {...common}><path d="M350 110c-50 90-125 155-125 245a125 125 0 0 0 250 0c0-90-75-155-125-245z"/><path d="M300 355q50 55 100 0"/></g>:
  kind==='warning'||kind==='prevention'?<g {...common}><path d="M350 95L585 455H115z"/><path d="M350 220v105"/><circle cx="350" cy="380" r="10" fill={accent}/></g>:
  <g {...common}><circle cx="270" cy="205" r="65"/><circle cx="430" cy="205" r="65"/><path d="M145 450q15-150 125-150t125 150M305 450q15-150 125-150t125 150"/></g>}
  </g>
 </svg>;
};

const WordCaption:React.FC<{text:string;frame:number;duration:number;highlight:string[];danger?:boolean}> = ({text,frame,duration,highlight,danger})=>{
 const words=text.split(/\s+/).filter(Boolean);
 const progress=Math.min(1,Math.max(0,frame/Math.max(1,duration*.78)));
 const shown=Math.max(1,Math.ceil(progress*words.length));
 return <div dir="rtl" style={{display:'flex',flexWrap:'wrap',justifyContent:'center',alignItems:'center',gap:'9px 12px',maxWidth:940,minHeight:155}}>
  {words.map((word,i)=>{const active=i<shown; const hit=highlight.some(h=>word.includes(h)); return <span key={i} style={{opacity:active?1:0,transform:active?'translateY(0) scale(1)':'translateY(18px) scale(.94)',transition:'opacity .18s, transform .18s',fontSize:35,fontWeight:900,color:hit?(danger?C.red:C.cyan):C.white,textShadow:'0 4px 16px #0008',whiteSpace:'pre-wrap'}}>{word}</span>;})}
 </div>;
};

export const CommonCold:React.FC=()=>{
 const frame=useCurrentFrame();
 const starts=COLD_SCENE_DURATIONS.map((_,i)=>COLD_SCENE_DURATIONS.slice(0,i).reduce((a,b)=>a+b,0));
 const active=starts.findIndex((s,i)=>frame>=s&&frame<s+COLD_SCENE_DURATIONS[i]);
 const index=Math.max(0,active);
 const s=scenes[index]; const local=frame-starts[index]; const duration=COLD_SCENE_DURATIONS[index];
 const fade=interpolate(local,[0,16,duration-16,duration],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const progress=(frame/COLD_SCENE_DURATIONS.reduce((a,b)=>a+b,0))*100;
 return <AbsoluteFill style={{background:C.bg,color:C.white,fontFamily:'Cairo, "Arial", sans-serif',overflow:'hidden'}}>
  <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 32%, #12364B 0%, #061522 66%)'}}/>
  {Array.from({length:24},(_,i)=><div key={i} style={{position:'absolute',left:`${(i*37)%100}%`,top:`${(i*61)%100}%`,width:4+(i%3)*2,height:4+(i%3)*2,borderRadius:20,background:i%4===0?C.cyan:'#4B829B',opacity:.12+(i%4)*.035}}/>)}
  <div style={{position:'absolute',top:70,left:54,right:54,display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:21,fontWeight:800,letterSpacing:2,color:C.muted}}><span>MEDICAL MOTION LAB</span><span dir="rtl">تَثْقِيف طِبِّيّ</span></div>
  <div style={{position:'absolute',top:125,left:54,right:54,height:2,background:'#234254'}}/>
  <AbsoluteFill style={{opacity:fade,alignItems:'center',justifyContent:'center',padding:'150px 58px 205px'}}>
   <div style={{padding:'11px 25px',borderRadius:30,border:`1px solid ${s.danger?C.red:C.cyan}66`,background:'#0B293B',color:s.danger?C.red:C.cyan,fontSize:21,fontWeight:900,letterSpacing:3}}>{s.tag}</div>
   <div style={{height:565,width:'100%',marginTop:35}}><IconArt kind={s.key} frame={local} danger={s.danger}/></div>
   <div dir="rtl" style={{fontSize:66,fontWeight:900,lineHeight:1.35,textAlign:'center',marginTop:20,textShadow:'0 8px 30px #0008'}}>{s.title}</div>
   <div dir="rtl" style={{fontSize:30,fontWeight:700,color:C.muted,textAlign:'center',lineHeight:1.65,marginTop:15,maxWidth:900}}>{s.sub}</div>
   <div style={{height:1,width:500,maxWidth:'80%',background:'linear-gradient(90deg, transparent, #00D9FF88, transparent)',marginTop:35,marginBottom:28}}/>
   <WordCaption text={COLD_SCENE_NARRATION[index]} frame={local} duration={duration} highlight={s.hi} danger={s.danger}/>
  </AbsoluteFill>
  <div style={{position:'absolute',bottom:88,left:55,right:55,display:'flex',justifyContent:'space-between',fontSize:19,color:C.muted,fontWeight:700}}><span>COMMON COLD</span><span>{String(index+1).padStart(2,'0')} / {scenes.length}</span></div>
  <div style={{position:'absolute',bottom:48,left:55,right:55,height:6,background:'#244456',borderRadius:9,overflow:'hidden'}}><div style={{height:'100%',width:`${progress}%`,background:s.danger?C.red:C.cyan}}/></div>
  <Sequence from={starts[index]||0} durationInFrames={duration}><Audio src={staticFile(`common-cold-audio/scene-${String(index+1).padStart(2,'0')}.mp3`)}/></Sequence>
 </AbsoluteFill>;
};
