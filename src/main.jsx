import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Play, Volume2, X } from 'lucide-react';
import './style.css';

const projects = [
  { n:'01', title:'Inverted Clock', category:'3D Animation', categoryZh:'三维动画', description:'The short film tells a story that takes place in a clock shop. A woman comes to the clock shop every day with food to find a boy to fix clocks, but the clocks in the shop keeps rotating backwards...', descriptionZh:'短片讲述了一个发生在钟表店里的故事。一位女人每天带着食物来到店里，寻找一位修钟的男孩。然而，店里的钟却总在不断倒转……', designs:['media/inverted-clock-design-01.webp','media/inverted-clock-design-02.webp'], theme:'choice', video:'media/inverted-clock.mp4', cover:'media/inverted-clock-cover.webp', ambient:'#bedbd9' },
  { n:'02', title:'Deer Path', category:'2D Animation', categoryZh:'二维动画', description:'Seeking a colorful lake, a girl hesitates before two diverging paths. Ignoring a mysterious colorful deer, she follows the brighter path and becomes trapped in fear and regret. Guided by the deer once more, she discovers both roads converge, reaching the lake where color, choice, and self-acceptance finally unite.', descriptionZh:'一个女孩在寻找彩色湖泊的途中，面对两条分岔路犹豫不决。她没有理会神秘的彩色鹿，而是选择了看起来更明亮的那条路，最终陷入恐惧与悔恨。在彩色鹿的再次引导下，她发现两条路其实殊途同归，并最终抵达湖边，在那里与色彩、选择和自我接纳重新相遇。', designs:['media/deer-path-design-01.webp','media/deer-path-design-02.webp'], theme:'seed', video:'media/deer-path.mp4', cover:'media/deer-path-cover.jpg', ambient:'#cbc7c0' },
  { n:'03', title:'The Lost Hometown', category:'Experimental Animation', categoryZh:'实验动画', description:'This short film predominantly utilizes frame-by-frame animation, integrated with live-action experimental animation. It narrates the story of “I” learning about the history of coastal reclamation and land filling in my hometown through conversations with my father. The film showcases the transformations before and after the reclamation in my hometown and the initiatives to replant forests, exploring the mutual impact and inherent contradictions between humans and the natural environment.', descriptionZh:'本片以逐帧动画为主，并结合真人影像进行实验性创作。故事中的“我”通过与父亲交谈，逐渐了解家乡围海造地的历史。影片呈现了家乡填海前后的变化，以及植树造林的行动，并探讨人类与自然环境之间相互影响又彼此矛盾的关系。', designs:['media/lost-hometown-design-01.webp','media/lost-hometown-design-02.webp'], theme:'river', video:'media/lost-hometown.mp4', cover:'media/lost-hometown-cover.webp', ambient:'#ddd2bd' },
];
const labs = [
  { name:'桃黑黑', mark:'✳', video:'media/play-01-taohei.mp4' }, { name:'猫猫', mark:'◉', video:'media/play-02-cat.mp4' }, { name:'桃黑黑加载中', mark:'☼', video:'media/play-03-loading.mp4' },
  { name:'蘑菇蘑菇', mark:'⌁', video:'media/play-04-mushroom.mp4' }, { name:'终版', mark:'✳', video:'media/play-05-final.mp4' }, { name:'wild life', mark:'☾', video:'media/play-06-wildlife.mp4' },
  { name:'飞鸟', mark:'✦', video:'media/play-07-birds.mp4' }, { name:'seasons', mark:'❋', video:'media/play-08-seasons.mp4' }, { name:'night', mark:'◌', video:'media/play-09-night.mp4' },
];

function LazyLoopVideo({ src, className }) {
  const videoRef = useRef(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let inView = false;
    const playIfVisible = () => {
      if (inView && !document.hidden) video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      playIfVisible();
    }, { rootMargin: '0px', threshold: 0.05 });
    const handleVisibility = () => playIfVisible();
    observer.observe(video);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      video.pause();
    };
  }, [src]);
  return <video ref={videoRef} className={className} src={src} muted loop playsInline preload="none" controlsList="nodownload" onContextMenu={event=>event.preventDefault()}/>;
}

function App(){
  const [active,setActive]=useState(null); const [featured,setFeatured]=useState(0); const [mascotFast,setMascotFast]=useState(false); const [mascotLeaving,setMascotLeaving]=useState(false); const [lightbox,setLightbox]=useState(null); const [language,setLanguage]=useState('en');
  const zh=language==='zh';
  useEffect(()=>{document.documentElement.lang=zh?'zh-CN':'en'},[zh]);
  const heroVideoRef=useRef(null);
  useEffect(()=>{
    if(!lightbox)return;
    const previousOverflow=document.body.style.overflow;
    const handleKeyDown=(event)=>{if(event.key==='Escape')setLightbox(null)};
    document.body.style.overflow='hidden';
    window.addEventListener('keydown',handleKeyDown);
    return()=>{document.body.style.overflow=previousOverflow;window.removeEventListener('keydown',handleKeyDown)};
  },[lightbox]);
  useEffect(()=>{
    const video=heroVideoRef.current;
    const source=video?.querySelector('source');
    const videoUrl=source?.dataset.src;
    if(!video||!source||!videoUrl||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const startVideo=()=>{
      source.src=videoUrl;
      source.removeAttribute('data-src');
      video.load();
      video.play().catch(()=>{});
    };
    if('requestIdleCallback' in window){
      const idleId=window.requestIdleCallback(startVideo,{timeout:1800});
      return()=>window.cancelIdleCallback(idleId);
    }
    const timeoutId=window.setTimeout(startVideo,450);
    return()=>window.clearTimeout(timeoutId);
  },[]);
  const selectProject=(step)=>setFeatured((featured+step+projects.length)%projects.length);
  const close=()=>setActive(null);
  return <>
    <main>
      <section className="hero" id="home"><div className="hero-film"><video ref={heroVideoRef} className="hero-background-video" muted loop playsInline preload="none" aria-hidden="true" controlsList="nodownload" onContextMenu={event=>event.preventDefault()}><source data-src="media/hero-background.mp4" type="video/mp4"/></video><div className="hero-video-tint"></div><div className="film-grain"></div></div>
        <div className="hero-gallery"><div className="hero-title-grid"><h1 className="hero-name">Yuduo Lin</h1><nav className="hero-section-nav is-sticky" aria-label={zh?'主导航':'Main navigation'}><a href="#work">{zh?'作品':'Work'}</a><a href="#play">{zh?'动画练习':'Play'}</a><a href="#about">{zh?'关于我':'About'}</a><button type="button" className="language-toggle" onClick={()=>setLanguage(zh?'en':'zh')} aria-label={zh?'Switch language to English':'切换为中文'}>{zh?'EN':'中文'}</button></nav><div className="hero-socials"><a href="https://www.instagram.com/yuduo_danica?stkn=MWZoNWd3bWZveDJnMg==" target="_blank" rel="noreferrer" aria-label="Instagram"><span className="instagram-glyph">◎</span></a><a href="https://xhslink.cn/o/2TniEhDZuoS" target="_blank" rel="noreferrer" aria-label="小红书"><span className="redbook-glyph">小红书</span></a></div></div>
          <p className="hero-bio">{zh?'这里是Yuduo Lin的个人动画网站，包含动画短片和一些小动画练习。':'Welcome to Yuduo Lin’s world of animation — a collection of animation shorts and playful motion experiments.'}</p><a className="hero-scroll" href="#work" aria-label={zh?'向下浏览作品':'Scroll to selected work'}><ArrowDown size={20}/></a>
        </div>
      </section>
      <section className="work showcase" id="work" style={{'--work-color':projects[featured].ambient}}><div className="showcase-heading"><span className="mono">{zh?'01 / 精选作品':'01 / SELECTED WORK'}</span><h2>{zh?'精选作品':<>Selected <em>Work</em></>}</h2></div>
        <div className="showcase-tabs" role="tablist" aria-label={zh?'选择精选项目':'Select a featured project'}>{projects.map((p,i)=><button key={p.n} role="tab" aria-selected={i===featured} className={i===featured?'active':''} onClick={()=>setFeatured(i)}>{zh?p.categoryZh:p.category}</button>)}</div>
        <div className={`showcase-frame art-${projects[featured].theme}`}><video key={projects[featured].video} className="showcase-video" poster={projects[featured].cover} controls playsInline preload="none" controlsList="nodownload" onContextMenu={event=>event.preventDefault()}><source src={projects[featured].video} type="video/mp4"/></video><button className="showcase-arrow previous" onClick={()=>selectProject(-1)} aria-label={zh?'上一个项目':'Previous project'}><ArrowLeft size={19}/></button><button className="showcase-arrow next" onClick={()=>selectProject(1)} aria-label={zh?'下一个项目':'Next project'}><ArrowRight size={19}/></button><span className="showcase-frame-count">{projects[featured].n} / 03</span></div>
        <div className="showcase-caption"><h3>{projects[featured].title}</h3><span className="showcase-duration">{projects[featured].n} / 03</span></div>
        <section className={`project-details project-details-${projects[featured].theme}`} aria-label={`${projects[featured].title} ${zh?'项目详情':'project details'}`}>
          <div className="project-details-copy"><div className="project-details-label"><span>{zh?'项目介绍':'PROJECT NOTES'}</span><span>{projects[featured].n} — 03</span></div><h3>{projects[featured].title}</h3><p>{zh?projects[featured].descriptionZh:projects[featured].description||'Project description will be added here.'}</p></div>
          <div className={`project-designs${projects[featured].designs?.length>2?' has-overflow':''}`} aria-label={zh?'项目设计图':'Project design images'}>
            <div className="project-design-track">
              <div className="project-design-group">
                {projects[featured].designs?.length ? projects[featured].designs.map((src,index)=><figure className="project-design-image" key={src}><button className="project-design-open" type="button" onClick={()=>setLightbox({src,title:projects[featured].title,index:index+1})} aria-label={zh?`放大查看${projects[featured].title}设计图${index+1}`:`Enlarge ${projects[featured].title} design image ${index+1}`}><img src={src} alt={zh?`${projects[featured].title}设计图${index+1}`:`${projects[featured].title} design image ${index+1}`} loading="lazy"/></button></figure>) : <><div className="project-design-slot"><span className="design-slot-index">{zh?'设计图':'DESIGN IMAGE'} / 01</span><span className="design-slot-mark">＋</span></div><div className="project-design-slot"><span className="design-slot-index">{zh?'设计图':'DESIGN IMAGE'} / 02</span><span className="design-slot-mark">＋</span></div></>}
              </div>
              {projects[featured].designs?.length>2&&<div className="project-design-group" aria-hidden="true">{projects[featured].designs.map((src,index)=><figure className="project-design-image" key={`copy-${src}`}><button className="project-design-open" type="button" tabIndex={-1} onClick={()=>setLightbox({src,title:projects[featured].title,index:index+1})} aria-label={`Enlarge ${projects[featured].title} design image ${index+1}`}><img src={src} alt="" loading="lazy"/></button></figure>)}</div>}
            </div>
          </div>
        </section>
        <div className="showcase-thumbnails">{projects.map((p,i)=><button key={p.n} onClick={()=>setFeatured(i)} className={`showcase-thumb art-${p.theme} ${i===featured?'active':''}`} aria-label={zh?`选择${p.title}`:`Select ${p.title}`}><span className="thumb-art"><img src={p.cover} alt="" loading="lazy"/></span><span className="thumb-name">{p.title}</span></button>)}</div>
      </section>
      <section className="lab-section play-section" id="play"><div className="play-heading"><span className="mono">{zh?'02 / 动画练习':'02 / PLAY'}</span><h2>{zh?'动画片段':'Animation Fragments'}</h2></div><div className="play-viewport" aria-label={zh?'循环播放的动画练习':'Looping animation experiments'}><div className="play-track"><div className="play-group">{labs.map((lab,i)=><button className="play-card" key={lab.name} onClick={()=>setActive({title:'',type:'',year:'',theme:`lab-${i+1}`,video:lab.video,desc:''})} aria-label={zh?`播放${lab.name}动画`:`Open ${lab.name} animation`}><div className={`play-poster poster-${i+1} has-video`}><LazyLoopVideo className="play-video" src={lab.video}/><Play size={18} fill="currentColor" className="poster-play"/></div></button>)}</div><div className="play-group play-group-copy" aria-hidden="true">{labs.map((lab,i)=><div className="play-card" key={`copy-${lab.name}`}><div className={`play-poster poster-${i+1} has-video`}><LazyLoopVideo className="play-video" src={lab.video}/><Play size={18} fill="currentColor" className="poster-play"/></div></div>)}</div></div></div></section>
      <section className="about about-profile" id="about"><span className="mono about-section-kicker">{zh?'03 / 关于我':'03 / ABOUT'}</span><div className="about-sky"></div><article className="about-card"><img className="about-avatar" src="media/yuduo-avatar.jpg" alt={zh?'Yuduo的插画肖像':'Illustrated portrait of Yuduo'}/><span className="about-greeting">{zh?'动画师':'ANIMATOR'}</span><h2>{zh?'因好奇而探索，':'Curious by nature.'}<br/>{zh?'为热爱而画。':'Animator by choice.'}</h2><p className="about-description">{zh?'我是一名动画师，作品涵盖二维与三维动画，喜欢通过诗意的视觉叙事探索情感、记忆与个人故事。':'I’m Yuduo, an animator working across 2D and 3D, exploring emotion, memory, and personal reflection through poetic visual storytelling.'}</p><div className="about-facts"><span>{zh?'动画硕士 · 伦敦艺术大学':'MA Animation · UAL'}</span><span>{zh?'二维 / 三维 / 合成':'2D / 3D / Compositing'}</span></div><div className="about-socials"><a href="https://www.instagram.com/yuduo_danica?stkn=MWZoNWd3bWZveDJnMg==" target="_blank" rel="noreferrer" aria-label="Instagram">IG</a><a href="https://xhslink.cn/o/2TniEhDZuoS" target="_blank" rel="noreferrer" aria-label="小红书">小红书</a></div><a href="#work" className="about-browse">{zh?'浏览作品':'Browse Works'} <ArrowUpRight size={16}/></a></article></section>
      <footer className="footer"><div className="footer-top"><span className="mono">{zh?'倾听你的故事':'HAVE A GOOD STORY?'}</span><span className="mono">{zh?'03 / 下一帧，由你来定':'03 / THE NEXT FRAME IS YOURS'}</span></div><div className="footer-main"><h2>{zh?<>让故事<br/><em>动起来。</em></>:<>Let’s make<br/><em>something move.</em></>}</h2><a href="mailto:linduod195@gmail.com" className="footer-cta">{zh?'聊聊你的项目':'TELL ME ABOUT IT'} <ArrowUpRight size={18}/></a></div><div className="footer-links"><a href="mailto:linduod195@gmail.com">LINDUOD195@GMAIL.COM</a><a href="tel:+447344369495">+44 7344 369 495</a><a href="#home" className="back-top">{zh?'返回顶部':'BACK TO TOP'} <ArrowUpRight size={13}/></a></div><div className="footer-bottom"><a href="#home" className="wordmark">YL<span>✳</span></a><span>{zh?'设计与动画：YUDUO LIN':'DESIGNED & ANIMATED BY YUDUO LIN'}</span></div></footer>
    </main>
    <div className={`floating-mascot${mascotFast?' is-hovered':''}${mascotLeaving?' is-leaving':''}`} role="img" aria-label="Animated drawing mascot" onMouseEnter={()=>{setMascotLeaving(false);setMascotFast(true)}} onMouseLeave={()=>{setMascotFast(false);setMascotLeaving(true)}}>
      <img src={mascotFast?'media/draw-mascot-fast.gif':'media/draw-mascot.gif'} alt="" draggable="false" onAnimationEnd={()=>setMascotLeaving(false)}/>
    </div>
    {lightbox&&<div className="design-lightbox" role="dialog" aria-modal="true" aria-label={zh?`${lightbox.title}设计图${lightbox.index}`:`${lightbox.title} design image ${lightbox.index}`} onClick={()=>setLightbox(null)}><button className="design-lightbox-close" type="button" onClick={()=>setLightbox(null)} aria-label={zh?'关闭放大图片':'Close enlarged image'}><X size={22}/></button><div className="design-lightbox-content" onClick={event=>event.stopPropagation()}><img src={lightbox.src} alt={zh?`${lightbox.title}设计图${lightbox.index}`:`${lightbox.title} design image ${lightbox.index}`}/><div className="design-lightbox-caption"><span>{lightbox.title}</span><span>{String(lightbox.index).padStart(2,'0')} / {String(projects[featured].designs.length).padStart(2,'0')}</span></div></div></div>}
    {active&&<div className="modal-backdrop" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={close} aria-label={zh?'关闭':'Close'}><X/></button>{active.video?<video className="modal-video" src={active.video} autoPlay muted loop playsInline controls controlsList="nodownload" onContextMenu={event=>event.preventDefault()}/>:<div className={`modal-screen art-${active.theme}`}><div className="modal-shape"></div><div className="modal-message"><span className="mono">{active.type||(zh?'动画练习':'ANIMATION STUDY')}</span><h3>{active.title}</h3><p>{active.desc}</p><span className="mono media-note"><Volume2 size={14}/> {zh?'动画预览 — 暂无视频':'FILM PREVIEW — MEDIA TO BE ADDED'}</span></div></div>}<div className="modal-bottom"><span>{active.title}</span><span>{active.year}</span></div></div></div>}
  </>
}
createRoot(document.getElementById('root')).render(<App/>);
