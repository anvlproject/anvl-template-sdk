// ANVL injects window.ANVL_DATA before this script runs.
(function () {
  var d = window.ANVL_DATA || {};
  var s = d.socials || {};

  function setText(id, val) {
    var el = document.getElementById(id);
    if (el && val) el.textContent = val;
  }
  function setHref(id, val) {
    var el = document.getElementById(id);
    if (el && val) { el.href = val; el.style.display = ""; }
    else if (el)   { el.style.display = "none"; }
  }

  // Hero
  if (d.logoUrl) { var img = document.getElementById("logo"); if (img) { img.src = d.logoUrl; img.style.display = ""; } }
  setText("ticker",     "$" + (d.ticker || "COIN"));
  setText("hero-title", d.heroTitle || d.name);
  setText("tagline",    d.tagline);

  // CTAs
  setHref("buy-link", s.buyLink || s.dexscreener);
  setHref("dex-link", s.dexscreener);

  // Sections
  setText("about",       d.about);
  setText("how-to-buy",  d.howToBuy);
  setText("disclaimer",  d.disclaimer);

  // Tokenomics
  setText("total-supply", d.totalSupply);
  setText("buy-tax",  (d.buyTax  != null ? d.buyTax  + "%" : "—"));
  setText("sell-tax", (d.sellTax != null ? d.sellTax + "%" : "—"));
  setText("lp-lock",  (d.lpLock  != null ? d.lpLock  + "%" : "—"));

  // Roadmap
  var rm = document.getElementById("roadmap");
  if (rm && Array.isArray(d.roadmap)) {
    rm.innerHTML = d.roadmap.map(function (item) {
      return '<div class="roadmap-item' + (item.done ? " done" : "") + '">'
        + '<div style="flex:1;">'
        + '<div class="roadmap-phase">' + (item.phase || "") + '</div>'
        + '<div class="roadmap-title">' + (item.title || "") + '</div>'
        + '<div class="roadmap-desc">'  + (item.description || "") + '</div>'
        + '</div>'
        + '<div class="roadmap-date">' + (item.date || "") + '</div>'
        + '</div>';
    }).join("");
  }

  // Socials
  var socEl = document.getElementById("socials");
  if (socEl) {
    var links = [
      ["Telegram",    s.telegram],
      ["Twitter",     s.twitter],
      ["Discord",     s.discord],
      ["DexScreener", s.dexscreener],
      ["CoinGecko",   s.coingecko],
      ["Audit",       s.audit],
    ].filter(function (l) { return l[1]; });

    socEl.innerHTML = links.map(function (l) {
      return '<a href="' + l[1] + '" target="_blank" rel="noopener noreferrer">' + l[0] + '</a>';
    }).join("");
  }
})();
