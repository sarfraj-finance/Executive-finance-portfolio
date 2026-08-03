/* ==========================================================================
   SARFRAJ SOLANKI — EXECUTIVE FINANCE PORTFOLIO
   js/charts.js — Minimal, dependency-free canvas chart rendering for the
   FP&A Portfolio page. No charting library is used, in keeping with the
   "no frameworks" requirement.

   IMPORTANT: every dataset in this file is fictional/illustrative, used
   only to demonstrate analytical method. No employer-confidential figures
   appear here or anywhere on this site — see the visible disclaimer on
   fpa-portfolio.html.
   ========================================================================== */

/**
 * Renders a simple grouped bar chart (Budget vs Actual) onto a <canvas>.
 * @param {string} canvasId - id of the target <canvas> element
 * @param {Array<{label: string, budget: number, actual: number}>} data
 */
function renderVarianceChart(canvasId, data) {
  var canvas = document.getElementById(canvasId);
  if (!canvas || !data || !data.length) return;

  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var cssWidth = canvas.clientWidth || 640;
  var cssHeight = canvas.clientHeight || 320;

  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;
  ctx.scale(dpr, dpr);

  var styles = getComputedStyle(document.documentElement);
  var colorBlue = styles.getPropertyValue('--color-ledger-blue').trim() || '#1F3A5F';
  var colorNegative = '#8B4A3C';
  var colorSlate = styles.getPropertyValue('--color-slate').trim() || '#5B6472';
  var colorInk = styles.getPropertyValue('--color-ink').trim() || '#1B2430';

  ctx.clearRect(0, 0, cssWidth, cssHeight);

  var padding = { top: 20, right: 20, bottom: 40, left: 50 };
  var chartWidth = cssWidth - padding.left - padding.right;
  var chartHeight = cssHeight - padding.top - padding.bottom;

  var maxValue = Math.max.apply(null, data.map(function (d) {
    return Math.max(d.budget, d.actual);
  })) * 1.15;

  var groupWidth = chartWidth / data.length;
  var barWidth = groupWidth * 0.28;

  // Axis line
  ctx.strokeStyle = colorSlate;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, padding.top + chartHeight);
  ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
  ctx.stroke();

  data.forEach(function (d, i) {
    var groupX = padding.left + i * groupWidth + groupWidth / 2;

    var budgetHeight = (d.budget / maxValue) * chartHeight;
    var actualHeight = (d.actual / maxValue) * chartHeight;
    var isOverBudget = d.actual > d.budget;

    // Budget bar
    ctx.fillStyle = colorSlate;
    ctx.globalAlpha = 0.35;
    ctx.fillRect(
      groupX - barWidth - 4,
      padding.top + chartHeight - budgetHeight,
      barWidth,
      budgetHeight
    );

    // Actual bar
    ctx.globalAlpha = 1;
    ctx.fillStyle = isOverBudget ? colorNegative : colorBlue;
    ctx.fillRect(
      groupX + 4,
      padding.top + chartHeight - actualHeight,
      barWidth,
      actualHeight
    );

    // Category label
    ctx.fillStyle = colorInk;
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(d.label, groupX, padding.top + chartHeight + 18);
  });

  // Simple legend
  ctx.font = '11px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = colorSlate;
  ctx.globalAlpha = 0.35;
  ctx.fillRect(padding.left, 4, 10, 10);
  ctx.globalAlpha = 1;
  ctx.fillStyle = colorInk;
  ctx.fillText('Budget', padding.left + 16, 13);
  ctx.fillStyle = colorBlue;
  ctx.fillRect(padding.left + 80, 4, 10, 10);
  ctx.fillStyle = colorInk;
  ctx.fillText('Actual', padding.left + 96, 13);
}

/* ---------- Fictional demonstration dataset (illustrative only) ---------- */
document.addEventListener('DOMContentLoaded', function () {
  var chartCanvas = document.getElementById('varianceChart');
  if (!chartCanvas) return; // Only run on pages that include this canvas

  var illustrativeData = [
    { label: 'Cost of Sales', budget: 420, actual: 447 },
    { label: 'Staff Costs',   budget: 210, actual: 198 },
    { label: 'Rent & Occ.',   budget: 96,  actual: 96 },
    { label: 'Marketing',     budget: 60,  actual: 74 },
    { label: 'Admin & Other', budget: 45,  actual: 41 }
  ];

  renderVarianceChart('varianceChart', illustrativeData);

  // Re-render on resize so the canvas stays crisp at any viewport width
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      renderVarianceChart('varianceChart', illustrativeData);
    }, 200);
  });
});
