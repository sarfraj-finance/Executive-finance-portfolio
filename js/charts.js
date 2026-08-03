/* ==========================================================================
   SARFRAJ SOLANKI — EXECUTIVE FINANCE PORTFOLIO
   js/charts.js — Vanilla-JS canvas charting for the Financial Models &
   Decision-Support Analysis section. No external chart library, no
   dependencies. Every dataset below is fictional/illustrative — used only
   to demonstrate analytical method. No employer-confidential figures
   appear anywhere in this file or on the page.
   ========================================================================== */

(function () {
  'use strict';

  function getCssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return v ? v.trim() : fallback;
  }

  var COLOR_BLUE = getCssVar('--color-ledger-blue', '#1F3A5F');
  var COLOR_BRASS = getCssVar('--color-brass', '#A6802E');
  var COLOR_GREY = 'rgba(255,255,255,0.35)';
  var COLOR_NEGATIVE = '#C77B63';
  var COLOR_GRIDLINE = 'rgba(255,255,255,0.12)';
  var COLOR_TEXT = 'rgba(255,255,255,0.85)';
  var COLOR_TEXT_DIM = 'rgba(255,255,255,0.5)';

  function prepCanvas(canvas) {
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var cssWidth = canvas.clientWidth || 640;
    var cssHeight = canvas.clientHeight || 260;
    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cssWidth, cssHeight);
    return { ctx: ctx, w: cssWidth, h: cssHeight };
  }

  var PADDING = { top: 24, right: 16, bottom: 34, left: 46 };

  /* ---------- Generic grouped/single bar chart ---------- */
  function drawBarChart(canvasId, categories, series, opts) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var p = prepCanvas(canvas);
    var ctx = p.ctx, w = p.w, h = p.h;
    opts = opts || {};

    var chartW = w - PADDING.left - PADDING.right;
    var chartH = h - PADDING.top - PADDING.bottom;
    var allValues = [];
    series.forEach(function (s) { allValues = allValues.concat(s.data); });
    var maxValue = Math.max.apply(null, allValues.concat([0])) * 1.2;
    var minValue = Math.min.apply(null, allValues.concat([0]));
    var zeroY = PADDING.top + chartH * (maxValue / (maxValue - minValue));

    // Axis
    ctx.strokeStyle = COLOR_GRIDLINE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PADDING.left, PADDING.top);
    ctx.lineTo(PADDING.left, PADDING.top + chartH);
    ctx.lineTo(PADDING.left + chartW, PADDING.top + chartH);
    ctx.stroke();

    var groupWidth = chartW / categories.length;
    var seriesCount = series.length;
    var barWidth = (groupWidth * 0.6) / seriesCount;

    categories.forEach(function (cat, i) {
      var groupX = PADDING.left + i * groupWidth + groupWidth * 0.2;
      series.forEach(function (s, si) {
        var val = s.data[i];
        var barH = (Math.abs(val) / (maxValue - minValue)) * chartH;
        var x = groupX + si * barWidth;
        var isNeg = val < 0;
        var y = isNeg ? PADDING.top + chartH - (chartH * (maxValue) / (maxValue - minValue)) : PADDING.top + chartH - barH - (chartH * (0 - minValue) / (maxValue - minValue));
        // simpler: baseline at value 0 position
        var baseline = PADDING.top + chartH - ((0 - minValue) / (maxValue - minValue)) * chartH;
        var barTop = val >= 0 ? baseline - barH : baseline;
        ctx.fillStyle = s.color || COLOR_BLUE;
        ctx.fillRect(x, barTop, barWidth * 0.82, barH);
      });
      ctx.fillStyle = COLOR_TEXT_DIM;
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(cat, groupX + (groupWidth * 0.6) / 2, PADDING.top + chartH + 18);
    });

    // Legend
    if (series.length > 1) {
      var lx = PADDING.left;
      ctx.font = '11px Inter, sans-serif';
      series.forEach(function (s) {
        ctx.fillStyle = s.color || COLOR_BLUE;
        ctx.fillRect(lx, 4, 10, 10);
        ctx.fillStyle = COLOR_TEXT;
        ctx.textAlign = 'left';
        ctx.fillText(s.label, lx + 14, 13);
        lx += ctx.measureText(s.label).width + 34;
      });
    }
  }

  /* ---------- Multi-line trend chart (normalized 0-100 secondary lines + primary line) ---------- */
  function drawLineChart(canvasId, categories, series) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var p = prepCanvas(canvas);
    var ctx = p.ctx, w = p.w, h = p.h;

    var chartW = w - PADDING.left - PADDING.right;
    var chartH = h - PADDING.top - PADDING.bottom;

    ctx.strokeStyle = COLOR_GRIDLINE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PADDING.left, PADDING.top);
    ctx.lineTo(PADDING.left, PADDING.top + chartH);
    ctx.lineTo(PADDING.left + chartW, PADDING.top + chartH);
    ctx.stroke();

    var stepX = chartW / (categories.length - 1);

    series.forEach(function (s) {
      var max = s.max, min = s.min || 0;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      s.data.forEach(function (val, i) {
        var x = PADDING.left + i * stepX;
        var y = PADDING.top + chartH - ((val - min) / (max - min)) * chartH;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // dots
      ctx.fillStyle = s.color;
      s.data.forEach(function (val, i) {
        var x = PADDING.left + i * stepX;
        var y = PADDING.top + chartH - ((val - min) / (max - min)) * chartH;
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    // X labels (every other month to avoid crowding)
    ctx.fillStyle = COLOR_TEXT_DIM;
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    categories.forEach(function (cat, i) {
      if (i % 2 === 0) {
        ctx.fillText(cat, PADDING.left + i * stepX, PADDING.top + chartH + 16);
      }
    });

    // Legend
    var lx = PADDING.left;
    ctx.font = '11px Inter, sans-serif';
    series.forEach(function (s) {
      ctx.fillStyle = s.color;
      ctx.fillRect(lx, 4, 10, 10);
      ctx.fillStyle = COLOR_TEXT;
      ctx.textAlign = 'left';
      ctx.fillText(s.label, lx + 14, 13);
      lx += ctx.measureText(s.label).width + 34;
    });
  }

  /* ---------- Waterfall chart (cash flow forecast) ---------- */
  function drawWaterfallChart(canvasId, steps) {
    // steps: [{label, value, isTotal}]  value can be +/-, isTotal draws a full bar from 0
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var p = prepCanvas(canvas);
    var ctx = p.ctx, w = p.w, h = p.h;

    var chartW = w - PADDING.left - PADDING.right;
    var chartH = h - PADDING.top - PADDING.bottom;

    var running = 0;
    var maxSoFar = 0;
    var cumValues = steps.map(function (s) {
      if (s.isTotal) { running = s.value; }
      else { running += s.value; }
      maxSoFar = Math.max(maxSoFar, running);
      return running;
    });
    var maxValue = maxSoFar * 1.2;

    ctx.strokeStyle = COLOR_GRIDLINE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PADDING.left, PADDING.top);
    ctx.lineTo(PADDING.left, PADDING.top + chartH);
    ctx.lineTo(PADDING.left + chartW, PADDING.top + chartH);
    ctx.stroke();

    var groupWidth = chartW / steps.length;
    var barWidth = groupWidth * 0.55;
    var prevCum = 0;

    steps.forEach(function (s, i) {
      var x = PADDING.left + i * groupWidth + groupWidth * 0.225;
      var startVal, endVal;
      if (s.isTotal) {
        startVal = 0; endVal = s.value;
      } else {
        startVal = prevCum; endVal = prevCum + s.value;
      }
      var yStart = PADDING.top + chartH - (Math.max(startVal, endVal) / maxValue) * chartH;
      var barH = (Math.abs(endVal - startVal) / maxValue) * chartH;

      ctx.fillStyle = s.isTotal ? COLOR_BLUE : (s.value >= 0 ? COLOR_BRASS : COLOR_NEGATIVE);
      ctx.fillRect(x, yStart, barWidth, barH);

      ctx.fillStyle = COLOR_TEXT_DIM;
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(s.label, x + barWidth / 2, PADDING.top + chartH + 16);

      prevCum = endVal;
    });
  }

  /* ---------- KPI mini-cards (no canvas — direct DOM injection) ---------- */
  function renderKpiCards(containerId, kpis) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    kpis.forEach(function (kpi) {
      var div = document.createElement('div');
      div.className = 'kpi-mini';
      div.innerHTML = '<div class="kpi-mini-value">' + kpi.value + '</div>' +
                       '<div class="kpi-mini-label">' + kpi.label + '</div>';
      container.appendChild(div);
    });
  }

  /* ==========================================================================
     FICTIONAL DATASETS AND RENDER CALLS
     All figures are illustrative only (SAR '000s unless stated), used to
     demonstrate methodology — none reflect any real employer's data.
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', function () {

    // 1. Budget vs Actual
    if (document.getElementById('chartBudgetActual')) {
      drawBarChart('chartBudgetActual',
        ['Revenue', 'Gross Profit', 'OpEx', 'EBITDA'],
        [
          { label: 'Budget', data: [4200, 1680, 950, 730], color: COLOR_GREY },
          { label: 'Actual', data: [4380, 1750, 990, 760], color: COLOR_BRASS }
        ]
      );
    }

    // 2. Monthly Revenue & Margin Trend (12 months)
    if (document.getElementById('chartRevenueTrend')) {
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      drawLineChart('chartRevenueTrend', months, [
        { label: 'Revenue (SAR 000s)', data: [340,352,338,361,375,368,382,390,401,395,410,418], color: COLOR_BRASS, max: 460, min: 300 },
        { label: 'Gross Margin %', data: [38,38.5,37.8,39,39.5,39,40,40.2,40.5,40,40.8,41], color: COLOR_BLUE, max: 46, min: 34 }
      ]);
    }

    // 3. Cash Flow Forecast (waterfall)
    if (document.getElementById('chartCashFlow')) {
      drawWaterfallChart('chartCashFlow', [
        { label: 'Opening Cash', value: 500, isTotal: true },
        { label: 'Operating Inflows', value: 1200 },
        { label: 'Operating Outflows', value: -950 },
        { label: 'Investing', value: -150 },
        { label: 'Financing', value: -100 },
        { label: 'Closing Cash', value: 500, isTotal: true }
      ]);
    }

    // 4. Working Capital Dashboard (KPI cards only)
    renderKpiCards('kpiWorkingCapital', [
      { value: 'SAR 820k', label: 'Accounts Receivable' },
      { value: 'SAR 540k', label: 'Accounts Payable' },
      { value: 'SAR 310k', label: 'Inventory' },
      { value: 'SAR 590k', label: 'Net Working Capital' },
      { value: '46 days', label: 'DSO' },
      { value: '38 days', label: 'DPO' },
      { value: '22 days', label: 'Inventory Days' },
      { value: '30 days', label: 'Cash Conversion Cycle' }
    ]);

    // 5. AR Ageing Analysis
    if (document.getElementById('chartArAgeing')) {
      drawBarChart('chartArAgeing',
        ['Current', '1-30 days', '31-60 days', '61-90 days', '90+ days'],
        [{ label: 'Balance (SAR 000s)', data: [420, 210, 110, 55, 25], color: COLOR_BRASS }]
      );
    }

    // 6. Cost & Margin Model
    if (document.getElementById('chartCostMargin')) {
      drawBarChart('chartCostMargin',
        ['Revenue', 'Direct Cost', 'Gross Profit', 'OpEx'],
        [{ label: 'SAR 000s', data: [4380, 2630, 1750, 990], color: COLOR_BLUE }]
      );
    }
    renderKpiCards('kpiCostMargin', [
      { value: '40.0%', label: 'Contribution Margin' },
      { value: '17.4%', label: 'EBITDA Margin' }
    ]);

    // 7. Scenario & Sensitivity Analysis
    if (document.getElementById('chartScenario')) {
      drawBarChart('chartScenario',
        ['Revenue Growth %', 'Cost Inflation %', 'Gross Margin %'],
        [
          { label: 'Base', data: [4.3, 3.0, 40.0], color: COLOR_GREY },
          { label: 'Upside', data: [8.5, 2.0, 42.5], color: COLOR_BRASS },
          { label: 'Downside', data: [-1.5, 5.5, 36.0], color: COLOR_NEGATIVE }
        ]
      );
    }
    renderKpiCards('kpiScenario', [
      { value: '+SAR 180k', label: 'Cash Impact — Base' },
      { value: '+SAR 340k', label: 'Cash Impact — Upside' },
      { value: '−SAR 60k', label: 'Cash Impact — Downside' }
    ]);

    // 8. Management KPI Dashboard
    renderKpiCards('kpiManagement', [
      { value: '4.3%', label: 'Revenue Growth' },
      { value: '40.0%', label: 'Gross Margin' },
      { value: '17.4%', label: 'EBITDA Margin' },
      { value: '46 days', label: 'DSO' },
      { value: '30 days', label: 'Cash Conversion Cycle' },
      { value: '+4.3%', label: 'Budget Variance' },
      { value: 'SAR 500k', label: 'Closing Cash Balance' }
    ]);

    // Re-render canvas charts on resize so they stay crisp at any width
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (document.getElementById('chartBudgetActual')) {
          drawBarChart('chartBudgetActual', ['Revenue','Gross Profit','OpEx','EBITDA'],
            [{ label: 'Budget', data: [4200,1680,950,730], color: COLOR_GREY },
             { label: 'Actual', data: [4380,1750,990,760], color: COLOR_BRASS }]);
        }
        if (document.getElementById('chartRevenueTrend')) {
          var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          drawLineChart('chartRevenueTrend', months, [
            { label: 'Revenue (SAR 000s)', data: [340,352,338,361,375,368,382,390,401,395,410,418], color: COLOR_BRASS, max: 460, min: 300 },
            { label: 'Gross Margin %', data: [38,38.5,37.8,39,39.5,39,40,40.2,40.5,40,40.8,41], color: COLOR_BLUE, max: 46, min: 34 }
          ]);
        }
        if (document.getElementById('chartCashFlow')) {
          drawWaterfallChart('chartCashFlow', [
            { label: 'Opening Cash', value: 500, isTotal: true },
            { label: 'Operating Inflows', value: 1200 },
            { label: 'Operating Outflows', value: -950 },
            { label: 'Investing', value: -150 },
            { label: 'Financing', value: -100 },
            { label: 'Closing Cash', value: 500, isTotal: true }
          ]);
        }
        if (document.getElementById('chartArAgeing')) {
          drawBarChart('chartArAgeing', ['Current','1-30 days','31-60 days','61-90 days','90+ days'],
            [{ label: 'Balance (SAR 000s)', data: [420,210,110,55,25], color: COLOR_BRASS }]);
        }
        if (document.getElementById('chartCostMargin')) {
          drawBarChart('chartCostMargin', ['Revenue','Direct Cost','Gross Profit','OpEx'],
            [{ label: 'SAR 000s', data: [4380,2630,1750,990], color: COLOR_BLUE }]);
        }
        if (document.getElementById('chartScenario')) {
          drawBarChart('chartScenario', ['Revenue Growth %','Cost Inflation %','Gross Margin %'],
            [{ label: 'Base', data: [4.3,3.0,40.0], color: COLOR_GREY },
             { label: 'Upside', data: [8.5,2.0,42.5], color: COLOR_BRASS },
             { label: 'Downside', data: [-1.5,5.5,36.0], color: COLOR_NEGATIVE }]);
        }
      }, 200);
    });
  });

})();
