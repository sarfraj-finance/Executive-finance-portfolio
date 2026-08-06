/* ==========================================================================
   SARFRAJ SOLANKI — EXECUTIVE FINANCE IDENTITY
   js/charts.js — SVG-based chart rendering for the Executive Finance
   Dashboard Showcase. No canvas, no external library, no network calls.
   SVG scales via viewBox and renders reliably in browser print/PDF export.
   Every dataset is fictional/illustrative, used only to demonstrate
   method — none reflect any real employer's data. All figures derive
   from one consistent SAR 12.4m annual revenue base so nothing
   contradicts across dashboards.
   ========================================================================== */

(function () {
  'use strict';

  var GOLD = '#A8834A';
  var NAVY = '#0E1B2E';
  var GREY = '#8891A0';
  var GOOD = '#3E7A5C';
  var BAD = '#A85C48';
  var GRID = 'rgba(255,255,255,0.14)';
  var TEXT = 'rgba(255,255,255,0.85)';
  var TEXT_DIM = 'rgba(255,255,255,0.55)';
  var PAD = { top: 22, right: 14, bottom: 30, left: 44 };

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function svgOpen(w, h) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid meet">';
  }

  /* ---------- Line chart (multi-series) ---------- */
  function lineChartSVG(w, h, categories, series, labelEvery) {
    var chartW = w - PAD.left - PAD.right, chartH = h - PAD.top - PAD.bottom;
    var stepX = chartW / (categories.length - 1);
    var parts = [svgOpen(w, h)];
    for (var gi = 0; gi <= 4; gi++) {
      var gy = PAD.top + (chartH / 4) * gi;
      parts.push('<line x1="' + PAD.left + '" y1="' + gy + '" x2="' + (PAD.left + chartW) + '" y2="' + gy + '" stroke="' + GRID + '"/>');
    }
    series.forEach(function (s) {
      var max = s.max, min = s.min || 0;
      var pts = s.data.map(function (val, i) {
        var x = PAD.left + i * stepX, y = PAD.top + chartH - ((val - min) / (max - min)) * chartH;
        return x.toFixed(1) + ',' + y.toFixed(1);
      });
      parts.push('<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + s.color + '" stroke-width="2.5"/>');
      s.data.forEach(function (val, i) {
        var x = PAD.left + i * stepX, y = PAD.top + chartH - ((val - min) / (max - min)) * chartH;
        parts.push('<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3" fill="' + s.color + '"/>');
      });
    });
    categories.forEach(function (cat, i) {
      if (i % (labelEvery || 2) === 0) {
        parts.push('<text x="' + (PAD.left + i * stepX) + '" y="' + (PAD.top + chartH + 18) + '" font-size="10" fill="' + TEXT_DIM + '" text-anchor="middle" font-family="Inter, sans-serif">' + esc(cat) + '</text>');
      }
    });
    var lx = PAD.left;
    series.forEach(function (s) {
      parts.push('<rect x="' + lx + '" y="2" width="12" height="3" fill="' + s.color + '"/>');
      parts.push('<text x="' + (lx + 16) + '" y="10" font-size="10.5" fill="' + TEXT + '" font-family="Inter, sans-serif">' + esc(s.label) + '</text>');
      lx += s.label.length * 6 + 32;
    });
    parts.push('</svg>');
    return parts.join('');
  }

  /* ---------- Bar chart (grouped, zero-baseline, +/- aware) ---------- */
  function barChartSVG(w, h, categories, series) {
    var chartW = w - PAD.left - PAD.right, chartH = h - PAD.top - PAD.bottom;
    var all = []; series.forEach(function (s) { all = all.concat(s.data); });
    var max = Math.max.apply(null, all.concat([0])) * 1.2;
    var min = Math.min.apply(null, all.concat([0]));
    var range = max - min || 1;
    var groupW = chartW / categories.length;
    var barW = (groupW * 0.6) / series.length;
    var baseline = PAD.top + chartH - ((0 - min) / range) * chartH;
    var parts = [svgOpen(w, h)];
    parts.push('<line x1="' + PAD.left + '" y1="' + baseline + '" x2="' + (PAD.left + chartW) + '" y2="' + baseline + '" stroke="' + GRID + '"/>');
    categories.forEach(function (cat, i) {
      var gx = PAD.left + i * groupW + groupW * 0.2;
      series.forEach(function (s, si) {
        var val = s.data[i];
        var barH = (Math.abs(val) / range) * chartH;
        var x = gx + si * barW;
        var color = s.color || (val >= 0 ? GOOD : BAD);
        var y = val >= 0 ? baseline - barH : baseline;
        parts.push('<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + (barW * 0.8).toFixed(1) + '" height="' + Math.max(barH, 1).toFixed(1) + '" fill="' + color + '"/>');
      });
      parts.push('<text x="' + (gx + (groupW * 0.6) / 2) + '" y="' + (PAD.top + chartH + 18) + '" font-size="10" fill="' + TEXT_DIM + '" text-anchor="middle" font-family="Inter, sans-serif">' + esc(cat) + '</text>');
    });
    if (series.length > 1) {
      var lx = PAD.left;
      series.forEach(function (s) {
        parts.push('<rect x="' + lx + '" y="2" width="10" height="10" fill="' + s.color + '"/>');
        parts.push('<text x="' + (lx + 14) + '" y="11" font-size="10.5" fill="' + TEXT + '" font-family="Inter, sans-serif">' + esc(s.label) + '</text>');
        lx += s.label.length * 6 + 30;
      });
    }
    parts.push('</svg>');
    return parts.join('');
  }

  /* ---------- Waterfall / bridge chart ---------- */
  function waterfallSVG(w, h, steps) {
    var chartW = w - PAD.left - PAD.right, chartH = h - PAD.top - PAD.bottom;
    var running = 0, maxSoFar = 0;
    steps.forEach(function (s) { running = s.isTotal ? s.value : running + s.value; maxSoFar = Math.max(maxSoFar, running); });
    var max = maxSoFar * 1.2;
    var groupW = chartW / steps.length, barW = groupW * 0.55, prevCum = 0;
    var parts = [svgOpen(w, h)];
    parts.push('<line x1="' + PAD.left + '" y1="' + (PAD.top + chartH) + '" x2="' + (PAD.left + chartW) + '" y2="' + (PAD.top + chartH) + '" stroke="' + GRID + '"/>');
    steps.forEach(function (s, i) {
      var x = PAD.left + i * groupW + groupW * 0.225;
      var startVal, endVal;
      if (s.isTotal) { startVal = 0; endVal = s.value; } else { startVal = prevCum; endVal = prevCum + s.value; }
      var yTop = PAD.top + chartH - (Math.max(startVal, endVal) / max) * chartH;
      var barH = (Math.abs(endVal - startVal) / max) * chartH;
      var color = s.isTotal ? NAVY : (s.value >= 0 ? GOLD : BAD);
      parts.push('<rect x="' + x.toFixed(1) + '" y="' + yTop.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + Math.max(barH, 1.5).toFixed(1) + '" fill="' + color + '"/>');
      parts.push('<text x="' + (x + barW / 2) + '" y="' + (PAD.top + chartH + 16) + '" font-size="9.5" fill="' + TEXT_DIM + '" text-anchor="middle" font-family="Inter, sans-serif">' + esc(s.label) + '</text>');
      prevCum = endVal;
    });
    parts.push('</svg>');
    return parts.join('');
  }

  /* ---------- Donut chart with legend ---------- */
  function donutSVG(w, h, segments) {
    var cx = w * 0.30, cy = h / 2, rOuter = Math.min(w * 0.24, h * 0.40), rInner = rOuter * 0.56;
    var total = segments.reduce(function (s, seg) { return s + seg.value; }, 0);
    var angle = -Math.PI / 2;
    var parts = [svgOpen(w, h)];
    segments.forEach(function (seg) {
      var slice = (seg.value / total) * Math.PI * 2;
      var x1 = cx + rOuter * Math.cos(angle), y1 = cy + rOuter * Math.sin(angle);
      var x2 = cx + rOuter * Math.cos(angle + slice), y2 = cy + rOuter * Math.sin(angle + slice);
      var largeArc = slice > Math.PI ? 1 : 0;
      parts.push('<path d="M ' + cx + ' ' + cy + ' L ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' A ' + rOuter + ' ' + rOuter + ' 0 ' + largeArc + ' 1 ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + ' Z" fill="' + seg.color + '"/>');
      angle += slice;
    });
    parts.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + rInner + '" fill="#0E1B2E"/>');
    var lx = cx + rOuter + 24, ly = cy - (segments.length * 15) / 2;
    segments.forEach(function (seg) {
      var pct = Math.round((seg.value / total) * 100);
      parts.push('<rect x="' + lx + '" y="' + (ly - 8) + '" width="9" height="9" fill="' + seg.color + '"/>');
      parts.push('<text x="' + (lx + 13) + '" y="' + ly + '" font-size="10.5" fill="' + TEXT + '" font-family="Inter, sans-serif">' + esc(seg.label) + ' — ' + pct + '%</text>');
      ly += 17;
    });
    parts.push('</svg>');
    return parts.join('');
  }

  /* ---------- Cash sensitivity heatmap ---------- */
  function heatmapSVG(w, h, rows, cols, matrix) {
    // matrix[row][col]: -1 (unfavourable) .. +1 (favourable)
    var leftPad = 118, topPad = 26, rightPad = 10, bottomPad = 10;
    var cellW = (w - leftPad - rightPad) / cols.length;
    var cellH = (h - topPad - bottomPad) / rows.length;
    var parts = [svgOpen(w, h)];
    cols.forEach(function (c, ci) {
      parts.push('<text x="' + (leftPad + ci * cellW + cellW / 2) + '" y="16" font-size="10.5" fill="' + TEXT_DIM + '" text-anchor="middle" font-family="Inter, sans-serif">' + esc(c) + '</text>');
    });
    rows.forEach(function (r, ri) {
      parts.push('<text x="' + (leftPad - 8) + '" y="' + (topPad + ri * cellH + cellH / 2 + 4) + '" font-size="10.5" fill="' + TEXT_DIM + '" text-anchor="end" font-family="Inter, sans-serif">' + esc(r) + '</text>');
      cols.forEach(function (c, ci) {
        var v = matrix[ri][ci];
        var color;
        if (v > 0.15) color = 'rgba(62,122,92,' + (0.35 + v * 0.45) + ')';
        else if (v < -0.15) color = 'rgba(168,92,72,' + (0.35 + Math.abs(v) * 0.45) + ')';
        else color = 'rgba(255,255,255,0.12)';
        var x = leftPad + ci * cellW + 2, y = topPad + ri * cellH + 2;
        parts.push('<rect x="' + x + '" y="' + y + '" width="' + (cellW - 4) + '" height="' + (cellH - 4) + '" fill="' + color + '"/>');
        parts.push('<text x="' + (x + (cellW - 4) / 2) + '" y="' + (y + (cellH - 4) / 2 + 4) + '" font-size="10" fill="' + TEXT + '" text-anchor="middle" font-family="IBM Plex Mono, monospace">' + (v > 0 ? '+' : '') + Math.round(v * 100) + '%</text>');
      });
    });
    parts.push('</svg>');
    return parts.join('');
  }

  function mount(id, svgString) { var el = document.getElementById(id); if (el) el.innerHTML = svgString; }

  function renderKpis(id, kpis) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = kpis.map(function (k) {
      var badge = k.badge ? '<span class="kpi-badge ' + k.badgeClass + '">' + k.badge + '</span>' : '';
      var valueAttrs = k.countTo ? ' data-count-to="' + k.countTo + '" data-count-suffix="' + (k.suffix || '') + '"' : '';
      return '<div class="kpi-card-exec"><div class="kpi-value"' + valueAttrs + '>' + k.value + '</div><div class="kpi-label">' + k.label + '</div>' + badge + '</div>';
    }).join('');
  }

  function renderIncomeStatement(id, rows) {
    var el = document.getElementById(id);
    if (!el) return;
    var body = rows.map(function (r) {
      var cls = r.total ? ' class="total-row"' : '';
      return '<tr' + cls + '><th scope="row">' + r.label + '</th><td class="num">' + r.budget + '</td><td class="num">' + r.actual + '</td><td class="num">' + r.variance + '</td></tr>';
    }).join('');
    el.innerHTML =
      '<table class="mini-income-statement"><caption class="visually-hidden">Mini income statement: budget vs actual</caption>' +
      '<thead><tr><th scope="col">SAR \'000s</th><th scope="col" class="num">Budget</th><th scope="col" class="num">Actual</th><th scope="col" class="num">Variance</th></tr></thead>' +
      '<tbody>' + body + '</tbody></table>';
  }

  /* ==========================================================================
     FICTIONAL DATASET — single consistent model, SAR '000s unless stated.
     Anchor: Revenue SAR 12,400 ('000s) = SAR 12.4m; Budget Variance +4.3%.
     ========================================================================== */
  var MONTHS12 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var REVENUE_ACTUAL = [935,959,926,987,1026,1007,1045,1069,1097,1083,1121,1145]; // = 12,400
  var REVENUE_BUDGET = [920,930,939,954,968,983,997,1011,1026,1040,1054,1069];    // = 11,890
  var GROSS_MARGIN = [38,38.5,37.8,39,39.5,39,40,40.2,40.5,40,40.8,41];
  var EBITDA_MARGIN = [16.8,16.9,16.5,17.2,17.5,17.3,17.5,17.7,17.8,17.6,17.9,18.0];

  function renderAll() {
    /* ---------- DASHBOARD 1: Executive Finance Performance ---------- */
    renderKpis('kpiDash1', [
      { value: 'SAR 12.4m', label: 'Revenue' },
      { value: '40.0%', label: 'Gross Margin' },
      { value: '17.4%', label: 'EBITDA Margin' },
      { value: 'SAR 500k', label: 'Closing Cash' },
      { value: '+4.3%', label: 'Budget Variance' },
      { value: '46 days', label: 'DSO' }
    ]);
    mount('svgRevenueBudget', lineChartSVG(560, 210, MONTHS12, [
      { label: 'Actual', data: REVENUE_ACTUAL, color: GOLD, max: 1200, min: 850 },
      { label: 'Budget', data: REVENUE_BUDGET, color: GREY, max: 1200, min: 850 }
    ], 2));
    mount('svgMarginTrend', lineChartSVG(560, 210, MONTHS12, [
      { label: 'Gross Margin %', data: GROSS_MARGIN, color: GOLD, max: 46, min: 34 },
      { label: 'EBITDA Margin %', data: EBITDA_MARGIN, color: '#5B8BB0', max: 22, min: 14 }
    ], 2));
    mount('svgVarianceBridge', barChartSVG(560, 210,
      ['Revenue Var.', 'Gross Profit Var.', 'OpEx Var.', 'EBITDA Var.'],
      [{ label: 'SAR 000s', data: [510, 204, -67, 137] }]
    ));
    renderIncomeStatement('incomeStatement', [
      { label: 'Revenue', budget: '11,890', actual: '12,400', variance: '+510' },
      { label: 'Direct Costs', budget: '(7,134)', actual: '(7,440)', variance: '−306' },
      { label: 'Gross Profit', budget: '4,756', actual: '4,960', variance: '+204' },
      { label: 'Operating Expenses', budget: '(2,735)', actual: '(2,802)', variance: '−67' },
      { label: 'EBITDA', budget: '2,021', actual: '2,158', variance: '+137', total: true }
    ]);

    /* ---------- DASHBOARD 2: Working Capital & Cash ---------- */
    renderKpis('kpiDash2', [
      { value: 'SAR 820k', label: 'Accounts Receivable' },
      { value: 'SAR 540k', label: 'Accounts Payable' },
      { value: 'SAR 310k', label: 'Inventory' },
      { value: '46 days', label: 'DSO' },
      { value: '38 days', label: 'DPO' },
      { value: '30 days', label: 'Cash Conversion Cycle' }
    ]);
    mount('svgArDonut', donutSVG(560, 210, [
      { label: 'Current', value: 420, color: '#5B8BB0' },
      { label: '1-30d', value: 210, color: GOLD },
      { label: '31-60d', value: 110, color: GOOD },
      { label: '61-90d', value: 55, color: BAD },
      { label: '90+d', value: 25, color: '#7A3A2C' }
    ]));
    mount('svgCashForecast', lineChartSVG(560, 210, ['M1','M2','M3','M4','M5','M6'], [
      { label: 'Closing Cash', data: [560,600,580,610,630,650], color: GOLD, max: 750, min: 250 },
      { label: 'Min. Threshold', data: [300,300,300,300,300,300], color: BAD, max: 750, min: 250 }
    ], 1));

    /* ---------- DASHBOARD 3: Profitability & Scenario Analysis ---------- */
    renderKpis('kpiDash3', [
      { value: '40.0%', label: 'Contribution Margin' },
      { value: '17.4%', label: 'EBITDA Margin' }
    ]);
    mount('svgProfitBridge', waterfallSVG(560, 210, [
      { label: 'Revenue', value: 12400, isTotal: true },
      { label: 'Direct Costs', value: -7440 },
      { label: 'Contrib. Margin', value: 4960, isTotal: true },
      { label: 'OpEx', value: -2802 },
      { label: 'EBITDA', value: 2158, isTotal: true }
    ]));
    mount('svgScenarioBars', barChartSVG(560, 210,
      ['Revenue Growth %', 'Gross Margin %'],
      [
        { label: 'Base', data: [4.3, 40.0], color: GREY },
        { label: 'Upside', data: [8.5, 42.5], color: GOLD },
        { label: 'Downside', data: [-1.5, 36.0], color: BAD }
      ]
    ));
    mount('svgSensitivityMatrix', heatmapSVG(560, 170,
      ['Revenue Growth', 'Cost Inflation', 'Gross Margin'],
      ['Downside', 'Base', 'Upside'],
      [
        [-0.6, 0.2, 0.8],
        [-0.7, 0.1, 0.5],
        [-0.8, 0.2, 0.7]
      ]
    ));
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('svgRevenueBudget')) return;
    renderAll();
  });

})();
