(function () {
  // Back to top button (#back-top is shown after scrolling)
  var backTop = document.getElementById('back-top');
  function toggleBackTop() {
    if (!backTop) return;
    backTop.style.display = window.pageYOffset > 300 ? 'block' : 'none';
  }
  window.addEventListener('scroll', toggleBackTop);
  toggleBackTop();

  if (backTop) {
    backTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Header search toggle
  var searchIcon = document.querySelector('.site-header .search-icon');
  var headerSearch = document.querySelector('.header-search');
  if (searchIcon) {
    searchIcon.addEventListener('click', function () {
      var search = document.querySelector('.genericon-search');
      var close = document.querySelector('.genericon-close');
      if (search) search.classList.toggle('active');
      if (close) close.classList.toggle('active');
      if (headerSearch) {
        headerSearch.style.display =
          headerSearch.style.display === 'block' ? 'none' : 'block';
      }
    });
  }
})();
