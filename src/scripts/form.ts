/**
 * Formulário de contato: validação acessível e envio.
 * - Erros em texto (não só cor), ligados ao campo por aria-describedby.
 * - No envio com erro, o foco vai para o primeiro campo inválido.
 * - Depois da primeira tentativa, cada campo revalida ao sair dele.
 * - Nunca apaga o que a pessoa digitou.
 */

type Channel = 'whatsapp' | 'telefone' | 'email';

const CHANNEL_UI: Record<Channel, { label: string; hint: string; type: string; autocomplete: string; inputmode: string; done: string }> = {
  whatsapp: {
    label: 'Seu WhatsApp',
    hint: 'Com DDD. Respondemos por mensagem.',
    type: 'tel',
    autocomplete: 'tel',
    inputmode: 'tel',
    done: 'pelo WhatsApp',
  },
  telefone: {
    label: 'Seu telefone',
    hint: 'Com DDD. Ligamos em horário comercial.',
    type: 'tel',
    autocomplete: 'tel',
    inputmode: 'tel',
    done: 'por telefone',
  },
  email: {
    label: 'Seu e-mail',
    hint: 'Respondemos por e-mail.',
    type: 'email',
    autocomplete: 'email',
    inputmode: 'email',
    done: 'por e-mail',
  },
};

const digits = (v: string) => v.replace(/\D/g, '');

function formatPhone(v: string) {
  const d = digits(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function initContactForm() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  const root = document.querySelector<HTMLElement>('[data-form-root]');
  if (!form || !root) return;

  const done = root.querySelector<HTMLElement>('[data-done]')!;
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const summary = form.querySelector<HTMLElement>('[data-error-summary]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const contact = form.elements.namedItem('contato') as HTMLInputElement;
  const contactLabel = form.querySelector<HTMLElement>('[data-contact-label]')!;
  const contactHint = form.querySelector<HTMLElement>('[data-contact-hint]')!;
  const message = form.elements.namedItem('mensagem') as HTMLTextAreaElement;
  const counter = form.querySelector<HTMLElement>('[data-count]');
  const subject = form.elements.namedItem('assunto') as HTMLSelectElement;
  let attempted = false;

  const channel = (): Channel => ((form.querySelector('input[name="canal"]:checked') as HTMLInputElement)?.value as Channel) ?? 'whatsapp';

  // Assunto pré-selecionado quando a pessoa vem de uma página de área (?assunto=familia).
  const pre = new URLSearchParams(location.search).get('assunto');
  if (pre && [...subject.options].some((o) => o.value === pre)) subject.value = pre;

  const applyChannel = () => {
    const ui = CHANNEL_UI[channel()];
    contactLabel.textContent = ui.label;
    contactHint.textContent = ui.hint;
    contact.type = ui.type;
    contact.autocomplete = ui.autocomplete as AutoFill;
    contact.inputMode = ui.inputmode;
    if (ui.type === 'tel' && contact.value && !contact.value.includes('@')) contact.value = formatPhone(contact.value);
    if (attempted) validateField('contato');
  };
  form.querySelectorAll('input[name="canal"]').forEach((r) => r.addEventListener('change', applyChannel));
  applyChannel();

  contact.addEventListener('input', () => {
    if (channel() !== 'email') {
      const pos = contact.value.length;
      contact.value = formatPhone(contact.value);
      if (pos === contact.value.length) contact.setSelectionRange(pos, pos);
    }
  });

  message.addEventListener('input', () => {
    if (counter) counter.textContent = String(message.value.length);
  });

  const rules: Record<string, () => string> = {
    nome: () => {
      const v = (form.elements.namedItem('nome') as HTMLInputElement).value.trim();
      if (!v) return 'Informe seu nome.';
      if (v.length < 2) return 'O nome parece incompleto.';
      return '';
    },
    contato: () => {
      const v = contact.value.trim();
      if (channel() === 'email') {
        if (!v) return 'Informe seu e-mail.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Confira o e-mail — ele parece incompleto (exemplo: nome@provedor.com).';
        return '';
      }
      const d = digits(v);
      if (!d) return channel() === 'whatsapp' ? 'Informe seu WhatsApp com DDD.' : 'Informe seu telefone com DDD.';
      if (d.length < 10 || d.length > 11) return 'Confira o número: são 10 ou 11 dígitos, com DDD.';
      return '';
    },
    assunto: () => (subject.value ? '' : 'Escolha o assunto — se não souber, selecione "Não sei ao certo".'),
    mensagem: () => {
      const v = message.value.trim();
      if (!v) return 'Conte, em poucas palavras, o que está acontecendo.';
      if (v.length < 15) return 'Escreva um pouco mais — uma ou duas frases bastam.';
      return '';
    },
    consentimento: () =>
      (form.elements.namedItem('consentimento') as HTMLInputElement).checked ? '' : 'Para responder, precisamos da sua concordância com o uso dos dados.',
  };

  function validateField(name: string) {
    const msg = rules[name]();
    const el = form!.elements.namedItem(name) as HTMLElement;
    const err = form!.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
    if (el) el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) err.textContent = msg;
    return !msg;
  }

  Object.keys(rules).forEach((name) => {
    const el = form.elements.namedItem(name) as HTMLElement | null;
    el?.addEventListener('blur', () => attempted && validateField(name));
    el?.addEventListener('change', () => attempted && validateField(name));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    attempted = true;
    status.textContent = '';
    const invalid = Object.keys(rules).filter((n) => !validateField(n));
    if (invalid.length) {
      summary.hidden = false;
      const first = form.elements.namedItem(invalid[0]) as HTMLElement;
      first?.focus();
      return;
    }
    summary.hidden = true;

    // Honeypot: robôs preenchem o campo invisível; pessoas não.
    if ((form.elements.namedItem('empresa') as HTMLInputElement).value) return;

    const data = Object.fromEntries(new FormData(form).entries());
    delete (data as Record<string, unknown>).empresa;

    submit.setAttribute('data-loading', 'true');
    submit.disabled = true;
    submit.querySelector('.btn-label')!.textContent = 'Enviando…';

    try {
      const endpoint = form.dataset.endpoint;
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(String(res.status));
      } else {
        // Sem endpoint configurado: nada é transmitido (ver README).
        await new Promise((r) => setTimeout(r, 900));
      }
      const firstName = String(data.nome).trim().split(/\s+/)[0];
      root.querySelector('[data-done-title]')!.textContent = `Recebemos sua mensagem, ${firstName}.`;
      root.querySelector('[data-done-channel]')!.textContent = CHANNEL_UI[channel()].done;
      form.hidden = true;
      done.hidden = false;
      done.focus();
      done.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    } catch {
      status.textContent =
        'Não foi possível enviar agora. Seus dados continuam no formulário — tente novamente em instantes ou fale conosco pelo WhatsApp ou telefone.';
    } finally {
      submit.removeAttribute('data-loading');
      submit.disabled = false;
      submit.querySelector('.btn-label')!.textContent = 'Enviar mensagem';
    }
  });
}
