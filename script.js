'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const imageTargets = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer=document.querySelector('.dots')
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', e => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//add event listener to a common parent element
//determine wht element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  tabs.forEach(el => el.classList.remove('operations__tab--active'));
  tabsContent.forEach(el => el.classList.remove('operations__content--active'));
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = entries => {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

const revealSection = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) entry.target.classList.add('section--hidden');
    // if (!entry.isIntersecting) return;
    else entry.target.classList.remove('section--hidden');
    // observer.unobserve(entry.target);
  });
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

//lazy loading images
const loading = (entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    else {
      entry.target.src = entry.target.dataset.src;
      entry.target.addEventListener('load', () =>
        entry.target.classList.remove('lazy-img')
      );
      observer.unobserve(entry.target);
    }
  });

  // const [entry]=entries;
  // if(!entry.isIntersecting) return
  // //replace src with data-src
  // entry.target.src=entry.target.dataset.src
  // entry.target.addEventListener('load',()=>entry.target.classList.remove('lazy-img'))
  // observer.unobserve(entry.target)
};
const imageObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imageTargets.forEach(img => imageObserver.observe(img));

//slider
const slider=function(){

let currSlide = 0;
const maxSlide = slides.length;

//functions
const createDots=function(){
  slides.forEach((_,i)=>{
    dotContainer.insertAdjacentHTML(`beforeend`,`<button class="dots__dot" data-slide="${i}"></button>`)
  })
}


const activateDot=function(slide){
  document.querySelectorAll('.dots__dot').forEach(dot=>dot.classList.remove('dots__dot--active'))
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active')
}

const goToSlide = slide => {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
  );
};


const nextSlide = () => {
  if (currSlide === maxSlide - 1) currSlide = 0;
  else {
    currSlide++;
  }
  goToSlide(currSlide);
  activateDot(currSlide)
};
const prevSlide = () => {
  if (currSlide === 0) currSlide = maxSlide - 1;
  else {
    currSlide--;
  }
  goToSlide(currSlide);
  activateDot(currSlide)
};

const init=()=>{
  createDots()
  goToSlide(0);
 activateDot(0);
}
init()

//event handlers
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  e.key==='ArrowLeft'&&prevSlide()

});

dotContainer.addEventListener('click',function(e){
  const dot=e.target;
  if(dot.classList.contains('dots__dot'))
  {
    currSlide=Number(dot.dataset.slide)
    goToSlide(currSlide)
    activateDot(currSlide)
  }

})
}
slider()
// //////////


const message = document.createElement('div');

message.classList.add('cookie-message');
message.innerHTML =
  'We use cookies for improved functionality and analytics<button class="btn btn--close-cookie">Got it!</button>';
header.append(message);
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', () => message.parentElement.removeChild(message));

message.style.backgroundColor = '#37383d';
message.style.width = '120%';
message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';

