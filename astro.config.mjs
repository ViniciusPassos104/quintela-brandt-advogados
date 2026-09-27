// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

// Se houver endpoint de formulário externo, a CSP precisa autorizar a origem dele.
const { PUBLIC_FORM_ENDPOINT = '' } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const formOrigin = PUBLIC_FORM_ENDPOINT.startsWith('http') ? new URL(PUBLIC_FORM_ENDPOINT).origin : '';

export default defineConfig({
  // Domínio fictício por padrão. SITE_URL permite publicar em outro endereço
  // (ex.: https://usuario.github.io/repositorio no GitHub Pages).
  site: process.env.SITE_URL || 'https://www.quintelabrandt.adv.br',
  trailingSlash: 'always',
  build: { format: 'directory' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
  // Com 'class', o escopo do pai acompanha o `class` passado a componentes filhos
  // (ex.: o <h1> gerado pelo RiseText recebe o posicionamento de grade da página).
  scopedStyleStrategy: 'class',
  // CSP gerada no build: hashes de todo script e estilo embutidos, nada de
  // 'unsafe-inline' em script-src. Atributos style="--i:…" (atrasos das
  // animações) são liberados só via style-src-attr.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        `connect-src 'self'${formOrigin ? ' ' + formOrigin : ''}`,
        `form-action 'self'${formOrigin ? ' ' + formOrigin : ''}`,
        "base-uri 'self'",
        "object-src 'none'",
      ],
      styleDirective: {
        resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }],
      },
    },
  },
});
