// Inlined in <body> so it runs before first paint: disables browser scroll
// restoration and starts every fresh load at the top (unless there's a #hash).
export const scrollToTopScript =
  "try{if('scrollRestoration' in history)history.scrollRestoration='manual';if(!location.hash)window.scrollTo(0,0)}catch(e){}";
