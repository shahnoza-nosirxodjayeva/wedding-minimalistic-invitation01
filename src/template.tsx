import React, { useEffect, useMemo, useState } from 'react';
import { useInvitation, useTranslation } from '@envitepkg/template-sdk/react';

function useCountdown(date: string) {
  const calculate = () => {
    const difference = Math.max(0, new Date(date).getTime() - Date.now());
    return { days: Math.floor(difference / 86400000), hours: Math.floor(difference / 3600000) % 24, minutes: Math.floor(difference / 60000) % 60, seconds: Math.floor(difference / 1000) % 60 };
  };
  const [value, setValue] = useState(calculate);
  useEffect(() => { const timer = setInterval(() => setValue(calculate()), 1000); return () => clearInterval(timer); }, [date]);
  return value;
}

export function Template() {
  const invitation = useInvitation();
  const { t, language, setLanguage, supportedLanguages } = useTranslation();
  const { groom, bride } = invitation.couple;
  const countdown = useCountdown(invitation.event.date);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const date = new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : language === 'en' ? 'en-GB' : 'uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(invitation.event.date));
  const mapLink = useMemo(() => invitation.venue.latitude == null ? 'https://maps.google.com' : `https://www.google.com/maps?q=${invitation.venue.latitude},${invitation.venue.longitude}`, [invitation.venue]);
  const schedule = invitation.schedule ?? [
    { time: '16:00', title: t('schedule.ceremony') }, { time: '17:00', title: t('schedule.reception') },
    { time: '19:00', title: t('schedule.dinner') }, { time: '22:00', title: t('schedule.dance') },
  ];
  const nav = [{ id: 'story', label: t('nav.story') }, { id: 'schedule', label: t('nav.schedule') }, { id: 'location', label: t('nav.location') }, { id: 'rsvp', label: 'RSVP' }];
  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };

  return <main className="invitation">
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
      <div className="hero-grid">
        <div className="hero-copy"><p className="eyebrow">{t('hero.invited')}</p><p className="eyebrow subtle">{invitation.event.title}</p><h1>{groom.name}<em>&amp;</em>{bride.name}</h1><p className="hero-date">{date}<br />{invitation.event.time}</p><p className="hero-place">{invitation.venue.name}<br />{invitation.venue.address}</p></div>
        <div className="hero-art"><span className="art-d">{groom.name[0]}</span><span className="art-y">{bride.name[0]}</span><span className="art-line" /><span className="art-date">{new Date(invitation.event.date).toLocaleDateString(language)}</span><span className="ring ring-one" /><span className="ring ring-two" /></div>
      </div>
      <button className="scroll-cue" onClick={() => go('countdown')}><span />{t('hero.scroll')}</button>
    </section>
    <section className="countdown-section" id="countdown"><p className="side-label">{t('countdown.label')}</p><div className="countdown">{Object.entries(countdown).map(([key, value]) => <div key={key}><strong>{String(value).padStart(2, '0')}</strong><span>{t(`countdown.${key}`)}</span></div>)}</div><p className="countdown-note">{t('countdown.note')}</p></section>
    <section className="schedule-section" id="schedule"><div className="section-title"><p>{t('schedule.label')}</p><span /></div><ol>{schedule.map(item => <li key={item.time}><time>{item.time}</time><span className="dash" /><div><strong>{item.title}</strong><small>{invitation.event.type}</small></div></li>)}</ol><div className="schedule-photo"><div>{groom.name[0]}{bride.name[0]}</div></div></section>
    <section className="story-section" id="story"><div className="story-photo"><span>{groom.name[0]}<br />{bride.name[0]}</span></div><div className="story-copy"><p className="eyebrow">{t('story.label')}</p><blockquote>{t('story.title')}</blockquote><p>{invitation.story || t('story.copy')}</p><span className="small-line" /><small>{invitation.dressCode || t('story.note')}</small></div></section>
    {invitation.gallery.length > 0 && <section className="gallery-section">{invitation.gallery.slice(0, 3).map(image => <img key={image.id} src={image.src} alt={image.alt || ''} loading="lazy" />)}</section>}
    <section className="location-section" id="location"><div><p className="section-kicker">{t('venue.label')}</p><h2>{invitation.venue.name}</h2><p>{invitation.venue.address}</p><p className="dress-code">{invitation.dressCode}</p><a href={mapLink} target="_blank" rel="noreferrer">{t('venue.maps')} <b>↗</b></a></div><div className="location-card"><div className="location-sun" /><span>{t('venue.coordinates')}<br />{invitation.venue.latitude}° N &nbsp; {invitation.venue.longitude}° E</span></div></section>
    {invitation.music && <section className="music-section"><span>♫</span><p>{invitation.music.title}<small>{invitation.music.artist}</small></p><audio controls preload="none" src={invitation.music.src} /></section>}
    <section className="rsvp-section" id="rsvp"><p className="section-kicker">RSVP</p><div className="rsvp-layout"><h2>{t('rsvp.title')}</h2>{confirmed ? <p className="thanks">{t('rsvp.success')}</p> : <form onSubmit={event => { event.preventDefault(); setConfirmed(true); }}><label>{t('rsvp.name')}<input required /></label><label>{t('rsvp.attendance')}<select><option>{t('rsvp.yes')}</option><option>{t('rsvp.no')}</option></select></label><button type="submit">{t('rsvp.submit')}</button></form>}</div></section>
    {invitation.wishes.length > 0 && <section className="wishes-section">{invitation.wishes.slice(0, 2).map(wish => <blockquote key={wish.id}>“{wish.message}”<footer>{wish.guest}</footer></blockquote>)}</section>}
    <footer><button className="monogram" onClick={() => go('home')}>{groom.name[0]}<span>{bride.name[0]}</span></button><span>{groom.name} &amp; {bride.name}</span><span>{date}</span><span className="footer-heart">♡</span></footer>
  </main>;
}
