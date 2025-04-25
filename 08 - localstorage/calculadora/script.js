const display = document.getElementById('display');
let current = '';

function calculate(expr) {
  try {
    // Replace symbols for evaluation
    let e = expr.replace(/÷/g, '/').replace(/×/g, '*');
    // Handle square root: replace √n with Math.sqrt(n)
    e = e.replace(/√(\d+(?:\.\d+)?)/g, 'Math.sqrt($1)');
    // Handle exponent: a^b => Math.pow(a,b)
    e = e.replace(/(\d+(?:\.\d+)?)(\^(\d+(?:\.\d+)?))/g, 'Math.pow($1,$3)');
    return Function('return ' + e)();
  } catch {
    return 'Error';
  }
}

function updateDisplay(value) {
  display.value = value;
}

document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    const op = btn.dataset.op;
    if (op === 'clear') {
      current = '';
    } else if (op === '=') {
      current = String(calculate(current));
    } else if (op === 'sqrt') {
      current += '√';
    } else {
      current += op;
    }
    updateDisplay(current);
  });
});
