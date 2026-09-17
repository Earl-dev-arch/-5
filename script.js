const splitLetters = (element) => {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((node) => {
    const fragment = document.createDocumentFragment();
    [...node.textContent].forEach((character, index) => {
      const letter = document.createElement('span');
      letter.className = 'scroll-letter';
      letter.style.setProperty('--letter-delay', `${index * 18}ms`);
      letter.textContent = character === ' ' ? '\u00a0' : character;
      fragment.append(letter);
    });
    node.parentNode.replaceChild(fragment, node);
  });
};

const intro = document.querySelector('.intro-screen');

const revealPage = () => {
  intro?.classList.add('is-hidden');
  document.body.classList.remove('is-loading');

  // Wait for the loading screen's fade-out to finish before starting the hero.
  window.setTimeout(() => {
    document.body.classList.add('intro-complete');
    window.requestAnimationFrame(() => document.body.classList.remove('page-entering'));
  }, 600);
};

window.addEventListener('load', () => {
  if (intro) {
    window.setTimeout(revealPage, 15000);
  } else {
    revealPage();
  }
});

const themeToggle = document.querySelector('.theme-toggle');

themeToggle?.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light-theme');
  themeToggle.textContent = isLight ? '☾' : '☼';
  themeToggle.setAttribute('aria-pressed', String(isLight));
  themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} theme`);
});

const animatedText = document.querySelectorAll(
  '.hero h1, section > .label, .card h2, .section-title, #contact h2, .language h3'
);

animatedText.forEach(splitLetters);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('letters-visible', entry.isIntersecting);
  });
}, { threshold: 0.18 });

animatedText.forEach((element) => observer.observe(element));

const leftRevealElements = document.querySelectorAll('.scroll-reveal-left, .scroll-reveal-right');
const leftRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('is-revealed', entry.isIntersecting);
  });
}, { threshold: 0.2 });

leftRevealElements.forEach((element) => leftRevealObserver.observe(element));

const pageLinks = document.querySelectorAll('.details-button, .back-link');

pageLinks.forEach((link) => link.addEventListener('click', (event) => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  document.body.classList.add('page-leaving');
  window.setTimeout(() => {
    window.location.assign(link.href);
  }, 420);
}));
