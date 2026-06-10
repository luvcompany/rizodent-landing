# RizoDent — Landing Page

Landing page da **RizoDent**, centro odontológico especializado em implantes dentários e estética dental em Vitória da Conquista – BA.

## Objetivo

Página focada em **conversão de leads** para agendamento de avaliação, com:

- Hero com proposta de valor clara e CTA duplo (formulário + WhatsApp)
- Seção de dores do público (dentadura, vergonha ao sorrir, dor ao comer)
- **Explicação dos procedimentos** (implante unitário, protocolo, overdenture)
- Jornada do tratamento em 4 passos
- Prova social: números, vídeos de transformações e depoimentos
- Seção de pagamento facilitado (quebra de objeção de preço)
- Formulário com máscara de telefone que envia o lead direto para o WhatsApp
- FAQ em acordeão
- Botão flutuante de WhatsApp
- Layout responsivo (mobile-first) e animações de scroll

## Stack

HTML + CSS + JavaScript puros, sem dependências ou build. Basta servir os arquivos estáticos.

## Desenvolvimento local

```bash
# Qualquer servidor estático funciona, por exemplo:
python3 -m http.server 8000
# Acesse http://localhost:8000
```

## Estrutura

```
index.html      # Página única
css/style.css   # Estilos
js/main.js      # Menu, animações, máscara de telefone e envio do formulário
```

## Pendências para o go-live

- [ ] Substituir os links dos vídeos de depoimentos (`#resultados`) pelos YouTube Shorts reais
- [ ] Adicionar fotos reais da clínica na seção `#clinica`
- [ ] Confirmar os números de prova social (pacientes atendidos, anos, parcelamento)
- [ ] Adicionar pixel do Meta/Google Tag Manager para rastreio de conversão
- [ ] Configurar domínio e hospedagem (Vercel, Netlify, GitHub Pages ou similar)
