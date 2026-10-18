(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  var altFill = $('#altFill'), altNum = $('#altNum');
  var heroImg = $('#heroImg');
  var stage = $('#cookStage'), track = $('.cook-track');
  var frames = $$('.fr'), badge = $('#cookBadge'), bar = $('#cookBar');
  var storyImg = $('#storyPhoto img');
  var sticky = $('.sticky-buy');
  var MAX_ALT = 5642; // высота Эльбруса
  var ticking = false;

  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  function update() {
    ticking = false;
    var y = window.scrollY, h = window.innerHeight;
    var docH = document.documentElement.scrollHeight - h;
    var p = docH > 0 ? clamp(y / docH, 0, 1) : 0;

    altFill.style.width = (p * 100) + '%';
    altNum.textContent = fmt(Math.round(p * MAX_ALT));

    if (!reduce && heroImg && y < h * 1.2) {
      heroImg.style.transform = 'translate3d(0,' + (y * 0.18).toFixed(1) + 'px,0) scale(' + (1 + y / h * 0.04).toFixed(3) + ')';
    }

    if (track) {
      var r = track.getBoundingClientRect();
      var cp = clamp(-r.top / (r.height - h), 0, 1);
      var step = cp < 0.33 ? 1 : cp < 0.66 ? 2 : 3;
      if (+stage.dataset.step !== step) {
        stage.dataset.step = step;
        badge.textContent = 'Шаг ' + step + ' из 3';
        frames.forEach(function (f) { f.classList.toggle('on', +f.dataset.f === step); });
      }
      bar.style.width = (cp * 100) + '%';
    }

    if (storyImg && !reduce) {
      var pr = storyImg.parentElement.parentElement.getBoundingClientRect();
      if (pr.bottom > 0 && pr.top < h) {
        var k = (pr.top + pr.height / 2 - h / 2) / h;
        storyImg.style.transform = 'translate3d(0,' + (k * -50).toFixed(1) + 'px,0)';
      }
    }

    if (sticky) sticky.classList.toggle('show', y > h * 0.8);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  // ---------- блюда ----------
  var DISHES = {
    borsch: {
      name: 'Борщ', video: 'assets/video/borsch.mp4', poster: 'assets/img/borsch-poster.jpg',
      desc: 'Картофельные хлопья, лук, морковь, свёкла, капуста, сушёный томат, паприка и зелень. Для насыщенного вкуса добавьте тушёнку.',
      big: '160 г', bigP: '402 ₽', small: '80 г', smallP: '283 ₽',
      nutri: 'На 160 г: 506 ккал, белки 17 г, жиры 11,5 г, углеводы 82,5 г.',
      steps: ['Высыпать пакет в холодную воду: пакет на 1 л готового блюда в 0,8-1 л, на 2 л в 1,8-2 л.', 'Дать постоять 5 минут, чтобы овощи напитались.', 'Довести до кипения на среднем огне и варить 4-6 минут, посолить по вкусу. Тушёнку можно добавить перед закипанием.']
    },
    harcho: {
      name: 'Харчо', video: 'assets/video/harcho.mp4', poster: 'assets/img/harcho-poster.jpg',
      desc: 'Густой пряный суп, который хорошо согревает после долгого дня на холоде. Готовится так же, как борщ.',
      big: '180 г', bigP: '', small: '90 г', smallP: '286 ₽', nutri: '',
      steps: ['Высыпать пакет в холодную воду: пакет на 1 л готового блюда в 0,8-1 л, на 2 л в 1,8-2 л.', 'Дать постоять 5 минут.', 'Довести до кипения и варить 4-6 минут. Вместо воды можно взять готовый бульон.']
    },
    goroh: {
      name: 'Гороховый крем-суп', video: 'assets/video/goroh.mp4', poster: 'assets/img/goroh-poster.jpg',
      desc: 'Нежный гороховый суп-пюре. По желанию в процессе варки добавьте копчёности.',
      big: '240 г', bigP: '370 ₽', small: '120 г', smallP: '236 ₽', nutri: '',
      steps: ['Высыпать пакет в холодную воду (большой в 1,4 л, маленький в 0,7-0,8 л) и тщательно перемешать.', 'Оставить на 5 минут.', 'Довести до кипения и варить 3-5 минут, постоянно помешивая, чтобы не подгорело.']
    },
    ragu: {
      name: 'Гороховое рагу с овощами', video: 'assets/video/ragu.mp4', poster: 'assets/img/ragu-poster.jpg',
      desc: 'Густое сытное блюдо, которое хорошо идёт с консервированной тушёнкой.',
      big: '320 г', bigP: '402 ₽', small: '160 г', smallP: '158 ₽', nutri: '',
      steps: ['Часть пакета с овощами засыпать в холодную воду (большой в 1,8 л, малый в 0,9 л), подождать 5 минут.', 'Варить на среднем огне 4-6 минут.', 'Постоянно помешивая, внести вторую часть пакета и мешать до однородной массы. Соль, специи и тушёнку добавить по вкусу.']
    }
  };
  var PORTIONS = { borsch: ['4-5 порций', '2-3 порции'], harcho: ['4-5 порций', '2-3 порции'], goroh: ['4 порции', '2 порции'], ragu: ['4-5 порций', '2-3 порции'] };
  var curDish = 'borsch';
  var video = $('#dishVideo'), clip = $('.clip'), info = $('.dish-info');
  var tabs = $$('.dish-tabs button');

  function setDish(k, animate) {
    var d = DISHES[k];
    tabs.forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.k === k)); });
    $('#dishName').textContent = d.name;
    $('#dishDesc').textContent = d.desc;
    $('#sizeBigW').textContent = d.big;
    $('#sizeSmallW').textContent = d.small;
    $('#sizeBigP').textContent = d.bigP || 'цена на Озоне'; $('#sizeSmallP').textContent = d.smallP || 'цена на Озоне';
    $('#sizeBigN').textContent = PORTIONS[k][0]; $('#sizeSmallN').textContent = PORTIONS[k][1];
    curDish = k; showLabel('big');
    var n = $('#dishNutri'); n.textContent = d.nutri; n.style.display = d.nutri ? '' : 'none';
    $('#dishSteps').innerHTML = d.steps.map(function (s) { return '<li><span>' + s + '</span></li>'; }).join('');
    video.poster = d.poster;
    video.src = d.video;
    video.load();
    playIfVisible();
    if (animate) { info.classList.remove('swap'); void info.offsetWidth; info.classList.add('swap'); }
  }
  function showLabel(which) {
    var lab = $('#dishLabel'), sb = $$('.size');
    lab.src = 'assets/labels/' + curDish + '-' + which + '.jpg';
    lab.alt = 'Этикетка: ' + DISHES[curDish].name + ', ' + (which === 'big' ? DISHES[curDish].big : DISHES[curDish].small);
    sb.forEach(function (s) { var on = s.dataset.s === which; s.classList.toggle('is-on', on); s.setAttribute('aria-pressed', String(on)); });
  }
  $$('.size').forEach(function (s) { s.addEventListener('click', function () { showLabel(s.dataset.s); }); });
  $$('.labels a').forEach(function (a) { a.addEventListener('click', function () { setDish(a.dataset.k, true); }); });
  tabs.forEach(function (b) { b.addEventListener('click', function () { setDish(b.dataset.k, true); }); });

  var userPaused = false;
  function playIfVisible() {
    if (userPaused || reduce) return;
    var r = clip.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight) { var pr = video.play(); if (pr && pr.catch) pr.catch(function () {}); }
  }
  $('#phonePlay').addEventListener('click', function () {
    if (video.paused) { userPaused = false; video.play(); clip.classList.remove('is-paused'); }
    else { userPaused = true; video.pause(); clip.classList.add('is-paused'); }
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) playIfVisible(); else video.pause(); });
    }, { threshold: 0.4 }).observe(clip);
  }
  // звук: ролики стартуют без звука (так требуют браузеры), включается по кнопке
  var soundBtn = $('#clipSound');
  if (soundBtn) soundBtn.addEventListener('click', function () {
    video.muted = !video.muted;
    var on = !video.muted;
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.setAttribute('aria-label', on ? 'Выключить звук' : 'Включить звук');
    soundBtn.querySelector('span').textContent = on ? 'Выключить звук' : 'Включить звук';
    if (on && video.paused && !userPaused) video.play();
  });
  setDish('borsch', false);
})();
