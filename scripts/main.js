const toggleBtn=document.querySelector('.nav-toggle');
const nav=document.getElementById('site-nav');
if(toggleBtn&&nav){toggleBtn.addEventListener('click',()=>{const isOpen=nav.classList.toggle('open');toggleBtn.setAttribute('aria-expanded',String(isOpen));});}
const yearEl=document.getElementById('year');
if(yearEl) yearEl.textContent=new Date().getFullYear();
