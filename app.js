(function () {
  'use strict';

  // Two modes, each with its own listings, filters and saved filter sets.
  // land.js is regenerated while the page is in use, so it may be missing.
  var MODE_KEY = 'flat-tracker-mode';
  var MODES = {
    flats: { label: 'Tokyo flats', items: window.FLAT_DATA.items, saveKey: 'flat-tracker-filters', presetKey: 'flat-tracker-presets',
      sel: ['lift', 'fav', 'added'], num: ['pmin', 'pmax', 'amin', 'amax', 'wmax', 'smax', 'fmax', 'bmin', 'bmax', 'gmax', 'mmax'], multi: [] },
    land: { label: 'Tokyo land', items: (window.LAND_DATA || { items: [] }).items, saveKey: 'flat-tracker-land-filters', presetKey: 'flat-tracker-land-presets',
      sel: ['roadpub', 'builder', 'setback', 'lot', 'lease', 'pfixed', 'fav', 'added'], num: ['pmin', 'pmax', 'amin', 'amax', 'wmax', 'smax', 'gmax', 'mmax', 'farmin', 'rwmin'], multi: ['shape', 'zoning'] }
  };
  Object.keys(MODES).forEach(function (k) {
    var m = MODES[k];
    m.byId = {};
    m.items.forEach(function (it) { m.byId[it.id] = it; });
  });
  // New = first found on SUUMO today (the viewer's date); the refresh stamps firstSeen.
  var now = new Date();
  var TODAY = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2);
  function isNew(it) { return it.firstSeen === TODAY; }
  var addedNewOpt = document.querySelector('#added option[value="today"]');

  // Favourites: one set of listing ids for both modes, kept in this browser.
  var FAV_KEY = 'flat-tracker-favs';
  var favs = {};
  try { favs = JSON.parse(localStorage.getItem(FAV_KEY) || '{}') || {}; } catch (e) {}
  function saveFavs() { try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch (e) {} }
  var mode = localStorage.getItem(MODE_KEY) === 'land' ? 'land' : 'flats';
  var M = MODES[mode];
  var ITEMS = M.items;
  var BY_ID = M.byId;

  // Formatting -----------------------------------------------------------

  var FACING = { '南': 'S', '南東': 'SE', '南西': 'SW', '東': 'E', '西': 'W', '北': 'N', '北東': 'NE', '北西': 'NW' };

  function fmtPrice(man) { return '¥' + (man / 100).toFixed(1) + 'M'; }

  function fmtPerM2(man) {
    var k = man * 10;
    return k >= 1000 ? '¥' + (k / 1000).toFixed(2) + 'M/㎡' : '¥' + Math.round(k) + 'k/㎡';
  }

  function fmtFees(yen) { return yen == null ? 'Fees not listed' : '¥' + yen.toLocaleString('en-US') + '/mo'; }

  // 'yes'/'no' come from the listing text; 6+ floor buildings without a tag are 'likely'.
  function fmtLift(it) {
    if (it.lift === 'yes') return '<b>Lift</b>';
    if (it.lift === 'no') return '<b>No lift</b>';
    if (it.buildingFloors >= 6) return 'Lift likely';
    return '<span class="en">Lift unknown</span>';
  }
  function fmtFloor(it) { return (it.floor || '?').replace(/階/g, 'F') + (it.buildingFloors ? ' / ' + it.buildingFloors + 'F' : ''); }

  function fmtArea(a) { return (Number.isInteger(a) ? a : a.toFixed(1)) + ' ㎡'; }

  // Land: ranges for multi-lot developments, tsubo alongside ㎡.
  function fmtPriceRange(it) {
    return fmtPrice(it.priceMan) + (it.priceMaxMan > it.priceMan ? '–' + (it.priceMaxMan / 100).toFixed(1) + 'M' : '');
  }
  function fmtPerTsubo(man) {
    var k = man * 10;
    return k >= 1000 ? '¥' + (k / 1000).toFixed(1) + 'M/tsubo' : '¥' + Math.round(k) + 'k/tsubo';
  }
  function num1(a) { return Number.isInteger(a) ? a : a.toFixed(1); }
  function fmtLotArea(it) {
    var r = it.areaMax > it.area;
    var tsubo = function (a) { return (a / 3.30579).toFixed(1); };
    return num1(it.area) + (r ? '–' + num1(it.areaMax) : '') + ' ㎡ · ' + tsubo(it.area) + (r ? '–' + tsubo(it.areaMax) : '') + ' tsubo';
  }
  function fmtRoad(r) {
    var parts = [];
    var dirs = (r && r.roads || []).map(function (x) { return (x.dir ? x.dir + ' ' : '') + (x.width != null ? x.width.toFixed(1) + 'm' : ''); });
    var kind = r && r.private === true ? 'private road' : r && r.private === false ? 'public road' : 'road';
    if (dirs.length) parts.push(dirs.join(', ') + ' ' + kind);
    else if (r && r.width != null) parts.push(r.width.toFixed(1) + 'm ' + kind);
    else if (r && r.private != null) parts.push(kind.charAt(0).toUpperCase() + kind.slice(1));
    if (r && r.frontage != null) parts.push(r.frontage.toFixed(1) + 'm frontage');
    return parts.join(' · ');
  }
  var SHAPES = [['regular', 'Regular'], ['flag', 'Flag lot'], ['irregular', 'Irregular'], ['narrow', 'Narrow frontage'], ['corner', 'Corner'], ['tworoads', 'Two roads'], ['sloped', 'Sloped'], ['unknown', 'Shape unknown']];
  var ZONES = [['low1', 'Low-rise residential'], ['low2', 'Low-rise residential II'], ['midhigh', 'Mid/high-rise residential'], ['rural', 'Rural residential'], ['residential', 'Residential'], ['neighbourhood_commercial', 'Neighbourhood commercial'], ['commercial', 'Commercial'], ['industrial', 'Industrial'], ['other', 'Other zoning']];
  var SHAPE_NAME = {}, ZONE_NAME = {};
  SHAPES.forEach(function (s) { SHAPE_NAME[s[0]] = s[1]; });
  ZONES.forEach(function (z) { ZONE_NAME[z[0]] = z[1]; });
  function shapesOf(it) { return it.shape && it.shape.length ? it.shape : ['unknown']; }
  function fmtRatios(it) {
    if (it.coverage != null && it.far != null) return it.coverage + '/' + it.far + '%';
    if (it.far != null) return 'FAR ' + it.far + '%';
    if (it.coverage != null) return 'Coverage ' + it.coverage + '%';
    return '';
  }
  function isPlan(img) { return !!img && (img.plan === true || /間取/.test(img.caption || '')); }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function icon(name) {
    return '<svg class="icon" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  }

  // State ----------------------------------------------------------------

  function freshState() {
    var s = { q: '', sort: 'price', dir: 1 };
    M.sel.forEach(function (k) { s[k] = ''; });
    M.num.forEach(function (k) { s[k] = null; });
    M.multi.forEach(function (k) { s[k] = []; });
    return s;
  }
  var state = freshState();
  // Phones get one view at a time and a filters sheet; touch screens get no hover highlight.
  var phone = matchMedia('(max-width: 760px)');
  var noHover = matchMedia('(hover: none)');
  var carouselIdx = {};
  var activeIds = [];
  var filtered = ITEMS.slice();
  var lastKey = '';

  var SORT = {
    price: function (it) { return it.priceMan; },
    ppm2: function (it) { return it.pricePerM2Man; },
    area: function (it) { return it.area; },
    shinjuku: function (it) { return it.shinjuku ? it.shinjuku.total : null; },
    fees: function (it) { return it.feesTotal; },
    walk: function (it) { return it.nearest ? it.nearest.walk : null; }
  };

  function matches(it, q) {
    var st = it.nearest || {};
    var hay = [it.name, it.nameEn, it.address, st.station, st.stationEn, st.line]
      .filter(Boolean).join(' ').toLowerCase();
    return hay.indexOf(q) !== -1;
  }

  function flatsMatch(it) {
    if (state.fmax != null && !(it.feesTotal != null && it.feesTotal <= state.fmax * 1000)) return false;
    var yr = it.built ? +it.built.slice(0, 4) : null;
    if (state.bmin != null && !(yr && yr >= state.bmin)) return false;
    if (state.bmax != null && !(yr && yr <= state.bmax)) return false;
    if (state.lift === 'yes' && it.lift !== 'yes') return false;
    if (state.lift === 'likely' && !(it.lift === 'yes' || (it.lift !== 'no' && it.buildingFloors >= 6))) return false;
    return true;
  }

  function landMatch(it) {
    if (state.farmin != null && !(it.far != null && it.far >= state.farmin)) return false;
    if (state.rwmin != null && !(it.road && it.road.width != null && it.road.width >= state.rwmin)) return false;
    if (state.roadpub === 'public' && it.road && it.road.private === true) return false;
    if (state.builder === 'none' && it.buildCondition === true) return false;
    if (state.setback === 'none' && it.setback === true) return false;
    if (state.lot && it.state !== state.lot) return false;
    if (state.lease !== 'include' && it.leasehold === true) return false;
    if (state.pfixed === 'fixed' && it.priceMaxMan != null && it.priceMaxMan !== it.priceMan) return false;
    if (state.shape.length && !shapesOf(it).some(function (t) { return state.shape.indexOf(t) !== -1; })) return false;
    if (state.zoning.length && state.zoning.indexOf(it.zoningCat) === -1) return false;
    return true;
  }

  function applyFilters() {
    var q = state.q.trim().toLowerCase();
    var newCount = 0;
    var out = ITEMS.filter(function (it) {
      if (q && !matches(it, q)) return false;
      // Multi-lot land lists a price and area range; it matches when the range overlaps the filter.
      if (state.pmin != null && (it.priceMaxMan || it.priceMan) < state.pmin * 100) return false;
      if (state.pmax != null && it.priceMan > state.pmax * 100) return false;
      if (state.amin != null && (it.areaMax || it.area) < state.amin) return false;
      if (state.amax != null && it.area > state.amax) return false;
      // A listing missing the value can't satisfy a filter on it.
      if (state.wmax != null && !(it.nearest && it.nearest.walk <= state.wmax)) return false;
      if (state.smax != null && !(it.shinjuku && it.shinjuku.total <= state.smax)) return false;
      if (state.gmax != null && !(it.gym && it.gym.walk <= state.gmax)) return false;
      if (state.mmax != null && !(it.supermarket && it.supermarket.walk <= state.mmax)) return false;
      if (state.fav === 'only' && !favs[it.id]) return false;
      if (!(mode === 'flats' ? flatsMatch(it) : landMatch(it))) return false;
      // The New today count is of listings that pass every other filter.
      if (isNew(it)) newCount++;
      return state.added !== 'today' || isNew(it);
    });
    addedNewOpt.textContent = 'New today · ' + newCount;
    var key = SORT[state.sort];
    // Listings missing the sort value (e.g. fees not listed) always go last.
    out.sort(function (a, b) {
      var ka = key(a), kb = key(b);
      if (ka == null || kb == null) return (ka == null) - (kb == null) || a.priceMan - b.priceMan;
      return (ka - kb) * state.dir || a.priceMan - b.priceMan;
    });
    filtered = out;

    renderList();
    renderCount();

    var idKey = out.map(function (it) { return it.id; }).sort().join(',');
    if (idKey !== lastKey) {
      lastKey = idKey;
      renderMarkers();
    }
    renderSheet();
  }

  // Listings -------------------------------------------------------------

  var listEl = document.getElementById('list');
  var countEl = document.getElementById('count');
  var doneBtn = document.getElementById('filters-done');
  var filtersBtn = document.getElementById('filters-btn');
  var sheetEl = document.getElementById('map-card');

  // Many land listings have no name; the address stands in for it.
  function titleOf(it) { return it.name || it.address; }

  // Photos are relative paths (img/...); a hosted copy can point them elsewhere via window.IMG_BASE.
  function imgSrc(img) { return /^https?:/.test(img.url) ? img.url : (window.IMG_BASE || '') + img.url; }
  function carouselHtml(it) {
    var n = it.images.length;
    var idx = Math.min(carouselIdx[it.id] || 0, n - 1);
    var img = it.images[idx];
    return '' +
        '<div class="carousel' + (isPlan(img) ? ' is-plan' : '') + '" role="group" aria-roledescription="carousel" aria-label="Photos of ' + esc(titleOf(it)) + '">' +
          (img ? '<img src="' + esc(imgSrc(img)) + '" alt="' + esc(img.caption || '') + '" loading="lazy" decoding="async" referrerpolicy="no-referrer">' : '') +
          (n > 1 ?
            '<button type="button" class="carousel-btn prev" data-dir="-1" aria-label="Previous photo">' + icon('prev') + '</button>' +
            '<button type="button" class="carousel-btn next" data-dir="1" aria-label="Next photo">' + icon('next') + '</button>' : '') +
          (isNew(it) ? '<span class="new-tag">New</span>' : '') +
          (n ? '<span class="carousel-count" aria-live="polite">' + (idx + 1) + ' / ' + n + '</span>' : '') +
          '<button type="button" class="fav-btn' + (favs[it.id] ? ' is-fav' : '') + '" aria-pressed="' + (favs[it.id] ? 'true' : 'false') + '" aria-label="Favourite">' + icon('star') + '</button>' +
          '<button type="button" class="link-btn" aria-label="Copy link to this listing">' + icon('link') + '</button>' +
        '</div>';
  }

  function cardOpen(it) {
    var idx = Math.max(0, Math.min(carouselIdx[it.id] || 0, it.images.length - 1));
    return '<article class="card' + (activeIds.indexOf(it.id) !== -1 ? ' is-active' : '') + '" data-id="' + esc(it.id) + '" data-idx="' + idx + '" tabindex="0">';
  }

  function stationLi(st) {
    if (!st) return '';
    return '<li class="wide">' + icon('train') + '<span><b>' + esc(st.station) + '</b>' + (st.stationEn ? ' <span class="en">' + esc(st.stationEn) + '</span>' : '') + ' · ' + st.walk + ' min walk</span></li>';
  }
  function gymLi(it) {
    return it.gym ? '<li class="wide">' + icon('gym') + '<span>Anytime Fitness · <b>' + it.gym.walk + ' min</b> walk</span></li>' : '';
  }

  function landCardHtml(it) {
    var road = fmtRoad(it.road);
    var zone = it.zoningCat ? ZONE_NAME[it.zoningCat] : it.zoning;
    var ratios = fmtRatios(it);
    var flags = [[it.setback, 'Setback'], [it.buildCondition, "Seller's builder required"], [it.state === 'oldhouse', 'Old house on lot'], [it.leasehold, 'Leasehold']]
      .filter(function (f) { return f[0] === true; });
    return cardOpen(it) + carouselHtml(it) +
        '<div class="card-body">' +
          '<h2 class="card-title">' +
            '<a href="' + esc(it.url) + '" target="_blank" rel="noopener noreferrer">' + esc(titleOf(it)) + '</a>' +
            (it.name ? '<span class="en">' + esc(it.address) + '</span>' : '') +
          '</h2>' +
          '<div class="card-price"><strong>' + fmtPriceRange(it) + '</strong><span>' + fmtPerM2(it.pricePerM2Man) + ' · ' + fmtPerTsubo(it.pricePerTsuboMan) + '</span></div>' +
          '<ul class="tags">' +
            shapesOf(it).map(function (t) { return '<li>' + esc(SHAPE_NAME[t] || t) + '</li>'; }).join('') +
            flags.map(function (f) { return '<li class="flag">' + f[1] + '</li>'; }).join('') +
          '</ul>' +
          '<ul class="specs">' +
            '<li class="wide">' + icon('area') + '<span><b>' + fmtLotArea(it) + '</b></span></li>' +
            '<li class="wide">' + icon('road') + '<span>' + (road ? '<b>' + esc(road) + '</b>' : '<span class="en">Road unknown</span>') + '</span></li>' +
            '<li class="wide">' + icon('zone') + '<span>' + (zone ? '<b>' + esc(zone) + '</b>' : '<span class="en">Zoning unknown</span>') + (ratios ? ' · ' + ratios : '') + '</span></li>' +
            (it.shinjuku ? '<li class="wide">' + icon('pin') + '<span>~<b>' + it.shinjuku.total + ' min</b> to Shinjuku</span></li>' : '') +
            stationLi(it.nearest) +
            gymLi(it) +
          '</ul>' +
        '</div>' +
      '</article>';
  }

  function cardHtml(it) {
    if (mode === 'land') return landCardHtml(it);
    var facing = it.facing && FACING[it.facing];
    var st = it.nearest;

    return '' +
      cardOpen(it) + carouselHtml(it) +
        '<div class="card-body">' +
          '<h2 class="card-title">' +
            '<a href="' + esc(it.url) + '" target="_blank" rel="noopener noreferrer">' + esc(it.name) + '</a>' +
            (it.nameEn ? '<span class="en">' + esc(it.nameEn) + '</span>' : '') +
          '</h2>' +
          '<div class="card-price"><strong>' + fmtPrice(it.priceMan) + '</strong><span>' + fmtPerM2(it.pricePerM2Man) + '</span></div>' +
          '<ul class="specs">' +
            '<li>' + icon('area') + '<span><b>' + fmtArea(it.area) + '</b> · ' + esc(it.layout) + '</span></li>' +
            '<li>' + icon('floor') + '<span><b>' + esc(fmtFloor(it)) + '</b></span></li>' +
            '<li>' + icon('compass') + '<span>' + (facing ? 'Faces <b>' + facing + '</b>' : '<span class="en">Facing unknown</span>') + '</span></li>' +
            '<li>' + icon('yen') + '<span><b>' + fmtFees(it.feesTotal) + '</b></span></li>' +
            '<li>' + icon('calendar') + '<span>Built <b>' + esc((it.built || '').slice(0, 4)) + '</b></span></li>' +
            '<li>' + icon('lift') + '<span>' + fmtLift(it) + '</span></li>' +
            '<li>' + icon('pin') + '<span>~<b>' + it.shinjuku.total + ' min</b> to Shinjuku</span></li>' +
            stationLi(st) +
            gymLi(it) +
          '</ul>' +
        '</div>' +
      '</article>';
  }

  function renderList() {
    if (!filtered.length) {
      listEl.innerHTML = '<p class="empty">No listings match these filters.</p>';
      return;
    }
    listEl.innerHTML = '<div class="cards">' + filtered.map(cardHtml).join('') + '</div>';
  }

  function renderCount() {
    var n = filtered.length, total = ITEMS.length;
    countEl.innerHTML = n === total
      ? '<strong>' + total + '</strong> listings'
      : '<strong>' + n + '</strong> of ' + total + ' listings';
    doneBtn.textContent = 'Show ' + n + (n === 1 ? ' listing' : ' listings');
    var k = M.sel.filter(function (s) { return state[s]; }).length +
      M.num.filter(function (s) { return state[s] != null; }).length +
      M.multi.filter(function (s) { return state[s].length; }).length;
    filtersBtn.innerHTML = icon('menu') + (k ? '<span class="badge">' + k + '</span>' : '');
    filtersBtn.setAttribute('aria-label', 'Filters' + (k ? ', ' + k + ' active' : ''));
  }

  function cardEl(id) {
    return listEl.querySelector('.card[data-id="' + id + '"]');
  }

  function stepCarousel(card, dir) {
    var it = BY_ID[card.dataset.id];
    var n = it.images.length;
    var idx = ((+card.dataset.idx || 0) + dir + n) % n;
    card.dataset.idx = idx;
    carouselIdx[it.id] = idx;
    var img = it.images[idx];
    var wrap = card.querySelector('.carousel');
    var el = wrap.querySelector('img');
    wrap.classList.toggle('is-plan', isPlan(img));
    el.classList.add('is-loading');
    el.onload = function () { el.classList.remove('is-loading'); };
    el.alt = img.caption || '';
    el.src = imgSrc(img);
    if (el.complete) el.classList.remove('is-loading');
    wrap.querySelector('.carousel-count').textContent = (idx + 1) + ' / ' + n;
  }

  // Card buttons work the same in the list and in the map sheet; only a list card selects.
  function onCardClick(e) {
    var lnk = e.target.closest('.link-btn');
    if (lnk) {
      e.preventDefault();
      var lid = lnk.closest('.card').dataset.id;
      var url = location.origin + location.pathname + '#' + mode + '/' + lid;
      (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).catch(function () {
        var t = document.createElement('textarea'); t.value = url; document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); } catch (err) {} t.remove();
      });
      lnk.classList.add('is-copied');
      setTimeout(function () { lnk.classList.remove('is-copied'); }, 1400);
      return;
    }
    var fav = e.target.closest('.fav-btn');
    if (fav) {
      e.preventDefault();
      var id = fav.closest('.card').dataset.id;
      if (favs[id]) delete favs[id]; else favs[id] = 1;
      saveFavs();
      var mk = M.markers && M.markers[id];
      if (mk) { mk.setIcon(pinIcon(M.byId[id])); applyMarkerStates(); }
      document.querySelectorAll('.card[data-id="' + id + '"] .fav-btn').forEach(function (b) {
        b.classList.toggle('is-fav', !!favs[id]);
        b.setAttribute('aria-pressed', favs[id] ? 'true' : 'false');
      });
      if (state.fav === 'only' && !favs[id]) applyFilters();
      return;
    }
    var btn = e.target.closest('.carousel-btn');
    if (btn) {
      e.preventDefault();
      stepCarousel(btn.closest('.card'), +btn.dataset.dir);
      return;
    }
    if (e.target.closest('a')) return;
    var card = e.target.closest('.card');
    if (card && listEl.contains(card)) setActive([card.dataset.id]);
  }
  listEl.addEventListener('click', onCardClick);

  listEl.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' || !e.target.classList.contains('card')) return;
    setActive([e.target.dataset.id]);
  });

  listEl.addEventListener('pointerover', function (e) {
    var card = e.target.closest('.card');
    if (!card || (e.relatedTarget && card.contains(e.relatedTarget))) return;
    setHover(card.dataset.id, true);
  });
  listEl.addEventListener('pointerout', function (e) {
    var card = e.target.closest('.card');
    if (!card || (e.relatedTarget && card.contains(e.relatedTarget))) return;
    setHover(card.dataset.id, false);
  });

  // Map ------------------------------------------------------------------

  var map = L.map('map', { zoomControl: false, maxZoom: 18, zoomSnap: 1, worldCopyJump: false });
  // Open on central Tokyo; the few outlying listings (Hachioji etc.) are a pan away.
  var CENTRAL = (ITEMS.length ? ITEMS : MODES.flats.items).filter(function (it) { return it.lat > 35.55 && it.lat < 35.82 && it.lng > 139.58 && it.lng < 139.92; });
  map.fitBounds(L.latLngBounds(CENTRAL.map(function (it) { return [it.lat, it.lng]; })), { padding: [32, 32] });
  L.control.zoom({ position: 'topright' }).addTo(map);
  // Basemap: OpenFreeMap's minimal Positron vector style (free, no key), adjusted so
  // detail appears only once it's useful, like Google Maps: buildings from zoom 16,
  // small streets from 13, street names from 16. Shopping/commercial areas get a soft
  // yellow, and parks, gardens and woods a soft green (city parks are landcover
  // 'grass' in these tiles, which Positron leaves undrawn). The style's own railways are hidden; we draw ours.
  var ATTR = '&copy; <a href="https://openfreemap.org">OpenFreeMap</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  var c = document.createElement('canvas');
  var hasGL = !!(window.maplibregl && (c.getContext('webgl2') || c.getContext('webgl')));
  if (!hasGL) {   // no WebGL: fall back to the earlier raster basemap
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', { maxZoom: 20, attribution: '&copy; Stadia Maps &copy; OpenMapTiles &copy; OpenStreetMap contributors' }).addTo(map);
    else L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', { maxNativeZoom: 16, maxZoom: 20, attribution: 'Tiles &copy; Esri' }).addTo(map);
  } else fetch('https://tiles.openfreemap.org/styles/positron').then(function (r) { return r.json(); }).then(function (style) {
    var MIN = { building: 15.5, highway_minor: 13, 'highway-name-minor': 16, 'highway-name-path': 17, highway_path: 15, 'highway-shield-non-us': 14, landcover_wood: 12, label_other: 14.5 };
    var DROP = /^(railway|landuse_residential|aeroway|road_shield_us|highway-shield-us)/;
    style.layers = style.layers.filter(function (l) { return !DROP.test(l.id); });
    style.layers.forEach(function (l) {
      if (MIN[l.id] != null) l.minzoom = MIN[l.id];
      if (l.id === 'building') l.paint = Object.assign({}, l.paint, { 'fill-opacity': ['interpolate', ['linear'], ['zoom'], 15.5, 0, 16.5, 1] });
      if (l.id === 'park') l.paint = Object.assign({}, l.paint, { 'fill-color': '#c6e5b9', 'fill-opacity': 0.9 });
      if (l.id === 'water') l.paint = Object.assign({}, l.paint, { 'fill-color': '#b3d9f2' });
      if (l.id === 'landcover_wood') l.paint = Object.assign({}, l.paint, { 'fill-color': '#c6e5b9', 'fill-opacity': 1 });
    });
    var at = style.layers.findIndex(function (l) { return l.id === 'waterway'; });
    style.layers.splice(at, 0, {
      id: 'landcover_green', type: 'fill', source: 'openmaptiles', 'source-layer': 'landcover', minzoom: 10,
      filter: ['match', ['get', 'class'], ['grass', 'wood', 'farmland'], true, false],
      paint: { 'fill-color': '#c6e5b9', 'fill-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.6, 12, 1] }
    }, {
      // Google-like colours for hospitals, schools, cemeteries and sports grounds.
      id: 'landuse_places', type: 'fill', source: 'openmaptiles', 'source-layer': 'landuse', minzoom: 12,
      filter: ['match', ['get', 'class'], ['hospital', 'school', 'university', 'college', 'kindergarten', 'cemetery', 'stadium', 'pitch', 'track', 'playground'], true, false],
      paint: {
        'fill-color': ['match', ['get', 'class'], 'hospital', '#f7dcdc', 'cemetery', '#d9e4d3', ['stadium', 'pitch', 'track', 'playground'], '#cdebd4', '#efe6d2'],
        'fill-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0, 13, 1]
      }
    }, {
      id: 'landuse_commercial', type: 'fill', source: 'openmaptiles', 'source-layer': 'landuse', minzoom: 12,
      filter: ['match', ['get', 'class'], ['commercial', 'retail'], true, false],
      paint: { 'fill-color': '#f6e6b4', 'fill-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0, 13, 0.7] }
    });
    L.maplibreGL({ style: style, attribution: ATTR, interactive: false }).addTo(map);
  });

  // Stations: one canvas for every dot, below the listing pins. Names are DOM
  // labels, added from zoom 14 and only for stations in view.
  var STATION_COLOR = getComputedStyle(document.documentElement).getPropertyValue('--station').trim();
  var LABEL_ZOOM = 13;
  // Train lines in their official colours, under the station dots and pins.
  map.createPane('rail').style.zIndex = 340;
  map.getPane('rail').style.pointerEvents = 'none';
  var railCanvas = L.canvas({ pane: 'rail', padding: 0.5 });
  var railLines = (window.RAIL_LINES || []).map(function (l) {
    return L.polyline(l.segs, { renderer: railCanvas, color: l.colour, weight: 2, opacity: 0.75, interactive: false, smoothFactor: 1 }).addTo(map);
  });
  function styleRail() {
    var z = map.getZoom();
    var w = z >= 15 ? 4 : z >= 13 ? 3 : 2;
    railLines.forEach(function (p) { p.setStyle({ weight: w }); });
  }
  map.on('zoomend', styleRail);
  styleRail();
  map.createPane('stations').style.zIndex = 350;
  map.createPane('poi').style.zIndex = 550;
  var stationCanvas = L.canvas({ pane: 'stations', padding: 0.5 });
  var stationDots = window.STATIONS.map(function (s) {
    return L.circleMarker([s.lat, s.lng], {
      renderer: stationCanvas, interactive: false, radius: 4,
      color: STATION_COLOR, weight: 2, opacity: 1, fillColor: '#fff', fillOpacity: 1
    }).addTo(map);
  });
  var stationLabels = L.layerGroup().addTo(map);
  var labelSets = {};
  var badgedStation = ''; // 'lat,lng' of the selected unit's station: its badge stands in for the label

  // Which stations get a name at a zoom level: first come, first served, skipping
  // any whose label would overlap one already placed. Worked out once per zoom
  // for the whole set, so labels do not change as the map pans.
  function labelSet(z) {
    if (labelSets[z]) return labelSets[z];
    var boxes = [];
    labelSets[z] = window.STATIONS.filter(function (s) {
      var p = map.project([s.lat, s.lng], z);
      var box = { l: p.x + 6, t: p.y - 11, r: p.x + 20 + s.name.length * 13.5 + (s.en || '').length * 6.6, b: p.y + 11 };
      var free = boxes.every(function (o) { return box.l > o.r || box.r < o.l || box.t > o.b || box.b < o.t; });
      if (free) boxes.push(box);
      return free;
    });
    return labelSets[z];
  }

  function renderStations() {
    var z = map.getZoom();
    // Stations stay quiet when zoomed out and grow as you zoom in.
    var r = z >= 15 ? 7 : z >= 14 ? 6 : z >= 13 ? 5 : z >= 12 ? 3 : z >= 11 ? 2 : 1.5;
    var w = z >= 13 ? 2 : 1, o = z >= 13 ? 1 : z >= 12 ? 0.7 : 0.45;
    if (stationDots[0].getRadius() !== r) stationDots.forEach(function (d) { d.setRadius(r); d.setStyle({ weight: w, opacity: o }); });
    stationLabels.clearLayers();
    if (z < LABEL_ZOOM) return;
    var view = map.getBounds().pad(0.1);
    labelSet(z).forEach(function (s) {
      if (!view.contains([s.lat, s.lng]) || s.lat + ',' + s.lng === badgedStation) return;
      L.marker([s.lat, s.lng], {
        pane: 'stations', interactive: false, keyboard: false,
        icon: L.divIcon({ className: 'station-label', html: '<span>' + esc(s.name) + (s.en ? ' <i>' + esc(s.en) + '</i>' : '') + '</span>', iconSize: null })
      }).addTo(stationLabels);
    });
  }
  map.on('zoomend moveend', renderStations);
  renderStations();

  var cluster = L.markerClusterGroup({
    maxClusterRadius: 60,
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true,
    spiderfyDistanceMultiplier: 1.7,
    zoomToBoundsOnClick: true,
    spiderLegPolylineOptions: { weight: 1.5, color: '#8b897f', opacity: 0.7 },
    iconCreateFunction: function (c) {
      var n = c.getChildCount();
      return L.divIcon({
        html: '<span>' + n + '</span>',
        className: 'cluster' + (n >= 10 ? ' is-lg' : ''),
        iconSize: [36, 36]
      });
    }
  }).addTo(map);

  // Price chip on the map; favourites carry a star inside the chip.
  function pinIcon(it) {
    return L.divIcon({ className: 'pin' + (favs[it.id] ? ' is-fav' : '') + (isNew(it) ? ' is-new' : ''), html: '<span>' + (favs[it.id] ? '<b class="pin-star">★</b>' : '') + (isNew(it) ? '<b class="pin-new">New</b>' : '') + fmtPrice(it.priceMan) + '</span>', iconSize: null });
  }

  Object.keys(MODES).forEach(function (k) {
    var ms = MODES[k].markers = {};
    MODES[k].items.forEach(function (it) {
      var m = L.marker([it.lat, it.lng], {
        icon: pinIcon(it),
        title: titleOf(it),
        keyboard: false
      });
      m.itemId = it.id;
      m.on('click', function () {
        setActive([it.id]);
        scrollToCard(it.id);
      });
      m.on('mouseover', function () { setMapHover([it.id], true); });
      m.on('mouseout', function () { setMapHover([], false); });
      ms[it.id] = m;
    });
  });
  var markers = M.markers;

  // A cluster that would still be one cluster at max zoom is one building:
  // markercluster spiderfies it, and the cards of every unit get highlighted.
  cluster.on('clusterclick', function (e) {
    var b = e.layer.getBounds();
    var z = map.getMaxZoom();
    var px = map.project(b.getNorthEast(), z).distanceTo(map.project(b.getSouthWest(), z));
    var kids = e.layer.getAllChildMarkers().map(function (m) { return m.itemId; });
    setActive(kids);
    revealCards(kids);
    if (px > cluster.options.maxClusterRadius) return;
  });

  cluster.on('clustermouseover', function (e) {
    setMapHover(e.layer.getAllChildMarkers().map(function (m) { return m.itemId; }), true);
  });
  cluster.on('clustermouseout', function () { setMapHover([], false); });

  // Map -> list highlight: hovering a pin (or cluster) marks its card(s). A single
  // pin also brings its card into view if it is scrolled out of sight.
  var mapHoverIds = [];
  function setMapHover(ids, reveal) {
    if (noHover.matches) ids = [];
    mapHoverIds.forEach(function (id) { var c = cardEl(id); if (c) c.classList.remove('is-maphover'); });
    mapHoverIds = ids;
    ids.forEach(function (id) { var c = cardEl(id); if (c) c.classList.add('is-maphover'); });
    if (reveal && ids.length) revealCards(ids);
  }

  cluster.on('animationend spiderfied unspiderfied', applyMarkerStates);
  map.on('zoomend moveend', applyMarkerStates);

  function renderMarkers() {
    cluster.clearLayers();
    var ms = filtered.map(function (it) { return markers[it.id]; });
    cluster.addLayers(ms);
    applyMarkerStates();   // re-added markers get fresh elements, so re-mark the selection
    renderOverlays();
    if (!ms.length) return;
    var b = map.getBounds();
    var anyVisible = ms.some(function (m) { return b.contains(m.getLatLng()); });
    if (!anyVisible) map.fitBounds(cluster.getBounds(), { padding: [48, 48], maxZoom: 15 });
  }

  function visibleEl(id) {
    var m = markers[id];
    var parent = cluster.getVisibleParent(m);
    return parent && parent.getElement ? parent.getElement() : null;
  }

  function applyMarkerStates() {
    document.querySelectorAll('.pin.is-active, .cluster.is-active').forEach(function (el) { el.classList.remove('is-active'); });
    activeIds.forEach(function (id) {
      var el = visibleEl(id);
      if (el) el.classList.add('is-active');
    });
  }

  function setActive(ids, keepView) {
    activeIdsForUrl = ids;
    writeUrlSoon();
    activeIds.forEach(function (id) {
      var c = cardEl(id);
      if (c) c.classList.remove('is-active');
    });
    activeIds = ids;
    ids.forEach(function (id) {
      var c = cardEl(id);
      if (c) c.classList.add('is-active');
    });
    applyMarkerStates();
    renderSheet();
    // Selecting one unit frames it with its station, gym and supermarket so the
    // walking lines are readable (they are a few pixels long at city zoom).
    // On a phone the frame sits above the listing's sheet.
    var pts = renderOverlays();
    var cover = sheetEl.hidden ? 0 : map.getContainer().getBoundingClientRect().bottom - sheetEl.getBoundingClientRect().top;
    if (pts && !keepView) map.flyToBounds(L.latLngBounds(pts), { padding: [72, 72], paddingBottomRight: [72, 72 + cover], maxZoom: 16, duration: 0.6 });
  }

  // Phone: the one selected listing's card, as a sheet over the map. It is kept
  // while the same listing stays selected, so its photo position is not reset.
  // Phone map card: photo, then name and price on one line, then one line of key facts.
  function miniCardHtml(it) {
    var st = it.nearest;
    var facts = it.kind === 'land'
      ? [fmtLotArea(it)].concat(shapesOf(it).filter(function (t) { return t !== 'unknown'; }).map(function (t) { return SHAPE_NAME[t] || t; }))
      : [fmtArea(it.area) + ' · ' + esc(it.layout || ''), fmtFloor(it)];
    if (st) facts.push(esc(st.station) + ' ' + st.walk + ' min');
    if (it.shinjuku) facts.push('Shinjuku ~' + it.shinjuku.total + ' min');
    return cardOpen(it).replace('class="card', 'class="card card-mini') + carouselHtml(it) +
      '<div class="card-body">' +
        '<div class="mini-head">' +
          '<a class="mini-title" href="' + esc(it.url) + '" target="_blank" rel="noopener noreferrer">' + esc(titleOf(it)) + '</a>' +
          '<strong class="mini-price">' + (it.kind === 'land' ? fmtPriceRange(it) : fmtPrice(it.priceMan)) + '</strong>' +
        '</div>' +
        '<div class="mini-facts">' + facts.join(' · ') + '</div>' +
      '</div>' +
    '</article>';
  }
  function renderSheet() {
    var id = phone.matches && activeIds.length === 1 && cluster.hasLayer(markers[activeIds[0]]) ? activeIds[0] : '';
    if (!id) { sheetEl.hidden = true; sheetEl.dataset.id = ''; return; }
    if (sheetEl.dataset.id !== id) {
      sheetEl.innerHTML = '<button type="button" class="sheet-x" aria-label="Close">' + icon('close') + '</button>' + miniCardHtml(BY_ID[id]);
      sheetEl.dataset.id = id;
    }
    sheetEl.hidden = false;
  }
  sheetEl.addEventListener('click', function (e) {
    if (e.target.closest('.sheet-x')) setActive([]);
    else onCardClick(e);
  });
  map.on('click', function () { if (!sheetEl.hidden) setActive([]); });

  // Selection overlays: with exactly one unit selected (and still on the map),
  // its nearest station, Anytime Fitness and supermarket each get a badge, a
  // dotted line from the unit and a walk label at the line's midpoint.
  // Returns the four points, or null when nothing is drawn.
  var overlays = L.layerGroup().addTo(map);

  // Walk labels are placed in screen space after every zoom: each tries points along
  // its line, then just off it, then beside its badge, and takes the first spot that
  // doesn't overlap another label, a badge or the unit's price pin.
  var overlayLabels = [];
  var labelLayer = L.layerGroup().addTo(map);
  function placeLabels() {
    labelLayer.clearLayers();
    if (!overlayLabels.length) return;
    var P = function (ll) { return map.latLngToLayerPoint(ll); };
    var home = P(overlayLabels[0].home);
    var taken = [{ l: home.x - 48, r: home.x + 48, t: home.y - 40, b: home.y + 4 }];   // the price pin
    overlayLabels.forEach(function (o) { var p = P(o.to); taken.push({ l: p.x - 16, r: p.x + 16, t: p.y - 16, b: p.y + 16 }); });
    var hit = function (bx) { return taken.some(function (o) { return !(bx.r < o.l || bx.l > o.r || bx.b < o.t || bx.t > o.b); }); };
    overlayLabels.forEach(function (o) {
      var a = P(o.home), b = P(o.to), w = o.text.length * 6.6 + 18, h = 20;
      var dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
      var cands = [];
      [0.5, 0.4, 0.6, 0.3, 0.7, 0.22, 0.8].forEach(function (t) {
        [0, 16, -16, 30, -30].forEach(function (off) { cands.push(L.point(a.x + dx * t + nx * off, a.y + dy * t + ny * off)); });
      });
      [[w / 2 + 20, 0], [-(w / 2 + 20), 0], [0, -26], [0, 26], [w / 2 + 20, -24], [-(w / 2 + 20), 24]].forEach(function (d) {
        cands.push(L.point(b.x + d[0], b.y + d[1]));
      });
      var pick = cands[0], box;
      for (var i = 0; i < cands.length; i++) {
        var c = cands[i], bx = { l: c.x - w / 2, r: c.x + w / 2, t: c.y - h / 2, b: c.y + h / 2 };
        if (!hit(bx)) { pick = c; box = bx; break; }
      }
      taken.push(box || { l: pick.x - w / 2, r: pick.x + w / 2, t: pick.y - h / 2, b: pick.y + h / 2 });
      L.marker(map.layerPointToLatLng(pick), {
        pane: 'poi', interactive: false, keyboard: false,
        icon: L.divIcon({ className: 'walk-label is-' + o.kind, html: '<span>' + o.text + '</span>', iconSize: null })
      }).addTo(labelLayer);
    });
  }
  map.on('zoomend', placeLabels);

  function renderOverlays() {
    overlays.clearLayers();
    overlayLabels = [];
    labelLayer.clearLayers();
    var it = activeIds.length === 1 && BY_ID[activeIds[0]];
    if (!it || !cluster.hasLayer(markers[it.id])) it = null;
    var key = it && it.nearest ? it.nearest.lat + ',' + it.nearest.lng : '';
    if (key !== badgedStation) { badgedStation = key; renderStations(); }
    if (!it) return null;
    var home = [it.lat, it.lng];
    var st = it.nearest, gym = it.gym, sm = it.supermarket;
    return [home].concat([
      st && ['station', 'train', st, st.station + (st.en ? ' ' + st.en : ''), st.walk + ' min'],
      gym && ['gym', 'gym', gym, gym.name, gym.walk + ' min · ' + gym.meters + ' m'],
      sm && ['market', 'cart', sm, sm.name, sm.walk + ' min · ' + sm.meters + ' m']
    ].filter(Boolean).map(function (o) {
      var kind = o[0], to = [o[2].lat, o[2].lng];
      L.polyline([home, to], { className: 'walk-line is-' + kind, interactive: false }).addTo(overlays);
      overlayLabels.push({ kind: kind, text: o[4], home: home, to: to });
      L.marker(to, {
        pane: 'poi', keyboard: false,
        icon: L.divIcon({ className: 'poi is-' + kind, html: icon(o[1]), iconSize: [26, 26] })
      }).bindTooltip(esc(o[3]), { direction: 'top', offset: [0, -14], className: 'poi-tip' }).addTo(overlays);
      return to;
    })).concat(placeLabelsSoon());
  }
  function placeLabelsSoon() { setTimeout(placeLabels, 0); return []; }

  var hoverEl = null;
  function setHover(id, on) {
    if (hoverEl) { hoverEl.classList.remove('is-hover'); hoverEl = null; }
    if (!on || noHover.matches) return;
    var el = visibleEl(id);
    if (el) { el.classList.add('is-hover'); hoverEl = el; }
  }

  function scrollToCard(id) {
    var c = cardEl(id);
    if (c) c.scrollIntoView({ behavior: 'instant', block: 'center' });
  }
  // Jump (no animation) to the stretch of the list that shows the most of these cards.
  function revealCards(ids) {
    if (ids.length === 1) return scrollToCard(ids[0]);
    var base = listEl.getBoundingClientRect().top - listEl.scrollTop, H = listEl.clientHeight - 36;
    var spans = ids.map(cardEl).filter(Boolean).map(function (c) {
      var r = c.getBoundingClientRect(); return { t: r.top - base, b: r.bottom - base };
    }).sort(function (x, y) { return x.t - y.t; });
    if (!spans.length) return;
    var best = spans[0].t, bestN = 0;
    spans.forEach(function (sp) {
      var n = spans.filter(function (o) { return o.t >= sp.t && o.b <= sp.t + H; }).length;
      if (n > bestN) { bestN = n; best = sp.t; }
    });
    listEl.scrollTop = best - 18;
  }

  // Divider --------------------------------------------------------------

  var app = document.getElementById('app');
  var divider = document.getElementById('divider');
  var MIN = 360;
  var raf = 0;

  function setLeft(px) {
    var max = window.innerWidth - MIN;
    px = Math.max(MIN, Math.min(max, px));
    app.style.setProperty('--left', px + 'px');
    divider.setAttribute('aria-valuenow', Math.round(px / window.innerWidth * 100));
    if (!raf) raf = requestAnimationFrame(function () { raf = 0; map.invalidateSize(false); });
  }

  divider.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    divider.setPointerCapture(e.pointerId);
    document.body.classList.add('is-resizing');
  });
  divider.addEventListener('pointermove', function (e) {
    if (!document.body.classList.contains('is-resizing')) return;
    setLeft(e.clientX);
  });
  function endDrag() {
    if (!document.body.classList.contains('is-resizing')) return;
    document.body.classList.remove('is-resizing');
    map.invalidateSize();
  }
  divider.addEventListener('pointerup', endDrag);
  divider.addEventListener('pointercancel', endDrag);
  divider.addEventListener('keydown', function (e) {
    var cur = listEl.getBoundingClientRect().width;
    if (e.key === 'ArrowLeft') setLeft(cur - 32);
    else if (e.key === 'ArrowRight') setLeft(cur + 32);
    else return;
    e.preventDefault();
    map.invalidateSize();
  });

  // Controls -------------------------------------------------------------

  function num(v) {
    var n = parseFloat(v);
    return isFinite(n) ? n : null;
  }

  var qEl = document.getElementById('q');
  var qTimer = 0;
  qEl.addEventListener('input', function () {
    clearTimeout(qTimer);
    qTimer = setTimeout(function () { state.q = qEl.value; applyFilters(); }, 120);
  });

  var ALL_NUM = MODES.flats.num.concat(MODES.land.num.filter(function (k) { return MODES.flats.num.indexOf(k) === -1; }));
  ALL_NUM.forEach(function (k) {
    document.getElementById(k).addEventListener('input', function (e) {
      state[k] = num(e.target.value);
      applyFilters();
    });
  });

  MODES.flats.sel.concat(MODES.land.sel).filter(function (k, i, all) { return all.indexOf(k) === i; }).forEach(function (k) {
    document.getElementById(k).addEventListener('change', function (e) {
      state[k] = e.target.value;
      applyFilters();
    });
  });

  // Shape and zoning: a dropdown of checkboxes. Nothing ticked means any.
  var MULTI_OPTS = { shape: SHAPES, zoning: ZONES };
  function renderMultiLabel(k) {
    var el = document.getElementById(k), v = state[k], names = MULTI_OPTS[k].filter(function (o) { return v.indexOf(o[0]) !== -1; });
    el.querySelector('summary').textContent = !names.length ? el.dataset.any : names[0][1] + (names.length > 1 ? ' +' + (names.length - 1) : '');
  }
  Object.keys(MULTI_OPTS).forEach(function (k) {
    var el = document.getElementById(k);
    el.querySelector('.multi-panel').innerHTML = MULTI_OPTS[k].map(function (o) {
      return '<label><input type="checkbox" value="' + o[0] + '"> ' + esc(o[1]) + '</label>';
    }).join('');
    el.addEventListener('change', function () {
      state[k] = [].slice.call(el.querySelectorAll('input:checked')).map(function (c) { return c.value; });
      renderMultiLabel(k);
      applyFilters();
    });
  });
  document.addEventListener('click', function (e) {
    document.querySelectorAll('details.multi[open]').forEach(function (d) { if (!d.contains(e.target)) d.open = false; });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('details.multi[open]').forEach(function (d) { d.open = false; d.querySelector('summary').focus(); });
  });

  // Write the whole filter state into the controls of the current mode.
  function syncControls() {
    qEl.value = state.q;
    M.sel.forEach(function (k) { document.getElementById(k).value = state[k]; });
    M.num.forEach(function (k) { document.getElementById(k).value = state[k] != null ? state[k] : ''; });
    M.multi.forEach(function (k) {
      document.getElementById(k).querySelectorAll('input').forEach(function (c) { c.checked = state[k].indexOf(c.value) !== -1; });
      renderMultiLabel(k);
    });
    document.getElementById('sort').value = state.sort;
    renderDir();
  }

  document.getElementById('sort').addEventListener('change', function (e) {
    state.sort = e.target.value;
    applyFilters();
  });

  var dirBtn = document.getElementById('dir');
  function renderDir() {
    var asc = state.dir === 1;
    dirBtn.setAttribute('aria-label', asc ? 'Ascending, switch to descending' : 'Descending, switch to ascending');
    dirBtn.querySelector('use').setAttribute('href', asc ? '#i-asc' : '#i-desc');
  }
  dirBtn.addEventListener('click', function () {
    state.dir = -state.dir;
    renderDir();
    applyFilters();
  });

  // Saved filters: every filter, the search and the sort are remembered in this
  // browser and restored on the next visit.
  // Each mode has its own keys; the flats keys are the original ones.
  function saveFilters() {
    try { localStorage.setItem(M.saveKey, JSON.stringify(currentFilters())); } catch (e) {}
  }
  function sortOk(k) { return SORT[k] && (k !== 'fees' || mode === 'flats'); }
  function restoreFilters() {
    var saved;
    try { saved = JSON.parse(localStorage.getItem(M.saveKey) || 'null'); } catch (e) { saved = null; }
    if (!saved) return;
    if (typeof saved.q === 'string') state.q = saved.q;
    M.sel.forEach(function (k) { if (typeof saved[k] === 'string') state[k] = saved[k]; });
    M.num.forEach(function (k) { if (saved[k] != null) state[k] = saved[k]; });
    M.multi.forEach(function (k) { if (Array.isArray(saved[k])) state[k] = saved[k]; });
    if (sortOk(saved.sort)) state.sort = saved.sort;
    if (saved.dir === 1 || saved.dir === -1) state.dir = saved.dir;
  }
  var baseApply = applyFilters;
  applyFilters = function () { baseApply(); saveFilters(); if (window.__syncPresets) window.__syncPresets(); writeUrlSoon(); };

  // Named saved filter sets, picked from the "Saved filters" dropdown.
  var presetSel = document.getElementById('presets');
  var presetDel = document.getElementById('preset-delete');
  var presetUpd = document.getElementById('preset-update');
  // "Update" shows only when the selected set differs from what's on screen.
  function syncPresetButtons() {
    var p = loadPresets(), sel = presetSel.value;
    presetDel.hidden = !sel;
    presetUpd.hidden = !sel || !p[sel] || JSON.stringify(p[sel]) === JSON.stringify(currentFilters());
  }
  function loadPresets() {
    try { return JSON.parse(localStorage.getItem(M.presetKey) || '{}') || {}; } catch (e) { return {}; }
  }
  function storePresets(p) { try { localStorage.setItem(M.presetKey, JSON.stringify(p)); } catch (e) {} }
  // Key order is fixed (it is compared as JSON): q, sort, dir, selects, numbers, multi-selects.
  function currentFilters() {
    var f = { q: state.q, sort: state.sort, dir: state.dir };
    M.sel.forEach(function (k) { f[k] = state[k]; });
    M.num.forEach(function (k) { f[k] = state[k]; });
    M.multi.forEach(function (k) { f[k] = MULTI_OPTS[k].map(function (o) { return o[0]; }).filter(function (v) { return state[k].indexOf(v) !== -1; }); });
    return f;
  }
  function applySaved(f) {
    state.q = f.q || '';
    M.sel.forEach(function (k) { state[k] = f[k] || ''; });
    M.num.forEach(function (k) { state[k] = f[k] != null ? f[k] : null; });
    M.multi.forEach(function (k) { state[k] = Array.isArray(f[k]) ? f[k] : []; });
    if (sortOk(f.sort)) state.sort = f.sort;
    state.dir = f.dir === -1 ? -1 : 1;
    syncControls();
    applyFilters();
  }
  function renderPresets(selected) {
    var p = loadPresets();
    presetSel.innerHTML = '<option value="">Saved filters</option>' + Object.keys(p).sort().map(function (n) {
      return '<option value="' + esc(n) + '"' + (n === selected ? ' selected' : '') + '>' + esc(n) + '</option>';
    }).join('');
    syncPresetButtons();
  }
  presetSel.addEventListener('change', function () {
    var p = loadPresets();
    if (p[presetSel.value]) applySaved(p[presetSel.value]);
    syncPresetButtons();
  });
  document.getElementById('preset-save').addEventListener('click', function () {
    var name = (window.prompt('Name for these filters', '') || '').trim();
    if (!name) return;
    var p = loadPresets(); p[name] = currentFilters(); storePresets(p);
    renderPresets(name);
  });
  presetUpd.addEventListener('click', function () {
    var p = loadPresets(); p[presetSel.value] = currentFilters(); storePresets(p);
    syncPresetButtons();
  });
  presetDel.addEventListener('click', function () {
    var name = presetSel.value;
    if (!name || !window.confirm('Delete saved filters "' + name + '"?')) return;
    var p = loadPresets(); delete p[name]; storePresets(p);
    renderPresets('');
  });
  window.__syncPresets = syncPresetButtons;

  // Mode -----------------------------------------------------------------

  var modeEl = document.getElementById('mode');
  var sortEl = document.getElementById('sort');
  function enterMode(m) {
    mode = m; M = MODES[m];
    ITEMS = M.items; BY_ID = M.byId; markers = M.markers;
    document.body.dataset.mode = m;
    document.title = M.label;
    modeEl.value = m;
    [].forEach.call(sortEl.options, function (o) { o.hidden = o.disabled = !!o.dataset.mode && o.dataset.mode !== m; });
    state = freshState();
    restoreFilters();
    syncControls();
    renderPresets('');
  }
  modeEl.addEventListener('change', function () {
    try { localStorage.setItem(MODE_KEY, modeEl.value); } catch (e) {}
    setMapHover([], false);
    setHover(null, false);
    activeIds = []; carouselIdx = {}; lastKey = '';
    enterMode(modeEl.value);
    listEl.scrollTop = 0;
    applyFilters();
  });

  // Phone views -----------------------------------------------------------

  var viewBtn = document.getElementById('view-toggle');
  function showMap(on) {
    document.body.classList.toggle('is-map', on);
    viewBtn.innerHTML = icon(on ? 'list' : 'map');
    viewBtn.setAttribute('aria-label', on ? 'Show list' : 'Show map');
    if (on) map.invalidateSize();
  }
  viewBtn.addEventListener('click', function () { showMap(!document.body.classList.contains('is-map')); });

  // On a phone the flats/land switch lives at the top of the menu; on desktop it is the title.
  var modeHome = modeEl.parentNode, modeNext = modeEl.nextSibling, filtersEl = document.getElementById('filters');
  function placeMode() {
    if (phone.matches) filtersEl.insertBefore(modeEl, filtersEl.firstChild);
    else modeHome.insertBefore(modeEl, modeNext);
  }
  phone.addEventListener('change', placeMode);
  placeMode();
  showMap(document.body.classList.contains('is-map'));

  function openFilters(on) {
    document.body.classList.toggle('is-filters-open', on);
    filtersBtn.setAttribute('aria-expanded', on ? 'true' : 'false');
  }
  filtersBtn.addEventListener('click', function () { openFilters(true); });
  document.getElementById('filters-close').addEventListener('click', function () { openFilters(false); });
  doneBtn.addEventListener('click', function () { openFilters(false); });

  // Boot -----------------------------------------------------------------

  // Shareable view: the address bar always holds the current view — mode, search,
  // filters, sort, map position and the selected listing — so copying it shares exactly
  // what is on screen. Favourites stay personal and are left out.
  //   ?m=land&q=..&pmax=150&shape=flag,corner&sort=area&dir=-1&z=14&c=35.68,139.70#land/<id>
  var activeIdsForUrl = [];
  var urlTimer = 0;
  function viewUrl() {
    var p = new URLSearchParams();
    p.set('m', mode);
    if (state.q) p.set('q', state.q);
    M.sel.forEach(function (k) { if (k !== 'fav' && state[k]) p.set(k, state[k]); });
    M.num.forEach(function (k) { if (state[k] != null) p.set(k, state[k]); });
    M.multi.forEach(function (k) { if (state[k].length) p.set(k, state[k].join(',')); });
    if (state.sort !== 'price') p.set('sort', state.sort);
    if (state.dir === -1) p.set('dir', '-1');
    var c = map.getCenter();
    p.set('z', map.getZoom());
    p.set('c', c.lat.toFixed(5) + ',' + c.lng.toFixed(5));
    var sel = activeIdsForUrl.length === 1 ? '#' + mode + '/' + activeIdsForUrl[0] : '';
    return location.pathname + '?' + p.toString() + sel;
  }
  function writeUrlSoon() {
    clearTimeout(urlTimer);
    urlTimer = setTimeout(function () { history.replaceState(null, '', viewUrl()); }, 200);
  }
  map.on('moveend zoomend', writeUrlSoon);

  var shareBtn = document.getElementById('share');
  shareBtn.addEventListener('click', function () {
    var url = location.origin + viewUrl();
    (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).catch(function () {
      var t = document.createElement('textarea'); t.value = url; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch (err) {} t.remove();
    });
    shareBtn.classList.add('is-copied');
    setTimeout(function () { shareBtn.classList.remove('is-copied'); }, 1400);
  });

  // Opening a shared view (or an older #<mode>/<id> permalink).
  var qs = new URLSearchParams(location.search);
  var link = /^#(flats|land)\/(.+)$/.exec(location.hash);
  var shared = qs.has('m') && MODES[qs.get('m')];
  if (shared) mode = qs.get('m');
  else if (link && MODES[link[1]] && MODES[link[1]].byId[decodeURIComponent(link[2])]) mode = link[1];
  enterMode(mode);
  if (shared) {
    state = freshState();
    state.q = qs.get('q') || '';
    M.sel.forEach(function (k) { if (k !== 'fav' && qs.has(k)) state[k] = qs.get(k); });
    M.num.forEach(function (k) { if (qs.has(k) && qs.get(k) !== '' && !isNaN(+qs.get(k))) state[k] = +qs.get(k); });
    M.multi.forEach(function (k) { if (qs.get(k)) state[k] = qs.get(k).split(','); });
    if (qs.get('sort') && sortOk(qs.get('sort'))) state.sort = qs.get('sort');
    if (qs.get('dir') === '-1') state.dir = -1;
    syncControls();
  }
  applyFilters();
  if (link && mode === link[1] && BY_ID[decodeURIComponent(link[2])]) {
    var target = decodeURIComponent(link[2]);
    if (!shared && !filtered.some(function (it) { return it.id === target; })) {
      state = freshState();
      if (BY_ID[target].leasehold) state.lease = 'include';
      syncControls();
      applyFilters();
    }
    if (phone.matches) showMap(true);
    setActive([target], shared && qs.get('c') && qs.get('z'));
    scrollToCard(target);
  }
  if (shared && qs.get('c') && qs.get('z')) {
    var cc = qs.get('c').split(',').map(Number);
    if (cc.length === 2 && !isNaN(cc[0]) && !isNaN(cc[1])) { map.setView(cc, +qs.get('z'), { animate: false }); }
    // Phone: keep the shared zoom, but if the selected pin lands under the listing's
    // card, shift the map so the pin sits in the open space above the card.
    var selIt = activeIds.length === 1 && BY_ID[activeIds[0]];
    if (selIt && !sheetEl.hidden) {
      var mapBox = map.getContainer().getBoundingClientRect();
      var open = sheetEl.getBoundingClientRect().top - mapBox.top;
      var pin = map.latLngToContainerPoint([selIt.lat, selIt.lng]);
      if (pin.y > open - 48) map.panBy([0, pin.y - open / 2], { animate: false });
    }
  }
})();
