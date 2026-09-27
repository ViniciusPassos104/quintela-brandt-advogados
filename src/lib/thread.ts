/**
 * Geometria do "fio da meada" do hero.
 * Os mesmos pontos são usados no servidor (desenho inicial, sem JS) e no
 * navegador (interpolação durante a rolagem) — por isso vivem aqui.
 */

export const THREAD_W = 360;
export const THREAD_H = 900;
const N = 240;

type Pt = [number, number];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Fio emaranhado: laços irregulares concentrados no meio da altura. */
export function tangledPoints(): Pt[] {
  const cx = THREAD_W / 2;
  const pts: Pt[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const u = clamp((t - 0.15) / 0.68);
    const env = Math.pow(Math.sin(Math.PI * u), 0.8);
    const y0 = THREAD_H * (t + 0.14 * Math.sin(2 * Math.PI * t));
    const freq = 12.5 + 3 * Math.sin(t * 5.1 + 0.4);
    const theta = 2 * Math.PI * freq * t + 0.9 * Math.sin(t * 11);
    const r = env * (76 + 34 * Math.sin(t * 17.3 + 1.2) + 18 * Math.sin(t * 41));
    const x = cx + r * Math.sin(theta) + env * 30 * Math.sin(t * 29 + 0.7);
    const y = y0 - r * Math.cos(theta);
    pts.push([x, y]);
  }
  return pts;
}

/** Fio esticado: mesma quantidade de pontos, distribuídos numa reta. */
export function straightPoints(): Pt[] {
  const cx = THREAD_W / 2;
  return Array.from({ length: N + 1 }, (_, i) => [cx, (THREAD_H * i) / N] as Pt);
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Catmull-Rom → Bézier cúbica: curva suave passando por todos os pontos. */
export function toPath(pts: Pt[]): string {
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${r1(c1x)} ${r1(c1y)} ${r1(c2x)} ${r1(c2y)} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return d;
}

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/**
 * Interpola do emaranhado para a reta. O topo se desembaraça primeiro,
 * como um fio puxado de cima.
 */
export function threadAt(progress: number, from: Pt[], to: Pt[]): string {
  const n = from.length - 1;
  const pts: Pt[] = from.map((p, i) => {
    const local = easeInOut(clamp(progress * 1.4 - (i / n) * 0.4));
    return [p[0] + (to[i][0] - p[0]) * local, p[1] + (to[i][1] - p[1]) * local];
  });
  return toPath(pts);
}
