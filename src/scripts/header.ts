/**
 * Cabeçalho e menu mobile.
 * - Um único listener de scroll (passivo, agrupado em rAF) controla:
 *   fundo sólido, esconder/mostrar e barra de leitura dos artigos.
 * - Menu: <dialog> nativo → foco preso, resto da página inerte, ESC fecha.
 */

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  const article = document.querySelector<HTMLElement>('[data-reading]');
  if (article) header.setAttribute('data-reading', '');

  let lastY = 0; // lido no primeiro frame (ver abaixo)
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.scrollY;
    // Leituras antes das escritas: evita layout forçado a cada frame.
    const rect = article?.getBoundingClientRect();
    const focusInside = header.matches(':focus-within');
    header.toggleAttribute('data-scrolled', y > 24);

    // Esconde ao descer, reaparece ao subir (nunca perto do topo).
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    if (goingDown && y > 480 && !focusInside) header.setAttribute('data-hidden', '');
    else if (goingUp || y < 480) header.removeAttribute('data-hidden');
    lastY = y;

    if (rect) {
      const total = rect.height - window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(total, 1)));
      header.style.setProperty('--progress', p.toFixed(4));
    }
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  // Primeira leitura no próximo frame: ler scrollY durante a execução inicial
  // forçaria o layout da página inteira antes da hora.
  requestAnimationFrame(update);

  // Na home, o item do menu acompanha a seção em leitura.
  if (header.hasAttribute('data-spy')) {
    const links = new Map<string, HTMLElement>();
    header.querySelectorAll<HTMLElement>('[data-nav-section]').forEach((a) => links.set(a.dataset.navSection!, a));
    const sections = [...document.querySelectorAll<HTMLElement>('[data-section]')];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = links.get((entry.target as HTMLElement).dataset.section!);
          if (!link) return;
          link.classList.toggle('is-section', entry.isIntersecting);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
  }
}

export function initMenu() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-menu]');
  const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
  if (!dialog || !openBtn) return;
  const closeBtn = dialog.querySelector<HTMLButtonElement>('[data-menu-close]');
  let closing = false;

  const open = () => {
    if (dialog.open) return;
    dialog.showModal();
    openBtn.setAttribute('aria-expanded', 'true');
    // Um frame para o estado inicial ser pintado antes da transição.
    requestAnimationFrame(() => requestAnimationFrame(() => dialog.classList.add('is-open')));
    closeBtn?.focus();
  };

  const close = () => {
    if (!dialog.open || closing) return;
    closing = true;
    dialog.classList.remove('is-open');
    const finish = () => {
      dialog.close();
      closing = false;
      openBtn.setAttribute('aria-expanded', 'false');
      openBtn.focus();
    };
    if (reduceMotion()) finish();
    else window.setTimeout(finish, 380);
  };

  openBtn.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  // ESC dispara "cancel": trocamos o fechamento seco pelo animado.
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });
  dialog.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest('a');
    if (!link) return;
    const url = new URL(link.href, location.href);
    // Âncora na mesma página: fecha primeiro para o scroll acontecer com o menu fora.
    if (url.pathname === location.pathname && url.hash) {
      e.preventDefault();
      close();
      window.setTimeout(() => document.querySelector(url.hash)?.scrollIntoView(), 400);
    }
  });
  // Ao passar para o layout desktop, o menu não pode ficar aberto por baixo.
  window.matchMedia('(min-width: 72rem)').addEventListener('change', (e) => {
    if (e.matches && dialog.open) {
      dialog.classList.remove('is-open');
      dialog.close();
      openBtn.setAttribute('aria-expanded', 'false');
    }
  });
}
