// ===== RizoDent — scripts compartilhados por todas as páginas =====
const WHATSAPP = '5577981147531';

// ---- Menu mobile ----
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

if (navToggle && nav) {
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

  // Destaca a página atual no menu
  const current = location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('a').forEach((link) => {
    const href = link.getAttribute('href').split('#')[0];
    if (href && href === current) link.classList.add('active');
  });
}

// ---- Scroll reveal ----
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ---- Contadores ----
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
document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));

// ---- Tabs de tratamentos (home) ----
const tabs = document.querySelectorAll('.tab');
if (tabs.length) {
  const panels = document.querySelectorAll('.tab-panel');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach((panel) => {
        const active = panel.id === `panel-${tab.dataset.tab}`;
        panel.hidden = !active;
        panel.classList.toggle('active', active);
        if (active) {
          panel.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
        }
      });
    });
  });
}

// ---- Quiz (home) ----
const quizBox = document.getElementById('quizBox');
if (quizBox) {
  const quizSteps = quizBox.querySelectorAll('.quiz__step');
  const quizProgress = document.getElementById('quizProgress');
  const quizResult = document.getElementById('quizResult');
  const quizAnswers = [];

  // Mapeia a 1ª resposta (situação) para a recomendação principal
  const RECOMMENDATIONS = {
    um: {
      title: 'Implante Unitário',
      text: 'Pelo seu perfil, o implante unitário tende a ser o caminho: substitui o dente perdido por um pino de titânio com coroa de porcelana, sem desgastar os dentes vizinhos e com resultado natural e definitivo.',
    },
    todos: {
      title: 'Protocolo — Prótese Fixa Total',
      text: 'Pelo seu perfil, o protocolo tende a ser o caminho: uma prótese completa fixada sobre 4 a 6 implantes, que devolve a mastigação, a estética e a segurança de dentes fixos.',
    },
    dentadura: {
      title: 'Protocolo ou Implante Zigomático',
      text: 'Quem não se adapta à dentadura costuma se beneficiar do protocolo (prótese fixa sobre implantes). E se houver perda óssea severa na maxila, o implante zigomático garante os dentes fixos sem necessidade de enxerto. A avaliação define o caminho ideal.',
    },
    estetica: {
      title: 'Estética do Sorriso',
      text: 'Pelo seu perfil, tratamentos como lentes de contato dental, facetas e clareamento tendem a ser o caminho para transformar o seu sorriso sem procedimentos invasivos.',
    },
  };

  quizSteps.forEach((step, index) => {
    step.querySelectorAll('.quiz__options button').forEach((option) => {
      option.addEventListener('click', () => {
        quizAnswers[index] = option.dataset.value;
        const next = quizSteps[index + 1];
        step.classList.remove('active');

        if (next) {
          next.classList.add('active');
          quizProgress.style.width = `${((index + 2) / quizSteps.length) * 100}%`;
        } else {
          const rec = RECOMMENDATIONS[quizAnswers[0]] || RECOMMENDATIONS.estetica;
          quizProgress.style.width = '100%';
          document.getElementById('quizResultTitle').textContent = `Indicação inicial: ${rec.title}`;
          document.getElementById('quizResultText').textContent = rec.text;

          const msg = `Olá! Fiz o teste do site e a indicação inicial foi: ${rec.title}. Quero agendar uma avaliação para confirmar.`;
          document.getElementById('quizWhats').href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
          quizResult.hidden = false;
        }
      });
    });
  });

  document.getElementById('quizRestart').addEventListener('click', () => {
    quizAnswers.length = 0;
    quizResult.hidden = true;
    quizSteps.forEach((step, i) => step.classList.toggle('active', i === 0));
    quizProgress.style.width = '33%';
  });
}

// ---- Carrossel de depoimentos (home) ----
const track = document.getElementById('carouselTrack');
if (track) {
  const dotsWrap = document.getElementById('carouselDots');
  const quotes = track.children.length;
  let perView = window.innerWidth <= 1020 ? 1 : 2;
  let pages = Math.ceil(quotes / perView);
  let page = 0;
  let autoTimer;

  const buildDots = () => {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Ir para o grupo ${i + 1}`);
      dot.addEventListener('click', () => goTo(i, true));
      dotsWrap.appendChild(dot);
    }
    updateDots();
  };

  const updateDots = () => {
    [...dotsWrap.children].forEach((d, i) => d.classList.toggle('active', i === page));
  };

  const goTo = (target, manual = false) => {
    page = (target + pages) % pages;
    track.style.transform = `translateX(-${page * 100}%)`;
    updateDots();
    if (manual) restartAuto();
  };

  const restartAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(page + 1), 6000);
  };

  document.getElementById('carouselPrev').addEventListener('click', () => goTo(page - 1, true));
  document.getElementById('carouselNext').addEventListener('click', () => goTo(page + 1, true));

  window.addEventListener('resize', () => {
    const newPerView = window.innerWidth <= 1020 ? 1 : 2;
    if (newPerView !== perView) {
      perView = newPerView;
      pages = Math.ceil(quotes / perView);
      page = 0;
      track.style.transform = 'translateX(0)';
      buildDots();
    }
  });

  buildDots();
  restartAuto();
}

// ---- Formulários de lead → WhatsApp ----
// Para integrar com um CRM ou e-mail, substitua o window.open pelo envio à sua API.
document.querySelectorAll('form.lead-form').forEach((form) => {
  const phone = form.telefone;
  phone.addEventListener('input', () => {
    let v = phone.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) {
      v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
      v = `(${v}`;
    }
    phone.value = v;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const telefone = phone.value.replace(/\D/g, '');
    const servico = form.servico ? form.servico.value : '';
    const cidade = form.cidade ? form.cidade.value : '';
    const mensagem = form.mensagem ? form.mensagem.value.trim() : '';

    let valid = true;
    [form.nome, phone, form.servico, form.cidade].forEach((field) => field && field.classList.remove('invalid'));
    if (!nome) {
      form.nome.classList.add('invalid');
      valid = false;
    }
    if (telefone.length < 10) {
      phone.classList.add('invalid');
      valid = false;
    }
    if (form.servico && !servico) {
      form.servico.classList.add('invalid');
      valid = false;
    }
    if (form.cidade && !cidade) {
      form.cidade.classList.add('invalid');
      valid = false;
    }
    if (!valid) return;

    let texto = `Olá! Quero agendar uma avaliação na RizoDent.\n\n*Nome:* ${nome}\n*Telefone:* ${phone.value}`;
    if (servico) texto += `\n*Serviço desejado:* ${servico}`;
    if (cidade) texto += `\n*Unidade mais próxima:* ${cidade}`;
    if (mensagem) texto += `\n*Mensagem:* ${mensagem}`;

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, '_blank');

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = '✓ Abrindo o WhatsApp...';
    setTimeout(() => {
      btn.textContent = original;
      form.reset();
    }, 3000);
  });
});
