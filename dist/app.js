const seedPosts = [
  { id: 1, category: 'campus', text: 'Please pray for everyone finding their feet this semester — that we find good people and feel at home here.', time: 'Today' },
  { id: 2, category: 'personal', text: 'For courage to make a decision I have been putting off, and peace with whatever comes next.', time: 'Today' },
  { id: 3, category: 'community', text: 'For our city and everyone sleeping rough tonight. May they find warmth, safety, and kindness.', time: 'Yesterday' },
  { id: 4, category: 'campus', text: 'A quiet prayer for exam season — for clear minds, steady hearts, and enough rest between the deadlines.', time: 'Yesterday' },
  { id: 5, category: 'personal', text: 'Please hold my family in your thoughts while we wait for some important news.', time: '2 days ago' },
  { id: 6, category: 'community', text: 'Grateful for the people who checked in this week. Praying that we keep looking out for one another.', time: '3 days ago' }
];
const labels = { campus: 'Campus life', personal: 'Personal', community: 'Community' };
const saved = JSON.parse(localStorage.getItem('brighton-prayers') || 'null');
let posts = saved || seedPosts;
let activeFilter = 'all';
const grid = document.querySelector('#post-grid');
const empty = document.querySelector('#empty-state');
const count = document.querySelector('#post-count');
const search = document.querySelector('#search');

function render() {
  const query = search.value.trim().toLowerCase();
  const visible = posts.filter(post => (activeFilter === 'all' || post.category === activeFilter) && (!query || post.text.toLowerCase().includes(query)));
  grid.innerHTML = visible.map(post => `<article class="post"><span class="post-tag">${labels[post.category]}</span><p class="post-text">${escapeHtml(post.text)}</p><div class="post-foot"><span>${post.time}</span><button class="support" data-id="${post.id}" aria-label="Support this prayer"><span aria-hidden="true">♡</span> <b>Support</b></button></div></article>`).join('');
  empty.hidden = visible.length > 0;
  count.textContent = String(posts.length).padStart(2, '0');
  grid.querySelectorAll('.support').forEach(button => button.addEventListener('click', () => { button.classList.toggle('is-supported'); button.innerHTML = button.classList.contains('is-supported') ? '<span aria-hidden="true">♥</span> Supported' : '<span aria-hidden="true">♡</span> <b>Support</b>'; }));
}
function escapeHtml(value) { return value.replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => { document.querySelector('.filter.is-active').classList.remove('is-active'); button.classList.add('is-active'); activeFilter = button.dataset.filter; render(); }));
search.addEventListener('input', render);
document.querySelector('#prayer-form').addEventListener('submit', event => { event.preventDefault(); const text = document.querySelector('#prayer-text').value.trim(); if (!text) return; posts.unshift({ id: Date.now(), category: document.querySelector('#category').value, text, time: 'Just now' }); localStorage.setItem('brighton-prayers', JSON.stringify(posts)); event.target.reset(); render(); document.querySelector('#wall').scrollIntoView({ behavior: 'smooth' }); });
render();
