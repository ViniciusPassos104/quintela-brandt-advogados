/**
 * Explorador de áreas (desktop): passar o mouse ou focar uma área mostra,
 * ao lado, as situações em que ela atua. Cada linha continua sendo um link
 * comum — clicar sempre leva à página da área, sem "toque duplo".
 * Em telas menores o conteúdo já aparece por inteiro, sem interação.
 */
export function initExplorer() {
  document.querySelectorAll<HTMLElement>('[data-explorer]').forEach((root) => {
    const items = [...root.querySelectorAll<HTMLElement>(':scope > li')];
    const desktop = window.matchMedia('(min-width: 64rem)');

    const activate = (item: HTMLElement) => {
      if (item.hasAttribute('data-active')) return;
      items.forEach((i) => i.toggleAttribute('data-active', i === item));
    };

    items.forEach((item) => {
      const row = item.querySelector<HTMLElement>('[data-explorer-trigger]');
      row?.addEventListener('pointerenter', (e) => {
        if (desktop.matches && (e as PointerEvent).pointerType === 'mouse') activate(item);
      });
      // Teclado: focar a linha ou o link do painel mantém a área ativa.
      item.addEventListener('focusin', () => desktop.matches && activate(item));
    });

    // O painel é posicionado ao lado da lista: reserva a altura do maior.
    const panels = items.map((i) => i.querySelector<HTMLElement>('.explorer__panel')).filter(Boolean) as HTMLElement[];
    let current = '';
    const measure = () => {
      if (!desktop.matches) {
        current = '';
        return root.style.removeProperty('--explorer-h');
      }
      const tallest = Math.max(...panels.map((p) => p.scrollHeight));
      const list = items.reduce((h, i) => h + i.offsetHeight, 0);
      const next = `${Math.max(tallest, list) + 1}px`;
      if (next !== current) {
        current = next;
        root.style.setProperty('--explorer-h', next);
      }
    };
    // Fora do callback do observer: evita o aviso de "ResizeObserver loop".
    const ro = new ResizeObserver(() => requestAnimationFrame(measure));
    ro.observe(root);
    desktop.addEventListener('change', measure);
  });
}
