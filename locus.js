// Locus TMDB Reviewer — Bookmarklet
// Use this bookmarklet on any TMDB movie or TV show page (e.g. themoviedb.org/movie/271110 or themoviedb.org/tv/1429)
javascript:(function(){
  const url = window.location.href;
  if (!url.includes('themoviedb.org')) {
    alert('Please click this bookmarklet while viewing a movie or TV show page on themoviedb.org!');
    return;
  }

  // TARGET GENERATOR URL:
  // Option A - Hosted on GitHub Pages (Recommended):
  //   URL: 'https://coach-punk.github.io/locus-bookmarklet/'
  //
  // Option B - Serving from a local web server:
  //   Run in project folder: python3 -m http.server 8000
  //   URL: 'http://localhost:8000/'
  //
  // Option C - Local file URL (Note: Edge and Chrome strictly block opening file:/// from external websites):
  //   URL: 'file:///Users/mac/Code/javascript/locus-bookmarklet/index.html'
  const generatorUrl = 'http://localhost:8000/';

  if (generatorUrl.startsWith('file:')) {
    alert('Browser Security Error:\n\nMicrosoft Edge and Chrome block web pages from opening local "file://" URLs.\n\nTo use this bookmarklet in Edge:\n1. Run: python3 -m http.server 8000 in your project folder\n2. Use: http://localhost:8000/tmdb-to-markdown.html as the generator URL');
    return;
  }

  const newTab = window.open(generatorUrl + '?url=' + encodeURIComponent(url), '_blank');
  if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
    alert('Pop-up blocked or failed to open.\n\nIf Edge blocked the pop-up, click the pop-up icon in the address bar to allow pop-ups from themoviedb.org.\n\nAlso ensure your local server is running at:\n' + generatorUrl);
  }
})();

