/**
 * This file safely initializes charts if the canvas elements exist
 */
document.addEventListener('DOMContentLoaded', function() {
  // Line chart initialization
  const lineCtx = document.getElementById('line');
  if (lineCtx) {
    window.myLine = new Chart(lineCtx, lineConfig);
  }
  
  // Pie chart initialization
  const pieCtx = document.getElementById('pie');
  if (pieCtx) {
    window.myPie = new Chart(pieCtx, pieConfig);
  }
});
