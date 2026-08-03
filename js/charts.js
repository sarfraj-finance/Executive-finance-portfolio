/* ==========================================================================
   SARFRAJ SOLANKI — EXECUTIVE FINANCE PORTFOLIO
   js/charts.js — Vanilla-JS canvas charting for the Financial Models &
   Decision-Support Dashboards section. No external chart library, no
   dependencies, no network calls. Every dataset below is fictional —
   illustrative only, used to demonstrate method, not copied from any real
   employer's data.
   ========================================================================== */

(function () {
  'use strict';

  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return v ? v.trim() : fallback;
  }

  var COLOR_BLUE = cssVar('--color-ledger-blue', '#1F3A5F');
  var COLOR_BRASS = cssVar('--color-brass', '#A6802E');
  var COLOR_GREY = 'rgba(255,255,255,0.35)';
  var COLOR_NEGATIVE = '#C77B63';
  var COLOR_GRID = 'rgba(255,255,255,0.12)';
  var COLOR_TEXT = 'rgba(255,255,255,0.85)';
  var COLOR_TEXT_DIM = 'rgba(255,255,255,0.5)';
  var PAD = { top: 22, right: 14, bottom: 30, left: 42 };

  function prep(canvas) {
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.clientWidth || 320;
    var h = canvas.clientHeight || 220;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    return { ctx: ctx, w: w, h: h };
  }

  function drawAxes(ctx, w, h) {
    var chartW = w - PAD.left - PAD.right;
    var chartH = h - PAD.top - PAD.bottom;
    ctx.strokeStyle = COLOR_GRID;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD.left, PAD.top);
    ctx.lineTo(PAD.left, PAD.top + chartH);
    ctx.lineTo(PAD.left + chartW, PAD.top + chartH);
    ctx.stroke();
    return { chartW: chartW, chartH: chartH };
  }

  function drawLegend(ctx, items) {
    var lx = PAD.left;
    ctx.font = '10px Inter, sans-serif';
    items.forEach(function (it) {
      ctx.fillStyle = it.color;
      if (it.line) { ctx.fillRect(lx, 4, 12, 2); } else { ctx.fillRect(lx, 2, 9, 9); }
      ctx.fillStyle = COLOR_TEXT;
      ctx.textAlign = 'left';
      ctx.fillText(it.label, lx + 15, 11);
      lx += ctx.measureText(it.label).width + 30;
    });
  }

  /* ---------- Generic bar chart (single or grouped, vertical) ---------- */
  function drawBarChart(canvasId, categories, series) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var p = prep(canvas), ctx = p.ctx;
    var g = drawAxes(ctx, p.w, p.h);
    var all = []; series.forEach(function (s) { all = all.concat(s.data); });
    var max = Math.max.apply(null, all.concat([0])) * 1.2;
    var min = Math.min.apply(null, all.concat([0]));
    var range = max - min || 1;
    var groupW = g.chartW / categories.length;
    var barW = (groupW * 0.62) / series.length;
    var baseline = PAD.top + g.chartH - ((0 - min) / range) * g.chartH;

    categories.forEach(function (cat, i) {
      var gx = PAD.left + i * groupW + groupW * 0.19;
      series.forEach(function (s, si) {
        var val = s.data[i];
        var barH = (Math.abs(val) / range) * g.chartH;
        var x = gx + si * barW;
        var top = val >= 0 ? baseline - barH : baseline;
        ctx.fillStyle = s.color || COLOR_BLUE;
        ctx.fillRect(x, top, barW * 0.8, barH);
      });
      ctx.fillStyle = COLOR_TEXT_DIM;
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(cat, gx + (groupW * 0.62) / 2, PAD.top + g.chartH + 16);
    });

    if (series.length > 1) drawLegend(ctx, series.map(function (s) { return { color: s.color, label: s.label }; }));
  }

  /* ---------- Horizontal bar chart ---------- */
  function drawHorizontalBar(canvasId, categories, values, color) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var p = prep(canvas), ctx = p.ctx, w = p.w, h = p.h;
    var leftPad = 92, rightPad = 40, topPad = 14, bottomPad = 10;
    var chartW = w - leftPad - rightPad;
    var chartH = h - topPad - bottomPad;
    var max = Math.max.apply(null, values) * 1.15;
    var rowH = chartH / categories.length;

    categories.forEach(function (cat, i) {
      var y = topPad + i * rowH + rowH * 0.22;
      var barH = rowH * 0.56;
      var barW = (values[i] / max) * chartW;
      ctx.fillStyle = color;
      ctx.fillRect(leftPad, y, barW, barH);
      ctx.fillStyle = COLOR_TEXT_DIM;
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(cat, leftPad - 8, y + barH * 0.75);
      ctx.fillStyle = COLOR_TEXT;
      ctx.textAlign = 'left';
      ctx.fillText(values[i].toLocaleString(), leftPad + barW + 6, y + barH * 0.75);
    });
  }

  /* ---------- Line chart (multi-series, independent scales) ---------- */
  function drawLineChart(canvasId, categories, series, labelEvery) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var p = prep(canvas), ctx = p.ctx;
    var g = drawAxes(ctx, p.w, p.h);
    var stepX = g.chartW / (categories.length - 1);

    series.forEach(function (s) {
      var max = s.max, min = s.min || 0;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      s.data.forEach(function (val, i) {
        var x = PAD.left + i * stepX;
        var y = PAD.top + g.chartH - ((val - min) / (max - min)) * g.chartH;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.fillStyle = s.color;
      s.data.forEach(function (val, i) {
        var x = PAD.left + i * stepX;
        var y = PAD.top + g.chartH - ((val - min) / (max - min)) * g.chartH;
        ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
      });
    });

    ctx.fillStyle = COLOR_TEXT_DIM;
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'center';
    categories.forEach(function (cat, i) {
      if (i % (labelEvery || 2) === 0) ctx.fillText(cat, PAD.left + i * stepX, PAD.top + g.chartH + 14);
    });

    drawLegend(ctx, series.map(function (s) { return { color: s.color, label: s.label, line: true }; }));
  }

  /* ---------- Combo chart: bars (left scale) + lines (right 0-100% scale) ---------- */
  function drawComboChart(canvasId, categories, barSeries, lineSeries, labelEvery) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var p = prep(canvas), ctx = p.ctx;
    var g = drawAxes(ctx, p.w, p.h);
    var groupW = g.chartW / categories.length;
    var barMax = Math.max.apply(null, barSeries.data) * 1.25;

    categories.forEach(function (cat, i) {
      var x = PAD.left + i * groupW + groupW * 0.25;
      var barW = groupW * 0.5;
      var barH = (barSeries.data[i] / barMax) * g.chartH;
      ctx.fillStyle = barSeries.color;
      ctx.fillRect(x, PAD.top + g.chartH - barH, barW, barH);
      if (i % (labelEvery || 2) === 0) {
        ctx.fillStyle = COLOR_TEXT_DIM;
        ctx.font = '9px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(cat, x + barW / 2, PAD.top + g.chartH + 14);
      }
    });

    var stepX = g.chartW / (categories.length - 1);
    lineSeries.forEach(function (s) {
      var max = s.max, min = s.min || 0;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      s.data.forEach(function (val, i) {
        var x = PAD.left + i * stepX;
        var y = PAD.top + g.chartH - ((val - min) / (max - min)) * g.chartH;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });

    var legendItems = [{ color: barSeries.color, label: barSeries.label }].concat(
      lineSeries.map(function (s) { return { color: s.color, label: s.label, line: true }; })
    );
    drawLegend(ctx, legendItems);
  }

  /* ---------- Waterfall / bridge chart ---------- */
  function drawWaterfall(canvasId, steps) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var p = prep(canvas), ctx = p.ctx;
    var g = drawAxes(ctx, p.w, p.h);

    var running = 0, maxSoFar = 0;
    steps.forEach(function (s) {
      running = s.isTotal ? s.value : running + s.value;
      maxSoFar = Math.max(maxSoFar, running);
    });
    var max = maxSoFar * 1.2;
    var groupW = g.chartW / steps.length;
    var barW = groupW * 0.55;
    var prevCum = 0;

    steps.forEach(function (s, i) {
      var x = PAD.left + i * groupW + groupW * 0.225;
      var startVal, endVal;
      if (s.isTotal) { startVal = 0; endVal = s.value; }
      else { startVal = prevCum; endVal = prevCum + s.value; }
      var yStart = PAD.top + g.chartH - (Math.max(startVal, endVal) / max) * g.chartH;
      var barH = (Math.abs(endVal - startVal) / max) * g.chartH;
      ctx.fillStyle = s.isTotal ? COLOR_BLUE : (s.value >= 0 ? COLOR_BRASS : COLOR_NEGATIVE);
      ctx.fillRect(x, yStart, barW, Math.max(barH, 1.5));
      ctx.fillStyle = COLOR_TEXT_DIM;
      ctx.font = '9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(s.label, x + barW / 2, PAD.top + g.chartH + 14);
      prevCum = endVal;
    });
  }

  /* ---------- Donut chart ---------- */
  function drawDonut(canvasId, segments) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var p = prep(canvas), ctx = p.ctx, w = p.w, h = p.h;
    var cx = w * 0.32, cy = h / 2, rOuter = Math.min(w * 0.28, h * 0.42), rInner = rOuter * 0.58;
    var total = segments.reduce(function (sum, s) { return sum + s.value; }, 0);
    var start = -Math.PI / 2;

    segments.forEach(function (s) {
      var slice = (s.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, rOuter, start, start + slice);
      ctx.closePath();
      ctx.fillStyle = s.color;
      ctx.fill();
      start += slice;
    });
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    var lx = cx + rOuter + 20, ly = cy - (segments.length * 16) / 2;
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'left';
    segments.forEach(function (s) {
      var pct = Math.round((s.value / total) * 100);
      ctx.fillStyle = s.color;
      ctx.fillRect(lx, ly, 9, 9);
      ctx.fillStyle = COLOR_TEXT;
      ctx.fillText(s.label + ' — ' + pct + '%', lx + 14, ly + 8.5);
      ly += 18;
    });
  }

  /* ---------- CCC bridge: DSO + Inventory Days − DPO = CCC (horizontal) ---------- */
  function drawCCCBridge(canvasId, dso, invDays, dpo, ccc) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var p = prep(canvas), ctx = p.ctx, w = p.w, h = p.h;
    var leftPad = 14, topPad = 30, barH = 26;
    var chartW = w - leftPad * 2;
    var max = (dso + invDays) * 1.1;
    var y = topPad;
    var x = leftPad;

    var dsoW = (dso / max) * chartW;
    ctx.fillStyle = COLOR_BRASS;
    ctx.fillRect(x, y, dsoW, barH);
    ctx.fillStyle = COLOR_TEXT;
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('DSO ' + dso + 'd', x + 4, y + barH / 2 + 4);
    x += dsoW;

    var invW = (invDays / max) * chartW;
    ctx.fillStyle = COLOR_BLUE;
    ctx.fillRect(x, y, invW, barH);
    ctx.fillStyle = '#fff';
    ctx.fillText('+ Inv ' + invDays + 'd', x + 4, y + barH / 2 + 4);
    x += invW;

    var dpoW = (dpo / max) * chartW;
    ctx.fillStyle = COLOR_NEGATIVE;
    ctx.fillRect(x - dpoW, y, dpoW, barH);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'right';
    ctx.fillText('− DPO ' + dpo + 'd', x - 4, y + barH / 2 + 4);

    ctx.fillStyle = COLOR_TEXT;
    ctx.font = '13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('= Cash Conversion Cycle: ' + ccc + ' days', w / 2, y + barH + 26);
  }

  /* ---------- Sensitivity heatmap ---------- */
  function drawHeatmap(canvasId, rows, cols, matrix) {
    // matrix[row][col] = value from -1 (unfavourable) to +1 (favourable), 0 = neutral
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var p = prep(canvas), ctx = p.ctx, w = p.w, h = p.h;
    var leftPad = 108, topPad = 26, rightPad = 10, bottomPad = 10;
    var cellW = (w - leftPad - rightPad) / cols.length;
    var cellH = (h - topPad - bottomPad) / rows.length;

    ctx.font = '10px Inter, sans-serif';
    cols.forEach(function (c, ci) {
      ctx.fillStyle = COLOR_TEXT_DIM;
      ctx.textAlign = 'center';
      ctx.fillText(c, leftPad + ci * cellW + cellW / 2, 16);
    });

    rows.forEach(function (r, ri) {
      ctx.fillStyle = COLOR_TEXT_DIM;
      ctx.textAlign = 'right';
      ctx.fillText(r, leftPad - 8, topPad + ri * cellH + cellH / 2 + 4);
      cols.forEach(function (c, ci) {
        var v = matrix[ri][ci];
        var color;
        if (v > 0.15) color = 'rgba(47,110,78,' + (0.35 + v * 0.4) + ')';
        else if (v < -0.15) color = 'rgba(199,123,99,' + (0.35 + Math.abs(v) * 0.4) + ')';
        else color = 'rgba(255,255,255,0.12)';
        ctx.fillStyle = color;
        var x = leftPad + ci * cellW + 2;
        var y = topPad + ri * cellH + 2;
        ctx.fillRect(x, y, cellW - 4, cellH - 4);
      });
    });
  }

  /* ---------- KPI mini-cards (DOM, no canvas) ---------- */
  function renderKpiCards(containerId, kpis) {
    var el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = '';
    kpis.forEach(function (k) {
      var div = document.createElement('div');
      div.className = 'kpi-mini';
      var badge = k.badge ? '<span class="kpi-badge ' + k.badgeClass + '">' + k.badge + '</span>' : '';
      div.innerHTML = '<div class="kpi-mini-value">' + k.value + '</div><div class="kpi-mini-label">' + k.label + '</div>' + badge;
      el.appendChild(div);
    });
  }

  /* ==========================================================================
     FICTIONAL DATASETS (shared across dashboards) — SAR '000s unless stated
     ========================================================================== */
  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var REVENUE = [980,1005,970,1035,1075,1055,1095,1120,1150,1135,1175,1200];
  var EBITDA = [165,170,160,178,188,182,192,198,205,200,210,216];
  var GROSS_MARGIN = [38,38.5,37.8,39,39.5,39,40,40.2,40.5,40,40.8,41];
  var EBITDA_MARGIN = [16.8,16.9,16.5,17.2,17.5,17.3,17.5,17.7,17.8,17.6,17.9,18.0];
  var CLOSING_CASH = [500,540,510,560,600,580,610,630,650,635,660,680];
  var CASH_THRESHOLD = 300;
  var INFLOWS = [1180,1200,1150,1230,1260,1240,1270,1300,1330,1310,1350,1380];
  var OUTFLOWS = [1140,1160,1180,1180,1220,1260,1240,1280,1310,1325,1325,1360];

  function renderAll() {
    // Dashboard 1: Executive Overview
    drawComboChart('chartOverviewTrend', MONTHS, { label: 'Revenue', data: REVENUE, color: COLOR_BRASS }, [
      { label: 'EBITDA', data: EBITDA, color: COLOR_BLUE, max: 260, min: 100 }
    ], 2);
    drawBarChart('chartOverviewBudget', ['Revenue','Gross Profit','OpEx','EBITDA'], [
      { label: 'Budget', data: [4200,1680,950,730], color: COLOR_GREY },
      { label: 'Actual', data: [4380,1750,990,760], color: COLOR_BRASS }
    ]);
    renderKpiCards('kpiOverviewWC', [
      { value: 'SAR 820k', label: 'Accounts Receivable' },
      { value: 'SAR 540k', label: 'Accounts Payable' },
      { value: 'SAR 590k', label: 'Net Working Capital' },
      { value: '30 days', label: 'Cash Conversion Cycle' }
    ]);

    // Dashboard 2: Budget vs Actual
    drawBarChart('chartBudgetActual', ['Revenue','Gross Profit','OpEx','EBITDA'], [
      { label: 'Budget', data: [4200,1680,950,730], color: COLOR_GREY },
      { label: 'Actual', data: [4380,1750,990,760], color: COLOR_BRASS }
    ]);
    drawWaterfall('chartBudgetBridge', [
      { label: 'Budget EBITDA', value: 730, isTotal: true },
      { label: 'Revenue Var.', value: 108 },
      { label: 'OpEx Var.', value: -40 },
      { label: 'Other', value: -38 },
      { label: 'Actual EBITDA', value: 760, isTotal: true }
    ]);
    renderKpiCards('kpiBudgetVariance', [
      { value: '+180', label: 'Revenue Variance (SAR 000s)', badge: 'Favourable', badgeClass: 'badge-good' },
      { value: '+70', label: 'Gross Profit Variance', badge: 'Favourable', badgeClass: 'badge-good' },
      { value: '+40', label: 'OpEx Variance', badge: 'Unfavourable', badgeClass: 'badge-bad' },
      { value: '+30', label: 'EBITDA Variance', badge: 'Favourable', badgeClass: 'badge-good' }
    ]);

    // Dashboard 3: Revenue & Margin Trend
    drawComboChart('chartRevenueTrend', MONTHS, { label: 'Revenue', data: REVENUE, color: COLOR_BRASS },
      [
        { label: 'Gross Margin %', data: GROSS_MARGIN, color: COLOR_BLUE, max: 46, min: 34 },
        { label: 'EBITDA Margin %', data: EBITDA_MARGIN, color: '#7FD4A8', max: 22, min: 14 }
      ], 2);

    // Dashboard 4: Cash Flow Forecast
    renderKpiCards('kpiCashFlow', [
      { value: 'SAR 500k', label: 'Opening Cash' },
      { value: '+SAR 1,200k', label: 'Operating Cash Flow' },
      { value: '−SAR 150k', label: 'Investing Cash Flow' },
      { value: '−SAR 100k', label: 'Financing Cash Flow' },
      { value: 'SAR 500k', label: 'Closing Cash' }
    ]);
    drawLineChart('chartCashClosing', MONTHS, [
      { label: 'Closing Cash', data: CLOSING_CASH, color: COLOR_BRASS, max: 750, min: 250 },
      { label: 'Min. Threshold', data: MONTHS.map(function () { return CASH_THRESHOLD; }), color: COLOR_NEGATIVE, max: 750, min: 250 }
    ], 2);
    drawBarChart('chartCashInOut', MONTHS, [
      { label: 'Inflows', data: INFLOWS, color: COLOR_BLUE },
      { label: 'Outflows', data: OUTFLOWS, color: COLOR_GREY }
    ]);

    // Dashboard 5: Working Capital
    renderKpiCards('kpiWorkingCapital', [
      { value: 'SAR 820k', label: 'Accounts Receivable' },
      { value: 'SAR 540k', label: 'Accounts Payable' },
      { value: 'SAR 310k', label: 'Inventory' },
      { value: 'SAR 590k', label: 'Net Working Capital' }
    ]);
    drawCCCBridge('chartCCC', 46, 22, 38, 30);
    drawBarChart('chartWCCompare', ['Receivable','Payable','Inventory'], [
      { label: 'SAR 000s', data: [820, 540, 310], color: COLOR_BRASS }
    ]);

    // Dashboard 6: AR Ageing
    drawHorizontalBar('chartArAgeingH', ['Current','1-30 days','31-60 days','61-90 days','90+ days'], [420,210,110,55,25], COLOR_BRASS);
    drawDonut('chartArDonut', [
      { label: 'Current', value: 420, color: COLOR_BLUE },
      { label: '1-30d', value: 210, color: COLOR_BRASS },
      { label: '31-60d', value: 110, color: '#7FD4A8' },
      { label: '61-90d', value: 55, color: COLOR_NEGATIVE },
      { label: '90+d', value: 25, color: '#8B4A3C' }
    ]);
    renderKpiCards('kpiArAgeing', [
      { value: '22%', label: 'Overdue % of Total' },
      { value: 'SAR 80k', label: 'High-Risk Balance (61+ days)' },
      { value: '90+ days', label: 'Collection Priority' }
    ]);

    // Dashboard 7: Cost & Margin
    drawWaterfall('chartProfitBridge', [
      { label: 'Revenue', value: 4380, isTotal: true },
      { label: 'Direct Costs', value: -2630 },
      { label: 'Contrib. Margin', value: 1750, isTotal: true },
      { label: 'OpEx', value: -990 },
      { label: 'EBITDA', value: 760, isTotal: true }
    ]);
    drawDonut('chartCostDonut', [
      { label: 'Direct Costs', value: 2630, color: COLOR_GREY },
      { label: 'OpEx', value: 990, color: COLOR_NEGATIVE },
      { label: 'EBITDA', value: 760, color: COLOR_BRASS }
    ]);
    drawLineChart('chartMarginTrend', MONTHS, [
      { label: 'Contribution Margin %', data: GROSS_MARGIN, color: COLOR_BRASS, max: 46, min: 34 },
      { label: 'EBITDA Margin %', data: EBITDA_MARGIN, color: '#7FD4A8', max: 22, min: 14 }
    ], 2);

    // Dashboard 8: Scenario Analysis
    drawBarChart('chartScenario', ['Revenue Growth %','Cost Inflation %','Gross Margin %'], [
      { label: 'Base', data: [4.3, 3.0, 40.0], color: COLOR_GREY },
      { label: 'Upside', data: [8.5, 2.0, 42.5], color: COLOR_BRASS },
      { label: 'Downside', data: [-1.5, 5.5, 36.0], color: COLOR_NEGATIVE }
    ]);
    drawHeatmap('chartHeatmap', ['Revenue Growth','Cost Inflation','Gross Margin'], ['Downside','Base','Upside'], [
      [-0.6, 0.2, 0.8],
      [-0.7, 0.1, 0.5],
      [-0.8, 0.2, 0.7]
    ]);
    renderKpiCards('kpiScenario', [
      { value: '+SAR 180k', label: 'Cash Impact — Base' },
      { value: '+SAR 340k', label: 'Cash Impact — Upside' },
      { value: '−SAR 60k', label: 'Cash Impact — Downside' }
    ]);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('chartOverviewTrend')) return; // not on this page
    renderAll();
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderAll, 200);
    });
  });

})();
