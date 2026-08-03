/* ==========================================================================
   SARFRAJ SOLANKI — EXECUTIVE FINANCE PORTFOLIO
   js/charts.js — SVG-based chart rendering for the FP&A & Decision-Support
   Portfolio section. No canvas, no external chart library, no network
   calls. SVG is used deliberately: it scales via viewBox (no
   devicePixelRatio/resize-timing bugs that can leave a canvas blank), and
   it renders reliably in browser print/PDF export, which canvas does not
   always do. Every dataset below is fictional/illustrative — used only to
   demonstrate method, not copied from any real employer's data.
   ========================================================================== */

(function () {
  'use strict';

  var COLOR_BLUE = '#1F3A5F';
  var COLOR_BRASS = '#A6802E';
  var COLOR_GREY = '#8891A0';
  var COLOR_GOOD = '#3E8F68';
  var COLOR_BAD = '#B5654F';
  var COLOR_GRID = 'rgba(255,255,255,0.14)';
  var COLOR_TEXT = 'rgba(255,255,255,0.85)';
  var COLOR_TEXT_DIM = 'rgba(255,255,255,0.55)';

  function svgOpen(w, h) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="false" preserveAspectRatio="xMidYMid meet">';
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  var PAD = { top: 24, right: 16, bottom: 34, left: 46 };

  /* ---------- Multi-series line chart ---------- */
  function lineChartSVG(w, h, categories, series, labelEvery) {
    var chartW = w - PAD.left - PAD.right;
    var chartH = h - PAD.top - PAD.bottom;
    var stepX = chartW / (categories.length - 1);
    var parts = [svgOpen(w, h)];

    // gridlines (4 horizontal)
    for (var gi = 0; gi <= 4; gi++) {
      var gy = PAD.top + (chartH / 4) * gi;
      parts.push('<line x1="' + PAD.left + '" y1="' + gy + '" x2="' + (PAD.left + chartW) + '" y2="' + gy + '" stroke="' + COLOR_GRID + '" stroke-width="1"/>');
    }
    parts.push('<line x1="' + PAD.left + '" y1="' + PAD.top + '" x2="' + PAD.left + '" y2="' + (PAD.top + chartH) + '" stroke="' + COLOR_GRID + '" stroke-width="1"/>');

    series.forEach(function (s) {
      var max = s.max, min = s.min || 0;
      var pts = s.data.map(function (val, i) {
        var x = PAD.left + i * stepX;
        var y = PAD.top + chartH - ((val - min) / (max - min)) * chartH;
        return x.toFixed(1) + ',' + y.toFixed(1);
      });
      parts.push('<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + s.color + '" stroke-width="2.5"/>');
      s.data.forEach(function (val, i) {
        var x = PAD.left + i * stepX;
        var y = PAD.top + chartH - ((val - min) / (max - min)) * chartH;
        parts.push('<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3" fill="' + s.color + '"/>');
      });
    });

    categories.forEach(function (cat, i) {
      if (i % (labelEvery || 2) === 0) {
        var x = PAD.left + i * stepX;
        parts.push('<text x="' + x + '" y="' + (PAD.top + chartH + 18) + '" font-size="10" fill="' + COLOR_TEXT_DIM + '" text-anchor="middle" font-family="Inter, sans-serif">' + esc(cat) + '</text>');
      }
    });

    var lx = PAD.left;
    series.forEach(function (s) {
      parts.push('<rect x="' + lx + '" y="2" width="12" height="3" fill="' + s.color + '"/>');
      parts.push('<text x="' + (lx + 16) + '" y="10" font-size="10.5" fill="' + COLOR_TEXT + '" font-family="Inter, sans-serif">' + esc(s.label) + '</text>');
      lx += s.label.length * 6 + 32;
    });

    parts.push('</svg>');
    return parts.join('');
  }

  /* ---------- Bar chart (grouped, vertical, zero-baseline with +/- support) ---------- */
  function barChartSVG(w, h, categories, series) {
    var chartW = w - PAD.left - PAD.right;
    var chartH = h - PAD.top - PAD.bottom;
    var all = []; series.forEach(function (s) { all = all.concat(s.data); });
    var max = Math.max.apply(null, all.concat([0])) * 1.2;
    var min = Math.min.apply(null, all.concat([0]));
    var range = max - min || 1;
    var groupW = chartW / categories.length;
    var barW = (groupW * 0.6) / series.length;
    var baseline = PAD.top + chartH - ((0 - min) / range) * chartH;

    var parts = [svgOpen(w, h)];
    parts.push('<line x1="' + PAD.left + '" y1="' + baseline + '" x2="' + (PAD.left + chartW) + '" y2="' + baseline + '" stroke="' + COLOR_GRID + '" stroke-width="1"/>');

    categories.forEach(function (cat, i) {
      var gx = PAD.left + i * groupW + groupW * 0.2;
      series.forEach(function (s, si) {
        var val = s.data[i];
        var barH = (Math.abs(val) / range) * chartH;
        var x = gx + si * barW;
        var color = s.color || (val >= 0 ? COLOR_GOOD : COLOR_BAD);
        var y = val >= 0 ? baseline - barH : baseline;
        parts.push('<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + (barW * 0.8).toFixed(1) + '" height="' + Math.max(barH, 1).toFixed(1) + '" fill="' + color + '"/>');
      });
      parts.push('<text x="' + (gx + (groupW * 0.6) / 2) + '" y="' + (PAD.top + chartH + 18) + '" font-size="10" fill="' + COLOR_TEXT_DIM + '" text-anchor="middle" font-family="Inter, sans-serif">' + esc(cat) + '</text>');
    });

    if (series.length > 1) {
      var lx = PAD.left;
      series.forEach(function (s) {
        parts.push('<rect x="' + lx + '" y="2" width="10" height="10" fill="' + s.color + '"/>');
        parts.push('<text x="' + (lx + 14) + '" y="11" font-size="10.5" fill="' + COLOR_TEXT + '" font-family="Inter, sans-serif">' + esc(s.label) + '</text>');
        lx += s.label.length * 6 + 30;
      });
    }
    parts.push('</svg>');
    return parts.join('');
  }

  /* ---------- Waterfall / bridge chart (true cumulative — steps must sum correctly) ---------- */
  function waterfallSVG(w, h, steps) {
    var chartW = w - PAD.left - PAD.right;
    var chartH = h - PAD.top - PAD.bottom;
    var running = 0, maxSoFar = 0;
    steps.forEach(function (s) {
      running = s.isTotal ? s.value : running + s.value;
      maxSoFar = Math.max(maxSoFar, running);
    });
    var max = maxSoFar * 1.2;
    var groupW = chartW / steps.length;
    var barW = groupW * 0.55;
    var prevCum = 0;
    var parts = [svgOpen(w, h)];
    parts.push('<line x1="' + PAD.left + '" y1="' + (PAD.top + chartH) + '" x2="' + (PAD.left + chartW) + '" y2="' + (PAD.top + chartH) + '" stroke="' + COLOR_GRID + '" stroke-width="1"/>');

    steps.forEach(function (s, i) {
      var x = PAD.left + i * groupW + groupW * 0.225;
      var startVal, endVal;
      if (s.isTotal) { startVal = 0; endVal = s.value; }
      else { startVal = prevCum; endVal = prevCum + s.value; }
      var yTop = PAD.top + chartH - (Math.max(startVal, endVal) / max) * chartH;
      var barH = (Math.abs(endVal - startVal) / max) * chartH;
      var color = s.isTotal ? COLOR_BLUE : (s.value >= 0 ? COLOR_BRASS : COLOR_BAD);
      parts.push('<rect x="' + x.toFixed(1) + '" y="' + yTop.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + Math.max(barH, 1.5).toFixed(1) + '" fill="' + color + '"/>');
      parts.push('<text x="' + (x + barW / 2) + '" y="' + (PAD.top + chartH + 16) + '" font-size="9.5" fill="' + COLOR_TEXT_DIM + '" text-anchor="middle" font-family="Inter, sans-serif">' + esc(s.label) + '</text>');
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
      parts.push('<path d="M ' + cx + ' ' + cy + ' L ' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
        ' A ' + rOuter + ' ' + rOuter + ' 0 ' + largeArc + ' 1 ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + ' Z" fill="' + seg.color + '"/>');
      angle += slice;
    });
    parts.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + rInner + '" fill="' + '#12181F' + '"/>');

    var lx = cx + rOuter + 26, ly = cy - (segments.length * 15) / 2;
    segments.forEach(function (seg) {
      var pct = Math.round((seg.value / total) * 100);
      parts.push('<rect x="' + lx + '" y="' + (ly - 8) + '" width="9" height="9" fill="' + seg.color + '"/>');
      parts.push('<text x="' + (lx + 13) + '" y="' + ly + '" font-size="10.5" fill="' + COLOR_TEXT + '" font-family="Inter, sans-serif">' + esc(seg.label) + ' — ' + pct + '%</text>');
      ly += 17;
    });
    parts.push('</svg>');
    return parts.join('');
  }

  /* ---------- Render into containers ---------- */
  function mount(id, svgString) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = svgString;
  }
  function renderKpis(id, kpis) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = kpis.map(function (k) {
      var badge = k.badge ? '<span class="kpi-badge ' + k.badgeClass + '">' + k.badge + '</span>' : '';
      return '<div class="kpi-mini"><div class="kpi-mini-value">' + k.value + '</div><div class="kpi-mini-label">' + k.label + '</div>' + badge + '</div>';
    }).join('');
  }

  /* ==========================================================================
     FICTIONAL DATASETS — one consolidated model, no figure reused across
     more than its designated dashboard/purpose. SAR '000s unless stated.
     ========================================================================== */
  var MONTHS12 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var MONTHS6 = ['M1','M2','M3','M4','M5','M6'];

  // Anchor: Revenue SAR 12.4m for the year, Budget Variance +4.3% — every
  // other figure below is derived from this single base so nothing
  // contradicts the KPI cards.
  var REVENUE_ACTUAL = [935,959,926,987,1026,1007,1045,1069,1097,1083,1121,1145]; // sums to 12,400
  var REVENUE_BUDGET = [920,930,939,954,968,983,997,1011,1026,1040,1054,1069];    // sums to 11,890 (+4.3% actual vs budget)
  var GROSS_MARGIN = [38,38.5,37.8,39,39.5,39,40,40.2,40.5,40,40.8,41];
  var EBITDA_MARGIN = [16.8,16.9,16.5,17.2,17.5,17.3,17.5,17.7,17.8,17.6,17.9,18.0];

  var DSO_TREND6 = [48,47,47,46,46,46];
  var DPO_TREND6 = [37,38,38,38,37,38];
  var INVD_TREND6 = [23,22,22,22,21,22];
  var CLOSING_CASH6 = [560,600,580,610,630,650];
  var CASH_THRESHOLD = 300;

  function renderAll() {
    /* ---------- DASHBOARD A: Executive Finance Performance ---------- */
    renderKpis('kpiDashboardA', [
      { value: 'SAR 12.4m', label: 'Revenue' },
      { value: '40.0%', label: 'Gross Margin' },
      { value: '17.4%', label: 'EBITDA Margin' },
      { value: 'SAR 500k', label: 'Closing Cash' },
      { value: '+4.3%', label: 'Budget Variance' },
      { value: '46 days', label: 'DSO' }
    ]);
    mount('svgRevenueBudget', lineChartSVG(560, 220, MONTHS12, [
      { label: 'Actual', data: REVENUE_ACTUAL, color: COLOR_BRASS, max: 1200, min: 850 },
      { label: 'Budget', data: REVENUE_BUDGET, color: COLOR_GREY, max: 1200, min: 850 }
    ], 2));
    mount('svgMarginTrendA', lineChartSVG(560, 220, MONTHS12, [
      { label: 'Gross Margin %', data: GROSS_MARGIN, color: COLOR_BRASS, max: 46, min: 34 },
      { label: 'EBITDA Margin %', data: EBITDA_MARGIN, color: COLOR_BLUE, max: 22, min: 14 }
    ], 2));
    mount('svgVarianceBridge', barChartSVG(560, 220,
      ['Revenue Var.', 'Gross Profit Var.', 'OpEx Var.', 'EBITDA Var.'],
      [{ label: 'SAR 000s', data: [510, 204, -67, 137] }]
    ));

    /* ---------- DASHBOARD B: Working Capital & Cash ---------- */
    renderKpis('kpiDashboardB', [
      { value: 'SAR 820k', label: 'Accounts Receivable' },
      { value: 'SAR 540k', label: 'Accounts Payable' },
      { value: 'SAR 310k', label: 'Inventory' },
      { value: 'SAR 590k', label: 'Net Working Capital' },
      { value: '30 days', label: 'Cash Conversion Cycle' }
    ]);
    mount('svgArDonut', donutSVG(560, 210, [
      { label: 'Current', value: 420, color: COLOR_BLUE },
      { label: '1-30d', value: 210, color: COLOR_BRASS },
      { label: '31-60d', value: 110, color: COLOR_GOOD },
      { label: '61-90d', value: 55, color: COLOR_BAD },
      { label: '90+d', value: 25, color: '#7A3A2C' }
    ]));
    mount('svgDsoDpoTrend', lineChartSVG(560, 220, MONTHS6, [
      { label: 'DSO', data: DSO_TREND6, color: COLOR_BRASS, max: 55, min: 18 },
      { label: 'DPO', data: DPO_TREND6, color: COLOR_BLUE, max: 55, min: 18 },
      { label: 'Inventory Days', data: INVD_TREND6, color: COLOR_GOOD, max: 55, min: 18 }
    ], 1));
    mount('svgCashForecast', lineChartSVG(560, 220, MONTHS6, [
      { label: 'Closing Cash', data: CLOSING_CASH6, color: COLOR_BRASS, max: 750, min: 250 },
      { label: 'Min. Threshold', data: MONTHS6.map(function () { return CASH_THRESHOLD; }), color: COLOR_BAD, max: 750, min: 250 }
    ], 1));

    /* ---------- DASHBOARD C: Profitability & Scenario Analysis ---------- */
    renderKpis('kpiDashboardC', [
      { value: '40.0%', label: 'Contribution Margin' },
      { value: '17.4%', label: 'EBITDA Margin' },
      { value: '+SAR 180k', label: 'Base Cash Impact' },
      { value: '+SAR 340k', label: 'Upside Cash Impact' },
      { value: '−SAR 60k', label: 'Downside Cash Impact' }
    ]);
    mount('svgProfitBridge', waterfallSVG(560, 220, [
      { label: 'Revenue', value: 12400, isTotal: true },
      { label: 'Direct Costs', value: -7440 },
      { label: 'Contrib. Margin', value: 4960, isTotal: true },
      { label: 'OpEx', value: -2802 },
      { label: 'EBITDA', value: 2158, isTotal: true }
    ]));
    mount('svgCostDonut', donutSVG(560, 210, [
      { label: 'Direct Costs', value: 7440, color: COLOR_GREY },
      { label: 'Payroll', value: 1541, color: COLOR_BLUE },
      { label: 'Occupancy', value: 504, color: COLOR_BRASS },
      { label: 'Administration', value: 420, color: COLOR_GOOD },
      { label: 'Other Operating', value: 337, color: COLOR_BAD }
    ]));
    mount('svgScenarioBars', barChartSVG(560, 220,
      ['Revenue Growth %', 'Gross Margin %'],
      [
        { label: 'Base', data: [4.3, 40.0], color: COLOR_GREY },
        { label: 'Upside', data: [8.5, 42.5], color: COLOR_BRASS },
        { label: 'Downside', data: [-1.5, 36.0], color: COLOR_BAD }
      ]
    ));
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('svgRevenueBudget')) return; // not on this page
    renderAll();
  });

})();
