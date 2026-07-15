const toggle = document.getElementById('nav-toggle');
const links  = document.getElementById('nav-links');
toggle.addEventListener('click', e => { e.stopPropagation(); links.classList.toggle('open'); });
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => links.classList.remove('open'));
});
document.addEventListener('click', e => {
  if (links.classList.contains('open') && !links.contains(e.target)) {
    links.classList.remove('open');
  }
});
