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

// ---- Agendamento em 2 passos: formulário curto → pop-up → WhatsApp ----
// Para integrar com um CRM ou agenda real, substitua o window.open pelo envio à sua API.
const SERVICOS = [
  'Implante Dentário', 'Prótese Dentária', 'Clareamento Dental', 'Facetas Dentárias',
  'Lente de Contato Dental', 'Aparelho Ortodôntico', 'Tratamento de Canal (Endodontia)',
  'Extração Dentária', 'Limpeza Dentária (Profilaxia)',
];
const CIDADES = ['Vitória da Conquista', 'Guanambi', 'Itabuna', 'Ipiaú'];
// Horários de atendimento: Seg–Sex 07h30–18h | Sáb 07h30–14h | Dom fechado
const HORARIOS_SEMANA = ['07:30', '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const HORARIOS_SABADO = ['07:30', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];

let modal = null;
let leadAtual = null;

function proximosDias() {
  const dias = [];
  const fmt = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
  const d = new Date();
  while (dias.length < 8) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) continue; // domingo fechado
    const rotulo = fmt.format(d).replace('.', '');
    dias.push({ rotulo: rotulo.charAt(0).toUpperCase() + rotulo.slice(1), sabado: d.getDay() === 6 });
  }
  return dias;
}

function criarModal() {
  const dias = proximosDias();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitulo">
      <button type="button" class="modal__close" aria-label="Fechar">×</button>
      <h3 id="modalTitulo">Quase lá! Escolha o melhor horário</h3>
      <p class="modal__sub">Selecione o serviço, a unidade e quando você prefere ser atendido.</p>
      <div class="form__field">
        <label for="mServico">Serviço desejado *</label>
        <select id="mServico" required>
          <option value="">Selecione</option>
          ${SERVICOS.map((s) => `<option>${s}</option>`).join('')}
        </select>
      </div>
      <div class="form__field">
        <label for="mCidade">Clínica mais próxima *</label>
        <select id="mCidade" required>
          <option value="">Selecione</option>
          ${CIDADES.map((c) => `<option>${c}</option>`).join('')}
        </select>
      </div>
      <div class="modal__grid">
        <div class="form__field">
          <label for="mDia">Dia *</label>
          <select id="mDia" required>
            <option value="">Selecione</option>
            ${dias.map((d) => `<option data-sabado="${d.sabado}">${d.rotulo}</option>`).join('')}
          </select>
        </div>
        <div class="form__field">
          <label for="mHora">Horário *</label>
          <select id="mHora" required>
            <option value="">Selecione o dia</option>
          </select>
        </div>
      </div>
      <div class="form__field">
        <label for="mMensagem">Mensagem (opcional)</label>
        <textarea id="mMensagem" rows="2" placeholder="Conte-nos sobre sua necessidade..."></textarea>
      </div>
      <button type="button" class="btn btn--primary btn--lg btn--block" id="mConfirmar">Confirmar agendamento</button>
      <p class="form__privacy">📅 O horário escolhido é uma preferência — nossa equipe confirma a disponibilidade pelo WhatsApp.</p>
    </div>`;
  document.body.appendChild(overlay);

  const dia = overlay.querySelector('#mDia');
  const hora = overlay.querySelector('#mHora');
  dia.addEventListener('change', () => {
    const sabado = dia.selectedOptions[0]?.dataset.sabado === 'true';
    const horarios = sabado ? HORARIOS_SABADO : HORARIOS_SEMANA;
    hora.innerHTML = '<option value="">Selecione</option>' + horarios.map((h) => `<option>${h}</option>`).join('');
  });

  const fechar = () => { overlay.hidden = true; };
  overlay.querySelector('.modal__close').addEventListener('click', fechar);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) fechar(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) fechar(); });

  overlay.querySelector('#mConfirmar').addEventListener('click', () => {
    const servico = overlay.querySelector('#mServico');
    const cidade = overlay.querySelector('#mCidade');
    const mensagem = overlay.querySelector('#mMensagem').value.trim();

    let valid = true;
    [servico, cidade, dia, hora].forEach((field) => {
      field.classList.remove('invalid');
      if (!field.value) {
        field.classList.add('invalid');
        valid = false;
      }
    });
    if (!valid || !leadAtual) return;

    let texto = `Olá! Quero agendar uma avaliação na RizoDent.\n\n*Nome:* ${leadAtual.nome}\n*Telefone:* ${leadAtual.telefone}` +
      `\n*Serviço desejado:* ${servico.value}\n*Clínica:* ${cidade.value}\n*Dia:* ${dia.value}\n*Horário:* ${hora.value}`;
    if (mensagem) texto += `\n*Mensagem:* ${mensagem}`;

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, '_blank');
    fechar();
    [servico, cidade, dia, hora].forEach((field) => { field.value = ''; });
    overlay.querySelector('#mMensagem').value = '';
    hora.innerHTML = '<option value="">Selecione o dia</option>';

    const btn = leadAtual.form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = '✓ Abrindo o WhatsApp...';
    setTimeout(() => {
      btn.textContent = original;
      leadAtual.form.reset();
      leadAtual = null;
    }, 3000);
  });

  return overlay;
}

function abrirModal(form) {
  if (!modal) modal = criarModal();
  leadAtual = {
    form,
    nome: form.nome.value.trim(),
    telefone: form.telefone.value,
  };
  // Pré-seleciona o serviço nas páginas de tratamento
  const servicoSelect = modal.querySelector('#mServico');
  if (form.dataset.servico) servicoSelect.value = form.dataset.servico;
  modal.hidden = false;
  modal.querySelector('.modal').scrollTop = 0;
  servicoSelect.focus();
}

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

    let valid = true;
    [form.nome, phone].forEach((field) => field.classList.remove('invalid'));
    if (!form.nome.value.trim()) {
      form.nome.classList.add('invalid');
      valid = false;
    }
    if (phone.value.replace(/\D/g, '').length < 10) {
      phone.classList.add('invalid');
      valid = false;
    }
    if (!valid) return;

    abrirModal(form);
  });
});
