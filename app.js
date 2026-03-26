// ===== STATE =====
const state = {
    eggs: [],
    current: 0,
    hunting: false,
};

const STORAGE_KEY = 'easterbunny_eggs';
const NAMES_KEY   = 'easterbunny_names';
const VOICE_KEY   = 'easterbunny_voice';

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

  <!-- EARS (behind head) -->
  <ellipse cx="65"  cy="65"  rx="23" ry="63" fill="url(#bunnyEarGrad)"      transform="rotate(-10,65,120)" filter="url(#furEdge)"/>
  <ellipse cx="65"  cy="62"  rx="13" ry="49" fill="url(#bunnyInnerEarGrad)" transform="rotate(-10,65,120)" opacity="0.92"/>
  <ellipse cx="65"  cy="60"  rx="7"  ry="34" fill="#c83060"                 transform="rotate(-10,65,120)" opacity="0.18"/>
  <ellipse cx="135" cy="65"  rx="23" ry="63" fill="url(#bunnyEarGrad)"      transform="rotate(10,135,120)" filter="url(#furEdge)"/>
  <ellipse cx="135" cy="62"  rx="13" ry="49" fill="url(#bunnyInnerEarGrad)" transform="rotate(10,135,120)" opacity="0.92"/>
  <ellipse cx="135" cy="60"  rx="7"  ry="34" fill="#c83060"                 transform="rotate(10,135,120)" opacity="0.18"/>

  <!-- HEAD — ambient occlusion base + main sphere -->
  <ellipse cx="103" cy="158" rx="72" ry="76" fill="#b09878" opacity="0.18"/>
  <ellipse cx="100" cy="150" rx="76" ry="76" fill="url(#bunnyHeadGrad)" filter="url(#furEdge)"/>

  <!-- Subsurface warmth (cheek/lower face glow) -->
  <ellipse cx="83"  cy="162" rx="40" ry="32" fill="#f8d0b8" opacity="0.16" transform="rotate(-12,83,162)"/>
  <!-- Specular highlight top-left -->
  <ellipse cx="74"  cy="110" rx="26" ry="20" fill="white"   opacity="0.15" transform="rotate(-22,74,110)"/>
  <!-- Rim light right edge -->
  <ellipse cx="160" cy="142" rx="14" ry="30" fill="white"   opacity="0.09" transform="rotate(18,160,142)"/>

  <!-- Forehead fur hints -->
  <g fill="none" stroke="#cec6bc" stroke-width="2.2" stroke-linecap="round" opacity="0.28">
    <line x1="83"  y1="76" x2="80"  y2="86"/>
    <line x1="94"  y1="73" x2="92"  y2="83"/>
    <line x1="106" y1="73" x2="108" y2="83"/>
    <line x1="117" y1="76" x2="120" y2="86"/>
  </g>

  <!-- MUZZLE patch -->
  <ellipse cx="100" cy="169" rx="40" ry="33" fill="url(#bunnyMuzzleGrad)" opacity="0.70"/>

  <!-- BODY peek -->
  <ellipse cx="100" cy="226" rx="52" ry="23" fill="url(#bunnyEarGrad)" filter="url(#furEdge)"/>
  <ellipse cx="87"  cy="219" rx="27" ry="15" fill="white" opacity="0.18"/>

  <!-- CHEEKS -->
  <ellipse cx="51"  cy="166" rx="26" ry="15" fill="#ffb0c8" opacity="0.32"/>
  <ellipse cx="149" cy="166" rx="26" ry="15" fill="#ffb0c8" opacity="0.32"/>

  <!-- LEFT EYE -->
  <g class="bunny-eye">
    <!-- Socket shadow -->
    <ellipse cx="72" cy="131" rx="19" ry="20" fill="#180e2e" opacity="0.11"/>
    <!-- Sclera -->
    <ellipse cx="72" cy="131" rx="16" ry="17" fill="#ece6f5"/>
    <!-- Iris layers -->
    <ellipse cx="72" cy="132" rx="12" ry="13" fill="#3828a0"/>
    <ellipse cx="72" cy="132" rx="10" ry="11" fill="#4838b8"/>
    <ellipse cx="72" cy="132" rx="7.5" ry="8.5" fill="#3020a8"/>
    <!-- Pupil -->
    <ellipse cx="72" cy="133" rx="5.5" ry="6.5" fill="#080618"/>
    <!-- Highlights -->
    <ellipse cx="76" cy="126" rx="5.5" ry="6"  fill="white" opacity="0.94"/>
    <ellipse cx="69" cy="137" rx="2.2" ry="1.8" fill="white" opacity="0.58"/>
    <circle  cx="79" cy="138" r="1.6"           fill="white" opacity="0.42"/>
    <!-- Upper eyelid crease -->
    <path d="M56,124 Q72,117 88,124" stroke="#7868a0" stroke-width="1.8" fill="none" opacity="0.42" stroke-linecap="round"/>
  </g>

  <!-- RIGHT EYE -->
  <g class="bunny-eye">
    <ellipse cx="128" cy="131" rx="19" ry="20" fill="#180e2e" opacity="0.11"/>
    <ellipse cx="128" cy="131" rx="16" ry="17" fill="#ece6f5"/>
    <ellipse cx="128" cy="132" rx="12" ry="13" fill="#3828a0"/>
    <ellipse cx="128" cy="132" rx="10" ry="11" fill="#4838b8"/>
    <ellipse cx="128" cy="132" rx="7.5" ry="8.5" fill="#3020a8"/>
    <ellipse cx="128" cy="133" rx="5.5" ry="6.5" fill="#080618"/>
    <ellipse cx="132" cy="126" rx="5.5" ry="6"  fill="white" opacity="0.94"/>
    <ellipse cx="125" cy="137" rx="2.2" ry="1.8" fill="white" opacity="0.58"/>
    <circle  cx="135" cy="138" r="1.6"           fill="white" opacity="0.42"/>
    <path d="M112,124 Q128,117 144,124" stroke="#7868a0" stroke-width="1.8" fill="none" opacity="0.42" stroke-linecap="round"/>
  </g>

  <!-- NOSE (heart shape) -->
  <path d="M100,155 C100,153 97.5,149 93,150 C88.5,151 88.5,157.5 100,165 C111.5,157.5 111.5,151 107,150 C102.5,149 100,153 100,155Z"
        fill="url(#bunnyNoseGrad)"/>
  <!-- Nose highlight -->
  <ellipse cx="96" cy="153" rx="3" ry="1.8" fill="white" opacity="0.44"/>
  <!-- Nostrils -->
  <circle cx="95"  cy="154.5" r="2.2" fill="#8a1a30" opacity="0.65"/>
  <circle cx="105" cy="154.5" r="2.2" fill="#8a1a30" opacity="0.65"/>
  <!-- Philtrum groove -->
  <line x1="100" y1="156" x2="100" y2="164" stroke="#903050" stroke-width="1.4" stroke-linecap="round" opacity="0.4"/>

  <!-- WHISKER DOTS -->
  <circle cx="86"  cy="162" r="3.5" fill="#beb6ae" opacity="0.42"/>
  <circle cx="86"  cy="172" r="3.5" fill="#beb6ae" opacity="0.42"/>
  <circle cx="114" cy="162" r="3.5" fill="#beb6ae" opacity="0.42"/>
  <circle cx="114" cy="172" r="3.5" fill="#beb6ae" opacity="0.42"/>

  <!-- WHISKERS -->
  <line x1="24"  y1="159" x2="83"  y2="163" stroke="#a89888" stroke-width="1.5" stroke-linecap="round" opacity="0.52"/>
  <line x1="26"  y1="167" x2="83"  y2="168" stroke="#a89888" stroke-width="1.5" stroke-linecap="round" opacity="0.52"/>
  <line x1="24"  y1="175" x2="83"  y2="173" stroke="#a89888" stroke-width="1.5" stroke-linecap="round" opacity="0.52"/>
  <line x1="117" y1="163" x2="176" y2="159" stroke="#a89888" stroke-width="1.5" stroke-linecap="round" opacity="0.52"/>
  <line x1="117" y1="168" x2="174" y2="167" stroke="#a89888" stroke-width="1.5" stroke-linecap="round" opacity="0.52"/>
  <line x1="117" y1="173" x2="176" y2="175" stroke="#a89888" stroke-width="1.5" stroke-linecap="round" opacity="0.52"/>

  <!-- MOUTH CLOSED -->
  <g class="mouth-closed-part">
    <path d="M88,175 Q100,185 112,175" stroke="#904858" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  </g>

  <!-- MOUTH OPEN -->
  <g class="mouth-open-part" style="display:none">
    <path d="M88,175 Q100,195 112,175" stroke="#904858" stroke-width="2" fill="#b86878" stroke-linecap="round"/>
    <!-- Teeth -->
    <rect x="92"    y="175" width="8.5" height="10" fill="#f5f0ec" rx="2"/>
    <rect x="100.5" y="175" width="8.5" height="10" fill="#f5f0ec" rx="2"/>
    <line x1="100.5" y1="175" x2="100.5" y2="185" stroke="#b86878" stroke-width="1.5"/>
    <!-- Tongue -->
    <ellipse cx="100" cy="192" rx="10.5" ry="6" fill="#e87090" opacity="0.75"/>
    <ellipse cx="100" cy="191" rx="5"    ry="2.5" fill="#f090a8" opacity="0.5"/>
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

// ===== VOICE SETTINGS =====
function loadVoiceSettings() {
    try {
        const saved = localStorage.getItem(VOICE_KEY);
        return saved ? JSON.parse(saved) : { voiceName: '', pitch: 1.5, rate: 1.0 };
    } catch (e) {
        return { voiceName: '', pitch: 1.5, rate: 1.0 };
    }
}

function saveVoiceSettings(settings) {
    localStorage.setItem(VOICE_KEY, JSON.stringify(settings));
}

function populateVoiceList() {
    const select = document.getElementById('voice-select');
    if (!select) return;

    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) return;

    const saved = loadVoiceSettings();
    select.innerHTML = '';

    // Default option (browser picks Finnish)
    const defOpt = document.createElement('option');
    defOpt.value = '';
    defOpt.textContent = '🌐 Oletus (fi-FI)';
    select.appendChild(defOpt);

    // Finnish voices first
    const fi = voices.filter(v => v.lang.startsWith('fi'));
    if (fi.length > 0) {
        const grp = document.createElement('optgroup');
        grp.label = '🇫🇮 Suomenkieliset';
        fi.forEach(v => {
            const o = document.createElement('option');
            o.value = v.name;
            o.textContent = v.name;
            grp.appendChild(o);
        });
        select.appendChild(grp);
    }

    // All other voices
    const others = voices.filter(v => !v.lang.startsWith('fi'));
    if (others.length > 0) {
        const grp = document.createElement('optgroup');
        grp.label = '🌍 Muut kielet';
        others.forEach(v => {
            const o = document.createElement('option');
            o.value = v.name;
            o.textContent = `${v.name} (${v.lang})`;
            grp.appendChild(o);
        });
        select.appendChild(grp);
    }

    select.value = saved.voiceName || '';
}

function setupVoiceControls() {
    // Populate voices (may need to wait for async load)
    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    const saved = loadVoiceSettings();

    const pitchEl = document.getElementById('voice-pitch');
    const rateEl  = document.getElementById('voice-rate');
    pitchEl.value = saved.pitch;
    rateEl.value  = saved.rate;
    document.getElementById('pitch-val').textContent = saved.pitch;
    document.getElementById('rate-val').textContent  = saved.rate;

    pitchEl.addEventListener('input', () => {
        document.getElementById('pitch-val').textContent = pitchEl.value;
        const s = loadVoiceSettings();
        s.pitch = parseFloat(pitchEl.value);
        saveVoiceSettings(s);
    });
    rateEl.addEventListener('input', () => {
        document.getElementById('rate-val').textContent = rateEl.value;
        const s = loadVoiceSettings();
        s.rate = parseFloat(rateEl.value);
        saveVoiceSettings(s);
    });
    document.getElementById('voice-select').addEventListener('change', (e) => {
        const s = loadVoiceSettings();
        s.voiceName = e.target.value;
        saveVoiceSettings(s);
    });
}

function testVoice() {
    speak('Hei! Minä olen Pääsiäispupu! Hauskaa pääsiäistä!');
}

// ===== NAMES =====
function loadNames() {
    try {
        const saved = localStorage.getItem(NAMES_KEY);
        return saved ? JSON.parse(saved) : { child1: '', child2: '' };
    } catch (e) {
        return { child1: '', child2: '' };
    }
}

function saveNames(names) {
    localStorage.setItem(NAMES_KEY, JSON.stringify(names));
}

function buildGreeting() {
    const { child1, child2 } = loadNames();
    const n1 = child1.trim();
    const n2 = child2.trim();
    if (n1 && n2) return `Hauskaa pääsiäistä ${n1} ja ${n2}!`;
    if (n1)       return `Hauskaa pääsiäistä ${n1}!`;
    if (n2)       return `Hauskaa pääsiäistä ${n2}!`;
    return 'Hauskaa pääsiäistä!';
}

function buildGreetingHtml() {
    const { child1, child2 } = loadNames();
    const n1 = escapeHtml(child1.trim());
    const n2 = escapeHtml(child2.trim());
    if (n1 && n2) return `Hauskaa pääsiäistä <strong>${n1}</strong> ja <strong>${n2}</strong>! 🐣`;
    if (n1)       return `Hauskaa pääsiäistä <strong>${n1}</strong>! 🐣`;
    if (n2)       return `Hauskaa pääsiäistä <strong>${n2}</strong>! 🐣`;
    return 'Hauskaa pääsiäistä! 🐣';
}

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
    loadEggs();
    setupFileUpload();
    setupNameInputs();
    setupVoiceControls();
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

function speak(text) {
    window.speechSynthesis.cancel();
    stopMouthAnimation();

    // Face forward during speech
    document.querySelectorAll('.bunny-svg').forEach(b => b.classList.add('bunny-speaking'));

    const vs = loadVoiceSettings();
    const voices = speechSynthesis.getVoices();
    const voice = vs.voiceName ? voices.find(v => v.name === vs.voiceName) : null;

    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) {
        utterance.voice = voice;
        utterance.lang  = voice.lang;
    } else {
        utterance.lang  = 'fi-FI';
    }
    utterance.pitch  = vs.pitch ?? 1.5;
    utterance.rate   = vs.rate  ?? 1.0;
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
    const names = loadNames();
    document.getElementById('child-name-1').value = names.child1;
    document.getElementById('child-name-2').value = names.child2;
    // Re-populate voices (may have loaded since last open)
    populateVoiceList();
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
    document.getElementById('final-greeting').innerHTML = buildGreetingHtml();
    launchConfetti('confetti-container-final');
    showScreen('screen-complete');
    speak(`Onneksi olkoon! Löysit kaikki munat! Olet pääsiäismunajahdin mestari! ${buildGreeting()}`);
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
function setupNameInputs() {
    ['child-name-1', 'child-name-2'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            saveNames({
                child1: document.getElementById('child-name-1').value,
                child2: document.getElementById('child-name-2').value,
            });
        });
    });
}

function setupFileUpload() {
    const input = document.getElementById('image-upload');
    input.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        for (const file of files) {
            try {
                const dataUrl = await compressImage(file, 1200, 0.80);
                state.eggs.push({ id: Date.now() + Math.random(), dataUrl, name: file.name });
            } catch (err) {
                console.error('Kuvan lukeminen epäonnistui:', err);
            }
        }
        try {
            saveEggs();
        } catch (e) {
            alert('Kuvien tallennus epäonnistui: tallennustila täynnä. Poista vanhoja kuvia.');
        }
        renderSettingsList();
        input.value = '';
    });
}

function compressImage(file, maxPx, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = (ev) => {
            const img = new Image();
            img.onerror = reject;
            img.onload = () => {
                let w = img.width, h = img.height;
                if (w > maxPx || h > maxPx) {
                    if (w >= h) { h = Math.round(h * maxPx / w); w = maxPx; }
                    else        { w = Math.round(w * maxPx / h); h = maxPx; }
                }
                const canvas = document.createElement('canvas');
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
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
