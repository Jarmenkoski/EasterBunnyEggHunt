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
    'Upea! Pääsiäispupu on ylpeä sinusta!',
    'Huikeaa! Löysit munan niin nopeasti!',
    'Loistavaa! Olet pääsiäisjahtimestari!',
    'Ihana! Jatka samaan malliin! 🌈',
    'Wau! Olet paras munanetsijä koko maailmassa!',
];

const CLUE_MSGS = [
    'Etsi muna tästä paikasta!',
    'Katso tarkkaan – muna odottaa sinua!',
    'Pääsiäispupu piilotti munan tänne!',
    'Oletko tarkkasilmäinen? Etsi muna!',
    'Juokse ja etsi – muna on täällä!',
];

// ===== EGG SVG (intro — ears through shell) =====
function createEggSVG() {
    return `<svg id="egg-inner-svg" viewBox="0 0 220 290"
        xmlns="http://www.w3.org/2000/svg"
        style="width:100%;height:100%;overflow:visible">

  <!-- EARS (drawn first = behind egg) -->
  <ellipse cx="72"  cy="110" rx="26" ry="80" fill="url(#bunnyEarGrad)"      transform="rotate(-14,72,215)" />
  <ellipse cx="72"  cy="107" rx="15" ry="63" fill="url(#bunnyInnerEarGrad)" transform="rotate(-14,72,215)" opacity="0.88"/>
  <ellipse cx="148" cy="110" rx="26" ry="80" fill="url(#bunnyEarGrad)"      transform="rotate(14,148,215)" />
  <ellipse cx="148" cy="107" rx="15" ry="63" fill="url(#bunnyInnerEarGrad)" transform="rotate(14,148,215)" opacity="0.88"/>

  <!-- EGG BODY (over the ear bases) -->
  <ellipse cx="110" cy="210" rx="74" ry="88" fill="url(#eggBodyGrad)" filter="url(#eggGlow)"/>

  <!-- Stripes clipped to egg shape -->
  <g clip-path="url(#eggBodyClip)">
    <rect x="36" y="200" width="148" height="38" fill="#f0c828"/>
    <rect x="36" y="187" width="148" height="8"  fill="white" opacity="0.70"/>
    <rect x="36" y="182" width="148" height="4"  fill="white" opacity="0.38"/>
    <rect x="36" y="238" width="148" height="8"  fill="white" opacity="0.70"/>
    <rect x="36" y="246" width="148" height="4"  fill="white" opacity="0.38"/>
  </g>

  <!-- Egg glossy highlight -->
  <ellipse cx="84" cy="163" rx="22" ry="30" fill="white" opacity="0.26" transform="rotate(-20,84,163)"/>

  <!-- Crack lines (hidden until clicked) -->
  <g id="egg-cracks" style="display:none" opacity="0.65">
    <path d="M110,128 L106,150 L114,164 L107,184" stroke="#4878a0" stroke-width="3"   fill="none" stroke-linecap="round"/>
    <path d="M124,134 L121,153 L127,165"           stroke="#4878a0" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M95,138  L92,157"                     stroke="#4878a0" stroke-width="2"   fill="none" stroke-linecap="round"/>
  </g>

  <!-- Ground shadow -->
  <ellipse cx="110" cy="285" rx="58" ry="7" fill="#608898" opacity="0.16"/>
</svg>`;
}

// ===== BUNNY SVG =====
function createBunnySVG() {
    return `<svg class="bunny-svg" viewBox="0 0 200 245"
        xmlns="http://www.w3.org/2000/svg" aria-label="Pääsiäispupu">

  <!-- Ground shadow -->
  <ellipse cx="100" cy="241" rx="52" ry="6" fill="#8b7355" opacity="0.14"/>

  <!-- EARS -->
  <ellipse cx="65"  cy="65"  rx="23" ry="62" fill="url(#bunnyEarGrad)"      transform="rotate(-10,65,120)"/>
  <ellipse cx="65"  cy="62"  rx="13" ry="48" fill="url(#bunnyInnerEarGrad)" transform="rotate(-10,65,120)" opacity="0.9"/>
  <ellipse cx="65"  cy="60"  rx="7"  ry="33" fill="#d83870"                 transform="rotate(-10,65,120)" opacity="0.15"/>
  <ellipse cx="135" cy="65"  rx="23" ry="62" fill="url(#bunnyEarGrad)"      transform="rotate(10,135,120)"/>
  <ellipse cx="135" cy="62"  rx="13" ry="48" fill="url(#bunnyInnerEarGrad)" transform="rotate(10,135,120)" opacity="0.9"/>
  <ellipse cx="135" cy="60"  rx="7"  ry="33" fill="#d83870"                 transform="rotate(10,135,120)" opacity="0.15"/>

  <!-- HEAD (round, 3D gradient) -->
  <ellipse cx="102" cy="157" rx="72" ry="76" fill="#c0a888" opacity="0.16"/>
  <ellipse cx="100" cy="150" rx="76" ry="76" fill="url(#bunnyHeadGrad)" filter="url(#bunnyShadow)"/>
  <!-- Rim light (right side) -->
  <ellipse cx="158" cy="140" rx="15" ry="30" fill="white" opacity="0.10" transform="rotate(18,158,140)"/>

  <!-- MUZZLE patch -->
  <ellipse cx="100" cy="169" rx="40" ry="33" fill="url(#bunnyMuzzleGrad)" opacity="0.68"/>

  <!-- BODY peek -->
  <ellipse cx="100" cy="226" rx="52" ry="23" fill="url(#bunnyEarGrad)"/>
  <ellipse cx="87"  cy="219" rx="27" ry="15" fill="white" opacity="0.18"/>

  <!-- CHEEKS -->
  <ellipse cx="51"  cy="165" rx="25" ry="14" fill="#ffb0c8" opacity="0.30"/>
  <ellipse cx="149" cy="165" rx="25" ry="14" fill="#ffb0c8" opacity="0.30"/>

  <!-- LEFT EYE -->
  <g class="bunny-eye">
    <ellipse cx="72" cy="131" rx="18" ry="19" fill="#1a0f30" opacity="0.10"/>
    <ellipse cx="72" cy="131" rx="16" ry="17" fill="#ede7f6"/>
    <ellipse cx="72" cy="132" rx="12" ry="13" fill="#4838a0"/>
    <ellipse cx="72" cy="132" rx="9.5" ry="10.5" fill="#5848b8"/>
    <ellipse cx="72" cy="133" rx="7"  ry="8"   fill="#0a0820"/>
    <ellipse cx="76" cy="126" rx="5.5" ry="6"  fill="white" opacity="0.92"/>
    <circle  cx="80" cy="136" r="2.2"           fill="white" opacity="0.52"/>
  </g>

  <!-- RIGHT EYE -->
  <g class="bunny-eye">
    <ellipse cx="128" cy="131" rx="18" ry="19" fill="#1a0f30" opacity="0.10"/>
    <ellipse cx="128" cy="131" rx="16" ry="17" fill="#ede7f6"/>
    <ellipse cx="128" cy="132" rx="12" ry="13" fill="#4838a0"/>
    <ellipse cx="128" cy="132" rx="9.5" ry="10.5" fill="#5848b8"/>
    <ellipse cx="128" cy="133" rx="7"  ry="8"   fill="#0a0820"/>
    <ellipse cx="132" cy="126" rx="5.5" ry="6"  fill="white" opacity="0.92"/>
    <circle  cx="136" cy="136" r="2.2"           fill="white" opacity="0.52"/>
  </g>

  <!-- NOSE (heart shape) -->
  <path d="M100,155 C100,153 97.5,149 93,150 C88.5,151 88.5,157.5 100,165 C111.5,157.5 111.5,151 107,150 C102.5,149 100,153 100,155Z"
        fill="url(#bunnyNoseGrad)"/>
  <ellipse cx="96" cy="153" rx="3" ry="1.8" fill="white" opacity="0.42"/>

  <!-- WHISKER DOTS -->
  <circle cx="86"  cy="162" r="3.5" fill="#c0b8b0" opacity="0.42"/>
  <circle cx="86"  cy="172" r="3.5" fill="#c0b8b0" opacity="0.42"/>
  <circle cx="114" cy="162" r="3.5" fill="#c0b8b0" opacity="0.42"/>
  <circle cx="114" cy="172" r="3.5" fill="#c0b8b0" opacity="0.42"/>

  <!-- WHISKERS -->
  <line x1="26"  y1="160" x2="83"  y2="163" stroke="#a89888" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
  <line x1="28"  y1="168" x2="83"  y2="168" stroke="#a89888" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
  <line x1="26"  y1="176" x2="83"  y2="173" stroke="#a89888" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
  <line x1="117" y1="163" x2="174" y2="160" stroke="#a89888" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
  <line x1="117" y1="168" x2="172" y2="168" stroke="#a89888" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
  <line x1="117" y1="173" x2="174" y2="176" stroke="#a89888" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>

  <!-- MOUTH CLOSED -->
  <g class="mouth-closed-part">
    <path d="M88,175 Q100,185 112,175" stroke="#9c5868" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  </g>

  <!-- MOUTH OPEN -->
  <g class="mouth-open-part" style="display:none">
    <path d="M88,175 Q100,194 112,175" stroke="#9c5868" stroke-width="2" fill="#be7080" stroke-linecap="round"/>
    <rect x="92"    y="175" width="8.5" height="9" fill="#f5f0ec" rx="2"/>
    <rect x="100.5" y="175" width="8.5" height="9" fill="#f5f0ec" rx="2"/>
    <line x1="100.5" y1="175" x2="100.5" y2="184" stroke="#be7080" stroke-width="1.5"/>
    <ellipse cx="100" cy="191" rx="10" ry="5.5" fill="#e87090" opacity="0.72"/>
  </g>
</svg>`;
}

function initBunnies() {
    document.querySelectorAll('[data-bunny-id]').forEach(el => {
        el.innerHTML = createBunnySVG();
    });
}

function initEgg() {
    const eggDiv = document.getElementById('egg-emoji');
    if (eggDiv) eggDiv.innerHTML = createEggSVG();
}

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
    loadEggs();
    setupFileUpload();
    initBunnies();
    initEgg();
    scheduleBlink();
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

// ===== SPEECH + MOUTH ANIMATION =====
let talkInterval = null;

function startMouthAnimation() {
    stopMouthAnimation();
    let open = false;
    talkInterval = setInterval(() => {
        open = !open;
        document.querySelectorAll('.mouth-open-part').forEach(el => el.style.display = open ? '' : 'none');
        document.querySelectorAll('.mouth-closed-part').forEach(el => el.style.display = open ? 'none' : '');
    }, 165);
}

function stopMouthAnimation() {
    if (talkInterval) { clearInterval(talkInterval); talkInterval = null; }
    document.querySelectorAll('.mouth-open-part').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.mouth-closed-part').forEach(el => el.style.display = '');
}

function speak(text, pitch = 1.5, rate = 1.0) {
    window.speechSynthesis.cancel();
    stopMouthAnimation();

    // Face forward during speech
    document.querySelectorAll('.bunny-svg').forEach(b => b.classList.add('bunny-speaking'));

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fi-FI';
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = 1;

    // Mouth moves ONLY when audio actually starts
    utterance.onstart = () => startMouthAnimation();

    utterance.onend = () => {
        stopMouthAnimation();
        setTimeout(() => {
            document.querySelectorAll('.bunny-svg').forEach(b => b.classList.remove('bunny-speaking'));
        }, 500);
    };
    utterance.onerror = () => {
        stopMouthAnimation();
        document.querySelectorAll('.bunny-svg').forEach(b => b.classList.remove('bunny-speaking'));
    };

    window.speechSynthesis.speak(utterance);
}

// ===== BLINK =====
let blinkTimer = null;

function scheduleBlink() {
    const delay = 2200 + Math.random() * 5000;
    blinkTimer = setTimeout(() => {
        triggerBlink();
        scheduleBlink();
    }, delay);
}

function triggerBlink() {
    document.querySelectorAll('.bunny-eye').forEach(eye => {
        eye.classList.add('blinking');
        setTimeout(() => eye.classList.remove('blinking'), 200);
    });
}

// ===== EGG CLICK + INTRO ANIMATION =====
let eggClicked = false;

function crackEgg() {
    if (eggClicked) return;
    eggClicked = true;

    const eggDiv  = document.getElementById('egg-emoji');
    const bunnyEl = document.getElementById('bunny-popup');
    const speechEl = document.getElementById('intro-speech');
    const btnStart = document.getElementById('btn-start');
    const hintEl  = document.getElementById('egg-hint');

    hintEl.style.display = 'none';

    // Phase 1: shake
    eggDiv.classList.remove('egg-idle');
    eggDiv.classList.add('shaking');

    // Phase 2: show cracks
    setTimeout(() => {
        eggDiv.classList.remove('shaking');
        const cracks = document.getElementById('egg-cracks');
        if (cracks) cracks.style.display = '';
        eggDiv.classList.add('cracking');
    }, 1200);

    // Phase 3: egg gone, bunny pops up
    setTimeout(() => {
        eggDiv.style.display = 'none';
        bunnyEl.classList.remove('hidden');
        bunnyEl.classList.add('popping');
    }, 1700);

    // Phase 4: speech bubble
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

function showIntro() { showScreen('screen-intro'); }

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
    const clueMsg = pickRandom(CLUE_MSGS);

    document.getElementById('clue-image').src = egg.dataUrl;
    document.getElementById('egg-current').textContent = state.current + 1;
    document.getElementById('egg-total').textContent = state.eggs.length;
    document.getElementById('clue-text').textContent = clueMsg;

    showScreen('screen-clue');
    speak(clueMsg);
}

function eggFound() {
    const isLast = state.current >= state.eggs.length - 1;
    const msg = pickRandom(CONGRATS);

    document.getElementById('found-message').textContent = msg;
    document.getElementById('btn-next').textContent = isLast
        ? '🏆 Katso lopputulos!'
        : 'Katso seuraava vihje →';

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
    document.getElementById('final-eggs').textContent = '🥚'.repeat(Math.min(state.eggs.length, 12));
    launchConfetti('confetti-container-final');
    showScreen('screen-complete');
    speak('Onneksi olkoon! Löysit kaikki munat! Olet pääsiäismunajahdin mestari! Hauskaa pääsiäistä Joona ja Jolanda!');
}

function restartHunt() {
    state.current = 0;
    eggClicked = false;
    stopMouthAnimation();

    const eggDiv  = document.getElementById('egg-emoji');
    const bunnyEl = document.getElementById('bunny-popup');
    const speechEl = document.getElementById('intro-speech');
    const btnStart = document.getElementById('btn-start');
    const hintEl  = document.getElementById('egg-hint');

    eggDiv.style.display = '';
    eggDiv.innerHTML = createEggSVG();
    eggDiv.className = 'egg-emoji egg-idle';
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
        for (const file of Array.from(e.target.files)) {
            const dataUrl = await fileToDataUrl(file);
            state.eggs.push({ id: Date.now() + Math.random(), dataUrl, name: file.name });
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
                <button class="btn-icon up"     onclick="moveEgg(${i},-1)" ${i === 0 ? 'disabled' : ''}>▲</button>
                <button class="btn-icon down"   onclick="moveEgg(${i}, 1)" ${i === state.eggs.length-1 ? 'disabled' : ''}>▼</button>
                <button class="btn-icon delete" onclick="deleteEgg(${i})">✕</button>
            </div>`;
        list.appendChild(item);
    });
}

function deleteEgg(index) {
    state.eggs.splice(index, 1);
    saveEggs();
    renderSettingsList();
}

function moveEgg(index, direction) {
    const ni = index + direction;
    if (ni < 0 || ni >= state.eggs.length) return;
    [state.eggs[index], state.eggs[ni]] = [state.eggs[ni], state.eggs[index]];
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
    const colors = ['#f4c842','#ff6b9d','#5cb85c','#9b59b6','#3498db','#e74c3c','#ff8c00'];
    for (let i = 0; i < 60; i++) {
        const p = document.createElement('div');
        p.className = 'confetti-piece';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = '-20px';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.width  = (6 + Math.random() * 8) + 'px';
        p.style.height = (6 + Math.random() * 8) + 'px';
        p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        p.style.animationDuration = (1.5 + Math.random() * 2) + 's';
        p.style.animationDelay   = (Math.random() * 0.8) + 's';
        container.appendChild(p);
    }
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

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
