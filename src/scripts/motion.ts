/**
 * Movimento do site. Carregado sob demanda (ver motion-loader.ts) e inteiro
 * dentro de gsap.matchMedia(): se o usuário ativar "reduzir movimento",
 * tudo é revertido automaticamente para o estado final.
 *
 * Tese: seco e preciso. Uma curva (power4.out ≈ cubic-bezier(.22,1,.36,1)),
 * revelações de ~0,9 s, stagger ≤ 80 ms, sem bounce, sem parallax decorativo.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { straightPoints, tangledPoints, threadAt } from '@/lib/thread';

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.defaults({ ease: 'power4.out', duration: 0.9 });

const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];

const NO_PREF = '(prefers-reduced-motion: no-preference)';

/**
 * Revelações simples usam IntersectionObserver (assíncrono, sem ler layout no
 * thread principal). ScrollTrigger fica só para o que acompanha a rolagem
 * quadro a quadro (scrub). Elementos que entram juntos são animados em lote.
 */
function onEnter(els: HTMLElement[], fn: (batch: HTMLElement[]) => void, bottom = '-10%') {
  if (!els.length) return () => {};
  const io = new IntersectionObserver(
    (entries) => {
      const batch = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
      if (!batch.length) return;
      batch.forEach((el) => io.unobserve(el));
      fn(batch);
    },
    { rootMargin: `0px 0px ${bottom} 0px` },
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

/** Devolve o controle ao navegador entre etapas: nenhuma tarefa longa na carga. */
const yieldToMain = () =>
  new Promise<void>((resolve) => {
    const s = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
    if (s?.yield) s.yield().then(resolve);
    else setTimeout(resolve, 0);
  });

export async function initMotion() {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: reduce)', () => {
    document.documentElement.classList.remove('motion');
  });

  // Cada etapa num contexto próprio do matchMedia (revertido se o usuário
  // ativar "reduzir movimento"), com uma pausa entre elas para o navegador
  // responder a toques e cliques durante a inicialização.
  const stages = [heroThread, fadeReveals, ruleReveals, clipReveals, lineReveals, scrubWords, finale];
  for (const stage of stages) {
    mm.add(NO_PREF, () => stage() ?? undefined);
    await yieldToMain();
  }

  // Linha do tempo do método: vinculada ao documento só no desktop,
  // onde o Mapa do Caso fica fixo ao lado das etapas.
  mm.add({ desktop: '(min-width: 64rem)', motion: NO_PREF }, (ctx) => {
    if (ctx.conditions?.motion) return methodTimeline(Boolean(ctx.conditions.desktop));
  });

  // Teclado: se o foco chega a um bloco ainda não revelado, ele aparece na hora.
  document.addEventListener('focusin', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-reveal]');
    if (el && getComputedStyle(el).opacity !== '1') gsap.to(el, { opacity: 1, y: 0, duration: 0.2, overwrite: true });
  });

  window.__motionReady = true;
  // Fontes mudam a altura dos blocos: recalcula as posições quando carregarem.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

/* ------------------------------------------------------------------ hero */
function heroThread() {
  const root = document.querySelector<HTMLElement>('[data-thread]');
  const path = root?.querySelector<SVGPathElement>('[data-thread-path]');
  if (!root || !path) return;
  const from = tangledPoints();
  const to = straightPoints();
  const caption = root.querySelector('[data-thread-caption]');
  const state = { p: 0 };
  let last = -1;

  gsap.to(state, {
    p: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: root.closest('[data-hero]') ?? root,
      start: 'top top',
      end: 'bottom 15%',
      scrub: 0.6,
    },
    onUpdate: () => {
      const p = Math.round(state.p * 500) / 500;
      if (p === last) return;
      last = p;
      path.setAttribute('d', threadAt(p, from, to));
      root.style.setProperty('--thread-p', String(p));
    },
  });

  if (caption) {
    gsap.to(caption, {
      autoAlpha: 0,
      y: -12,
      ease: 'none',
      scrollTrigger: { trigger: root, start: 'top 20%', end: 'top -10%', scrub: true },
    });
  }
}

/* ------------------------------------------------- títulos por máscara */
function lineReveals() {
  // O split (que mede linhas) só acontece quando o título se aproxima da tela.
  return onEnter($$('[data-reveal="lines"]'), (batch) =>
    batch.forEach((el) => {
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { opacity: 1 });
          // Já revelado: um novo split (resize, fonte) não repete a animação.
          if (el.dataset.revealed) return;
          el.dataset.revealed = 'true';
          return gsap.from(self.lines, { yPercent: 108, duration: 1.05, stagger: 0.08 });
        },
      });
    }),
  '-8%');
}

/* ------------------------------------------------------ blocos em lote */
function fadeReveals() {
  // Estado inicial vem do CSS (html.motion): um gsap.set aqui leria o transform
  // de cada elemento logo após escrever o anterior — layout thrashing na carga.
  const items = $$('[data-reveal="fade"]');
  return onEnter(items, (batch) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.07, overwrite: true }));
}

function ruleReveals() {
  return onEnter($$('[data-reveal="rule"]'), (batch) => gsap.to(batch, { scaleX: 1, duration: 1.3, stagger: 0.08, overwrite: true }), '-6%');
}

function clipReveals() {
  const items = $$('[data-reveal="clip"]');
  return onEnter(items, (batch) =>
    gsap.fromTo(batch, { clipPath: 'inset(100% 0% 0% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.2,
      stagger: 0.1,
      overwrite: true,
      onComplete() {
        // 'none' inline (e não clearProps): o CSS de pré-estado voltaria a ocultar.
        gsap.set(batch, { clipPath: 'none' });
      },
    }),
  );
}

/* ------------------------------------------- manifesto palavra a palavra */
function scrubWords() {
  $$('[data-scrub-words]').forEach((el) => {
    const words = $$('.w', el);
    if (!words.length) return;
    gsap.fromTo(
      words,
      // 0.48 mantém contraste ≥ 3:1 (texto grande) mesmo antes da "leitura".
      { opacity: 0.48 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.06,
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 52%', scrub: 0.4 },
      },
    );
  });
}

/* ------------------------------------------------ método: o fio conduz */
function methodTimeline(desktop: boolean) {
  const list = document.querySelector<HTMLElement>('[data-timeline]');
  if (!list) return;
  const fill = list.querySelector<HTMLElement>('[data-timeline-fill]');
  const steps = $$('[data-step]', list);
  const doc = document.querySelector<HTMLElement>('[data-casemap]');

  if (fill) {
    gsap.fromTo(
      fill,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: list, start: 'top 62%', end: 'bottom 62%', scrub: 0.3 },
      },
    );
  }

  if (doc && desktop) doc.setAttribute('data-linked', '');

  steps.forEach((step) => {
    const n = step.dataset.step;
    const parts = doc && desktop ? $$(`[data-doc-step="${n}"]`, doc) : [];
    ScrollTrigger.create({
      trigger: step,
      start: 'top 62%',
      onEnter: () => {
        step.classList.add('is-active');
        parts.forEach((p) => p.classList.add('is-shown'));
      },
      onLeaveBack: () => {
        step.classList.remove('is-active');
        parts.forEach((p) => p.classList.remove('is-shown'));
      },
    });
  });

  return () => {
    doc?.removeAttribute('data-linked');
    steps.forEach((s) => s.classList.remove('is-active'));
    doc?.querySelectorAll('.is-shown').forEach((p) => p.classList.remove('is-shown'));
  };
}

/* ---------------------------------------- final: o papel vira tinta */
function finale() {
  const el = document.querySelector<HTMLElement>('[data-finale]');
  const bg = el?.querySelector<HTMLElement>('[data-finale-bg]');
  if (!el || !bg) return;
  gsap.fromTo(
    bg,
    { scaleX: 0.92, scaleY: 0.96 },
    {
      scaleX: 1,
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 30%', scrub: 0.4 },
    },
  );
}
