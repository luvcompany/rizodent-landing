// ===== RizoDent Landing Page =====

// Menu mobile
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Animação de entrada (scroll reveal)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Contador animado das estatísticas
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1400;
      const start = performance.now();
      const prefix = target >= 100 ? '+' : '';

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + Math.round(target * eased).toLocaleString('pt-BR');
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
counters.forEach((el) => counterObserver.observe(el));

// Máscara de telefone (formato brasileiro)
const phoneInput = document.getElementById('telefone');
phoneInput.addEventListener('input', () => {
  let v = phoneInput.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 6) {
    v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
  } else if (v.length > 2) {
    v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
  } else if (v.length > 0) {
    v = `(${v}`;
  }
  phoneInput.value = v;
});

// Envio do formulário → abre o WhatsApp da clínica com a mensagem preenchida.
// Para integrar com um CRM ou e-mail, substitua este bloco pelo envio à sua API.
const form = document.getElementById('leadForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = form.nome.value.trim();
  const telefone = form.telefone.value.replace(/\D/g, '');
  const interesse = form.interesse.value;
  const mensagem = form.mensagem.value.trim();

  let valid = true;
  [form.nome, form.telefone].forEach((field) => field.classList.remove('invalid'));
  if (!nome) {
    form.nome.classList.add('invalid');
    valid = false;
  }
  if (telefone.length < 10) {
    form.telefone.classList.add('invalid');
    valid = false;
  }
  if (!valid) return;

  let texto = `Olá! Quero agendar uma avaliação na RizoDent.\n\n*Nome:* ${nome}\n*Telefone:* ${form.telefone.value}`;
  if (interesse) texto += `\n*Interesse:* ${interesse}`;
  if (mensagem) texto += `\n*Mensagem:* ${mensagem}`;

  window.open(`https://wa.me/5577981147531?text=${encodeURIComponent(texto)}`, '_blank');

  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = '✓ Abrindo o WhatsApp...';
  setTimeout(() => {
    btn.textContent = 'Quero agendar minha avaliação';
    form.reset();
  }, 3000);
});
