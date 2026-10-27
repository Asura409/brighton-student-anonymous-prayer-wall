import React, { useEffect, useState } from 'react';

export const starter = [
  ['campus', 'Please pray for everyone finding their feet this semester — that we find good people and feel at home here.', 'Today'],
  ['personal', 'For courage to make a decision I have been putting off, and peace with whatever comes next.', 'Today'],
  ['community', 'For our city and everyone sleeping rough tonight. May they find warmth, safety, and kindness.', 'Yesterday'],
  ['campus', 'A quiet prayer for exam season — for clear minds, steady hearts, and enough rest between the deadlines.', 'Yesterday'],
  ['personal', 'Please hold my family in your thoughts while we wait for some important news.', '2 days ago'],
  ['community', 'Grateful for the people who checked in this week. Praying that we keep looking out for one another.', '3 days ago']
].map(([category, text, time], id) => ({ id, category, text, time }));

export const labels = { campus: 'Campus life', personal: 'Personal', community: 'Community' };

export default function App({ initialPosts = starter }) {
  const [posts, setPosts] = useState(initialPosts);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [supported, setSupported] = useState([]);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('personal');
  const [apiOnline, setApiOnline] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/prayers`)
      .then(response => { if (!response.ok) throw new Error('API unavailable'); return response.json(); })
      .then(remotePosts => { setPosts(remotePosts.map(post => ({ ...post, time: new Date(post.created_at).toLocaleDateString() }))); setApiOnline(true); })
      .catch(() => setApiOnline(false));
  }, []);

  const visible = posts.filter(post => (filter === 'all' || post.category === filter) && post.text.toLowerCase().includes(query.toLowerCase()));
  const addPrayer = async event => {
    event.preventDefault();
    if (!text.trim()) return;
    if (apiOnline) {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/prayers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ body: text, category }) });
      if (response.ok) { setText(''); alert('Your prayer was submitted for moderation.'); return; }
    }
    const next = [{ id: Date.now(), category, text: text.trim(), time: 'Just now' }, ...posts];
    setPosts(next); localStorage.setItem('brighton-prayers', JSON.stringify(next)); setText('');
    document.querySelector('#wall').scrollIntoView({ behavior: 'smooth' });
  };

  return <div className="site-shell"><header className="topbar"><a className="brand" href="#top"><span className="brand-mark">✦</span><span><b>Brighton</b><small>Student Society</small></span></a><a className="quiet-link" href="#about">About the wall <span>↗</span></a></header><main id="top">
    <section className="hero"><div className="hero-copy"><p className="eyebrow"><span/> A quiet corner of campus</p><h1>You don't have to carry it <em>alone.</em></h1><p className="hero-intro">Share what’s on your heart, anonymously. Browse the wall, pause with someone else’s words, and leave a little encouragement behind.</p><a className="button button-primary" href="#write">Add a prayer <span>↓</span></a></div><div className="hero-art"><div className="sun"/><div className="cloud cloud-one"/><div className="cloud cloud-two"/><div className="sea-line line-one"/><div className="sea-line line-two"/><div className="shore"/><span className="art-note note-one">breathe</span><span className="art-note note-two">hope</span></div></section>
    <section className="wall-section" id="wall"><div className="section-heading"><div><p className="eyebrow"><span/> From our community</p><h2>The prayer wall</h2></div><p className="wall-count"><strong>{String(posts.length).padStart(2, '0')}</strong> prayers shared</p></div><div className="wall-tools"><div className="filters">{['all', 'campus', 'personal', 'community'].map(value => <button key={value} className={`filter ${filter === value ? 'is-active' : ''}`} onClick={() => setFilter(value)}>{value === 'all' ? 'All prayers' : labels[value]}</button>)}</div><label className="search"><span>⌕</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search the wall"/></label></div><div className="post-grid">{visible.map(post => <article className="post" key={post.id}><span className="post-tag">{labels[post.category]}</span><p className="post-text">{post.text}</p><div className="post-foot"><span>{post.time}</span><button className={`support ${supported.includes(post.id) ? 'is-supported' : ''}`} onClick={() => setSupported(current => current.includes(post.id) ? current.filter(id => id !== post.id) : [...current, post.id])}><span>{supported.includes(post.id) ? '♥' : '♡'}</span>{supported.includes(post.id) ? 'Supported' : 'Support'}</button></div></article>)}</div>{!visible.length && <p className="empty-state">No prayers match that search yet. Try another word or browse all prayers.</p>}</section>
    <section className="write-section" id="write"><div className="write-card"><div className="write-intro"><p className="eyebrow light"><span/> Your words are welcome</p><h2>What would you like us to hold with you?</h2><p>There’s no need to sign your name. Share as much or as little as feels right.</p></div><form onSubmit={addPrayer}><label htmlFor="prayer-text">Your prayer request</label><textarea id="prayer-text" maxLength="500" required value={text} onChange={event => setText(event.target.value)} placeholder="Write your prayer here…"/><div className="form-row"><label htmlFor="category">This is about <select id="category" value={category} onChange={event => setCategory(event.target.value)}><option value="personal">Personal</option><option value="campus">Campus life</option><option value="community">Community</option></select></label><button className="button button-light">Place prayer <span>↗</span></button></div><p className="form-note"><span>⌁</span> Anonymous by default · Please keep this a kind, safe space</p></form></div></section>
    <section className="about" id="about"><div className="about-icon">✦</div><div><p className="eyebrow"><span/> A note from the society</p><h2>Small acts of care make a campus feel like home.</h2></div><p>Whether you pray, reflect, or simply send good thoughts, you’re welcome here. This wall is a shared pause in a busy week — a place to be seen without needing to be known.</p></section>
  </main><footer><span>© 2025 Brighton Student Society</span><span>Made with care on campus <i>♥</i></span></footer></div>;
}
