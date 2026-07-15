/* ═══════════════════════════════════════════════════════════════
   Ademir Agência — Medição de acessos (Google Analytics 4 + LGPD)
   ───────────────────────────────────────────────────────────────
   COMO ATIVAR:
   1. Crie uma conta gratuita em https://analytics.google.com
   2. Crie uma propriedade GA4 e um fluxo de dados para o site.
   3. Copie o "ID de medição" (formato G-XXXXXXXXXX).
   4. Cole esse ID na linha GA_ID abaixo, no lugar de G-XXXXXXXXXX.
   5. Publique. Pronto — a medição passa a valer em todas as páginas.

   Enquanto o ID estiver como G-XXXXXXXXXX (placeholder), NADA muda no
   site: sem rastreamento e sem aviso de cookies. Tudo só ativa quando
   você colocar o seu ID real.
═══════════════════════════════════════════════════════════════ */
(function () {
  var GA_ID = 'G-6XCLYCXM6F'; // <<< ID de medição do GA4

  // Só ativa com um ID real (o placeholder G-XXXXXXXXXX contém "XXXX")
  var VALID = GA_ID.indexOf('G-') === 0 && GA_ID.length >= 10 && GA_ID.indexOf('XXXX') === -1;
  if (!VALID) return;

  var KEY = 'aa_consent';

  function loadGA() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
    initLeadTracking();
    initSpeedInsights();
  }

  // Speed Insights — mede a velocidade real de cada visita (Core Web Vitals:
  // TTFB, FCP, LCP, CLS e INP) e envia ao GA4 como eventos "web_vitals".
  // Equivalente ao Vercel Speed Insights, mas funcionando no GitHub Pages.
  function initSpeedInsights() {
    if (window.__aaVitals) return;
    window.__aaVitals = true;
    var sent = {};
    function send(name, value) {
      if (sent[name] || typeof gtag !== 'function') return;
      sent[name] = true;
      gtag('event', 'web_vitals', {
        metric_name: name,
        metric_value: Math.round(name === 'CLS' ? value * 1000 : value),
        page_path: location.pathname,
        non_interaction: true
      });
    }
    try {
      var nav = performance.getEntriesByType('navigation')[0];
      if (nav) send('TTFB', nav.responseStart);
    } catch (e) {}
    try {
      new PerformanceObserver(function (l) {
        l.getEntries().forEach(function (en) {
          if (en.name === 'first-contentful-paint') send('FCP', en.startTime);
        });
      }).observe({ type: 'paint', buffered: true });
    } catch (e) {}
    var lcp = 0, cls = 0, inp = 0;
    try {
      new PerformanceObserver(function (l) {
        var es = l.getEntries();
        if (es.length) lcp = es[es.length - 1].startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {}
    try {
      new PerformanceObserver(function (l) {
        l.getEntries().forEach(function (en) {
          if (!en.hadRecentInput) cls += en.value;
        });
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (e) {}
    try {
      new PerformanceObserver(function (l) {
        l.getEntries().forEach(function (en) {
          if (en.duration > inp) inp = en.duration;
        });
      }).observe({ type: 'event', durationThreshold: 40, buffered: true });
    } catch (e) {}
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        if (lcp) send('LCP', lcp);
        send('CLS', cls);
        if (inp) send('INP', inp);
      }
    });
  }

  // Mede leads: clique em WhatsApp e envio do formulário de contato.
  // O evento "generate_lead" é o recomendado pelo GA4 para marcar como conversão.
  function initLeadTracking() {
    if (window.__aaLeadTracking) return; // evita duplicar
    window.__aaLeadTracking = true;

    function track(method, extra) {
      if (typeof gtag !== 'function') return;
      var params = { method: method };
      if (extra) for (var k in extra) params[k] = extra[k];
      gtag('event', 'generate_lead', params);
    }

    // Cliques em qualquer link de WhatsApp (wa.me ou api.whatsapp)
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href*="wa.me"],a[href*="api.whatsapp.com"]') : null;
      if (a) track('whatsapp', { link_url: a.getAttribute('href') });
    }, true);

    // Cliques em links de e-mail (mailto) e telefone (tel)
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href^="mailto:"],a[href^="tel:"]') : null;
      if (a) track(a.getAttribute('href').indexOf('mailto:') === 0 ? 'email' : 'telefone');
    }, true);

    // Envio do formulário de contato
    var form = document.getElementById('contactForm');
    if (form) form.addEventListener('submit', function () { track('formulario'); });
  }

  var consent = null;
  try { consent = localStorage.getItem(KEY); } catch (e) {}
  if (consent === 'accepted') { loadGA(); return; }
  if (consent === 'rejected') { return; }

  function showBanner() {
    var style = document.createElement('style');
    style.textContent =
      '#aa-cookie{position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;max-width:520px;margin:0 auto;' +
      'background:#111;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:18px 20px;' +
      "font-family:'Space Grotesk',system-ui,sans-serif;color:#fff;box-shadow:0 10px 40px rgba(0,0,0,.5)}" +
      '#aa-cookie p{margin:0 0 12px;font-size:13.5px;line-height:1.55;color:rgba(255,255,255,.75)}' +
      '#aa-cookie a{color:#F5A623;text-decoration:none}' +
      '#aa-cookie .row{display:flex;gap:10px}' +
      '#aa-cookie button{flex:1;padding:10px;border-radius:8px;border:0;font-weight:700;cursor:pointer;font-size:13px}' +
      '#aa-ok{background:#F5A623;color:#000}' +
      '#aa-no{background:transparent;border:1px solid rgba(255,255,255,.2);color:#fff}';
    document.head.appendChild(style);

    var d = document.createElement('div');
    d.id = 'aa-cookie';
    d.innerHTML =
      '<p>Usamos cookies para entender como o site é usado e melhorar sua experiência. ' +
      'Você pode aceitar ou recusar a qualquer momento. ' +
      '<a href="/privacidade/">Saiba mais</a>.</p>' +
      '<div class="row"><button id="aa-no">Recusar</button><button id="aa-ok">Aceitar</button></div>';
    document.body.appendChild(d);

    document.getElementById('aa-ok').onclick = function () {
      try { localStorage.setItem(KEY, 'accepted'); } catch (e) {}
      d.remove(); loadGA();
    };
    document.getElementById('aa-no').onclick = function () {
      try { localStorage.setItem(KEY, 'rejected'); } catch (e) {}
      d.remove();
    };
  }

  if (document.body) showBanner();
  else document.addEventListener('DOMContentLoaded', showBanner);
})();
