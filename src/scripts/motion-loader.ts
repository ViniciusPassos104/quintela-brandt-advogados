/**
 * Carrega o GSAP só quando há movimento a executar — e só depois da primeira
 * pintura: o ScrollTrigger mede a página ao registrar-se, e fazer isso antes
 * do primeiro frame forçaria o layout inteiro no meio do carregamento.
 * Com "reduzir movimento" ativo, nenhum byte de animação é baixado.
 */
declare global {
  interface Window {
    __motionReady?: boolean;
  }
}

const allowMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

const start = () =>
  import('./motion')
    .then((m) => m.initMotion())
    .catch(() => document.documentElement.classList.remove('motion'));

if (allowMotion) {
  // Safari ainda não tem requestIdleCallback: cai para um setTimeout.
  const idle = (cb: () => void) =>
    typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(cb, { timeout: 800 }) : setTimeout(cb, 1);
  // dois frames: garante que o primeiro já foi pintado
  requestAnimationFrame(() => requestAnimationFrame(() => idle(start)));
} else {
  document.documentElement.classList.remove('motion');
}

export {};
