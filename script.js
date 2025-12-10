let clickCount = 0;

const calculator = {
    displayValue: '0',
    expression: '',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    justCalculated: false,
    resetExpression: false
};

const expressionLine = document.querySelector('.expression-line');
const resultLine = document.querySelector('.result-line');
const keys = document.querySelector('.calculator-keys');
const countButton = document.querySelector('.count-btn');

const historyContent = document.querySelector('.history-content');
const HISTORY = loadHistoryFromCache(); 

const hamburgerBtn = document.getElementById('hamburger-btn');
const optionsBtn = document.getElementById('options-btn');

const sideMenu = document.getElementById('side-menu');
const closeSideMenuBtn = document.getElementById('close-side-menu');

const modalOptionsOverlay = document.getElementById('modal-options-overlay');
const modalOptions = document.getElementById('modal-options');

const openHistoryBtn = document.getElementById('open-history');
const historyFloatingMenu = document.getElementById('history-floating-menu');
const closeHistoryMenuBtn = document.getElementById('close-history-menu');

const openFullscreenBtn = document.getElementById('open-fullscreen');
const fullScreenView = document.getElementById('full-screen-view');
const closeFullscreenViewBtn = document.getElementById('close-fullscreen-view');

// Nuevas variables para la Librería
const openLibraryBtn = document.getElementById('open-library-btn');
const libraryView = document.getElementById('library-view');
const closeLibraryViewBtn = document.getElementById('close-library-view');
const libraryContentContainer = document.getElementById('library-content-container');

const OPERATION_MAP = {
    '÷': (a, b) => a / b,
    '×': (a, b) => a * b,
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
};

function loadHistoryFromCache() {
    const cachedHistory = localStorage.getItem('calculatorHistory');
    try {
        return cachedHistory ? JSON.parse(cachedHistory) : [];
    } catch (e) {
        return [];
    }
}

function saveHistoryToCache() {
    localStorage.setItem('calculatorHistory', JSON.stringify(HISTORY));
}

function saveToHistory(expression, result) {
    if (result !== 'Error') {
        HISTORY.push({
            expression: expression,
            result: result
        });
    }
    if (HISTORY.length > 50) {
        HISTORY.shift();
    }
    saveHistoryToCache(); 
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    historyContent.innerHTML = '';
    
    if (HISTORY.length === 0) {
        historyContent.innerHTML = '<p style="color: #999; text-align: center; margin-top: 20px;">No hay historial de operaciones.</p>';
        return;
    }

    HISTORY.slice().reverse().forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        
        historyItem.innerHTML = `
            <span class="history-expression">${item.expression}</span>
            <span class="history-result">${item.result}</span>
        `;
        
        historyItem.addEventListener('click', () => {
            resetStateForNewInput();
            calculator.displayValue = item.result;
            calculator.expression = item.expression.replace(/=$/, '');
            calculator.firstOperand = parseFloat(item.result);
            calculator.justCalculated = true;
            updateDisplay();
            historyFloatingMenu.classList.add('hidden');
        });

        historyContent.appendChild(historyItem);
    });
}

function updateDisplay() {
    expressionLine.textContent = calculator.displayValue === 'Error' ? '' : calculator.expression || '';
    resultLine.textContent = calculator.displayValue;
}

function resetStateForNewInput() {
    calculator.displayValue = '0';
    calculator.expression = '';
    calculator.firstOperand = null;
    calculator.operator = null;
    calculator.waitingForSecondOperand = false;
    calculator.justCalculated = false;
    calculator.resetExpression = false;
    clickCount = 0;
    if (countButton) countButton.textContent = '';
}

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand, resetExpression, operator, expression } = calculator;

    if (resetExpression) {
        resetStateForNewInput();
        calculator.displayValue = digit;
        calculator.expression = digit;
    } else if (waitingForSecondOperand) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
        calculator.expression += digit;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
        
        if (operator) {
            const opIndex = expression.lastIndexOf(operator);
            if (opIndex !== -1) {
                calculator.expression = expression.substring(0, opIndex + operator.length) + calculator.displayValue;
            } else {
                 calculator.expression = calculator.displayValue;
            }
        } else {
            calculator.expression = calculator.displayValue;
        }
    }
    
    calculator.justCalculated = false;
    resultLine.classList.remove('large');
    updateDisplay();
}

function inputDecimal(dot) {
    if (calculator.resetExpression) {
        resetStateForNewInput();
        calculator.displayValue = '0.';
        calculator.expression = '0.';
    } else if (calculator.waitingForSecondOperand) {
        calculator.displayValue = "0.";
        calculator.waitingForSecondOperand = false;
        calculator.expression += '0.';
    } else if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
        
        if (calculator.operator) {
            const opIndex = calculator.expression.lastIndexOf(calculator.operator);
            if (opIndex !== -1) {
                calculator.expression = calculator.expression.substring(0, opIndex + calculator.operator.length) + calculator.displayValue;
            }
        } else {
             calculator.expression = calculator.displayValue;
        }
    }
    
    resultLine.classList.remove('large');
    updateDisplay();
}

function calculate(firstOperand, secondOperand, operator) {
    if (operator === '÷' && secondOperand === 0) {
        return 'Error';
    }
    return OPERATION_MAP[operator](firstOperand, secondOperand);
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator, expression, justCalculated, waitingForSecondOperand } = calculator;
    const inputValue = parseFloat(displayValue);
    
    if (displayValue === 'Error') return;

    if (justCalculated) {
        calculator.firstOperand = inputValue;
        calculator.operator = nextOperator;
        calculator.expression = displayValue + nextOperator;
        calculator.waitingForSecondOperand = true;
        calculator.justCalculated = false;
        calculator.resetExpression = false;
        resultLine.classList.remove('large');
        updateDisplay();
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator && !waitingForSecondOperand) {
        const secondOperand = inputValue;
        let result = calculate(firstOperand, secondOperand, operator);
        
        if (result === 'Error') {
             resetCalculator();
             calculator.displayValue = 'Error';
             resultLine.classList.add('large'); 
             updateDisplay();
             return;
        }

        result = parseFloat(result.toFixed(10)); 

        calculator.displayValue = String(result);
        calculator.firstOperand = result;
    } 
    
    if (nextOperator === '=') {
        if (operator === null || waitingForSecondOperand) return;
        
        const secondOperand = inputValue;
        let result = calculate(firstOperand, secondOperand, operator);
        
        if (result !== 'Error') {
            result = parseFloat(result.toFixed(10));
            
            const currentDisplay = calculator.displayValue;
            let fullExpression = expression.substring(0, expression.lastIndexOf(operator)) + operator + currentDisplay + nextOperator;

            saveToHistory(fullExpression, String(result));
            calculator.displayValue = String(result);
        } else {
             calculator.displayValue = 'Error';
             resetStateForNewInput();
        }

        resultLine.classList.add('large'); 
        calculator.expression += nextOperator;
        calculator.justCalculated = true;
        calculator.resetExpression = true;
        updateDisplay();
        return;
    }

    if (operator && waitingForSecondOperand) {
        calculator.operator = nextOperator;
        calculator.expression = expression.slice(0, -(operator.length)) + nextOperator;
    } else if (calculator.firstOperand !== null) {
        calculator.expression = calculator.firstOperand + nextOperator;
        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;
    }

    resultLine.classList.remove('large');
    updateDisplay();
}

function handleAuxButton(value) {
    let currentVal = calculator.displayValue;
    
    switch (value) {
        case 'sign':
            if (currentVal === '0' || currentVal === 'Error') return;
            let newVal = String(parseFloat(currentVal) * -1);
            calculator.displayValue = newVal;
            
            let expressionToUpdate = calculator.expression;
            
            if (calculator.operator) {
                const opIndex = expressionToUpdate.lastIndexOf(calculator.operator);
                if (opIndex !== -1) {
                    expressionToUpdate = expressionToUpdate.substring(0, opIndex + calculator.operator.length);
                }
                calculator.expression = expressionToUpdate + `(${newVal})`;
            } else {
                calculator.expression = newVal;
            }
            updateDisplay();
            break;
        case 'backspace':
            if (currentVal.length > 1 && currentVal !== 'Error') {
                calculator.displayValue = currentVal.slice(0, -1);
                calculator.expression = calculator.expression.slice(0, -1); 
            } else {
                calculator.displayValue = '0';
                calculator.expression = '';
            }
            updateDisplay();
            break;
        case 'count':
            clickCount++;
            calculator.displayValue = String(clickCount);
            calculator.expression = 'Clicks: ' + clickCount;
            calculator.justCalculated = true; 
            updateDisplay();
            break;
    }
}

function resetCalculator() {
    resetStateForNewInput();
    resultLine.classList.remove('large');
    updateDisplay();
}

keys.addEventListener('click', (event) => {
    const { target } = event; 
    
    if (!target.matches('button')) {
        return;
    }

    const value = target.value;
    if (value === undefined) {
        return;
    }

    if (target.classList.contains('operator')) {
        handleOperator(value);
        return;
    }

    if (target.classList.contains('aux-btn') || target.classList.contains('count-btn')) {
        handleAuxButton(value);
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(value);
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        return;
    }
    
    inputDigit(value);
});

updateDisplay();
updateHistoryDisplay();

function openSideMenu() {
    sideMenu.classList.remove('hidden');
    void sideMenu.offsetWidth; 
    sideMenu.classList.add('open');
}

function closeSideMenu() {
    sideMenu.classList.remove('open');
    setTimeout(() => sideMenu.classList.add('hidden'), 300);
}

hamburgerBtn.addEventListener('click', () => {
    modalOptionsOverlay.classList.add('hidden');
    sideMenu.classList.contains('open') ? closeSideMenu() : openSideMenu();
});

closeSideMenuBtn.addEventListener('click', closeSideMenu);

document.addEventListener('click', (event) => {
    const isMenuOpen = sideMenu.classList.contains('open');
    
    if (isMenuOpen && 
        !sideMenu.contains(event.target) && 
        !hamburgerBtn.contains(event.target)) 
    {
        closeSideMenu();
    }
});

optionsBtn.addEventListener('click', (event) => {
    closeSideMenu();
    modalOptionsOverlay.classList.remove('hidden');
    
    const rect = optionsBtn.getBoundingClientRect();
    const x = rect.left;
    const y = rect.bottom;

    let left = x - modalOptions.offsetWidth + rect.width;
    let top = y + 5;

    if (left < 10) left = 10; 
    if (top < 0) top = 10; 

    modalOptions.style.left = `${left}px`;
    modalOptions.style.top = `${top}px`;
    
    event.stopPropagation();
});

modalOptionsOverlay.addEventListener('click', (event) => {
    if (event.target === modalOptionsOverlay) {
        modalOptionsOverlay.classList.add('hidden');
    }
});

openHistoryBtn.addEventListener('click', () => {
    modalOptionsOverlay.classList.add('hidden');
    historyFloatingMenu.classList.remove('hidden');
});

closeHistoryMenuBtn.addEventListener('click', () => {
    historyFloatingMenu.classList.add('hidden');
});

let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

historyFloatingMenu.addEventListener("mousedown", dragStart);
historyFloatingMenu.addEventListener("mouseup", dragEnd);
historyFloatingMenu.addEventListener("mousemove", drag);

historyFloatingMenu.addEventListener("touchstart", dragStart);
historyFloatingMenu.addEventListener("touchend", dragEnd);
historyFloatingMenu.addEventListener("touchmove", drag);

function dragStart(e) {
    const excludeElements = historyFloatingMenu.querySelectorAll('.history-content, button');

    if (Array.from(excludeElements).some(el => el === e.target || el.contains(e.target))) {
        return;
    }
    
    const currentTransform = window.getComputedStyle(historyFloatingMenu).transform;
    const matrix = new DOMMatrixReadOnly(currentTransform);
    xOffset = matrix.m41;
    yOffset = matrix.m42;
    
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }
    
    isDragging = true;
    historyFloatingMenu.style.cursor = 'grabbing';
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;

    isDragging = false;
    historyFloatingMenu.style.cursor = 'move';
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        
        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;
        
        setTranslate(currentX, currentY, historyFloatingMenu);
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate(${xPos}px, ${yPos}px)`;
}

openFullscreenBtn.addEventListener('click', () => {
    modalOptionsOverlay.classList.add('hidden');
    fullScreenView.classList.remove('hidden');
    if (typeof initializeGameListeners === 'function') {
        initializeGameListeners();
    }
});

closeFullscreenViewBtn.addEventListener('click', () => {
    fullScreenView.classList.add('hidden');
});

// --- Lógica para la Vista de Librería (Pantalla Completa) ---

async function loadLibraryContent() {
    if (libraryContentContainer.children.length > 0 && libraryContentContainer.querySelector('p').textContent !== 'Cargando librería...') {
        return;
    }

    try {
        const response = await fetch('libreria.html');
        
        if (!response.ok) {
            throw new Error(`Error al cargar libreria.html: ${response.statusText}`);
        }
        
        const html = await response.text();
        
        libraryContentContainer.innerHTML = html;
        
    } catch (error) {
        libraryContentContainer.innerHTML = `<p style="color: #FF0000; padding: 20px;">Error al cargar el contenido. Asegúrate de que 'libreria.html' existe.</p>`;
    }
}

if (openLibraryBtn) {
    openLibraryBtn.addEventListener('click', () => {
        if (typeof closeSideMenu === 'function') {
            closeSideMenu(); 
        }
        
        modalOptionsOverlay.classList.add('hidden'); 
        fullScreenView.classList.add('hidden'); 

        libraryView.classList.remove('hidden');
        
        loadLibraryContent();
    });
}


if (closeLibraryViewBtn) {
    closeLibraryViewBtn.addEventListener('click', () => {
        libraryView.classList.add('hidden');
    });
}
