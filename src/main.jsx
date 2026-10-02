import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Play, Volume2, X } from 'lucide-react';
import './style.css';

const projects = [
  { n:'01', title:'Inverted Clock', category:'3D Animation', description:'The short film tells a story that takes place in a clock shop. A woman comes to the clock shop every day with food to find a boy to fix clocks, but the clocks in the shop keeps rotating backwards...', designs:['media/inverted-clock-design-01.webp','media/inverted-clock-design-02.webp'], theme:'choice', video:'media/inverted-clock.mp4', cover:'media/inverted-clock-cover.webp', ambient:'#bedbd9' },
  { n:'02', title:'Deer Path', category:'2D Animation', description:'Seeking a colorful lake, a girl hesitates before two diverging paths. Ignoring a mysterious colorful deer, she follows the brighter path and becomes trapped in fear and regret. Guided by the deer once more, she discovers both roads converge, reaching the lake where color, choice, and self-acceptance finally unite.', designs:['media/deer-path-design-01.webp','media/deer-path-design-02.webp'], theme:'seed', video:'media/deer-path.mp4', cover:'media/deer-path-cover.jpg', ambient:'#cbc7c0' },
  { n:'03', title:'The Lost Hometown', category:'Experimental Animation', description:'This short film predominantly utilizes frame-by-frame animation, integrated with live-action experimental animation. It narrates the story of “I” learning about the history of coastal reclamation and land filling in my hometown through conversations with my father. The film showcases the transformations before and after the reclamation in my hometown and the initiatives to replant forests, exploring the mutual impact and inherent contradictions between humans and the natural environment.', designs:['media/lost-hometown-design-01.webp','media/lost-hometown-design-02.webp','media/lost-hometown-design-03.webp'], theme:'river', video:'media/lost-hometown.mp4', cover:'media/lost-hometown-cover.webp', ambient:'#ddd2bd' },
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
  const [active,setActive]=useState(null); const [featured,setFeatured]=useState(0); const [mascotFast,setMascotFast]=useState(false); const [mascotLeaving,setMascotLeaving]=useState(false); const [lightbox,setLightbox]=useState(null);
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
        <div className="hero-gallery"><div className="hero-title-grid"><h1 className="hero-name">Yuduo Lin</h1><nav className="hero-section-nav is-sticky" aria-label="Main navigation"><a href="#work">Work</a><a href="#play">Play</a><a href="#about">About</a></nav><div className="hero-socials"><a href="https://www.instagram.com/yuduo_danica?stkn=MWZoNWd3bWZveDJnMg==" target="_blank" rel="noreferrer" aria-label="Instagram"><span className="instagram-glyph">◎</span></a><a href="https://xhslink.cn/o/2TniEhDZuoS" target="_blank" rel="noreferrer" aria-label="小红书"><span className="redbook-glyph">小红书</span></a></div></div>
          <p className="hero-bio">这里是Yuduo Lin的个人动画网站，包含动画短片和一些小动画练习。<br/>Welcome to Yuduo Lin’s world of animation — a collection of animation shorts and playful motion experiments.</p><a className="hero-scroll" href="#work" aria-label="向下浏览作品"><ArrowDown size={20}/></a>
        </div>
      </section>
      <section className="work showcase" id="work" style={{'--work-color':projects[featured].ambient}}><div className="showcase-heading"><span className="mono">01 / SELECTED WORK</span><h2>Selected <em>Work</em></h2></div>
        <div className="showcase-tabs" role="tablist" aria-label="Select a featured project">{projects.map((p,i)=><button key={p.n} role="tab" aria-selected={i===featured} className={i===featured?'active':''} onClick={()=>setFeatured(i)}>{p.category}</button>)}</div>
        <div className={`showcase-frame art-${projects[featured].theme}`}><video key={projects[featured].video} className="showcase-video" poster={projects[featured].cover} controls playsInline preload="none" controlsList="nodownload" onContextMenu={event=>event.preventDefault()}><source src={projects[featured].video} type="video/mp4"/></video><button className="showcase-arrow previous" onClick={()=>selectProject(-1)} aria-label="Previous project"><ArrowLeft size={19}/></button><button className="showcase-arrow next" onClick={()=>selectProject(1)} aria-label="Next project"><ArrowRight size={19}/></button><span className="showcase-frame-count">{projects[featured].n} / 03</span></div>
        <div className="showcase-caption"><h3>{projects[featured].title}</h3><span className="showcase-duration">{projects[featured].n} / 03</span></div>
        <section className={`project-details project-details-${projects[featured].theme}`} aria-label={`${projects[featured].title} project details`}>
          <div className="project-details-copy"><div className="project-details-label"><span>PROJECT NOTES</span><span>{projects[featured].n} — 03</span></div><h3>{projects[featured].title}</h3><p>{projects[featured].description||'Project description will be added here.'}</p></div>
          <div className={`project-designs${projects[featured].designs?.length>2?' has-overflow':''}`} aria-label="Project design images">
            <div className="project-design-track">
              <div className="project-design-group">
                {projects[featured].designs?.length ? projects[featured].designs.map((src,index)=><figure className="project-design-image" key={src}><button className="project-design-open" type="button" onClick={()=>setLightbox({src,title:projects[featured].title,index:index+1})} aria-label={`Enlarge ${projects[featured].title} design image ${index+1}`}><img src={src} alt={`${projects[featured].title} design image ${index+1}`} loading="lazy"/></button></figure>) : <><div className="project-design-slot"><span className="design-slot-index">DESIGN IMAGE / 01</span><span className="design-slot-mark">＋</span></div><div className="project-design-slot"><span className="design-slot-index">DESIGN IMAGE / 02</span><span className="design-slot-mark">＋</span></div></>}
              </div>
              {projects[featured].designs?.length>2&&<div className="project-design-group" aria-hidden="true">{projects[featured].designs.map((src,index)=><figure className="project-design-image" key={`copy-${src}`}><button className="project-design-open" type="button" tabIndex={-1} onClick={()=>setLightbox({src,title:projects[featured].title,index:index+1})} aria-label={`Enlarge ${projects[featured].title} design image ${index+1}`}><img src={src} alt="" loading="lazy"/></button></figure>)}</div>}
            </div>
          </div>
        </section>
        <div className="showcase-thumbnails">{projects.map((p,i)=><button key={p.n} onClick={()=>setFeatured(i)} className={`showcase-thumb art-${p.theme} ${i===featured?'active':''}`} aria-label={`Select ${p.title}`}><span className="thumb-art"><img src={p.cover} alt="" loading="lazy"/></span><span className="thumb-name">{p.title}</span></button>)}</div>
      </section>
      <section className="lab-section play-section" id="play"><div className="play-heading"><span className="mono">02 / PLAY</span><h2>Animation Fragments</h2></div><div className="play-viewport" aria-label="Looping animation experiments"><div className="play-track"><div className="play-group">{labs.map((lab,i)=><button className="play-card" key={lab.name} onClick={()=>setActive({title:'',type:'',year:'',theme:`lab-${i+1}`,video:lab.video,desc:''})} aria-label={`Open ${lab.name} animation`}><div className={`play-poster poster-${i+1} has-video`}><LazyLoopVideo className="play-video" src={lab.video}/><Play size={18} fill="currentColor" className="poster-play"/></div></button>)}</div><div className="play-group play-group-copy" aria-hidden="true">{labs.map((lab,i)=><div className="play-card" key={`copy-${lab.name}`}><div className={`play-poster poster-${i+1} has-video`}><LazyLoopVideo className="play-video" src={lab.video}/><Play size={18} fill="currentColor" className="poster-play"/></div></div>)}</div></div></div></section>
      <section className="about about-profile" id="about"><span className="mono about-section-kicker">03 / ABOUT</span><div className="about-sky"></div><article className="about-card"><img className="about-avatar" src="media/yuduo-avatar.jpg" alt="Illustrated portrait of Yuduo"/><span className="about-greeting">ANIMATOR</span><h2>Curious by nature.<br/>Animator by choice.</h2><p className="about-description">I’m Yuduo, an animator working across 2D and 3D, exploring emotion, memory, and personal reflection through poetic visual storytelling.</p><div className="about-facts"><span>MA Animation · UAL</span><span>2D / 3D / Compositing</span></div><div className="about-socials"><a href="https://www.instagram.com/yuduo_danica?stkn=MWZoNWd3bWZveDJnMg==" target="_blank" rel="noreferrer" aria-label="Instagram">IG</a><a href="https://xhslink.cn/o/2TniEhDZuoS" target="_blank" rel="noreferrer" aria-label="小红书">小红书</a></div><a href="#work" className="about-browse">Browse Works <ArrowUpRight size={16}/></a></article></section>
      <footer className="footer"><div className="footer-top"><span className="mono">HAVE A GOOD STORY?</span><span className="mono">03 / THE NEXT FRAME IS YOURS</span></div><div className="footer-main"><h2>Let’s make<br/><em>something move.</em></h2><a href="mailto:linduod195@gmail.com" className="footer-cta">TELL ME ABOUT IT <ArrowUpRight size={18}/></a></div><div className="footer-links"><a href="mailto:linduod195@gmail.com">LINDUOD195@GMAIL.COM</a><a href="tel:+447344369495">+44 7344 369 495</a><a href="tel:+8618065913356">+86 18065913356</a><a href="#home" className="back-top">BACK TO TOP <ArrowUpRight size={13}/></a></div><div className="footer-bottom"><a href="#home" className="wordmark">YL<span>✳</span></a><span>DESIGNED & ANIMATED BY YUDUO LIN</span></div></footer>
    </main>
    <div className={`floating-mascot${mascotFast?' is-hovered':''}${mascotLeaving?' is-leaving':''}`} role="img" aria-label="Animated drawing mascot" onMouseEnter={()=>{setMascotLeaving(false);setMascotFast(true)}} onMouseLeave={()=>{setMascotFast(false);setMascotLeaving(true)}}>
      <img src={mascotFast?'media/draw-mascot-fast.gif':'media/draw-mascot.gif'} alt="" draggable="false" onAnimationEnd={()=>setMascotLeaving(false)}/>
    </div>
    {lightbox&&<div className="design-lightbox" role="dialog" aria-modal="true" aria-label={`${lightbox.title} design image ${lightbox.index}`} onClick={()=>setLightbox(null)}><button className="design-lightbox-close" type="button" onClick={()=>setLightbox(null)} aria-label="Close enlarged image"><X size={22}/></button><div className="design-lightbox-content" onClick={event=>event.stopPropagation()}><img src={lightbox.src} alt={`${lightbox.title} design image ${lightbox.index}`}/><div className="design-lightbox-caption"><span>{lightbox.title}</span><span>{String(lightbox.index).padStart(2,'0')} / {String(projects[featured].designs.length).padStart(2,'0')}</span></div></div></div>}
    {active&&<div className="modal-backdrop" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={close} aria-label="Close"><X/></button>{active.video?<video className="modal-video" src={active.video} autoPlay muted loop playsInline controls controlsList="nodownload" onContextMenu={event=>event.preventDefault()}/>:<div className={`modal-screen art-${active.theme}`}><div className="modal-shape"></div><div className="modal-message"><span className="mono">{active.type||'ANIMATION STUDY'}</span><h3>{active.title}</h3><p>{active.desc}</p><span className="mono media-note"><Volume2 size={14}/> FILM PREVIEW — MEDIA TO BE ADDED</span></div></div>}<div className="modal-bottom"><span>{active.title}</span><span>{active.year}</span></div></div></div>}
  </>
}
createRoot(document.getElementById('root')).render(<App/>);
