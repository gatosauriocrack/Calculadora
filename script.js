let expression = "";
let historial = [];
let counter = 0; // Variable para el contador
const display = document.getElementById('display');
const mainMenu = document.getElementById('main-menu');
const historyMenu = document.getElementById('history-menu');
const historialItems = document.getElementById('historial-items');
const sideMenu = document.getElementById('side-menu');
const normalButtons = document.getElementById('normal-buttons');
const scientificButtons = document.getElementById('scientific-buttons');
const calculatorView = document.getElementById('calculator-view');

const volumeModule = document.getElementById('volume-module');
const massModule = document.getElementById('mass-module');
const lengthModule = document.getElementById('length-module');
const temperatureModule = document.getElementById('temperature-module');
const timeModule = document.getElementById('time-module');
const dataModule = document.getElementById('data-module');
const imageVaultModule = document.getElementById('image-vault-module');
const gamesModule = document.getElementById('games-module');
const webBrowserModule = document.getElementById('web-browser-module');
const fileGallery = document.getElementById('file-gallery');
const fileInput = document.getElementById('file-input');
const importInput = document.getElementById('import-input');
const vaultMenu = document.getElementById('vault-menu');

const fileModal = document.getElementById('file-modal');
const modalContent = document.getElementById('modal-content');

const foldersBar = document.getElementById('folders-bar');
const vaultTitle = document.getElementById('vault-title');

const mainMenuButton = document.getElementById('main-menu-button');
const sideMenuButton = document.getElementById('side-menu-button');
const vaultMenuButton = document.getElementById('vault-menu-button');

const gamesMenuList = document.getElementById('games-menu-list');
const tictactoeGame = document.getElementById('tictactoe-game');
const tictactoeStatus = document.getElementById('tictactoe-status');
const tictactoeBoard = document.getElementById('tictactoe-board');

let currentFolder = 'Principal';

// Lógica para cerrar menús al hacer clic fuera
document.addEventListener('click', function(event) {
    const isClickInsideMainMenu = mainMenu.contains(event.target) || mainMenuButton.contains(event.target);
    const isClickInsideVaultMenu = vaultMenu.contains(event.target) || vaultMenuButton.contains(event.target);
    const isClickInsideHistoryMenu = historyMenu.contains(event.target);
    const isClickInsideSideMenu = sideMenu.contains(event.target) || sideMenuButton.contains(event.target);
    
    if (!isClickInsideMainMenu && !isClickInsideVaultMenu && !isClickInsideHistoryMenu && !isClickInsideSideMenu) {
        closeAllMenus();
    }
});

function closeAllMenus() {
    mainMenu.style.display = "none";
    vaultMenu.style.display = "none";
    historyMenu.style.display = "none";
    sideMenu.classList.remove('visible');
}

// Función para el nuevo contador de clics
function incrementCounter() {
    counter++;
    display.value = counter;
    expression = counter.toString(); // Actualizar la expresión para que el AC y ← funcionen
}

function updateDisplay(value) {
    if (value === 'backspace') {
        expression = expression.slice(0, -1);
    } else if (value === 'AC') {
        expression = "";
        counter = 0; // Reiniciar el contador
    } else if (value === '+/-') {
        if (expression !== "" && !isNaN(expression)) {
            expression = (parseFloat(expression) * -1).toString();
        }
    } else if (value === 'pi') {
        expression += Math.PI;
    } else if (value === '10^') {
        expression += 'Math.pow(10,';
    } else if (value === 'sqrt(') {
        expression += 'Math.sqrt(';
    } else if (value === 'cbrt(') {
        expression += 'Math.cbrt(';
    } else if (value === 'ln(') {
        expression += 'Math.log(';
    } else if (value === 'lg') {
        expression += 'Math.log10(';
    } else if (value === 'rad(') {
        alert("La función 'rad' no está implementada.");
    } else if (value === 'sin(') {
        expression += 'Math.sin(';
    } else if (value === 'cos(') {
        expression += 'Math.cos(';
    } else if (value === 'tan(') {
        expression += 'Math.tan(';
    } else if (value === 'x^2') {
        expression += '**2';
    } else if (value === 'x^3') {
        expression += '**3';
    } else if (value === 'pow(') {
        expression += '**';
    } else if (value === '!') {
        expression += '!';
    } else if (value === '%') {
        expression = '(' + expression + ') / 100';
    } else if (value === '1/') {
        expression = '1/(' + expression + ')';
    } else {
        expression += value;
    }
    display.value = expression;
}

function factorial(n) {
    if (n === 0 || n === 1) {
        return 1;
    }
    if (n < 0) {
        return NaN;
    }
    let res = 1;
    for (let i = 2; i <= n; i++) {
        res *= i;
    }
    return res;
}

function calculate() {
    try {
        if (expression === '...-') {
            showVault();
            expression = "";
            display.value = "";
            return;
        }

        let exprToEval = expression.replace(/x/g, '*').replace(/÷/g, '/');
        
        if (exprToEval.includes('!')) {
            const parts = exprToEval.split('!');
            const num = parseInt(parts[0]);
            const factResult = factorial(num);
            exprToEval = factResult.toString();
        }

        let result = eval(exprToEval);
        let operacionCompleta = expression + " = " + result;
        historial.push(operacionCompleta);
        display.value = result;
        expression = result.toString();
    } catch (error) {
        display.value = "Error";
        expression = "";
    }
}

function toggleMenu() {
    closeAllMenus();
    if (mainMenu.style.display === "flex") {
        mainMenu.style.display = "none";
    } else {
        mainMenu.style.display = "flex";
    }
}

function toggleVaultMenu() {
    closeAllMenus();
    if (vaultMenu.style.display === "flex") {
        vaultMenu.style.display = "none";
    } else {
        vaultMenu.style.display = "flex";
    }
}

function showHistoryMenu() {
    mainMenu.style.display = "none";
    historialItems.innerHTML = '';
    historial.forEach(item => {
        const p = document.createElement('div');
        p.textContent = item;
        p.classList.add('historial-item');
        historialItems.appendChild(p);
    });
    historyMenu.style.display = "flex";
}

function hideHistoryMenu() {
    historyMenu.style.display = "none";
}

function toggleSideMenu() {
    if (sideMenu.classList.contains('visible')) {
        sideMenu.classList.remove('visible');
    } else {
        closeAllMenus();
        sideMenu.classList.add('visible');
    }
}

function hideSideMenu() {
    sideMenu.classList.remove('visible');
}

function toggleCalculatorView(mode) {
    hideAllModules();
    calculatorView.style.display = 'block';

    if (mode === 'normal') {
        normalButtons.classList.remove('hidden');
        scientificButtons.classList.add('hidden');
    } else if (mode === 'scientific') {
        normalButtons.classList.add('hidden');
        scientificButtons.classList.remove('hidden');
    }
    hideSideMenu();
}

function hideAllModules() {
    calculatorView.style.display = 'none';
    volumeModule.style.display = 'none';
    massModule.style.display = 'none';
    lengthModule.style.display = 'none';
    temperatureModule.style.display = 'none';
    timeModule.style.display = 'none';
    dataModule.style.display = 'none';
    imageVaultModule.style.display = 'none';
    gamesModule.style.display = 'none';
    webBrowserModule.style.display = 'none';
}

function showConversionModule(moduleName) {
    hideAllModules();
    if (moduleName === 'volume') {
        volumeModule.style.display = 'flex';
    } else if (moduleName === 'mass') {
        massModule.style.display = 'flex';
    } else if (moduleName === 'length') {
        lengthModule.style.display = 'flex';
    } else if (moduleName === 'temperature') {
        temperatureModule.style.display = 'flex';
    } else if (moduleName === 'time') {
        timeModule.style.display = 'flex';
    } else if (moduleName === 'data') {
        dataModule.style.display = 'flex';
    }
    hideSideMenu();
}

function showVault() {
    hideAllModules();
    imageVaultModule.style.display = 'flex';
    loadVaultData();
}

function exitVault() {
    hideAllModules();
    toggleCalculatorView('normal');
}

function showGamesModule() {
    hideAllModules();
    gamesModule.style.display = 'flex';
    gamesMenuList.style.display = 'flex';
    tictactoeGame.style.display = 'none';
    hideSideMenu();
}

function showWebBrowserModule() {
    hideAllModules();
    webBrowserModule.style.display = 'flex';
    hideSideMenu();
}

function loadURL() {
    let url = document.getElementById('url-input').value;
    if (url.trim() === '') {
        alert('Por favor, ingresa una URL.');
        return;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    document.getElementById('web-frame').src = url;
}

function exitGames() {
    hideAllModules();
    toggleCalculatorView('normal');
}

// --- Lógica de la bóveda (Actualizada para exportar/importar) ---
fileInput.addEventListener('change', handleFileUpload);
importInput.addEventListener('change', handleImport);

function getVaultData() {
    const vaultData = localStorage.getItem('vault');
    return vaultData ? JSON.parse(vaultData) : { 'Principal': [] };
}

function saveVaultData(data) {
    localStorage.setItem('vault', JSON.stringify(data));
}

function loadVaultData() {
    const vaultData = getVaultData();
    
    // Renderizar carpetas
    let folderButtonsHtml = '<button class="folder-button" onclick="createFolder()">+ Crear Carpeta</button>';
    for (const folderName in vaultData) {
        const isActive = folderName === currentFolder ? 'active' : '';
        folderButtonsHtml += `<button class="folder-button ${isActive}" onclick="selectFolder('${folderName}')">
            ${folderName}
            <span class="folder-action-icon" onclick="event.stopPropagation(); renameFolder('${folderName}')">✏️</span>
            ${folderName !== 'Principal' ? `<span class="folder-action-icon delete-icon" onclick="event.stopPropagation(); deleteFolder('${folderName}')">🗑️</span>` : ''}
        </button>`;
    }
    foldersBar.innerHTML = folderButtonsHtml;
    vaultTitle.textContent = 'Bóveda de archivos (' + currentFolder + ')';
    
    // Renderizar archivos de la carpeta actual
    fileGallery.innerHTML = '';
    if (vaultData[currentFolder]) {
        vaultData[currentFolder].forEach(fileObj => {
            displayFile(fileObj);
        });
    }
}

function createFolder() {
    const folderName = prompt("Escribe el nombre de la nueva carpeta:");
    if (folderName) {
        const vaultData = getVaultData();
        if (!vaultData[folderName]) {
            vaultData[folderName] = [];
            saveVaultData(vaultData);
            selectFolder(folderName);
        } else {
            alert('Esa carpeta ya existe.');
        }
    }
}

function renameFolder(oldName) {
    const newName = prompt(`Escribe el nuevo nombre para la carpeta "${oldName}":`);
    if (newName && newName !== oldName) {
        const vaultData = getVaultData();
        if (!vaultData[newName]) {
            vaultData[newName] = vaultData[oldName];
            delete vaultData[oldName];
            saveVaultData(vaultData);
            currentFolder = newName;
            loadVaultData();
        } else {
            alert('Ya existe una carpeta con ese nombre.');
        }
    }
}

function deleteFolder(folderName) {
    if (folderName === 'Principal') {
        alert('No se puede eliminar la carpeta Principal.');
        return;
    }

    if (confirm(`¿Estás seguro de que quieres eliminar la carpeta "${folderName}" y todo su contenido? Esta acción no se puede deshacer.`)) {
        const vaultData = getVaultData();
        delete vaultData[folderName];
        saveVaultData(vaultData);
        currentFolder = 'Principal';
        loadVaultData();
        alert(`La carpeta "${folderName}" ha sido eliminada.`);
    }
}

function selectFolder(folderName) {
    currentFolder = folderName;
    loadVaultData();
}

function handleFileUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) {
        return;
    }

    const vaultData = getVaultData();
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function(e) {
            if (!vaultData[currentFolder]) {
                vaultData[currentFolder] = [];
            }
            const fileObj = {
                name: file.name,
                url: e.target.result,
                size: file.size,
                type: file.type,
                date: new Date().toLocaleString()
            };
            vaultData[currentFolder].push(fileObj);
            saveVaultData(vaultData);
            loadVaultData();
        };
        reader.readAsDataURL(file);
    }
}

function exportVault() {
    const vaultData = getVaultData();
    const dataStr = JSON.stringify(vaultData, null, 2);
    const blob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'boveda.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('¡Bóveda exportada! El archivo boveda.json ha sido descargado.');
    toggleVaultMenu();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            // Opcional: validar que el objeto importado tenga la estructura correcta
            if (typeof importedData === 'object' && !Array.isArray(importedData)) {
                saveVaultData(importedData);
                currentFolder = 'Principal';
                loadVaultData();
                alert('¡Bóveda importada con éxito!');
                toggleVaultMenu();
            } else {
                alert('El archivo seleccionado no es un archivo de bóveda válido.');
            }
        } catch (error) {
            alert('Error al leer el archivo. Asegúrate de que es un archivo .json válido.');
            console.error('Error de importación:', error);
        }
    };
    reader.readAsText(file);
}

function getFileMimeType(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
        case 'jpg':
        case 'jpeg': return 'image/jpeg';
        case 'png': return 'image/png';
        case 'gif': return 'image/gif';
        case 'mp4': return 'video/mp4';
        case 'mp3': return 'audio/mpeg';
        case 'pdf': return 'application/pdf';
        case 'txt': return 'text/plain';
        default: return 'application/octet-stream';
    }
}

function displayFile(fileObj) {
    const container = document.createElement('div');
    container.classList.add('file-item');
    
    let mediaHtml = '';
    if (fileObj.type.startsWith('image/')) {
        mediaHtml = `<img class="file-item-media" src="${fileObj.url}" alt="${fileObj.name}" onclick="showFullFile('${fileObj.url}', '${fileObj.type}')">`;
    } else if (fileObj.type.startsWith('video/')) {
        mediaHtml = `<video class="file-item-media" src="${fileObj.url}" preload="metadata" onclick="showFullFile('${fileObj.url}', '${fileObj.type}')"></video>`;
    } else {
        mediaHtml = `<div class="file-item-media" style="background-color: #555; display: flex; align-items: center; justify-content: center; font-size: 40px;">📄</div>`;
    }

    container.innerHTML = `
        ${mediaHtml}
        <div class="file-item-info">
            <span class="file-name">${fileObj.name}</span>
        </div>
        <div class="file-item-actions">
            <button onclick="event.stopPropagation(); renameFile('${fileObj.name}')">✏️</button>
            <button onclick="event.stopPropagation(); showFileInfo('${fileObj.name}')">ℹ️</button>
            <button onclick="event.stopPropagation(); moveFile('${fileObj.name}')">➡️</button>
            <button onclick="event.stopPropagation(); downloadFile('${fileObj.name}')">⬇️</button>
            <button onclick="event.stopPropagation(); deleteFile('${fileObj.name}')">🗑️</button>
        </div>
    `;
    fileGallery.appendChild(container);
}

function renameFile(fileName) {
    const newName = prompt(`Escribe el nuevo nombre para "${fileName}":`);
    if (newName && newName !== fileName) {
        const vaultData = getVaultData();
        const fileIndex = vaultData[currentFolder].findIndex(f => f.name === fileName);
        if (fileIndex > -1) {
            vaultData[currentFolder][fileIndex].name = newName;
            saveVaultData(vaultData);
            loadVaultData();
        }
    }
}

function showFileInfo(fileName) {
    const vaultData = getVaultData();
    const fileObj = vaultData[currentFolder].find(f => f.name === fileName);
    if (fileObj) {
        modalContent.innerHTML = `
            <div class="info-panel">
                <h4>Información del archivo</h4>
                <p><strong>Nombre:</strong> ${fileObj.name}</p>
                <p><strong>Tamaño:</strong> ${(fileObj.size / 1024).toFixed(2)} KB</p>
                <p><strong>Tipo:</strong> ${fileObj.type}</p>
                <p><strong>Fecha:</strong> ${fileObj.date}</p>
            </div>
        `;
        modalContent.classList.add('info-panel');
        fileModal.style.display = 'flex';
    }
}

function downloadFile(fileName) {
    const vaultData = getVaultData();
    const fileObj = vaultData[currentFolder].find(f => f.name === fileName);
    if (fileObj) {
        const a = document.createElement('a');
        a.href = fileObj.url;
        a.download = fileObj.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

function moveFile(fileName) {
    const vaultData = getVaultData();
    const folders = Object.keys(vaultData);
    const destinationFolder = prompt(`Mover "${fileName}" a:\n${folders.join('\n')}`);
    
    if (destinationFolder && folders.includes(destinationFolder)) {
        const fileIndex = vaultData[currentFolder].findIndex(f => f.name === fileName);
        if (fileIndex > -1) {
            const fileObj = vaultData[currentFolder].splice(fileIndex, 1)[0];
            vaultData[destinationFolder].push(fileObj);
            saveVaultData(vaultData);
            loadVaultData();
        }
    } else if (destinationFolder) {
        alert("Carpeta no encontrada.");
    }
}

function deleteFile(fileName) {
    if (confirm(`¿Estás seguro de que quieres eliminar "${fileName}"?`)) {
        const vaultData = getVaultData();
        const fileIndex = vaultData[currentFolder].findIndex(f => f.name === fileName);
        if (fileIndex > -1) {
            vaultData[currentFolder].splice(fileIndex, 1);
            saveVaultData(vaultData);
            loadVaultData();
        }
    }
}

// Funciones del modal
function showFullFile(url, type) {
    modalContent.innerHTML = '';
    modalContent.classList.remove('info-panel');
    
    if (type.startsWith('image/')) {
        modalContent.innerHTML = `<img src="${url}" class="modal-content">`;
    } else if (type.startsWith('video/')) {
        modalContent.innerHTML = `<video src="${url}" class="modal-content" controls autoplay></video>`;
    } else {
            modalContent.innerHTML = `<div class="info-panel">
                                        <h4>Vista previa no disponible</h4>
                                        <p>El tipo de archivo (${type}) no se puede mostrar. Puedes descargarlo para verlo.</p>
                                        </div>`;
    }
    fileModal.style.display = 'flex';
}

function closeModal(event) {
    if (event.target === fileModal || event.target.className === 'modal-close') {
        fileModal.style.display = 'none';
        modalContent.innerHTML = '';
    }
}

// --- Lógica del juego Tres en Raya ---
let ticTacToeBoard = [['', '', ''], ['', '', ''], ['', '', '']];
let ticTacToePlayer = 'X';
let isTicTacToeGameOver = false;

function showGame(gameName) {
    gamesMenuList.style.display = 'none';
    if (gameName === 'tictactoe') {
        tictactoeGame.style.display = 'flex';
        resetTicTacToe();
    }
}

function renderTicTacToeBoard() {
    tictactoeBoard.innerHTML = '';
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            const cell = document.createElement('div');
            cell.classList.add('tictactoe-cell');
            cell.textContent = ticTacToeBoard[r][c];
            cell.addEventListener('click', () => handleTicTacToeClick(r, c));
            tictactoeBoard.appendChild(cell);
        }
    }
}

function handleTicTacToeClick(row, col) {
    if (isTicTacToeGameOver || ticTacToeBoard[row][col] !== '') {
        return;
    }

    ticTacToeBoard[row][col] = ticTacToePlayer;
    renderTicTacToeBoard();

    if (checkTicTacToeWinner(ticTacToePlayer)) {
        isTicTacToeGameOver = true;
        tictactoeStatus.textContent = `¡El jugador '${ticTacToePlayer}' ha ganado!`;
    } else if (checkTicTacToeDraw()) {
        isTicTacToeGameOver = true;
        tictactoeStatus.textContent = '¡Empate!';
    } else {
        ticTacToePlayer = ticTacToePlayer === 'X' ? 'O' : 'X';
        tictactoeStatus.textContent = `Turno de '${ticTacToePlayer}'`;
    }
}

function checkTicTacToeWinner(player) {
    // Filas
    for (let i = 0; i < 3; i++) {
        if (ticTacToeBoard[i][0] === player && ticTacToeBoard[i][1] === player && ticTacToeBoard[i][2] === player) return true;
    }
    // Columnas
    for (let i = 0; i < 3; i++) {
        if (ticTacToeBoard[0][i] === player && ticTacToeBoard[1][i] === player && ticTacToeBoard[2][i] === player) return true;
    }
    // Diagonales
    if (ticTacToeBoard[0][0] === player && ticTacToeBoard[1][1] === player && ticTacToeBoard[2][2] === player) return true;
    if (ticTacToeBoard[0][2] === player && ticTacToeBoard[1][1] === player && ticTacToeBoard[2][0] === player) return true;
    return false;
}

function checkTicTacToeDraw() {
    return ticTacToeBoard.flat().every(cell => cell !== '');
}

function resetTicTacToe() {
    ticTacToeBoard = [['', '', ''], ['', '', ''], ['', '', '']];
    ticTacToePlayer = 'X';
    isTicTacToeGameOver = false;
    tictactoeStatus.textContent = "Turno de 'X'";
    renderTicTacToeBoard();
}

// --- Funciones de conversión (se mantienen igual) ---

function convertVolume() {
    const input = parseFloat(document.getElementById('volume-input').value);
    const fromUnit = document.getElementById('volume-from').value;
    const toUnit = document.getElementById('volume-to').value;
    let result;

    if (isNaN(input)) {
        document.getElementById('volume-output').value = "Error";
        return;
    }

    let baseValue;
    switch (fromUnit) {
        case 'liters': baseValue = input; break;
        case 'milliliters': baseValue = input / 1000; break;
        case 'cubic_meters': baseValue = input * 1000; break;
        case 'gallons': baseValue = input * 3.78541; break;
        case 'fluid_ounces': baseValue = input * 0.0295735; break;
    }

    switch (toUnit) {
        case 'liters': result = baseValue; break;
        case 'milliliters': result = baseValue * 1000; break;
        case 'cubic_meters': result = baseValue / 1000; break;
        case 'gallons': result = baseValue / 3.78541; break;
        case 'fluid_ounces': result = baseValue / 0.0295735; break;
    }

    document.getElementById('volume-output').value = result.toFixed(2);
}

function convertMass() {
    const input = parseFloat(document.getElementById('mass-input').value);
    const fromUnit = document.getElementById('mass-from').value;
    const toUnit = document.getElementById('mass-to').value;
    let result;

    if (isNaN(input)) {
        document.getElementById('mass-output').value = "Error";
        return;
    }
    
    let baseValue;
    switch(fromUnit) {
        case 'kg': baseValue = input; break;
        case 'g': baseValue = input / 1000; break;
        case 'mg': baseValue = input / 1e6; break;
        case 'lbs': baseValue = input * 0.453592; break;
        case 'oz': baseValue = input * 0.0283495; break;
        case 'tons': baseValue = input * 907.185; break;
    }

    switch(toUnit) {
        case 'kg': result = baseValue; break;
        case 'g': result = baseValue * 1000; break;
        case 'mg': result = baseValue * 1e6; break;
        case 'lbs': result = baseValue / 0.453592; break;
        case 'oz': result = baseValue / 0.0283495; break;
        case 'tons': result = baseValue / 907.185; break;
    }

    document.getElementById('mass-output').value = result.toFixed(2);
}

function convertLength() {
    const input = parseFloat(document.getElementById('length-input').value);
    const fromUnit = document.getElementById('length-from').value;
    const toUnit = document.getElementById('length-to').value;
    let result;

    if (isNaN(input)) {
        document.getElementById('length-output').value = "Error";
        return;
    }
    
    let baseValue;
    switch(fromUnit) {
        case 'km': baseValue = input * 1000; break;
        case 'm': baseValue = input; break;
        case 'cm': baseValue = input / 100; break;
        case 'mm': baseValue = input / 1000; break;
        case 'mi': baseValue = input * 1609.34; break;
        case 'ft': baseValue = input * 0.3048; break;
        case 'in': baseValue = input * 0.0254; break;
    }

    switch(toUnit) {
        case 'km': result = baseValue / 1000; break;
        case 'm': result = baseValue; break;
        case 'cm': result = baseValue * 100; break;
        case 'mm': result = baseValue * 1000; break;
        case 'mi': result = baseValue / 1609.34; break;
        case 'ft': result = baseValue / 0.3048; break;
        case 'in': result = baseValue / 0.0254; break;
    }

    document.getElementById('length-output').value = result.toFixed(2);
}

function convertTemperature() {
    const input = parseFloat(document.getElementById('temp-input').value);
    const fromUnit = document.getElementById('temp-from').value;
    const toUnit = document.getElementById('temp-to').value;
    let result;

    if (isNaN(input)) {
        document.getElementById('temp-output').value = "Error";
        return;
    }

    let baseValue;
    switch(fromUnit) {
        case 'celsius': baseValue = input; break;
        case 'fahrenheit': baseValue = (input - 32) * 5/9; break;
        case 'kelvin': baseValue = input - 273.15; break;
    }

    switch(toUnit) {
        case 'celsius': result = baseValue; break;
        case 'fahrenheit': result = (baseValue * 9/5) + 32; break;
        case 'kelvin': result = baseValue + 273.15; break;
    }

    document.getElementById('temp-output').value = result.toFixed(2);
}

function convertTime() {
    const input = parseFloat(document.getElementById('time-input').value);
    const fromUnit = document.getElementById('time-from').value;
    const toUnit = document.getElementById('time-to').value;
    let result;

    if (isNaN(input)) {
        document.getElementById('time-output').value = "Error";
        return;
    }
    
    let baseValue;
    switch(fromUnit) {
        case 'seconds': baseValue = input; break;
        case 'minutes': baseValue = input * 60; break;
        case 'hours': baseValue = input * 3600; break;
        case 'days': baseValue = input * 86400; break;
        case 'years': baseValue = input * 31536000; break;
    }

    switch(toUnit) {
        case 'seconds': result = baseValue; break;
        case 'minutes': result = baseValue / 60; break;
        case 'hours': result = baseValue / 3600; break;
        case 'days': result = baseValue / 86400; break;
        case 'years': result = baseValue / 31536000; break;
    }

    document.getElementById('time-output').value = result.toFixed(2);
}

function convertData() {
    const input = parseFloat(document.getElementById('data-input').value);
    const fromUnit = document.getElementById('data-from').value;
    const toUnit = document.getElementById('data-to').value;
    let result;

    if (isNaN(input)) {
        document.getElementById('data-output').value = "Error";
        return;
    }
    
    let baseValue;
    const conversionFactor = 1024;

    switch(fromUnit) {
        case 'bytes': baseValue = input; break;
        case 'kb': baseValue = input * conversionFactor; break;
        case 'mb': baseValue = input * Math.pow(conversionFactor, 2); break;
        case 'gb': baseValue = input * Math.pow(conversionFactor, 3); break;
        case 'tb': baseValue = input * Math.pow(conversionFactor, 4); break;
    }

    switch(toUnit) {
        case 'bytes': result = baseValue; break;
        case 'kb': result = baseValue / conversionFactor; break;
        case 'mb': result = baseValue / Math.pow(conversionFactor, 2); break;
        case 'gb': result = baseValue / Math.pow(conversionFactor, 3); break;
        case 'tb': result = baseValue / Math.pow(conversionFactor, 4); break;
    }

    document.getElementById('data-output').value = result.toFixed(2);
}
