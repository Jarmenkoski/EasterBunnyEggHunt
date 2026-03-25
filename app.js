// ===== STATE =====
const state = {
    eggs: [],       // array of { id, dataUrl, name }
    current: 0,     // current egg index (0-based)
    hunting: false,
};

const STORAGE_KEY = 'easterbunny_eggs';

// Finnish congratulation messages
const CONGRATS = [
    'Hienoa! Löysit munan! 🎉',
    'Mahtavaa! Olet todella taitava! ⭐',
    'Vau! Kyllä sinä osaat! 🌟',
    'Upea! Pääsiäispupu on ylpeä sinusta! 🐰',
    'Huikeaa! Löysit munan niin nopeasti! 🚀',
    'Loistavaa! Olet pääsiäisjahtimestari! 🥇',
    'Ihana! Jatka samaan malliin! 🌈',
    'Wau! Olet paras munanetsijä koko maailmassa! 🌍',
];

// Clue messages
const CLUE_MSGS = [
    'Etsi muna tästä paikasta!',
    'Katso tarkkaan – muna odottaa sinua!',
    'Pääsiäispupu piilotti munan tänne!',
    'Oletko tarkkasilmäinen? Etsi muna!',
    'Juokse ja etsi – muna on täällä!',
];

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
    loadEggs();
    setupFileUpload();
    // Animation starts on egg click, not automatically
});

// ===== LOAD / SAVE =====
function loadEggs() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        state.eggs = saved ? JSON.parse(saved) : [];
    } catch (e) {
        state.eggs = [];
    }
}

function saveEggs() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.eggs));
}

// ===== SPEECH =====
function speak(text, pitch = 1.5, rate = 1.0) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fi-FI';
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
}

// ===== EGG CLICK + INTRO ANIMATION =====
let eggClicked = false;

function crackEgg() {
    if (eggClicked) return;
    eggClicked = true;

    const eggEl    = document.getElementById('egg-emoji');
    const bunnyEl  = document.getElementById('bunny-popup');
    const speechEl = document.getElementById('intro-speech');
    const btnStart = document.getElementById('btn-start');
    const hintEl   = document.getElementById('egg-hint');

    hintEl.style.display = 'none';

    // Phase 1: shake
    eggEl.classList.remove('egg-idle');
    eggEl.classList.add('shaking');

    // Phase 2: crack
    setTimeout(() => {
        eggEl.classList.remove('shaking');
        eggEl.textContent = '🐣';
        eggEl.classList.add('cracking');
    }, 1200);

    // Phase 3: bunny pops up
    setTimeout(() => {
        eggEl.style.display = 'none';
        bunnyEl.classList.remove('hidden');
        bunnyEl.classList.add('popping');
    }, 1700);

    // Phase 4: speech bubble + pupu puhuu
    setTimeout(() => {
        speechEl.classList.remove('hidden');
        speechEl.style.animation = 'fadeSlideIn 0.5s ease';
        speak('Hei! Minä olen Pääsiäispupu! Oletko valmis pääsiäismunajahtiiin?');
    }, 2300);

    // Phase 5: start button
    setTimeout(() => {
        btnStart.classList.remove('hidden');
        btnStart.style.animation = 'fadeSlideIn 0.4s ease';
    }, 2900);
}

// ===== SCREEN NAVIGATION =====
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function showIntro() {
    showScreen('screen-intro');
}

function showSettings() {
    renderSettingsList();
    showScreen('screen-settings');
}

// ===== HUNT FLOW =====
function startHunt() {
    if (state.eggs.length === 0) {
        alert('Lisää ensin kuvia asetuksista! ⚙️\n\nNapauta asetukset-painiketta yläkulmassa.');
        return;
    }
    state.current = 0;
    state.hunting = true;
    showClue();
}

function showClue() {
    const egg = state.eggs[state.current];
    const total = state.eggs.length;

    const clueMsg = pickRandom(CLUE_MSGS);
    document.getElementById('clue-image').src = egg.dataUrl;
    document.getElementById('egg-current').textContent = state.current + 1;
    document.getElementById('egg-total').textContent = total;
    document.getElementById('clue-text').textContent = clueMsg;

    showScreen('screen-clue');
    speak(clueMsg);
}

function eggFound() {
    const isLast = state.current >= state.eggs.length - 1;
    const msg = pickRandom(CONGRATS);

    document.getElementById('found-message').textContent = msg;

    // Update "next" button for last egg
    const btnNext = document.getElementById('btn-next');
    if (isLast) {
        btnNext.textContent = '🏆 Katso lopputulos!';
    } else {
        btnNext.textContent = 'Katso seuraava vihje →';
    }

    launchConfetti('confetti-container');
    showScreen('screen-found');
    speak(msg);
}

function nextClue() {
    state.current++;
    if (state.current >= state.eggs.length) {
        showComplete();
    } else {
        showClue();
    }
}

function showComplete() {
    // Fill trophy egg row
    const eggsRow = document.getElementById('final-eggs');
    eggsRow.textContent = '🥚'.repeat(Math.min(state.eggs.length, 12));

    launchConfetti('confetti-container-final');
    showScreen('screen-complete');
    speak('Onneksi olkoon! Löysit kaikki munat! Olet pääsiäismunajahdin mestari!');
}

function restartHunt() {
    state.current = 0;
    eggClicked = false;

    // Reset egg scene
    const eggEl   = document.getElementById('egg-emoji');
    const bunnyEl = document.getElementById('bunny-popup');
    const speechEl = document.getElementById('intro-speech');
    const btnStart = document.getElementById('btn-start');
    const hintEl  = document.getElementById('egg-hint');

    eggEl.style.display = '';
    eggEl.textContent = '🥚';
    eggEl.className = 'egg-emoji egg-idle';
    bunnyEl.className = 'bunny-popup hidden';
    speechEl.classList.add('hidden');
    btnStart.classList.add('hidden');
    hintEl.style.display = '';

    showIntro();
}

// ===== SETTINGS =====
function setupFileUpload() {
    const input = document.getElementById('image-upload');
    input.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        for (const file of files) {
            const dataUrl = await fileToDataUrl(file);
            state.eggs.push({
                id: Date.now() + Math.random(),
                dataUrl,
                name: file.name,
            });
        }
        saveEggs();
        renderSettingsList();
        // Reset the input so same files can be re-added
        input.value = '';
    });
}

function renderSettingsList() {
    const list = document.getElementById('images-list');
    list.innerHTML = '';

    if (state.eggs.length === 0) {
        list.innerHTML = '<div class="empty-state">📭 Ei kuvia vielä.<br>Lisää kuvia piilotetuista munista!</div>';
        return;
    }

    state.eggs.forEach((egg, i) => {
        const item = document.createElement('div');
        item.className = 'image-item';
        item.innerHTML = `
            <img src="${egg.dataUrl}" alt="Muna ${i + 1}">
            <div class="image-item-info">
                <div class="image-item-name">${escapeHtml(egg.name)}</div>
                <div class="image-item-num">Muna nro ${i + 1}</div>
            </div>
            <div class="image-item-actions">
                <button class="btn-icon up" onclick="moveEgg(${i}, -1)" ${i === 0 ? 'disabled' : ''}>▲</button>
                <button class="btn-icon down" onclick="moveEgg(${i}, 1)" ${i === state.eggs.length - 1 ? 'disabled' : ''}>▼</button>
                <button class="btn-icon delete" onclick="deleteEgg(${i})">✕</button>
            </div>
        `;
        list.appendChild(item);
    });
}

function deleteEgg(index) {
    state.eggs.splice(index, 1);
    saveEggs();
    renderSettingsList();
}

function moveEgg(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= state.eggs.length) return;
    const temp = state.eggs[index];
    state.eggs[index] = state.eggs[newIndex];
    state.eggs[newIndex] = temp;
    saveEggs();
    renderSettingsList();
}

function clearAllImages() {
    if (!confirm('Haluatko varmasti poistaa kaikki kuvat?')) return;
    state.eggs = [];
    saveEggs();
    renderSettingsList();
}

// ===== CONFETTI =====
function launchConfetti(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const colors = ['#f4c842', '#ff6b9d', '#5cb85c', '#9b59b6', '#3498db', '#e74c3c', '#ff8c00'];
    const count = 60;

    for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.top = '-20px';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = (6 + Math.random() * 8) + 'px';
        piece.style.height = (6 + Math.random() * 8) + 'px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.animationDuration = (1.5 + Math.random() * 2) + 's';
        piece.style.animationDelay = (Math.random() * 0.8) + 's';
        container.appendChild(piece);
    }

    // Clean up after animation
    setTimeout(() => { container.innerHTML = ''; }, 4000);
}

// ===== UTILS =====
function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
