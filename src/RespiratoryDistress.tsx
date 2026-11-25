import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

type Scene = {title:string; sub:string; kind:string; accent:string};
const scenes:Scene[] = [
{title:'NEONATAL RESPIRATORY DISTRESS',sub:'Recognize the signs. Understand the causes.',kind:'intro',accent:'#4DE1D2'},
{title:'THE FIRST BREATH',sub:'A newborn must transition to breathing air.',kind:'baby',accent:'#4DE1D2'},
{title:'WHAT IS IT?',sub:'Difficulty maintaining adequate breathing and oxygenation.',kind:'lungs',accent:'#4DE1D2'},
{title:'EARLY WARNING SIGNS',sub:'Tachypnea: respiratory rate above 60/min.',kind:'rate',accent:'#FFC66D'},
{title:'NASAL FLARING',sub:'Widening nostrils with each inspiration.',kind:'nose',accent:'#FFC66D'},
{title:'CHEST RETRACTIONS',sub:'Indrawing of the intercostal or subcostal spaces.',kind:'chest',accent:'#FFC66D'},
{title:'EXPIRATORY GRUNTING',sub:'A sound that may help maintain end-expiratory pressure.',kind:'sound',accent:'#FFC66D'},
{title:'CYANOSIS & HYPOXEMIA',sub:'Assess color, oxygen saturation and perfusion.',kind:'oxygen',accent:'#FF7185'},
{title:'CAUSES: TTN',sub:'Transient tachypnea: delayed clearance of fetal lung fluid.',kind:'fluid',accent:'#65B8FF'},
{title:'CAUSES: RDS',sub:'Surfactant deficiency, especially in preterm infants.',kind:'alveoli',accent:'#65B8FF'},
{title:'CAUSES: MAS',sub:'Meconium aspiration can obstruct and inflame airways.',kind:'airway',accent:'#65B8FF'},
{title:'CAUSES: INFECTION',sub:'Pneumonia or sepsis may present with respiratory distress.',kind:'bacteria',accent:'#65B8FF'},
{title:'OTHER IMPORTANT CAUSES',sub:'Pneumothorax, congenital heart or lung disease.',kind:'xray',accent:'#65B8FF'},
{title:'INITIAL ASSESSMENT',sub:'Airway • Breathing • Circulation • Temperature • Glucose',kind:'assessment',accent:'#4DE1D2'},
{title:'MONITOR CLOSELY',sub:'Work of breathing, respiratory rate and SpO₂.',kind:'monitor',accent:'#4DE1D2'},
{title:'SUPPORT OXYGENATION',sub:'Give oxygen when indicated; consider CPAP for suitable infants.',kind:'support',accent:'#4DE1D2'},
{title:'INVESTIGATE THE CAUSE',sub:'Blood gas, chest imaging and infection work-up as indicated.',kind:'tests',accent:'#4DE1D2'},
{title:'TREAT THE UNDERLYING CAUSE',sub:'Management depends on gestation, severity and diagnosis.',kind:'treatment',accent:'#4DE1D2'},
{title:'URGENT RED FLAGS',sub:'Apnea, exhaustion, severe hypoxemia or poor perfusion.',kind:'alert',accent:'#FF7185'},
{title:'EARLY RECOGNITION SAVES LIVES',sub:'Assess promptly • Support safely • Escalate early',kind:'end',accent:'#4DE1D2'}
];
const C = ({children}:{children:React.ReactNode}) => <>{children}</>;
const Visual:React.FC<{kind:string;accent:string;frame:number}> = ({kind,accent,frame}) => {
 const pulse=1+0.035*Math.sin(frame/8);
 const circle=(x:number,y:number,r:number,fill:string,opacity=1)=><circle cx={x} cy={y} r={r} fill={fill} opacity={opacity}/>;
 const line=(x1:number,y1:number,x2:number,y2:number,stroke=accent,w=12)=><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={w} strokeLinecap="round"/>;
 return <svg viewBox="0 0 700 600" width="100%" height="100%" fill="none">
  <defs><radialGradient id="glow"><stop stopColor={accent} stopOpacity=".35"/><stop offset="1" stopColor={accent} stopOpacity="0"/></radialGradient></defs>
  {circle(350,300,245,'url(#glow)')}
  {kind==='intro'||kind==='end'? <g transform={`translate(0 0) scale(${pulse})`} transformOrigin="350 300">{circle(350,280,150,'#153B53')}<path d="M350 150v110m0 0c-55-55-145-12-145 70 0 80 80 115 145 42 65 73 145 38 145-42 0-82-90-125-145-70" stroke={accent} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/></g>:
  kind==='baby'?<g><circle cx="350" cy="180" r="90" fill="#F0B99D"/><path d="M220 520c5-150 65-230 130-230s125 80 130 230" fill="#2D6077"/><path d="M275 170q75-65 150 0" stroke="#784B48" strokeWidth="16" strokeLinecap="round"/></g>:
  kind==='lungs'||kind==='chest'||kind==='alveoli'||kind==='fluid'||kind==='airway'?<g transform={`translate(0 0) scale(${pulse})`} transformOrigin="350 300"><path d="M350 115v170" stroke="#D9E8F0" strokeWidth="24" strokeLinecap="round"/><path d="M350 255c-35-70-75-105-110-80-60 45-95 160-65 245 24 68 112 63 175-5" fill="#E86D85" fillOpacity=".78" stroke="#FF9AAD" strokeWidth="10"/><path d="M350 255c35-70 75-105 110-80 60 45 95 160 65 245-24 68-112 63-175-5" fill="#E86D85" fillOpacity=".78" stroke="#FF9AAD" strokeWidth="10"/>{line(350,265,260,360)}{line(350,265,440,360)}{kind==='alveoli'&&[0,1,2,3,4,5].map(i=>circle(250+(i%3)*35,370+Math.floor(i/3)*38,24,accent,.9))}{kind==='fluid'&&[0,1,2,3,4].map(i=>circle(215+i*65,430+(i%2)*35,10,'#65B8FF'))}</g>:
  kind==='rate'||kind==='monitor'?<g>{Array.from({length:7},(_,i)=><rect key={i} x={105+i*75} y={300-Math.sin((frame/5)+i*.7)*80} width="38" height="150" rx="19" fill={accent} opacity=".85"/>)}<text x="350" y="520" textAnchor="middle" fill="white" fontSize="58" fontWeight="bold">{kind==='rate'?' >60 / MIN':'SpO₂'}</text></g>:
  kind==='nose'?<g><path d="M290 180q-30 120 0 190q60 55 120 0q30-70 0-190" stroke="#F0B99D" strokeWidth="28" strokeLinecap="round"/><path d="M300 370q50 55 100 0" stroke={accent} strokeWidth="16" strokeLinecap="round"/>{circle(280,390,20,accent)}{circle(420,390,20,accent)}</g>:
  kind==='sound'?<g>{[1,2,3,4].map(i=><path key={i} d={`M${350+i*35} ${180-i*22}q${90+i*20} 120 0 240`} stroke={accent} strokeWidth="12" strokeLinecap="round" opacity={1-i*.16}/>) }<path d="M190 350h150l35-90 45 180 35-90h60" stroke="white" strokeWidth="18" strokeLinejoin="round"/></g>:
  kind==='oxygen'||kind==='support'?<g>{circle(350,300,155,'#1A536C')}{circle(350,300,115,'#163A52') }<text x="350" y="330" textAnchor="middle" fontSize="88" fontWeight="bold" fill={accent}>{kind==='oxygen'?'O₂':'CPAP'}</text>{[0,1,2,3,4,5].map(i=>circle(350+Math.cos(i*Math.PI/3)*210,300+Math.sin(i*Math.PI/3)*210,15,accent))}</g>:
  kind==='bacteria'||kind==='alert'?<g>{circle(350,300,130,kind==='alert'?'#5A2338':'#254D66')}{[0,1,2,3,4,5,6,7].map(i=><g key={i}>{line(350+Math.cos(i*Math.PI/4)*100,300+Math.sin(i*Math.PI/4)*100,350+Math.cos(i*Math.PI/4)*160,300+Math.sin(i*Math.PI/4)*160,accent,8)}{circle(350+Math.cos(i*Math.PI/4)*100,300+Math.sin(i*Math.PI/4)*100,18,accent)}</g>)}<text x="350" y="330" textAnchor="middle" fontSize="100" fill="white">{kind==='alert'?'!':'+'}</text></g>:
  kind==='xray'||kind==='tests'?<g><rect x="180" y="100" width="340" height="400" rx="35" fill="#152F45" stroke={accent} strokeWidth="10"/><path d="M350 150v300m0-230c-50-65-125-25-130 65-5 90 55 140 130 90m0-155c50-65 125-25 130 65 5 90-55 140-130 90" stroke="#A9D8E8" strokeWidth="18" strokeLinecap="round"/></g>:
  <g>{circle(350,300,150,'#16425A')}{Array.from({length:5},(_,i)=><rect key={i} x={230} y={170+i*65} width={240-i*28} height="24" rx="12" fill={accent} opacity={.95-i*.12}/>)}</g>}
 </svg>;
};
export const NeonatalRespiratoryDistress:React.FC=()=>{
 const frame=useCurrentFrame(); const {fps}=useVideoConfig();
 const sceneFrames=67.5; const overlap=7;
 return <AbsoluteFill style={{background:'#071827',fontFamily:'Arial, sans-serif',color:'#F4FAFD',overflow:'hidden'}}>
  <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 38%, #153B50 0%, #071827 68%)'}}/>
  <div style={{position:'absolute',top:70,left:64,right:64,display:'flex',justifyContent:'space-between',fontSize:24,letterSpacing:5,color:'#9DB9C8'}}><span>NEONATAL CARE</span><span>MEDICAL MOTION</span></div>
  {scenes.map((s,i)=>{
   const start=Math.round(i*sceneFrames); const local=frame-start;
   const opacity=interpolate(local,[0,overlap,sceneFrames-overlap,sceneFrames],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
   const y=interpolate(local,[0,sceneFrames],[45,-20],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
   if(frame<start-overlap||frame>start+sceneFrames) return null;
   return <AbsoluteFill key={i} style={{opacity,justifyContent:'center',alignItems:'center',padding:'120px 72px',transform:`translateY(${y}px)`}}>
    <div style={{width:'100%',height:620,marginBottom:50}}><Visual kind={s.kind} accent={s.accent} frame={local}/></div>
    <div style={{fontSize:22,fontWeight:700,letterSpacing:6,color:s.accent,marginBottom:24}}> {String(i+1).padStart(2,'0')} / 20 </div>
    <div style={{fontSize:54,lineHeight:1.12,fontWeight:900,textAlign:'center',letterSpacing:1,maxWidth:900}}>{s.title}</div>
    <div style={{fontSize:31,lineHeight:1.4,textAlign:'center',color:'#B9D0DC',marginTop:28,maxWidth:850}}>{s.sub}</div>
   </AbsoluteFill>;
  })}
  <div style={{position:'absolute',bottom:65,left:64,right:64,height:6,background:'#244252',borderRadius:10,overflow:'hidden'}}><div style={{height:'100%',width:`${(frame/1349)*100}%`,background:'#4DE1D2'}}/></div>
 </AbsoluteFill>;
};
