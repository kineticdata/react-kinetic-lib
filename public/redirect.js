(function() {
  const redirect = sessionStorage.redirect;
  delete sessionStorage.redirect;
  if (redirect && redirect !== window.location.href) {
    window.history.replaceState(null, null, redirect);
  }
})();
