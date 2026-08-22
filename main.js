// ===================== MONARCH PIXEL — main.js =====================

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector('.site-header');
  function onScroll(){
    if (!header) return;
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  var burger = document.querySelector('.burger');
  var mobileNav = document.querySelector('.mobile-nav');
  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      var open = burger.classList.toggle('is-open');
      mobileNav.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function(){
        if (a.classList.contains('mobile-expand')) return;
        burger.classList.remove('is-open');
        mobileNav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }
  var mExpand = document.querySelector('.mobile-expand');
  if (mExpand) {
    mExpand.addEventListener('click', function () {
      var sub = document.querySelector('.m-sub');
      sub.classList.toggle('open');
      mExpand.setAttribute('aria-expanded', sub.classList.contains('open') ? 'true' : 'false');
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Toast ---------- */
  window.mpToast = function (msg) {
    var toast = document.querySelector('.toast');
    if (!toast) return;
    toast.querySelector('span').textContent = msg;
    toast.classList.add('show');
    clearTimeout(window.__mpToastTimer);
    window.__mpToastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3600);
  };

  /* ==================== PROJECT ENQUIRY FORM ==================== */
  var enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    var dz = enquiryForm.querySelector('.dropzone');
    var fileInput = enquiryForm.querySelector('#projectFiles');
    var fileList = enquiryForm.querySelector('.file-list');
    var selectedFiles = [];

    if (dz && fileInput) {
      dz.addEventListener('click', function () { fileInput.click(); });
      dz.addEventListener('dragover', function (e) { e.preventDefault(); dz.classList.add('drag'); });
      dz.addEventListener('dragleave', function () { dz.classList.remove('drag'); });
      dz.addEventListener('drop', function (e) {
        e.preventDefault(); dz.classList.remove('drag');
        addFiles(e.dataTransfer.files);
      });
      fileInput.addEventListener('change', function () { addFiles(fileInput.files); });
    }

    function addFiles(fileArr) {
      Array.prototype.forEach.call(fileArr, function (f) { selectedFiles.push(f); });
      renderFiles();
    }
    function renderFiles() {
      if (!fileList) return;
      fileList.innerHTML = '';
      selectedFiles.forEach(function (f, idx) {
        var li = document.createElement('li');
        var sizeKb = (f.size / 1024).toFixed(0);
        li.innerHTML = '<span>' + f.name + ' &middot; ' + sizeKb + ' KB</span>';
        var btn = document.createElement('button');
        btn.type = 'button'; btn.innerHTML = '&times;'; btn.setAttribute('aria-label','Remove file');
        btn.addEventListener('click', function () { selectedFiles.splice(idx, 1); renderFiles(); });
        li.appendChild(btn);
        fileList.appendChild(li);
      });
    }

    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var required = enquiryForm.querySelectorAll('[required]');
      var valid = true;
      required.forEach(function (input) {
        var field = input.closest('.field');
        var isEmail = input.type === 'email';
        var empty = !input.value.trim();
        var badEmail = isEmail && !empty && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        if (empty || badEmail) { field.classList.add('has-error'); valid = false; }
        else field.classList.remove('has-error');
      });
      if (!valid) return;

      enquiryForm.classList.add('hide');
      var success = document.getElementById('enquirySuccess');
      if (success) success.classList.add('show');
      window.scrollTo({ top: success.offsetTop - 140, behavior: 'smooth' });
    });
  }

  /* ==================== WORK / PORTFOLIO FILTER ==================== */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var workCards = document.querySelectorAll('.work-card');
  if (filterBtns.length && workCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.dataset.filter;
        workCards.forEach(function (card) {
          var match = cat === 'all' || card.dataset.category === cat;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* ==================== CAREERS INTEREST FORM (if present) ==================== */
  var careersForm = document.getElementById('careersForm');
  if (careersForm) {
    careersForm.addEventListener('submit', function (e) {
      e.preventDefault();
      careersForm.classList.add('hide');
      var s = document.getElementById('careersSuccess');
      if (s) s.classList.add('show');
    });
  }

});
