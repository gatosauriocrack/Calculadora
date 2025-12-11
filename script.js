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

let currentScientificInput = '0';
let lastResult = null;
let isScientificMode = false;
let isDegreeMode = true;

const expressionLine = document.querySelector('.expression-line');
const resultLine = document.querySelector('.result-line');
const keys = document.querySelector('.calculator-keys');
const calculatorApp = document.getElementById('calculator-app');

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
const openLibraryBtn = document.getElementById('open-library-btn');
const libraryView = document.getElementById('library-view');
const closeLibraryViewBtn = document.getElementById('close-library-view');
const libraryContentContainer = document.getElementById('library-content-container');

const openInfoBtn = document.getElementById('open-info-btn');
const infoView = document.getElementById('info-view');
const closeInfoViewBtn = document.getElementById('close-info-view');

const modeStandardBtn = document.getElementById('mode-standard-btn');
const modeScientificBtn = document.getElementById('mode-scientific-btn');

const OPERATION_MAP = {
    '÷': (a, b) => a / b,
    '×': (a, b) => a * b,
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
};

const mathFunctions = {
    PI: Math.PI,
    E: Math.E,
    sqrt: Math.sqrt,
    log: (x) => Math.log10(x),
    ln: (x) => Math.log(x),
    sin: (x) => isDegreeMode ? Math.sin(x * Math.PI / 180) : Math.sin(x),
    cos: (x) => isDegreeMode ? Math.cos(x * Math.PI / 180) : Math.cos(x),
    tan: (x) => isDegreeMode ? Math.tan(x * Math.PI / 180) : Math.tan(x)
};

const scientificButtonsData = [
    { text: 'INV', class: 'function', value: 'INV' },
    { text: 'deg', class: 'function', value: 'toggleDegRad' },
    { text: 'e', class: 'function', value: 'E' },
    { text: 'log', class: 'function', value: 'log(' },
    { text: 'ln', class: 'function', value: 'ln(' },
    
    
    { text: 'sin', class: 'function', value: 'sin(' },
    { text: 'cos', class: 'function', value: 'cos(' },
    { text: 'tan', class: 'function', value: 'tan(' },
    { text: 'x²', class: 'function', value: '**2' },
    { text: 'xʸ', class: 'function', value: '**' },
    
    { text: '(', class: 'operator', value: '(' },
    { text: ')', class: 'operator', value: ')' },
    { text: '!', class: 'function', value: '!' },
    { text: '√', class: 'function', value: 'sqrt(' },
    { text: 'π', class: 'function', value: 'PI' },
    
    { text: '8', class: 'number', value: '8' },
    { text: '9', class: 'number', value: '9' },
    { text: '7', class: 'number', value: '7' },
    { text: '⌫', class: 'clear', value: 'DEL' },
    { text: 'AC', class: 'clear', value: 'AC' },
    
    { text: '4', class: 'number', value: '4' },
    { text: '5', 'class': 'number', value: '5' },
    { text: '6', class: 'number', value: '6' },
    { text: '×', class: 'operator', value: '×' },
    { text: '÷', class: 'operator', value: '÷' },
    
    { text: '1', class: 'number', value: '1' },
    { text: '2', class: 'number', value: '2' },
    { text: '3', class: 'number', value: '3' },
    { text: '−', class: 'operator', value: '-' },
    { text: '+', class: 'operator', value: '+' },

    { text: '±', class: 'operator', value: '±' },
    { text: '0', class: 'number', value: '0' },
    { text: '.', class: 'number', value: '.' },
    { text: '%', class: 'function', value: '%' },
    { text: '=', class: 'equal', value: '=' }
];

const standardButtonsData = [

    { text: 'AC', class: 'all-clear', value: 'AC' },
    { text: '±', class: 'aux-btn', value: 'sign' },
    { text: '%', class: 'function', value: '%' }, 
    { text: '÷', class: 'operator', value: '÷' },

    { text: '7', class: 'number', value: '7' },
    { text: '8', class: 'number', value: '8' },
    { text: '9', class: 'number', value: '9' },
    { text: '×', class: 'operator', value: '×' },

    { text: '4', class: 'number', value: '4' },
    { text: '5', class: 'number', value: '5' },
    { text: '6', class: 'number', value: '6' },
    { text: '−', class: 'operator', value: '-' },

    { text: '1', class: 'number', value: '1' },
    { text: '2', class: 'number', value: '2' },
    { text: '3', class: 'number', value: '3' },
    { text: '+', class: 'operator', value: '+' },

    { text: '⌫', class: 'aux-btn', value: 'backspace' },
    { text: '0', class: 'number', value: '0' },
    { text: '.', class: 'decimal', value: '.' },
    { text: '=', class: 'equal', value: '=' }
];


function calculate(firstOperand, secondOperand, operator) {
    if (operator === '÷' && secondOperand === 0) {
        return 'Error';
    }
    return OPERATION_MAP[operator](firstOperand, secondOperand);
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

function updateDisplay() {
    if (isScientificMode) return; 
    
    expressionLine.textContent = calculator.displayValue === 'Error' ? '' : calculator.expression || '';
    resultLine.textContent = calculator.displayValue;
}

function resetCalculator() {
    resetStateForNewInput();
    resultLine.classList.remove('large');
    updateDisplay();
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
                let newExpression = calculator.expression.slice(0, -1);
                calculator.expression = newExpression; 
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


function scientificUpdateScreen() {
    resultLine.textContent = currentScientificInput.replace(/\*\*/g, '^');
    expressionLine.textContent = ''; 
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
}

function handleScientificInput(value) {
    if (value === 'AC') {
        currentScientificInput = '0';
        lastResult = null;
    } else if (value === 'DEL') {
        currentScientificInput = currentScientificInput.slice(0, -1) || '0';
    } else if (value === '=') {
        try {
            let expression = currentScientificInput
                .replace(/π/g, 'PI')
                .replace(/e/g, 'E')
                .replace(/([0-9\)])!/g, (match, p1) => `factorial(${p1})`)
                .replace(/sin\(/g, 'mathFunctions.sin(')
                .replace(/cos\(/g, 'mathFunctions.cos(')
                .replace(/tan\(/g, 'mathFunctions.tan(')
                .replace(/log\(/g, 'mathFunctions.log(')
                .replace(/ln\(/g, 'mathFunctions.ln(')
                .replace(/sqrt\(/g, 'mathFunctions.sqrt(')
                .replace(/×/g, '*')
                .replace(/÷/g, '/');

            expression = expression.replace(/PI/g, 'Math.PI').replace(/E/g, 'Math.E');

            let result = eval(expression); 
            
            if (isNaN(result) || !isFinite(result)) {
                currentScientificInput = 'Error';
            } else {
                currentScientificInput = result.toString();
                lastResult = result;
            }
            expressionLine.textContent = currentScientificInput; 
        } catch (e) {
            currentScientificInput = 'Error';
        }
    } else if (value === 'toggleDegRad') {
        isDegreeMode = !isDegreeMode;
    } else if (value === '±') {
        if (currentScientificInput !== '0' && !isNaN(parseFloat(currentScientificInput))) {
            currentScientificInput = (parseFloat(currentScientificInput) * -1).toString();
        }
    } else if (value === 'INV') {
    } else {
        if (currentScientificInput === '0' && !['.', '(', 'sin(', 'cos(', 'tan(', '**', 'PI', 'E'].includes(value)) {
            currentScientificInput = value;
        } else {
            currentScientificInput += value;
        }
    }
    
    scientificUpdateScreen();
}

function renderButtons(buttonsData) {
    keys.innerHTML = '';
    buttonsData.forEach(btnData => {
        const button = document.createElement('button');
        button.textContent = btnData.text;
        button.className = btnData.class;
        button.setAttribute('type', 'button');
        button.setAttribute('value', btnData.value);
        
        keys.appendChild(button);
    });
}

function toggleScientificMode(enable) {
    if (enable) {
        isScientificMode = true;
        calculatorApp.classList.add('cientifica-view');
        currentScientificInput = '0';
        renderButtons(scientificButtonsData); 
        scientificUpdateScreen();
    } else {
        isScientificMode = false;
        calculatorApp.classList.remove('cientifica-view');
        renderButtons(standardButtonsData); 
        resetCalculator();
        updateDisplay();
    }
}


function handleCalculatorClick(event) {
    const { target } = event; 
    
    if (!target.matches('button')) return;
    const value = target.value;
    if (value === undefined) return;

    if (isScientificMode) {
        handleScientificInput(value);
    } else {
        if (target.classList.contains('operator')) {
            handleOperator(value);
        } else if (target.classList.contains('aux-btn') || target.classList.contains('count-btn')) {
            handleAuxButton(value);
        } else if (target.classList.contains('decimal')) {
            inputDecimal(value);
        } else if (target.classList.contains('all-clear')) {
            resetCalculator();
        } else {
            inputDigit(value);
        }
    }
}

keys.addEventListener('click', handleCalculatorClick);

if (modeScientificBtn) {
    modeScientificBtn.addEventListener('click', () => {
        toggleScientificMode(true);
        closeSideMenu();
    });
}
if (modeStandardBtn) {
    modeStandardBtn.addEventListener('click', () => {
        toggleScientificMode(false);
        closeSideMenu();
    });
}

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
        HISTORY.push({ expression: expression, result: result });
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
        historyItem.innerHTML = `<span class="history-expression">${item.expression}</span><span class="history-result">${item.result}</span>`;
        
        historyItem.addEventListener('click', () => {
            if (isScientificMode) return; 
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
    if (isMenuOpen && !sideMenu.contains(event.target) && !hamburgerBtn.contains(event.target)) {
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
let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

historyFloatingMenu.addEventListener("mousedown", dragStart);
historyFloatingMenu.addEventListener("mouseup", dragEnd);
historyFloatingMenu.addEventListener("mousemove", drag);
historyFloatingMenu.addEventListener("touchstart", dragStart);
historyFloatingMenu.addEventListener("touchend", dragEnd);
historyFloatingMenu.addEventListener("touchmove", drag);

function dragStart(e) {
    const excludeElements = historyFloatingMenu.querySelectorAll('.history-content, button');
    if (Array.from(excludeElements).some(el => el === e.target || el.contains(e.target))) return;
    
    const currentTransform = window.getComputedStyle(historyFloatingMenu).transform;
    const matrix = new DOMMatrixReadOnly(currentTransform);
    xOffset = matrix.m41;
    yOffset = matrix.m42;
    
    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

    initialX = clientX - xOffset;
    initialY = clientY - yOffset;
    
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
        
        const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

        currentX = clientX - initialX;
        currentY = clientY - initialY;
        
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
    calculatorApp.classList.add('hidden');
    libraryView.classList.add('hidden');
    infoView.classList.add('hidden');
    fullScreenView.classList.remove('hidden');
    if (typeof initializeGameListeners === 'function') {
        initializeGameListeners();
    }
});

closeFullscreenViewBtn.addEventListener('click', () => {
    fullScreenView.classList.add('hidden');
    calculatorApp.classList.remove('hidden');
});


const SECTION_NAMES = {
    'aritmetica': 'Aritmética',
    'fracciones': 'Fracciones',
    'aritmetica_suma': 'Suma',
};

const PDF_PATHS = {
    'aritmetica_suma': 'La_suma.pdf', 
};

async function loadLibraryContent() {
    if (libraryContentContainer.children.length > 0 && libraryContentContainer.querySelector('p')?.textContent !== 'Cargando librería...') {
        return;
    }
    try {
        const response = await fetch('libreria.html');
        if (!response.ok) throw new Error(`Error al cargar libreria.html: ${response.statusText}`);
        const html = await response.text();
        libraryContentContainer.innerHTML = html;
        initializeLibraryListeners(); 
    } catch (error) {
        libraryContentContainer.innerHTML = `<p style="color: #FF0000; padding: 20px;">Error al cargar el contenido. Asegúrate de que 'libreria.html' existe.</p>`;
    }
}

if (openLibraryBtn) {
    openLibraryBtn.addEventListener('click', () => {
        closeSideMenu(); 
        modalOptionsOverlay.classList.add('hidden'); 
        fullScreenView.classList.add('hidden'); 
        infoView.classList.add('hidden');
        calculatorApp.classList.add('hidden');
        libraryView.classList.remove('hidden');
        loadLibraryContent();
    });
}

if (closeLibraryViewBtn) {
    closeLibraryViewBtn.addEventListener('click', () => {
        libraryView.classList.add('hidden');
        calculatorApp.classList.remove('hidden');
    });
}

if (openInfoBtn) {
    openInfoBtn.addEventListener('click', () => {
        closeSideMenu(); 
        if (typeof modalOptionsOverlay !== 'undefined') modalOptionsOverlay.classList.add('hidden'); 
        
        calculatorApp.classList.add('hidden');
        libraryView.classList.add('hidden');
        fullScreenView.classList.add('hidden');
        infoView.classList.remove('hidden');
    });
}

if (closeInfoViewBtn) {
    closeInfoViewBtn.addEventListener('click', () => {
        infoView.classList.add('hidden');
        calculatorApp.classList.remove('hidden');
    });
}

function generateSectionContent(sectionId) {
    let htmlContent = '';
    const sectionContent = document.getElementById('section-content');
    if (!sectionContent) return;
    switch (sectionId) {
        case 'aritmetica':
            htmlContent = `
                <button onclick="openDocument('aritmetica_suma')">Suma</button>
                <button onclick="openDocument('aritmetica_resta')">Resta (Próx.)</button>
                <button onclick="openDocument('aritmetica_multiplicacion')">Multiplicación (Próx.)</button>
                <button onclick="openDocument('aritmetica_division')">División (Próx.)</button>
            `;
            break;
        case 'fracciones':
            htmlContent = `
                <button onclick="openDocument('fracciones_suma_resta')">Suma y Resta de Fracciones</button>
                <button onclick="openDocument('fracciones_multiplicacion')">Multiplicación de Fracciones</button>
                <button onclick="openDocument('fracciones_division')">División de Fracciones</button>
            `;
            break;
        default:
            htmlContent = `<p style="text-align: center; color: #999; margin-top: 20px;">No hay subsecciones para ${SECTION_NAMES[sectionId] || sectionId}. Documento no disponible. <br>¡Próximamente!</p>`;
            break;
    }
    sectionContent.innerHTML = htmlContent;
}

window.openSection = function(sectionId) {
    const mainMenu = document.getElementById('main-menu');
    const detailView = document.getElementById('detail-view');
    const detailTitle = document.getElementById('detail-title');
    if (!mainMenu || !detailView || !detailTitle) return;

    if (PDF_PATHS[sectionId]) {
        openDocument(sectionId);
        return;
    }
    
    const needsSubmenu = ['aritmetica', 'fracciones'].includes(sectionId);
    if (needsSubmenu) {
        detailTitle.textContent = SECTION_NAMES[sectionId] || sectionId.toUpperCase();
        generateSectionContent(sectionId);
        mainMenu.classList.add('hidden');
        detailView.classList.remove('hidden');
    } else {
        alert(`Documento de ${SECTION_NAMES[sectionId] || sectionId.toUpperCase()} no disponible.`);
    }
}

window.openDocument = function(documentId) {
    const url = PDF_PATHS[documentId];
    if (!url) {
        const name = SECTION_NAMES[documentId] || documentId.toUpperCase().replace(/_/g, ' ');
        alert(`El documento para ${name} aún no está disponible o la ruta es incorrecta.`);
        return;
    }
    const pdfWindow = window.open(url, '_blank');
    if (!pdfWindow || pdfWindow.closed || typeof pdfWindow.closed == 'undefined') {
        window.location.href = url;
    }
}

window.goBackToMenuLibrary = function() {
    const mainMenu = document.getElementById('main-menu');
    const detailView = document.getElementById('detail-view');
    const sectionContent = document.getElementById('section-content');
    if (!mainMenu || !detailView || !sectionContent) return;
    detailView.classList.add('hidden');
    mainMenu.classList.remove('hidden');
    sectionContent.innerHTML = '';
}

function initializeLibraryListeners() {
    const mainMenu = document.getElementById('main-menu');
    const detailView = document.getElementById('detail-view');
    if (!mainMenu || !detailView) return; 
    const backBtn = detailView.querySelector('.back-btn');
    if (backBtn) {
        backBtn.onclick = window.goBackToMenuLibrary;
    }
}

updateDisplay();
updateHistoryDisplay();



const converterView = document.getElementById('converter-view');
const closeConverterViewBtn = document.getElementById('close-converter-view');
const converterTitle = document.getElementById('converter-title');
const inputValue = document.getElementById('input-value');
const outputValue = document.getElementById('output-value');
const selectFrom = document.getElementById('select-from');
const selectTo = document.getElementById('select-to');
const conversionRateDisplay = document.getElementById('conversion-rate-display');

let currentConverterType = '';

const CONVERSION_FACTORS = {
    'Volumen': {
        'm³': 1,
        'Litro (L)': 0.001,
        'Mililitro (mL)': 0.000001,
        'Galón (US liq)': 0.00378541,
        'Pulgada³ (in³)': 0.0000163871,
        'Pie³ (ft³)': 0.0283168,
    },
    'PesoMasa': {
        'kilogramo (kg)': 1,
        'gramo (g)': 0.001,
        'miligramo (mg)': 0.000001,
        'Tonelada métrica (t)': 1000,
        'Libra (lb)': 0.453592,
        'Onza (oz)': 0.0283495,
    },
    'Longitud': {
        'metro (m)': 1,
        'kilómetro (km)': 1000,
        'centímetro (cm)': 0.01,
        'milímetro (mm)': 0.001,
        'Milla (mi)': 1609.34,
        'Yarda (yd)': 0.9144,
        'Pie (ft)': 0.3048,
        'Pulgada (in)': 0.0254,
    },
    'Tiempo': {
        'segundo (s)': 1,
        'milisegundo (ms)': 0.001,
        'Minuto': 60,
        'Hora': 3600,
        'Día': 86400,
        'Semana': 604800,
        'Año': 31536000,
    },
    'Datos': {
        'Byte (B)': 1,
        'Kilobyte (KB)': 1024,
        'Megabyte (MB)': 1048576,
        'Gigabyte (GB)': 1073741824,
        'Terabyte (TB)': 1099511627776,
        'Bit': 1 / 8, 
    },
    'Temperatura': {
        'Celsius (°C)': 'func',
        'Fahrenheit (°F)': 'func',
        'Kelvin (K)': 'func',
    }
};

function convertTemperature(value, from, to) {
    let k;

    switch (from) {
        case 'Celsius (°C)':
            k = value + 273.15;
            break;
        case 'Fahrenheit (°F)':
            k = (value - 32) * (5 / 9) + 273.15;
            break;
        case 'Kelvin (K)':
            k = value;
            break;
        default:
            return NaN;
    }

    switch (to) {
        case 'Celsius (°C)':
            return k - 273.15;
        case 'Fahrenheit (°F)':
            return (k - 273.15) * (9 / 5) + 32;
        case 'Kelvin (K)':
            return k;
        default:
            return NaN;
    }
}

function populateUnits(converterType) {
    const units = CONVERSION_FACTORS[converterType];
    selectFrom.innerHTML = '';
    selectTo.innerHTML = '';

    if (!units) return;

    const unitKeys = Object.keys(units).sort();

    unitKeys.forEach(unit => {
        const optionFrom = document.createElement('option');
        optionFrom.value = unit;
        optionFrom.textContent = unit;
        selectFrom.appendChild(optionFrom);

        const optionTo = document.createElement('option');
        optionTo.value = unit;
        optionTo.textContent = unit;
        selectTo.appendChild(optionTo);
    });

    if (unitKeys.length > 1) {
        selectTo.value = unitKeys[1];
    }
}

window.convertUnit = function() {
    const value = parseFloat(inputValue.value);
    const fromUnit = selectFrom.value;
    const toUnit = selectTo.value;
    let convertedValue;
    let conversionInfo = '';

    if (isNaN(value)) {
        outputValue.value = 'Ingrese un número';
        conversionRateDisplay.textContent = '';
        return;
    }
    
    if (fromUnit === toUnit) {
        convertedValue = value;
        conversionInfo = '1 ' + fromUnit + ' = 1 ' + toUnit;
    } else if (currentConverterType === 'Temperatura') {
        convertedValue = convertTemperature(value, fromUnit, toUnit);
        conversionRateDisplay.textContent = `Fórmula aplicada: De ${fromUnit} a ${toUnit}`;

    } else {
        const factors = CONVERSION_FACTORS[currentConverterType];
        
        const factorFrom = factors[fromUnit];
        const factorTo = factors[toUnit];
        
        const valueInBase = value * factorFrom;
        convertedValue = valueInBase / factorTo;

        const rate = factorFrom / factorTo;
        conversionInfo = `1 ${fromUnit} ≈ ${rate.toPrecision(6)} ${toUnit}`;
    }

    if (!isNaN(convertedValue)) {
        outputValue.value = convertedValue.toFixed(10).replace(/\.?0+$/, '');
        if (currentConverterType !== 'Temperatura') {
            conversionRateDisplay.textContent = conversionInfo;
        }
    } else {
        outputValue.value = 'Error de Conversión';
        conversionRateDisplay.textContent = 'Unidades o valor no válidos.';
    }
}

window.openConverter = function(type) {
    if (typeof closeSideMenu === 'function') closeSideMenu();
    if (typeof modalOptionsOverlay !== 'undefined') modalOptionsOverlay.classList.add('hidden'); 
    
    calculatorApp.classList.add('hidden');
    libraryView.classList.add('hidden');
    infoView.classList.add('hidden');
    
    currentConverterType = type;
    
    let displayTitle = type;
    if (type === 'PesoMasa') displayTitle = 'Peso y Masa';

    converterTitle.textContent = 'Convertidor de ' + displayTitle;
    
    populateUnits(type);
    inputValue.value = '1';
    
    converterView.classList.remove('hidden');
    convertUnit();
}

closeConverterViewBtn.addEventListener('click', () => {
    converterView.classList.add('hidden');
    calculatorApp.classList.remove('hidden');
});

window.switchUnits = function() {
    const tempUnit = selectFrom.value;
    selectFrom.value = selectTo.value;
    selectTo.value = tempUnit;
    
    convertUnit();
}


updateDisplay();
updateHistoryDisplay();
