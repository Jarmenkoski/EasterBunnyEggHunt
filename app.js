// ===== STATE =====
const state = {
    eggs: [],
    current: 0,
    hunting: false,
};

const STORAGE_KEY = 'easterbunny_eggs';

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

const CLUE_MSGS = [
    'Etsi muna tästä paikasta!',
    'Katso tarkkaan – muna odottaa sinua!',
    'Pääsiäispupu piilotti munan tänne!',
    'Oletko tarkkasilmäinen? Etsi muna!',
    'Juokse ja etsi – muna on täällä!',
];

// ===== BUNNY SVG =====
function createBunnySVG() {
    return `<svg class="bunny-svg" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-label="Pääsiäispupu">
  <ellipse cx="100" cy="234" rx="52" ry="7" fill="#8b7355" opacity="0.18"/>
  <ellipse cx="66"  cy="68" rx="22" ry="57" fill="url(#bunnyEarGrad)" transform="rotate(-9,66,118)"/>
  <ellipse cx="66"  cy="65" rx="12" ry="43" fill="#f598b5" opacity="0.78" transform="rotate(-9,66,118)"/>
  <ellipse cx="134" cy="68" rx="22" ry="57" fill="url(#bunnyEarGrad)" transform="rotate(9,134,118)"/>
  <ellipse cx="134" cy="65" rx="12" ry="43" fill="#f598b5" opacity="0.78" transform="rotate(9,134,118)"/>
  <ellipse cx="100" cy="148" rx="74" ry="78" fill="url(#bunnyHeadGrad)" filter="url(#bunnyShadow)"/>
  <ellipse cx="100" cy="222" rx="50" ry="22" fill="url(#bunnyEarGrad)"/>
  <ellipse cx="88"  cy="215" rx="26" ry="15" fill="white" opacity="0.22"/>
  <ellipse cx="55"  cy="163" rx="22" ry="13" fill="#ffb0c8" opacity="0.4"/>
  <ellipse cx="145" cy="163" rx="22" ry="13" fill="#ffb0c8" opacity="0.4"/>
  <ellipse cx="72"  cy="134" rx="15" ry="17" fill="#1a1030"/>
  <ellipse cx="73"  cy="134" rx="11" ry="13" fill="#302055"/>
  <ellipse cx="76"  cy="127" rx="6"  ry="7"  fill="white"/>
  <circle  cx="80"  cy="137" r="2"           fill="white" opacity="0.5"/>
  <ellipse cx="128" cy="134" rx="15" ry="17" fill="#1a1030"/>
  <ellipse cx="129" cy="134" rx="11" ry="13" fill="#302055"/>
  <ellipse cx="132" cy="127" rx="6"  ry="7"  fill="white"/>
  <circle  cx="136" cy="137" r="2"           fill="white" opacity="0.5"/>
  <path d="M100,154 C100,152 97,148 93,149 C89,150 89,156 100,163 C111,156 111,150 107,149 C103,148 100,152 100,154Z" fill="#e06880"/>
  <ellipse cx="96" cy="152" rx="3" ry="2" fill="white" opacity="0.4"/>
  <line x1="30"  y1="158" x2="88"  y2="160" stroke="#a89888" stroke-width="1.5" stroke-linecap="round" opacity="0.65"/>
  <line x1="32"  y1="166" x2="88"  y2="165" stroke="#a89888" stroke-width="1.5" stroke-linecap="round" opacity="0.65"/>
  <line x1="30"  y1="174" x2="88"  y2="170" stroke="#a89888" stroke-width="1.5" stroke-linecap="round" opacity="0.65"/>
  <line x1="112" y1="160" x2="170" y2="158" stroke="#a89888" stroke-width="1.5" stroke-linecap="round" opacity="0.65"/>
  <line x1="112" y1="165" x2="168" y2="166" stroke="#a89888" stroke-width="1.5" stroke-linecap="round" opacity="0.65"/>
  <line x1="112" y1="170" x2="170" y2="174" stroke="#a89888" stroke-width="1.5" stroke-linecap="round" opacity="0.65"/>
  <g class="mouth-closed-part">
    <path d="M85,170 Q100,180 115,170" stroke="#c06878" stroke-width="3" fill="none" stroke-linecap="round"/>
  </g>
  <g class="mouth-open-part" style="display:none">
    <path d="M85,170 Q100,188 115,170" stroke="#c06878" stroke-width="2.5" fill="#d07080" stroke-linecap="round"/>
    <rect x="91"  y="170" width="9" height="9" fill="#f5f0ed" rx="2"/>
    <rect x="100" y="170" width="9" height="9" fill="#f5f0ed" rx="2"/>
    <line x1="100" y1="170" x2="100" y2="179" stroke="#d07080" stroke-width="1.5"/>
  </g>
</svg>`;
}

function initBunnies() {
    document.querySelectorAll('[data-bunny-id]').forEach(el => {
        el.innerHTML = createBunnySVG();
    });
}

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
    loadEggs();
    setupFileUpload();
    initBunnies();
    // Animation starts on egg click, not automatically
});

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

// ===== SPEECH + MOUTH ANIMATION =====
let talkInterval = null;

function startMouthAnimation() {
    stopMouthAnimation();
    let open = false;
    talkInterval = setInterval(() => {
        open = !open;
        document.querySelectorAll('.mouth-open-part').forEach(el => el.style.display = open ? '' : 'none');
        document.querySelectorAll('.mouth-closed-part').forEach(el => el.style.display = open ? 'none' : '');
    }, 170);
}

function stopMouthAnimation() {
    if (talkInterval) { clearInterval(talkInterval); talkInterval = null; }
    document.querySelectorAll('.mouth-open-part').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.mouth-closed-part').forEach(el => el.style.display = '');
}

function speak(text, pitch = 1.5, rate = 1.0) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fi-FI';
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = 1;
    utterance.onend = () => stopMouthAnimation();
    utterance.onerror = () => stopMouthAnimation();
    window.speechSynthesis.speak(utterance);
    startMouthAnimation();
}

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

    eggEl.classList.remove('egg-idle');
    eggEl.classList.add('shaking');

    setTimeout(() => {
        eggEl.classList.remove('shaking');
        eggEl.textContent = '🐣';
        eggEl.classList.add('cracking');
    }, 1200);

    setTimeout(() => {
        eggEl.style.display = 'none';
        bunnyEl.classList.remove('hidden');
        bunnyEl.classList.add('popping');
    }, 1700);

    setTimeout(() => {
        speechEl.classList.remove('hidden');
        speechEl.style.animation = 'fadeSlideIn 0.5s ease';
        speak('Hei! Minä olen Pääsiäispupu! Oletko valmis pääsiäismunajahtiiin?');
    }, 2300);

    setTimeout(() => {
        btnStart.classList.remove('hidden');
        btnStart.style.animation = 'fadeSlideIn 0.4s ease';
    }, 2900);
}

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
    const eggsRow = document.getElementById('final-eggs');
    eggsRow.textContent = '🥚'.repeat(Math.min(state.eggs.length, 12));

    launchConfetti('confetti-container-final');
    showScreen('screen-complete');
    speak('Onneksi olkoon! Löysit kaikki munat! Olet pääsiäismunajahdin mestari! Hauskaa pääsiäistä Joona ja Jolanda!');
}

function restartHunt() {
    state.current = 0;
    eggClicked = false;

    const eggEl    = document.getElementById('egg-emoji');
    const bunnyEl  = document.getElementById('bunny-popup');
    const speechEl = document.getElementById('intro-speech');
    const btnStart = document.getElementById('btn-start');
    const hintEl   = document.getElementById('egg-hint');

    eggEl.style.display = '';
    eggEl.textContent = '🥚';
    eggEl.className = 'egg-emoji egg-idle';
    bunnyEl.className = 'bunny-popup hidden';
    speechEl.classList.add('hidden');
    btnStart.classList.add('hidden');
    hintEl.style.display = '';

    showIntro();
}

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

function launchConfetti(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    const colors = ['#f4c842', '#ff6b9d', '#5cb85c', '#9b59b6', '#3498db', '#e74c3c', '#ff8c00'];
    for (let i = 0; i < 60; i++) {
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
    setTimeout(() => { container.innerHTML = ''; }, 4000);
}

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