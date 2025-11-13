const display = document.getElementById('display');
let currentInput = '';
let memory = 0;
let grandTotal = 0;
let lastOperation = null;
let resetDisplay = false;

function updateDisplay(value) {
    display.textContent = value || '0';
}

function calculate(a, b, op) {
    a = parseFloat(a);
    b = parseFloat(b);
    switch(op) {
        case 'add': return a + b;
        case 'subtract': return a - b;
        case 'multiply': return a * b;
        case 'divide': return b === 0 ? 'Error' : a / b;
        default: return b;
    }
}

function handleInput(value) {
    if(resetDisplay) {
        currentInput = '';
        resetDisplay = false;
    }

    if(value === '.') {
        if(!currentInput.includes('.')) {
            currentInput += value;
        }
    } else {
        currentInput += value;
    }
    updateDisplay(currentInput);
}

function handleOperator(op) {
    if(currentInput === '') return; // Ignore if no input
    if(lastOperation && !resetDisplay) {
        let result = calculate(memory, currentInput, lastOperation);
        if(result === 'Error') {
            updateDisplay(result);
            resetCalculator();
            return;
        }
        memory = result;
        updateDisplay(result);
    } else {
        memory = parseFloat(currentInput);
    }
    lastOperation = op;
    resetDisplay = true;
    currentInput = '';
}

function resetCalculator() {
    currentInput = '';
    memory = 0;
    grandTotal = 0;
    lastOperation = null;
    resetDisplay = false;
}

// Memory functions
function memoryPlus() {
    memory += parseFloat(currentInput || 0);
    resetDisplay = true;
}

function memoryMinus() {
    memory -= parseFloat(currentInput || 0);
    resetDisplay = true;
}

function memoryRecall() {
    currentInput = memory.toString();
    updateDisplay(currentInput);
}

function grandTotalAdd() {
    grandTotal += parseFloat(currentInput || 0);
    updateDisplay(grandTotal);
    resetDisplay = true;
}

// Backspace function
function backspace() {
    if(display.textContent === 'Error') {
        resetCalculator();
        updateDisplay('0');
        return;
    }
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput || '0');
}

// Square root
function squareRoot() {
    let num = parseFloat(currentInput);
    if(num < 0) {
        updateDisplay('Error');
        resetCalculator();
        return;
    }
    let result = Math.sqrt(num);
    currentInput = result.toString();
    updateDisplay(currentInput);
    resetDisplay = true;
}

// Mark Up (MU) can be a simple profit margin calculator for this example: MU = Price * (1 + margin%)
function markUp() {
    // Let's say the MU button adds 10% profit margin to the current input
    let num = parseFloat(currentInput);
    if(isNaN(num)) return;
    let result = num * 1.10;
    currentInput = result.toFixed(2);
    updateDisplay(currentInput);
    resetDisplay = true;
}

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        const val = button.id;

        if(val === 'AC') {
            resetCalculator();
            updateDisplay('0');
        } else if(val === 'CE') {
            currentInput = '';
            updateDisplay('0');
        } else if(val === 'Mplus') {
            memoryPlus();
        } else if(val === 'Mminus') {
            memoryMinus();
        } else if(val === 'MRC') {
            memoryRecall();
        } else if(val === 'GT') {
            grandTotalAdd();
        } else if(val === 'backspace') {
            backspace();
        } else if(val === 'sqrt') {
            squareRoot();
        } else if(val === 'MU') {
            markUp();
        } else if(val === 'percent') {
            if(currentInput === '') return;
            let num = parseFloat(currentInput);
            currentInput = (num / 100).toString();
            updateDisplay(currentInput);
            resetDisplay = true;
        } else if(val === 'equals') {
            if(lastOperation && currentInput !== '') {
                let result = calculate(memory, currentInput, lastOperation);
                if(result === 'Error') {
                    updateDisplay(result);
                    resetCalculator();
                    return;
                }
                updateDisplay(result);
                currentInput = result.toString();
                memory = 0;
                lastOperation = null;
                resetDisplay = true;
            }
        } else if(['add', 'subtract', 'multiply', 'divide'].includes(val)) {
            handleOperator(val);
        } else if(val === 'decimal') {
            handleInput('.');
        } else if(['0','00','000','1','2','3','4','5','6','7','8','9'].includes(val)) {
            if(val === '00') {
                // Prevent leading zeros
                if(currentInput === '0' || currentInput === '') return;
            }
            handleInput(val);
        }
    });
});
