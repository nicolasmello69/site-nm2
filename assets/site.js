
// NAV
const nav = document.getElementById('nav');
function updateNav(){nav.classList.toggle('solid',window.scrollY>60)}
window.addEventListener('scroll',updateNav,{passive:true});
updateNav();

// HERO IMAGE
const heroImg = document.getElementById('hero-img');
if(heroImg.complete) heroImg.classList.add('loaded');
else heroImg.addEventListener('load',()=>heroImg.classList.add('loaded'));

// MOBILE MENU
const hamburger = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');
function setMobileMenu(open) {
  mobileMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  if (open) mobileClose.focus();
  else hamburger.focus();
}
hamburger.addEventListener('click', () => setMobileMenu(!mobileMenu.classList.contains('open')));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobileMenu.classList.contains('open')) setMobileMenu(false);
});
mobileClose.addEventListener('click',()=>setMobileMenu(false));
document.querySelectorAll('.mobile-link,.mobile-menu .btn-primary').forEach(el=>el.addEventListener('click',()=>setMobileMenu(false)));

// SCROLL REVEAL
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.documentElement.classList.add('js-reveal');
  document.querySelectorAll('.reveal').forEach(element => revealObs.observe(element));
}

// PORTFOLIO FILTER
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.filter;
    document.querySelectorAll('.portfolio-item').forEach(item=>{
      const show=f==='all'||item.dataset.cat===f;
      item.style.display=show?'':'none';
      if(show)item.classList.add('visible');
    });
  });
});

// LIGHTBOX
const lightbox=document.getElementById('lightbox');
const lbImg=document.getElementById('lb-img');
const lbCat=document.getElementById('lb-cat');
const lbName=document.getElementById('lb-name');
const lbCounter=document.getElementById('lb-counter');
const lbStrip=document.getElementById('lb-strip');
let lbItems=[],lbIndex=0;
let lightboxTrigger=null;

function visibleItems(){
  return Array.from(document.querySelectorAll('.portfolio-item')).filter(item=>item.style.display!=='none');
}
function buildStrip(){
  lbStrip.innerHTML='';
  lbItems.forEach((item,i)=>{
    const src=item.querySelector('img').src;
    const t=document.createElement('button');
    t.type='button';
    t.setAttribute('aria-label', 'Ver imagem '+(i+1));
    const thumb=document.createElement('img');
    thumb.src=src;
    thumb.alt='';
    t.appendChild(thumb);
    t.className='lb-thumb';
    t.addEventListener('click',()=>{lbIndex=i;showLightbox()});
    lbStrip.appendChild(t);
  });
}
function openLightbox(item){
  lightboxTrigger=item;
  lbItems=visibleItems();
  lbIndex=lbItems.indexOf(item);
  buildStrip();
  showLightbox();
  lightbox.classList.add('open');
  document.getElementById('lb-close').focus();
  document.body.style.overflow='hidden';
}
function showLightbox(){
  const item=lbItems[lbIndex];
  if(!item)return;
  const img=item.querySelector('img');
  lbImg.src=img.dataset.full||img.src;
  lbImg.alt=img.alt;
  lbCat.textContent=item.querySelector('.portfolio-cat').textContent;
  lbName.textContent=item.querySelector('.portfolio-name').textContent;
  lbCounter.textContent=(lbIndex+1)+' / '+lbItems.length;
  Array.from(lbStrip.children).forEach((t,i)=>{
    t.classList.toggle('active',i===lbIndex);
    t.setAttribute('aria-pressed', String(i===lbIndex));
    if(i===lbIndex)t.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',inline:'center',block:'nearest'});
  });
  // pré-carrega vizinhas para navegação instantânea
  [lbIndex+1,lbIndex-1].forEach(n=>{
    const it=lbItems[(n+lbItems.length)%lbItems.length];
    if(it){const im=it.querySelector('img');new Image().src=im.dataset.full||im.src;}
  });
}
function closeLightbox(){
  lightbox.classList.remove('open');
  document.body.style.overflow='';
  if (lightboxTrigger) lightboxTrigger.focus({preventScroll:true});
}
function lbNav(dir){
  lbIndex=(lbIndex+dir+lbItems.length)%lbItems.length;
  showLightbox();
}
document.getElementById('portfolio-grid').addEventListener('click',e=>{
  const item=e.target.closest('.portfolio-item');
  if(item)openLightbox(item);
});
document.getElementById('lb-close').addEventListener('click',closeLightbox);
document.getElementById('lb-prev').addEventListener('click',()=>lbNav(-1));
document.getElementById('lb-next').addEventListener('click',()=>lbNav(1));
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
document.addEventListener('keydown',e=>{
  if(!lightbox.classList.contains('open'))return;
  if(e.key==='Escape')closeLightbox();
  if(e.key==='ArrowLeft')lbNav(-1);
  if(e.key==='ArrowRight')lbNav(1);
});

document.getElementById('portfolio-grid').addEventListener('keydown', event => {
  const item = event.target.closest('.portfolio-item');
  if (item && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    openLightbox(item);
  }
});
document.querySelectorAll('.portfolio-item').forEach(item => {
  item.setAttribute('aria-label', 'Ampliar '+item.querySelector('.portfolio-name').textContent);
});
function trapFocus(event, container) {
  if (event.key !== 'Tab') return;
  const focusable = [...container.querySelectorAll('button, a[href], [tabindex="0"]')].filter(element => element.getClientRects().length);
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}
document.addEventListener('keydown', event => {
  if (lightbox.classList.contains('open')) trapFocus(event, lightbox);
  else if (mobileMenu.classList.contains('open')) trapFocus(event, mobileMenu);
});

// FAQ
document.querySelectorAll('.faq-q').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item=btn.closest('.faq-item');
    const open=item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i=>{i.classList.remove('open');i.querySelector('.faq-q').setAttribute('aria-expanded','false')});
    if(!open){item.classList.add('open');btn.setAttribute('aria-expanded','true')}
  });
});

// Prepare a message locally and let the visitor send it in WhatsApp.
const contactForm = document.getElementById('contact-form');
contactForm.querySelector('[type="submit"]').disabled = false;
contactForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const nome = document.getElementById('nome').value.trim();
  if (!nome) { document.getElementById('nome').focus(); return; }
  const tel = document.getElementById('tel').value.trim();
  const email = document.getElementById('email').value.trim();
  const tipo = document.getElementById('tipo').value;
  const msg = document.getElementById('msg').value.trim();
  const lines = ['Olá, vim pelo site NM2 e gostaria de um orçamento', 'Nome: '+nome];
  if (tel) lines.push('Telefone: '+tel);
  if (email) lines.push('E-mail: '+email);
  if (tipo) lines.push('Interesse: '+tipo);
  if (msg) lines.push(msg);
  window.open('https://wa.me/5544999626215?text='+encodeURIComponent(lines.join('\n')), '_blank', 'noopener,noreferrer');
  document.getElementById('form-feedback').textContent = 'Confira a mensagem no WhatsApp e toque em enviar. Se a janela não abriu, use o link direto acima.';
});

// PARALLAX HERO
let ticking=false;
window.addEventListener('scroll',()=>{
  if(!ticking){
    requestAnimationFrame(()=>{
      const bg=document.querySelector('.hero-bg img');
      if(bg&&!reducedMotion.matches&&window.scrollY<window.innerHeight){
        bg.style.transform=`scale(1) translateY(${window.scrollY*.28}px)`;
      }
      ticking=false;
    });
    ticking=true;
  }
},{passive:true});
