import React, { useEffect, useMemo, useState } from 'react';
import { useGuest, useInvitation, useTranslation } from '@envitepkg/template-sdk/react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { MusicPlayer } from './components/music-player';
import { SqueezeCarousel } from './components/squeeze-carousel';

type RevealSectionProps = {
  children: React.ReactNode;
  className: string;
  id?: string;
  delay?: number;
};

function RevealSection({ children, className, id, delay = 0 }: RevealSectionProps) {
  const reducedMotion = useReducedMotion();

  return <section id={id} className={className}>
    <motion.div
      className="section-container scroll-reveal"
      initial={reducedMotion ? false : { opacity: 0, y: 72, scale: 0.99 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: reducedMotion ? 0 : 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  </section>;
}

function useCountdown(date: string) {
  const calculate = () => {
    const difference = Math.max(0, new Date(date).getTime() - Date.now());
    return {
      days: Math.floor(difference / 86400000),
      hours: Math.floor(difference / 3600000) % 24,
      minutes: Math.floor(difference / 60000) % 60,
      seconds: Math.floor(difference / 1000) % 60,
    };
  };
  const [value, setValue] = useState(calculate);
  useEffect(() => {
    const timer = setInterval(() => setValue(calculate()), 1000);
    return () => clearInterval(timer);
  }, [date]);
  return value;
}

export function Template() {
  const invitation = useInvitation();
  const guest = useGuest() ?? invitation.guests[0] ?? null;
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.25,
  });
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -42]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0.72]);
  const { t, language, setLanguage, supportedLanguages } = useTranslation();
  const { groom, bride } = invitation.couple;
  const countdown = useCountdown(invitation.event.date);
  const [menuOpen, setMenuOpen] = useState(false);
  const locale = language === 'ru' ? 'ru-RU' : language === 'en' ? 'en-GB' : 'uz-UZ';
  const date = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(invitation.event.date));
  const mapLink = useMemo(
    () => invitation.venue.latitude == null
      ? 'https://maps.google.com'
      : `https://www.google.com/maps?q=${invitation.venue.latitude},${invitation.venue.longitude}`,
    [invitation.venue.latitude, invitation.venue.longitude],
  );
  const schedule = invitation.schedule.length ? invitation.schedule : [
    { time: '16:00', title: t('schedule.ceremony') },
    { time: '17:00', title: t('schedule.reception') },
    { time: '19:00', title: t('schedule.dinner') },
    { time: '22:00', title: t('schedule.dance') },
  ];
  const nav = [
    { id: 'story', label: t('nav.story') },
    { id: 'schedule', label: t('nav.schedule') },
    ...(invitation.gallery.length ? [{ id: 'gallery', label: t('nav.gallery') }] : []),
    { id: 'location', label: t('nav.location') },
  ];
  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return <main className="invitation">
    {!reducedMotion && <motion.div className="scroll-progress" style={{ scaleY: smoothScrollProgress }} aria-hidden="true" />}
    <section className="hero" id="home">
      <header className="topbar">
        <button className="monogram" onClick={() => go('home')}>{groom.name[0]}<span>{bride.name[0]}</span></button>
        <nav className="desktop-nav">{nav.map(item => <button key={item.id} onClick={() => go(item.id)}>{item.label}</button>)}</nav>
        <div className="header-actions">
          <div className="languages">{supportedLanguages.map(item => <button key={item} className={language === item ? 'active' : ''} onClick={() => setLanguage(item)}>{item.toUpperCase()}</button>)}</div>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"><i /><i /></button>
        </div>
      </header>
      {menuOpen && <nav className="mobile-nav">{nav.map(item => <button key={item.id} onClick={() => go(item.id)}>{item.label}</button>)}</nav>}
      <motion.div
        className="hero-grid"
        style={reducedMotion ? undefined : { y: heroY, opacity: heroOpacity }}
      >
        <div className="hero-copy">
          {guest && <p className="guest-name">{t('guest.dear', { name: guest.name })}</p>}
          <p className="eyebrow">{t('hero.invited')}</p>
          <p className="eyebrow subtle">{invitation.event.title}</p>
          <h1>{groom.name}<em>&amp;</em>{bride.name}</h1>
          <p className="hero-date">{date}<br />{invitation.event.time}</p>
          <p className="hero-place">{invitation.venue.name}<br />{invitation.venue.address}</p>
        </div>
        <div className="hero-art">
          <span className="art-d">{groom.name[0]}</span><span className="art-y">{bride.name[0]}</span><span className="art-line" />
          <span className="art-date">{new Date(invitation.event.date).toLocaleDateString(locale)}</span><span className="ring ring-one" /><span className="ring ring-two" />
        </div>
      </motion.div>
      <button className="scroll-cue" onClick={() => go('countdown')}><span />{t('hero.scroll')}</button>
    </section>

    <RevealSection className="countdown-section" id="countdown">
      <p className="side-label">{t('countdown.label')}</p>
      <div className="countdown">{Object.entries(countdown).map(([key, value]) => <div key={key}><strong>{String(value).padStart(2, '0')}</strong><span>{t(`countdown.${key}`)}</span></div>)}</div>
      <p className="countdown-note">{t('countdown.note')}</p>
    </RevealSection>

    <RevealSection className="schedule-section" id="schedule">
      <div className="section-title"><p>{t('schedule.label')}</p><span /></div>
      <ol>{schedule.map((item, index) => <li key={`${item.time}-${index}`}><time>{item.time}</time><span className="dash" /><div><strong>{item.title}</strong><small>{item.description || invitation.event.type}</small></div></li>)}</ol>
      <div className="schedule-photo"><div>{groom.name[0]}{bride.name[0]}</div></div>
    </RevealSection>

    <RevealSection className="story-section" id="story">
      <div className="story-photo"><span>{groom.name[0]}<br />{bride.name[0]}</span></div>
      <div className="story-copy"><p className="eyebrow">{t('story.label')}</p><blockquote>{t('story.title')}</blockquote><p>{invitation.story || t('story.copy')}</p><span className="small-line" /><small>{invitation.dressCode || t('story.note')}</small></div>
    </RevealSection>

    {invitation.gallery.length > 0 && <RevealSection className="gallery-section" id="gallery">
      <div className="gallery-heading"><h2>{t('gallery.title')}</h2></div>
      <SqueezeCarousel slides={invitation.gallery} label={t('gallery.label')} previousLabel={t('gallery.previous')} nextLabel={t('gallery.next')} />
    </RevealSection>}

    <RevealSection className="location-section" id="location">
      <div className="location-copy">
        <div className="location-heading"><span>05</span><p className="section-kicker">{t('venue.label')}</p></div>
        <p className="location-event">{invitation.event.title} · {invitation.event.type}</p>
        <h2>{invitation.venue.name}</h2>
        <p className="location-address">{invitation.venue.address}</p>
        <div className="location-meta">
          <div><span>{t('venue.date')}</span><strong>{date}</strong><small>{invitation.event.time}</small></div>
          <div><span>{t('venue.dressCode')}</span><strong>{invitation.dressCode || '—'}</strong></div>
        </div>
        <a className="location-link" href={mapLink} target="_blank" rel="noreferrer"><span>{t('venue.maps')}</span><b aria-hidden="true">↗</b></a>
      </div>

      <div className="location-map">
        <span className="location-map__stamp">{t('venue.mapEyebrow')}</span>
        <svg className="location-map__roads" viewBox="0 0 800 520" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-40 410 C130 290 215 480 390 350 S655 170 840 250" />
          <path d="M180 -40 C285 110 150 220 280 330 S540 425 500 570" />
          <path d="M-30 120 C150 185 300 70 470 135 S690 170 840 65" />
          <path className="major-road" d="M-50 485 C210 370 330 420 510 270 S690 105 850 145" />
        </svg>
        <span className="location-map__district district-one" aria-hidden="true" />
        <span className="location-map__district district-two" aria-hidden="true" />
        <span className="location-map__district district-three" aria-hidden="true" />
        <div className="location-pin"><i /><span>{invitation.venue.name}</span></div>
        <p className="location-coordinates"><span>{t('venue.coordinates')}</span>{invitation.venue.latitude}° N<br />{invitation.venue.longitude}° E</p>
      </div>
    </RevealSection>

    {invitation.music && <RevealSection className="music-section">
      <MusicPlayer
        title={invitation.music.title}
        artist={invitation.music.artist}
        src={invitation.music.src}
        label={t('music.label')}
        playLabel={t('music.play')}
        pauseLabel={t('music.pause')}
        seekLabel={t('music.seek')}
        muteLabel={t('music.mute')}
        unmuteLabel={t('music.unmute')}
        unavailableLabel={t('music.unavailable')}
      />
    </RevealSection>}

    <motion.footer initial={reducedMotion ? false : { opacity: 0, y: 48 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: reducedMotion ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}><button className="monogram" onClick={() => go('home')}>{groom.name[0]}<span>{bride.name[0]}</span></button><span>{groom.name} &amp; {bride.name}</span><span>{date}</span><span className="footer-heart">♡</span></motion.footer>
  </main>;
}
