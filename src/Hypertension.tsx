import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {HYPERTENSION_SCENE_DURATIONS, HYPERTENSION_NARRATION} from './hypertension-timing';

const C={bg:'#061522',cyan:'#00D9FF',white:'#F7FBFF',muted:'#A9C3D2',red:'#FF4545',green:'#5DE0C0'};
const scenes=[
 {tag:'HOOK',title:'القَاتِل الصَّامِت',sub:'مَرَضٌ قَدْ يَسْتَمِرُّ سِنِينَ دُونَ أَعْرَاض',kind:'heart',hi:['مَرَضٌ','دُونَ','أَعْرَاض']},
 {tag:'THE SILENT THREAT',title:'اِرْتِفَاعُ ضَغْطِ الدَّم',sub:'مُمْكِنْ يَكُونْ عِنْدَكْ مِنْ غَيْر مَا تَعْرَف',kind:'monitor',hi:['مِنْ','غَيْر']},
 {tag:'DEFINITION',title:'يَعْنِي إِيه ضَغْط الدَّم؟',sub:'قُوَّةُ دَفْعِ الدَّم عَلَى جُدْرَان الشَّرَايِين',kind:'artery',hi:['قُوَّةُ','الشَّرَايِين']},
 {tag:'HEART PUMP',title:'القَلْب بِيَضُخّ الدَّم',sub:'وَالضَّغْط بِيَتْغَيَّر مَع كُلّ نَبْضَة',kind:'heart',hi:['القَلْب','نَبْضَة']},
 {tag:'WHY IT MATTERS',title:'حِمْل إِضَافِيّ عَلَى القَلْب',sub:'اِرْتِفَاع الضَّغْط المُسْتَمِرّ بِيُجْهِد الأَوْعِيَة الدَّمَوِيَّة',kind:'artery',hi:['يُجْهِد','الأَوْعِيَة']},
 {tag:'SILENT KILLER',title:'القَاتِل الصَّامِت',sub:'لِأَنَّه غَالِبًا مَا بِيَظْهَرْش بِأَعْرَاض وَاضِحَة',kind:'warning',hi:['أَعْرَاض'],danger:true},
 {tag:'NO OBVIOUS SIGNS',title:'مُمْكِن مَا تِحِسّش بِحَاجَة',sub:'كَتِير مِنَ المُصَابِين مَا عِنْدُهُمْش أَعْرَاض',kind:'person',hi:['مَا','أَعْرَاض']},
 {tag:'COMMON MYTH',title:'الصُّدَاع مِش دَلِيل',sub:'وَلَا الدُّوخَة تَكْفِي لِتَشْخِيص الضَّغْط',kind:'brain',hi:['مِش','تَشْخِيص'],danger:true},
 {tag:'COMPLICATIONS',title:'مَاذَا يَحْدُث مَع الإِهْمَال؟',sub:'مَضَاعَفَات قَدْ تَظْهَر مَعَ الوَقْت',kind:'organs',hi:['مَضَاعَفَات'],danger:true},
 {tag:'BRAIN',title:'الجَلَطَات الدِّمَاغِيَّة',sub:'اِرْتِفَاع الضَّغْط مِنْ أَهَمّ عَوَامِل الخَطَر',kind:'brain',hi:['الجَلَطَات'],danger:true},
 {tag:'HEART',title:'أَمْرَاض القَلْب',sub:'مِنْهَا ضَعْف عَضَلَة القَلْب وَمَشَاكِل الشَّرَايِين',kind:'heart',hi:['القَلْب'],danger:true},
 {tag:'KIDNEYS',title:'تَأَثُّر وَظِيفَة الكُلَى',sub:'الضَّغْط المُرْتَفِع قَدْ يُؤْذِي الكُلَى مَعَ الوَقْت',kind:'kidney',hi:['الكُلَى'],danger:true},
 {tag:'MEASUREMENT',title:'إِمْتَى نَقُول الضَّغْط عَالِي؟',sub:'قِيَاس صَحِيح وَمُتَكَرِّر هُوَ الأَسَاس',kind:'monitor',hi:['قِيَاس','مُتَكَرِّر']},
 {tag:'REFERENCE',title:'أَقَلّ مِن 120 / 80',sub:'هَذَا هُوَ المُسْتَهْدَف الطَّبِيعِيّ لِكَثِير مِنَ البَالِغِين',kind:'numbers',hi:['120','80']},
 {tag:'CLINIC THRESHOLD',title:'140 / 90 أَو أَعْلَى',sub:'قِرَاءَة مُتَكَرِّرَة تَسْتَدْعِي تَقْيِيمًا طِبِّيًّا',kind:'numbers',hi:['140','90'],danger:true},
 {tag:'IMPORTANT',title:'مِش قِرَاءَة وَاحْدَة',sub:'التَّشْخِيص لَا يَعْتَمِد عَلَى قِيَاس وَاحِد فَقَط',kind:'check',hi:['وَاحِد']},
 {tag:'MEASURE RIGHT',title:'قِيسْ ضَغْطَك بِطَرِيقَة صَحِيحَة',sub:'اِرْتَاح قَبْل القِيَاس وَاسْتَخْدِم جِهَاز مُنَاسِب',kind:'monitor',hi:['صَحِيحَة','اِرْتَاح']},
 {tag:'PREVENTION',title:'قَلِّل المِلْح',sub:'وَحَافِظ عَلَى وَزْن صِحِّيّ وَنَشَاط بَدَنِيّ مُنْتَظِم',kind:'food',hi:['المِلْح','وَزْن']},
 {tag:'TREATMENT',title:'مَا تَوَقَّفْش العِلَاج',sub:'لَوْ بْتَاخُد دَوَاء الضَّغْط، مَا تَوَقَّفُوش مِنْ نَفْسَك',kind:'medicine',hi:['مَا','تَوَقَّفُوش'],danger:true},
 {tag:'TAKE HOME',title:'قِيسْ ضَغْطَك وَتَابِع',sub:'الكَشْف المُبَكِّر وَالالْتِزَام بِالعِلَاج بِيِفْرَقُوا',kind:'check',hi:['الكَشْف','العِلَاج']}
];

const Art:React.FC<{kind:string;frame:number;danger?:boolean}> = ({kind,frame,danger})=>{
 const a=danger?C.red:C.cyan, pulse=1+Math.sin(frame/9)*.045;
 const line={fill:'none',stroke:a,strokeWidth:13,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
 return <svg viewBox="0 0 700 560" width="100%" height="100%">
 <defs><radialGradient id="halo"><stop stopColor={a} stopOpacity=".3"/><stop offset="1" stopColor={a} stopOpacity="0"/></radialGradient></defs>
 <circle cx="350" cy="280" r="245" fill="url(#halo)"/>
 <g transform={`translate(350 280) scale(${pulse}) translate(-350 -280)`}>
 {kind==='heart'?<g {...line}><path d="M350 430S120 300 170 190c38-85 145-65 180 10 35-75 142-95 180-10 50 110-180 240-180 240z"/><path d="M350 195v-85m0 85 55-65"/></g>:
 kind==='artery'?<g {...line}><path d="M90 220C220 220 235 330 350 330s130-110 260-110"/><path d="M90 340C220 340 235 230 350 230s130 110 260 110"/><path d="M180 280h340m-50-40 50 40-50 40"/></g>:
 kind==='monitor'||kind==='numbers'?<g {...line}><rect x="185" y="100" width="330" height="350" rx="38"/><rect x="230" y="155" width="240" height="125" rx="18"/><path d="M255 235h45l25-48 35 75 25-45h65"/><path d="M285 340h130M285 390h80"/></g>:
 kind==='brain'?<g {...line}><path d="M350 120c-65-65-145 5-125 75-85 20-80 135-15 160-20 85 85 125 145 65 60 60 165 20 145-65 65-25 70-140-15-160 20-70-60-140-125-75z"/><path d="M350 125v310m-80-245q-55 40-15 90m175-90q55 40 15 90m-175 70q55-5 55 55m120-55q-55-5-55 55"/></g>:
 kind==='kidney'?<g {...line}><path d="M285 120c-100-35-165 75-125 190 35 100 130 125 180 45 35-55 10-100-20-130-35-35-5-80-35-105z"/><path d="M415 120c100-35 165 75 125 190-35 100-130 125-180 45-35-55-10-100 20-130 35-35 5-80 35-105z"/><path d="M350 260v175"/></g>:
 kind==='warning'?<g {...line}><path d="M350 80L600 470H100z"/><path d="M350 210v110"/><circle cx="350" cy="380" r="10" fill={a}/></g>:
 kind==='person'?<g {...line}><circle cx="350" cy="155" r="75"/><path d="M190 470q10-210 160-210t160 210"/></g>:
 kind==='organs'?<g {...line}><path d="M350 95v120m0 0q-120-65-155 60t55 145q70 0 100-85q30 85 100 85q110-20 55-145t-155-60"/><path d="M350 215v200"/></g>:
 kind==='food'?<g {...line}><path d="M180 350q170 170 340 0"/><path d="M250 330q-30-120 80-150 55 70-10 145m40 0q-5-130 120-135 15 95-90 145"/></g>:
 kind==='medicine'?<g {...line}><g transform="rotate(-35 350 280)"><rect x="235" y="190" width="230" height="180" rx="90"/><path d="M350 190v180"/></g></g>:
 <g {...line}><rect x="190" y="100" width="320" height="360" rx="32"/><path d="M260 260l65 65 125-145"/></g>}
 </g></svg>;
};

const Scene:React.FC<{index:number;from:number;duration:number}> = ({index,from,duration})=>{
 const f=useCurrentFrame(), local=f, s=scenes[index];
 const fade=interpolate(local,[0,18,duration-18,duration],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const zoom=interpolate(local,[0,duration],[.88,1.08],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const words=HYPERTENSION_NARRATION[index].split(/\s+/).filter(Boolean);
 const shown=Math.max(1,Math.ceil(Math.min(1,local/Math.max(1,duration*.72))*words.length));
 return <AbsoluteFill style={{opacity:fade,background:'radial-gradient(ellipse at 50% 34%, #12364B 0%, #061522 68%)',color:C.white,fontFamily:'Cairo,Arial,sans-serif',overflow:'hidden'}}>
 <div style={{position:'absolute',inset:-80,opacity:.22,background:'radial-gradient(circle at 18% 20%,#00D9FF 0,transparent 30%),radial-gradient(circle at 85% 78%,#164A65 0,transparent 35%)'}}/>
 <div style={{position:'absolute',top:65,left:55,right:55,display:'flex',justifyContent:'space-between',fontSize:20,fontWeight:800,color:C.muted,letterSpacing:2}}><span>MEDICAL MOTION LAB</span><span dir="rtl">تَثْقِيف طِبِّيّ</span></div>
 <div style={{position:'absolute',top:120,left:55,right:55,height:2,background:'#234254'}}/>
 <div style={{position:'absolute',top:155,left:50,right:50,bottom:180,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
 <div style={{padding:'10px 24px',borderRadius:30,border:`1px solid ${s.danger?C.red:C.cyan}77`,background:'#0B293B',color:s.danger?C.red:C.cyan,fontSize:20,fontWeight:900,letterSpacing:2}}>{s.tag}</div>
 <div style={{width:'100%',height:490,marginTop:22,transform:`scale(${zoom})`,filter:`drop-shadow(0 0 28px ${s.danger?'#FF454566':'#00D9FF55'}) brightness(1.12)`}}><Art kind={s.kind} frame={local} danger={s.danger}/></div>
 <div dir="rtl" style={{fontSize:60,fontWeight:900,lineHeight:1.3,textAlign:'center',marginTop:8,textShadow:'0 8px 30px #0009'}}>{s.title}</div>
 <div dir="rtl" style={{fontSize:28,fontWeight:700,color:C.muted,textAlign:'center',lineHeight:1.6,marginTop:12,maxWidth:900}}>{s.sub}</div>
 <div style={{height:2,width:440,maxWidth:'75%',background:'linear-gradient(90deg,transparent,#00D9FF,transparent)',margin:'25px 0'}}/>
 <div dir="rtl" style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:'8px 12px',maxWidth:930,minHeight:115}}>
 {words.map((w,i)=><span key={i} style={{opacity:i<shown?1:0,transform:i<shown?'translateY(0) scale(1)':'translateY(16px) scale(.95)',fontSize:32,fontWeight:900,color:s.hi.some(h=>w.includes(h))?(s.danger?C.red:C.cyan):C.white,textShadow:'0 4px 16px #0008'}}>{w}</span>)}
 </div></div>
 <div style={{position:'absolute',bottom:85,left:55,right:55,display:'flex',justifyContent:'space-between',fontSize:19,color:C.muted,fontWeight:800}}><span>HYPERTENSION</span><span>{String(index+1).padStart(2,'0')} / 20</span></div>
 <div style={{position:'absolute',bottom:48,left:55,right:55,height:6,background:'#244456',borderRadius:9,overflow:'hidden'}}><div style={{height:'100%',width:`${((from+local)/HYPERTENSION_TOTAL_FRAMES)*100}%`,background:s.danger?C.red:C.cyan}}/></div>
 </AbsoluteFill>;
};

import {HYPERTENSION_TOTAL_FRAMES} from './hypertension-timing';
export const Hypertension:React.FC=()=>{
 let cursor=0;
 return <AbsoluteFill style={{background:C.bg}}>{scenes.map((_,i)=>{const from=cursor;const duration=HYPERTENSION_SCENE_DURATIONS[i];cursor+=duration;return <Sequence key={i} from={from} durationInFrames={duration}><Scene index={i} from={from} duration={duration}/><Audio src={staticFile(`hypertension-audio/scene-${String(i+1).padStart(2,'0')}.mp3`)}/></Sequence>;})}</AbsoluteFill>;
};
