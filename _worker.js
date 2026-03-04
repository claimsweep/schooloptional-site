export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Fix double-path bug: /articles/articles/* → /articles/*
    if (url.pathname.startsWith('/articles/articles/')) {
      let fixed = url.pathname.replace('/articles/articles/', '/articles/');
      if (fixed.endsWith('.html')) fixed = fixed.slice(0, -5);
      return Response.redirect(new URL(fixed + url.search, url), 301);
    }

    // Strip .html extensions: /foo.html → /foo
    if (url.pathname.endsWith('.html')) {
      const clean = url.pathname.slice(0, -5);
      return Response.redirect(new URL(clean + url.search, url), 301);
    }

    return env.ASSETS.fetch(request);
  }
}
