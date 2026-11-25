import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {SCENE_DURATIONS, SCENE_NARRATION} from './generated-timing';

type Scene = {title:string; sub:string; caption:string; kind:string; accent:string};
const scenes:Scene[] = [
{title:'الرضاعة الطبيعية',sub:'بداية صحية لطفلك من أول يوم',caption:'الرضاعة الطبيعية: بداية صحية لحديثي الولادة',kind:'intro',accent:'#4DE1D2'},
{title:'أفضل بداية غذائية',sub:'لبن الأم بيتغير حسب احتياجات الطفل',caption:'لبن الأم غذاء متكامل ومناسب لاحتياجات الرضيع',kind:'baby',accent:'#4DE1D2'},
{title:'اللبأ: أول لبن',sub:'لبن مركز غني بالأجسام المضادة',caption:'اللبأ غني بعوامل المناعة ومهم في الأيام الأولى',kind:'fluid',accent:'#FFC66D'},
{title:'ابدئي بدري',sub:'ملامسة الجلد للجلد وبدء الرضاعة خلال أول ساعة إذا أمكن',caption:'ابدئي الرضاعة خلال الساعة الأولى إذا كانت الحالة تسمح',kind:'baby',accent:'#4DE1D2'},
{title:'فوائد للطفل',sub:'يدعم النمو ويساعد في الحماية من بعض العدوى',caption:'الرضاعة الطبيعية تدعم صحة ونمو الطفل',kind:'lungs',accent:'#4DE1D2'},
{title:'فوائد للأم',sub:'لها فوائد صحية مهمة على المدى القريب والبعيد',caption:'للرضاعة الطبيعية فوائد صحية للأم أيضاً',kind:'mother',accent:'#4DE1D2'},
{title:'الوضعية الصحيحة',sub:'جسم الطفل مواجه لجسم الأم والرأس والرقبة في خط واحد',caption:'خلي جسم الطفل قريب ومواجه لجسمك',kind:'position',accent:'#65B8FF'},
{title:'الالتقام الصحيح',sub:'الفم مفتوح جيداً والذقن قريب من الثدي',caption:'ساعدي الطفل يفتح فمه كويس قبل الالتقام',kind:'latch',accent:'#65B8FF'},
{title:'مش الحلمة بس',sub:'الفم يلتقط جزءاً كبيراً من الهالة',caption:'الالتقام يشمل جزءاً كبيراً من الهالة',kind:'latch',accent:'#65B8FF'},
{title:'علامات الرضاعة الجيدة',sub:'مص منتظم وبلع مسموع دون ألم مستمر',caption:'راقبي المص والبلع وراحة الأم أثناء الرضاعة',kind:'check',accent:'#4DE1D2'},
{title:'اعرفي علامات الجوع',sub:'تحريك الفم والبحث وضم اليد للفم',caption:'قدمي الرضعة عند ظهور علامات الجوع المبكرة',kind:'cues',accent:'#FFC66D'},
{title:'عدد الرضعات',sub:'غالباً 8 إلى 12 رضعة خلال 24 ساعة في البداية',caption:'معظم حديثي الولادة يرضعون 8–12 مرة يومياً',kind:'rate',accent:'#FFC66D'},
{title:'مدة الرضعة',sub:'دعي الطفل يكمل، ثم اعرضي الثدي الآخر',caption:'اتركي الطفل ينهي الرضعة ثم اعرضي الثدي الآخر',kind:'clock',accent:'#4DE1D2'},
{title:'الحفاضات المبلولة',sub:'بعد اليوم الخامس: غالباً 6 حفاضات أو أكثر يومياً',caption:'ست حفاضات مبلولة أو أكثر يومياً بعد اليوم الخامس',kind:'diaper',accent:'#4DE1D2'},
{title:'تغير لون البراز',sub:'من العقي الداكن إلى الأصفر تدريجياً',caption:'لون البراز يتغير تدريجياً خلال الأيام الأولى',kind:'stool',accent:'#FFC66D'},
{title:'هل لازم يتجشأ؟',sub:'التجشؤ قد يساعد بعض الأطفال، وليس شرطاً بعد كل رضعة',caption:'التجشؤ مفيد لبعض الأطفال وليس ضرورياً دائماً',kind:'burp',accent:'#65B8FF'},
{title:'ألم أو تشققات؟',sub:'راجعي الوضعية والالتقام واطلبي مساعدة مختصة',caption:'الألم المستمر يستحق مراجعة الالتقام وطلب الدعم',kind:'alert',accent:'#FF7185'},
{title:'علامات تستدعي التقييم',sub:'خمول أو ضعف رضاعة أو قلة بول أو جفاف',caption:'اطلبي تقييماً طبياً سريعاً عند ظهور علامات الخطر',kind:'alert',accent:'#FF7185'},
{title:'أول ستة أشهر',sub:'رضاعة طبيعية حصرية دون ماء أو أعشاب',caption:'الرضاعة الطبيعية الحصرية موصى بها لأول 6 أشهر',kind:'six',accent:'#4DE1D2'},
{title:'كل بداية تستحق الدعم',sub:'اطلبي المساعدة مبكراً واتبعي إرشادات فريقك الطبي',caption:'الدعم المبكر يصنع فرقاً للأم والطفل',kind:'end',accent:'#4DE1D2'}
];
const Visual:React.FC<{kind:string;accent:string;frame:number}> = ({kind,accent,frame}) => {
 const pulse=1+0.035*Math.sin(frame/8);
 const circle=(x:number,y:number,r:number,fill:string,opacity=1)=><circle cx={x} cy={y} r={r} fill={fill} opacity={opacity}/>;
 const line=(x1:number,y1:number,x2:number,y2:number,stroke=accent,w=12)=><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={w} strokeLinecap="round"/>;
 return <svg viewBox="0 0 700 600" width="100%" height="100%" fill="none">
  <defs><radialGradient id="glow"><stop stopColor={accent} stopOpacity=".35"/><stop offset="1" stopColor={accent} stopOpacity="0"/></radialGradient></defs>
  {circle(350,300,245,'url(#glow)')}
  {kind==='intro'||kind==='end'? <g transform={`scale(${pulse})`} transformOrigin="350 300">{circle(350,280,150,'#153B53')}<path d="M350 150v110m0 0c-55-55-145-12-145 70 0 80 80 115 145 42 65 73 145 38 145-42 0-82-90-125-145-70" stroke={accent} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/></g>:
  kind==='baby'||kind==='mother'||kind==='position'||kind==='latch'?<g><circle cx="350" cy="180" r="90" fill="#F0B99D"/><path d="M220 520c5-150 65-230 130-230s125 80 130 230" fill="#2D6077"/><path d="M275 170q75-65 150 0" stroke="#784B48" strokeWidth="16" strokeLinecap="round"/>{kind==='latch'&&<path d="M420 260q45 35 0 70" stroke={accent} strokeWidth="18" strokeLinecap="round"/>}</g>:
  kind==='lungs'||kind==='fluid'?<g transform={`scale(${pulse})`} transformOrigin="350 300"><path d="M350 115v170" stroke="#D9E8F0" strokeWidth="24" strokeLinecap="round"/><path d="M350 255c-35-70-75-105-110-80-60 45-95 160-65 245 24 68 112 63 175-5" fill="#E86D85" fillOpacity=".78" stroke="#FF9AAD" strokeWidth="10"/><path d="M350 255c35-70 75-105 110-80 60 45 95 160 65 245-24 68-112 63-175-5" fill="#E86D85" fillOpacity=".78" stroke="#FF9AAD" strokeWidth="10"/>{line(350,265,260,360)}{line(350,265,440,360)}{kind==='fluid'&&[0,1,2,3,4,5].map(i=>circle(215+i*55,420+(i%2)*35,12,'#65B8FF'))}</g>:
  kind==='rate'||kind==='clock'?<g>{Array.from({length:7},(_,i)=><rect key={i} x={105+i*75} y={300-Math.sin((frame/5)+i*.7)*80} width="38" height="150" rx="19" fill={accent} opacity=".85"/>)}<text x="350" y="520" textAnchor="middle" fill="white" fontSize="58" fontWeight="bold">{kind==='rate'?'8–12 / يوم':'رضاعة حسب الطفل'}</text></g>:
  kind==='alert'?<g>{circle(350,300,130,'#5A2338')}{[0,1,2,3,4,5,6,7].map(i=><g key={i}>{line(350+Math.cos(i*Math.PI/4)*100,300+Math.sin(i*Math.PI/4)*100,350+Math.cos(i*Math.PI/4)*160,300+Math.sin(i*Math.PI/4)*160,accent,8)}{circle(350+Math.cos(i*Math.PI/4)*100,300+Math.sin(i*Math.PI/4)*100,18,accent)}</g>)}<text x="350" y="330" textAnchor="middle" fontSize="100" fill="white">!</text></g>:
  <g>{circle(350,300,150,'#16425A')}{Array.from({length:5},(_,i)=><rect key={i} x={230} y={170+i*65} width={240-i*28} height="24" rx="12" fill={accent} opacity={.95-i*.12}/>)}<text x="350" y="475" textAnchor="middle" fill="white" fontSize="36" fontWeight="bold">{kind==='six'?'6 أشهر':kind==='diaper'?'6+ حفاضات':kind==='stool'?'تغير تدريجي':kind==='burp'?'تجشؤ':'علامات الجوع'}</text></g>}
 </svg>;
};
export const BreastfeedingNewborn:React.FC=()=>{
 const frame=useCurrentFrame(); const overlap=7;
 const sceneStarts=SCENE_DURATIONS.map((_,i)=>SCENE_DURATIONS.slice(0,i).reduce((a,b)=>a+b,0));
 return <AbsoluteFill style={{background:'#071827',fontFamily:'Arial, sans-serif',color:'#F4FAFD',overflow:'hidden'}}>
  <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 38%, #153B50 0%, #071827 68%)'}}/>
  <div style={{position:'absolute',top:62,left:48,right:48,display:'flex',justifyContent:'space-between',fontSize:21,letterSpacing:2,color:'#9DB9C8'}}><span>NEWBORN CARE</span><span>تثقيف طبي</span></div>
  {scenes.map((s,i)=>{
   const start=sceneStarts[i]; const sceneFrames=SCENE_DURATIONS[i]; const local=frame-start;
   const opacity=interpolate(local,[0,overlap,sceneFrames-overlap,sceneFrames],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
   const y=interpolate(local,[0,sceneFrames],[38,-18],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
   if(frame<start-overlap||frame>start+sceneFrames) return null;
   return <React.Fragment key={i}>
    <Sequence from={start} durationInFrames={sceneFrames}><Audio src={staticFile(`narration/scene-${String(i+1).padStart(2,'0')}.mp3`)} /></Sequence>
    <AbsoluteFill style={{opacity,justifyContent:'center',alignItems:'center',padding:'105px 58px 235px',transform:`translateY(${y}px)`}}>
    <div style={{width:'100%',height:570,marginBottom:28}}><Visual kind={s.kind} accent={s.accent} frame={local}/></div>
    <div style={{fontSize:24,fontWeight:800,letterSpacing:2,color:s.accent,marginBottom:20}}>المشهد {String(i+1).padStart(2,'0')} / 20</div>
    <div dir="rtl" style={{fontSize:53,lineHeight:1.2,fontWeight:900,textAlign:'center',maxWidth:900}}>{s.title}</div>
    <div dir="rtl" style={{fontSize:30,lineHeight:1.45,textAlign:'center',color:'#B9D0DC',marginTop:22,maxWidth:870}}>{s.sub}</div>
    <div dir="rtl" style={{position:'absolute',bottom:65,left:42,right:42,minHeight:105,padding:'18px 24px',borderRadius:22,background:'rgba(3,14,24,.88)',border:'1px solid rgba(77,225,210,.35)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:25,lineHeight:1.35,textAlign:'center',fontWeight:700,color:'#FFFFFF'}}>{SCENE_NARRATION[i]}</div>
   </AbsoluteFill>
   </React.Fragment>;
  })}
  <div style={{position:'absolute',bottom:28,left:48,right:48,height:5,background:'#244252',borderRadius:10,overflow:'hidden'}}><div style={{height:'100%',width:`${(frame/Math.max(1,SCENE_DURATIONS.reduce((a,b)=>a+b,0)-1))*100}%`,background:'#4DE1D2'}}/></div>
 </AbsoluteFill>;
};
