// ===== STATE =====
const state = {
    eggs: [],
    current: 0,
    hunting: false,
};

const STORAGE_KEY = 'easterbunny_eggs';
const NAMES_KEY   = 'easterbunny_names';
const VOICE_KEY   = 'easterbunny_voice';
const RV_KEY      = 'easterbunny_rvkey';

let cachedVoices = [];

const CONGRATS = {
    one: [
        'Hienoa! Löysit munan!',
        'Mahtavaa! Olet todella taitava!',
        'Vau! Kyllä sinä osaat!',
        'Upea! Pääsiäispupu on ylpeä sinusta!',
        'Huikeaa! Löysit munan niin nopeasti!',
        'Loistavaa! Olet pääsiäisjahtimestari!',
        'Ihana! Jatka samaan malliin!',
        'Wau! Olet paras munanetsijä koko maailmassa!',
    ],
    many: [
        'Hienoa! Löysitte munan!',
        'Mahtavaa! Olette todella taitavia!',
        'Vau! Kyllä te osaatte!',
        'Upea! Pääsiäispupu on ylpeä teistä!',
        'Huikeaa! Löysitte munan niin nopeasti!',
        'Loistavaa! Olette pääsiäisjahtimestarit!',
        'Ihana! Jatkakaa samaan malliin!',
        'Wau! Olette parhaat munanetsijät koko maailmassa!',
    ],
};

const CLUE_MSGS = {
    one: [
        'Etsi muna tästä paikasta!',
        'Katso tarkkaan – muna odottaa sinua!',
        'Pääsiäispupu piilotti munan tänne!',
        'Oletko tarkkasilmäinen? Etsi muna!',
        'Juokse ja etsi – muna on täällä!',
    ],
    many: [
        'Etsikää muna tästä paikasta!',
        'Katsokaa tarkkaan – muna odottaa teitä!',
        'Pääsiäispupu piilotti munan tänne!',
        'Oletteko tarkkasilmäisiä? Etsikää muna!',
        'Juoskaa ja etsikää – muna on täällä!',
    ],
};

function plural() { return getNameList().length > 1; }

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

    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) return;
    cachedVoices = voices;

    if (!select) return;

    const saved = loadVoiceSettings();
    select.innerHTML = '';

    // Default option (browser picks Finnish)
    const defOpt = document.createElement('option');
    defOpt.value = '';
    defOpt.textContent = '🌐 Oletus (fi-FI)';
    select.appendChild(defOpt);

    // Normalize lang: Android uses fi_FI, desktop uses fi-FI
    // Normalize lang codes: Android uses fi_FI, desktop uses fi-FI
    function normLang(lang) { return (lang || '').replace(/_/g, '-'); }
    function langBase(lang) { return normLang(lang).split('-')[0].toLowerCase(); }

    function genderLabel(v) {
        const n = v.name.toLowerCase();
        if (n.includes('male') && !n.includes('female')) return ' ♂';
        if (n.includes('female')) return ' ♀';
        if (/-[fm]$/i.test(v.name)) return /f$/i.test(v.name) ? ' ♀' : ' ♂';
        const males   = ['onni','oskari','harri','mikko','juhani','adam','george','daniel','thomas','oliver'];
        const females = ['satu','siiri','elina','anna','liisa','karin','alice','victoria','karen','samantha','moira'];
        const first   = v.name.split(/[-_ ]/)[0].toLowerCase();
        if (males.includes(first))   return ' ♂';
        if (females.includes(first)) return ' ♀';
        return '';
    }

    // Android voices: name = "suomi Suomi" / "assami Intia" (lowercase lang + Title country)
    // Desktop voices: name = "Google UK English Male" / "Satu" / "en-US-Neural2-F"
    function cleanName(v, showCountryIfNeeded, sameFirstWordVoices) {
        const n = v.name;
        // Desktop: starts with uppercase or is a lang-code style (fi-FI-x-...)
        if (/^[A-Z]/.test(n)) {
            // Strip lang prefix from Cloud TTS voices like "en-US-Neural2-F"
            const stripped = n.replace(/^[a-z]{2}-[a-z]{2}-/i, '').trim();
            const suffix = /^x-.*(local|network|language)/i.test(stripped) ? '' : stripped;
            return (suffix && suffix !== n ? `${normLang(v.lang)} ${suffix}` : n) + genderLabel(v);
        }
        if (/^[a-z]{2}[-_]/i.test(n)) {
            // lang-code style: "fi-FI-x-fif-local" → show just lang
            return normLang(v.lang) + genderLabel(v);
        }
        // Android style: "suomi Suomi" → capitalize first word, add country if ambiguous
        const parts = n.split(' ');
        const langPart = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        const countryPart = parts.slice(1).join(' ');
        const needsCountry = showCountryIfNeeded &&
            sameFirstWordVoices.filter(x => x !== v &&
                x.name.split(' ')[0].toLowerCase() === parts[0].toLowerCase()).length > 0;
        return (needsCountry && countryPart ? `${langPart} (${countryPart})` : langPart) + genderLabel(v);
    }

    const LANG_NAMES = {
        fi:'🇫🇮 Suomi',     en:'🇬🇧 Englanti', sv:'🇸🇪 Ruotsi',
        no:'🇳🇴 Norja',     da:'🇩🇰 Tanska',   de:'🇩🇪 Saksa',
        fr:'🇫🇷 Ranska',    es:'🇪🇸 Espanja',   it:'🇮🇹 Italia',
        nl:'🇳🇱 Hollanti',  pt:'🇵🇹 Portugali', ru:'🇷🇺 Venäjä',
        ja:'🇯🇵 Japani',    zh:'🇨🇳 Kiina',     ko:'🇰🇷 Korea',
        ar:'🌙 Arabia',     pl:'🇵🇱 Puola',     cs:'🇨🇿 Tšekki',
        hu:'🇭🇺 Unkari',    tr:'🇹🇷 Turkki',
    };

    // Group voices by language base code
    const byLang = {};
    voices.forEach(v => {
        const key = langBase(v.lang);
        if (!byLang[key]) byLang[key] = [];
        byLang[key].push(v);
    });

    function makeGroup(key, label) {
        const grp = document.createElement('optgroup');
        grp.label = label;
        byLang[key].forEach(v => {
            const o = document.createElement('option');
            o.value = v.name;
            o.textContent = cleanName(v, true, byLang[key]);
            grp.appendChild(o);
        });
        return grp;
    }

    // Finnish voices first
    if (byLang['fi']) select.appendChild(makeGroup('fi', LANG_NAMES['fi']));

    // Known useful languages
    Object.entries(LANG_NAMES).forEach(([key, label]) => {
        if (key !== 'fi' && byLang[key]) select.appendChild(makeGroup(key, label));
    });

    // All other languages in one "Muut" group
    const unknownVoices = voices.filter(v => !LANG_NAMES[langBase(v.lang)]);
    if (unknownVoices.length > 0) {
        const grp = document.createElement('optgroup');
        grp.label = `🌍 Muut (${unknownVoices.length})`;
        unknownVoices.forEach(v => {
            const o = document.createElement('option');
            o.value = v.name;
            o.textContent = cleanName(v, true, unknownVoices);
            grp.appendChild(o);
        });
        select.appendChild(grp);
    }

    select.value = saved.voiceName || '';

    // Warn if no Finnish voice found on this device
    const hasFinnish = voices.some(v => (v.lang || '').replace(/_/g, '-').startsWith('fi'));
    const warning = document.getElementById('voice-warning');
    if (warning) warning.style.display = hasFinnish ? 'none' : '';
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
        if (!saved) return ['', '', ''];
        const d = JSON.parse(saved);
        // Migrate old {child1, child2, child3} format to array
        if (Array.isArray(d)) return d;
        return [d.child1 || '', d.child2 || '', d.child3 || ''].filter((_, i) =>
            i < 3 || d['child' + (i + 1)] !== undefined);
    } catch (e) {
        return ['', '', ''];
    }
}

function saveNames(arr) {
    localStorage.setItem(NAMES_KEY, JSON.stringify(arr));
}

function getNameList() {
    return loadNames().map(n => n.trim()).filter(Boolean);
}

function joinNames(names) {
    if (!names.length) return null;
    if (names.length === 1) return names[0];
    return names.slice(0, -1).join(', ') + ' ja ' + names[names.length - 1];
}

function buildHeiGreeting() {
    const names = getNameList();
    return names.length ? `Hei ${joinNames(names)}!` : '';
}

function buildGreeting() {
    const names = getNameList();
    return names.length ? `Hauskaa pääsiäistä ${joinNames(names)}!` : 'Hauskaa pääsiäistä!';
}

function buildGreetingHtml() {
    const names = getNameList().map(escapeHtml);
    if (!names.length) return 'Hauskaa pääsiäistä! 🐣';
    const joined = names.length === 1
        ? `<strong>${names[0]}</strong>`
        : names.slice(0, -1).map(n => `<strong>${n}</strong>`).join(', ') + ` ja <strong>${names[names.length - 1]}</strong>`;
    return `Hauskaa pääsiäistä ${joined}! 🐣`;
}

function renderNamesList() {
    const container = document.getElementById('names-list');
    if (!container) return;
    const names = loadNames();
    container.innerHTML = '';
    names.forEach((name, i) => {
        const row = document.createElement('div');
        row.className = 'name-input-row';
        const delBtn = names.length > 1
            ? `<button class="btn-icon delete" onclick="removeChild(${i})" title="Poista">✕</button>`
            : '';
        row.innerHTML = `
            <label>Lapsi ${i + 1}</label>
            <input type="text" maxlength="30" autocomplete="off" value="${escapeHtml(name)}"
                   oninput="updateChildName(${i}, this.value)">
            ${delBtn}`;
        container.appendChild(row);
    });
}

function updateChildName(index, value) {
    const names = loadNames();
    names[index] = value;
    saveNames(names);
}

function addChild() {
    const names = loadNames();
    names.push('');
    saveNames(names);
    renderNamesList();
    // Focus the new input
    const inputs = document.querySelectorAll('#names-list input');
    if (inputs.length) inputs[inputs.length - 1].focus();
}

function removeChild(index) {
    const names = loadNames();
    if (names.length <= 1) return; // keep at least one
    names.splice(index, 1);
    saveNames(names);
    renderNamesList();
}

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
    loadEggs();
    setupFileUpload();
    renderNamesList();
    setupVoiceControls();
    initBunnies();
    initEgg();
    scheduleBlink();
    initResponsiveVoice(loadRVKey());
    const hint = document.getElementById('setup-hint');
    if (hint) hint.style.display = state.eggs.length === 0 ? '' : 'none';
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

// ===== RESPONSIVEVOICE =====
function loadRVKey() { return localStorage.getItem(RV_KEY) || ''; }
function saveRVKey(key) {
    if (key) localStorage.setItem(RV_KEY, key.trim());
    else localStorage.removeItem(RV_KEY);
}

function initResponsiveVoice(key) {
    if (!key || window.responsiveVoice) return;
    const s = document.createElement('script');
    s.src = `https://code.responsivevoice.org/responsivevoice.js?key=${encodeURIComponent(key)}`;
    s.async = true;
    s.onload = () => updateRVStatus();
    s.onerror = () => {
        const el = document.getElementById('rv-key-status');
        if (el) { el.textContent = '❌ Avain virheellinen tai verkkovirhe'; el.style.color = '#c00'; }
    };
    document.head.appendChild(s);
}

function updateRVStatus() {
    const el = document.getElementById('rv-key-status');
    if (!el) return;
    if (window.responsiveVoice) {
        el.textContent = '✅ ResponsiveVoice ladattu — suomenkielinen puhe käytössä';
        el.style.color = '#2d7a2d';
    }
}

function setupRVKeyInput() {
    const input = document.getElementById('rv-key-input');
    const btn   = document.getElementById('rv-key-save');
    if (!input || !btn) return;
    input.value = loadRVKey();
    updateRVStatus();
    btn.addEventListener('click', () => {
        const key = input.value.trim();
        saveRVKey(key);
        if (key && !window.responsiveVoice) {
            initResponsiveVoice(key);
        } else if (!key) {
            const el = document.getElementById('rv-key-status');
            if (el) { el.textContent = ''; }
        }
    });
}

// ===== SPEECH + MOUTH ANIMATION =====
let mouthCloseTimer = null;

function setMouthOpen(open) {
    document.querySelectorAll('.mouth-open-part').forEach(el => el.style.display = open ? '' : 'none');
    document.querySelectorAll('.mouth-closed-part').forEach(el => el.style.display = open ? 'none' : '');
}

function stopMouthAnimation() {
    clearTimeout(mouthCloseTimer);
    mouthCloseTimer = null;
    setMouthOpen(false);
}

// Called on each word boundary: open mouth briefly proportional to word length
function pulseMouth(charLength, rate) {
    clearTimeout(mouthCloseTimer);
    setMouthOpen(true);
    const openMs = Math.min(400, Math.max(80, (charLength * 55) / rate));
    mouthCloseTimer = setTimeout(() => setMouthOpen(false), openMs);
}

function speak(text) {
    text = stripEmoji(text);
    window.speechSynthesis.cancel();
    stopMouthAnimation();

    document.querySelectorAll('.bunny-svg').forEach(b => b.classList.add('bunny-speaking'));

    const vs = loadVoiceSettings();
    const freshVoices = speechSynthesis.getVoices();
    const voiceList = freshVoices.length > 0 ? freshVoices : cachedVoices;

    // Priority: saved voice → Finnish voice → ResponsiveVoice cloud → any voice
    let voice = vs.voiceName ? voiceList.find(v => v.name === vs.voiceName) : null;
    if (!voice) {
        voice = voiceList.find(v => (v.lang || '').replace(/_/g, '-').startsWith('fi')) || null;
    }

    // No Finnish voice and no user selection → use ResponsiveVoice Finnish Female (cloud TTS)
    if (!voice && !vs.voiceName && window.responsiveVoice) {
        const rate = vs.rate ?? 1.0;
        const wordCount = text.split(/\s+/).length;
        const estimatedMs = Math.max(3000, (wordCount / 2.5) * (1000 / rate)) + 2000;
        let open = false;
        const rvInterval = setInterval(() => { open = !open; setMouthOpen(open); }, 160);
        let rvDone = false;
        function stopRV() {
            if (rvDone) return; rvDone = true;
            clearTimeout(rvGuard); clearInterval(rvInterval);
            stopMouthAnimation();
            document.querySelectorAll('.bunny-svg').forEach(b => b.classList.remove('bunny-speaking'));
        }
        const rvGuard = setTimeout(stopRV, estimatedMs);
        responsiveVoice.speak(text, 'Finnish Female', {
            rate, pitch: 1.0, volume: 1,
            onend: stopRV,
            onerror: () => { stopRV(); if (voiceList.length > 0) _speakWSA(text, vs, voiceList[0]); },
        });
        return;
    }

    // Last resort: any available voice (better than silence)
    if (!voice && voiceList.length > 0) voice = voiceList[0];

    _speakWSA(text, vs, voice);
}

function _speakWSA(text, vs, voice) {
    document.querySelectorAll('.bunny-svg').forEach(b => b.classList.add('bunny-speaking'));
    const rate = vs.rate ?? 1.0;

    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) {
        utterance.voice = voice;
        utterance.lang  = voice.lang;
    } else {
        utterance.lang = 'fi-FI';
    }
    utterance.pitch  = vs.pitch ?? 1.5;
    utterance.rate   = rate;
    utterance.volume = 1;

    // Safety guard: stop if onend never fires (Chrome bug at high rates)
    const wordCount = text.split(/\s+/).length;
    const estimatedMs = Math.max(2000, (wordCount / 2.5) * (1000 / rate)) + 2000;
    let animGuard = setTimeout(() => stopSpeaking(), estimatedMs);
    let fallbackInterval = null;

    function stopSpeaking() {
        clearTimeout(animGuard);
        clearInterval(fallbackInterval);
        stopMouthAnimation();
        document.querySelectorAll('.bunny-svg').forEach(b => b.classList.remove('bunny-speaking'));
    }

    // onboundary fires at each word — most reliable sync available in Web Speech API
    let boundaryFired = false;
    utterance.onboundary = (e) => {
        if (e.name !== 'word') return;
        boundaryFired = true;
        pulseMouth(e.charLength || 4, rate);
    };

    // Fallback interval if onboundary never fires (some voices/browsers don't support it)
    utterance.onstart = () => {
        setTimeout(() => {
            if (!boundaryFired) {
                let open = false;
                fallbackInterval = setInterval(() => {
                    open = !open;
                    setMouthOpen(open);
                }, 160);
            }
        }, 300);
    };

    utterance.onend = () => {
        clearInterval(fallbackInterval);
        stopSpeaking();
    };
    utterance.onerror = () => {
        clearInterval(fallbackInterval);
        stopSpeaking();
    };

    setTimeout(() => window.speechSynthesis.speak(utterance), 50);
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
        const hei = buildHeiGreeting();
        const heiHtml = hei ? `<p>${escapeHtml(hei)}</p>` : '';
        const valmis = plural() ? 'Oletteko valmiita pääsiäismunajahtiiin?' : 'Oletko valmis pääsiäismunajahtiiin?';
        speechEl.innerHTML = `${heiHtml}<p>Minä olen <strong>Pääsiäispupu</strong>! 🐰</p><p>${valmis}</p>`;
        speak(`${hei ? hei + ' ' : ''}Minä olen Pääsiäispupu! ${valmis}`);
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
    const hint = document.getElementById('setup-hint');
    if (hint) hint.style.display = state.eggs.length === 0 ? '' : 'none';
}

function showSettings() {
    renderSettingsList();
    renderNamesList();
    populateVoiceList();
    setupRVKeyInput();
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
    const clueMsg = pickRandom(plural() ? CLUE_MSGS.many : CLUE_MSGS.one);

    document.getElementById('clue-image').src = egg.dataUrl;
    document.getElementById('egg-current').textContent = state.current + 1;
    document.getElementById('egg-total').textContent = state.eggs.length;
    document.getElementById('clue-text').textContent = clueMsg;

    showScreen('screen-clue');
    speak(clueMsg);
}

function eggFound() {
    const isLast = state.current >= state.eggs.length - 1;
    const msg = pickRandom(plural() ? CONGRATS.many : CONGRATS.one);

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
    const many = plural();
    document.getElementById('final-eggs').textContent = '🥚'.repeat(Math.min(state.eggs.length, 12));
    document.getElementById('final-greeting').innerHTML = buildGreetingHtml();
    document.getElementById('complete-found-text').textContent =
        many ? 'Löysitte kaikki munat!' : 'Löysit kaikki munat!';
    document.getElementById('complete-mestari-text').innerHTML =
        many ? 'Olette pääsiäismunajahdin <strong>mestarit</strong>! 🌟'
             : 'Olet pääsiäismunajahdin <strong>mestari</strong>! 🌟';
    launchConfetti('confetti-container-final');
    showScreen('screen-complete');
    const finalMsg = many
        ? `Onneksi olkoon! Löysitte kaikki munat! Olette pääsiäismunajahdin mestarit!`
        : `Onneksi olkoon! Löysit kaikki munat! Olet pääsiäismunajahdin mestari!`;
    speak(`${finalMsg} ${buildGreeting()}`);
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

function updateStorageIndicator() {
    const el = document.getElementById('storage-indicator');
    if (!el) return;
    const QUOTA = 5 * 1024 * 1024; // ~5MB
    const used = JSON.stringify(state.eggs).length; // bytes (base64 chars ≈ bytes)
    const pct = Math.min(100, Math.round(used / QUOTA * 100));
    const usedKB = Math.round(used / 1024);
    const fillClass = pct >= 90 ? 'full' : pct >= 65 ? 'warn' : '';
    el.innerHTML = `
        <span>${state.eggs.length} kuvaa &nbsp;·&nbsp; ${usedKB} KB / ~5 000 KB käytössä</span>
        <div class="storage-bar-track">
            <div class="storage-bar-fill ${fillClass}" style="width:${pct}%"></div>
        </div>`;
}

function showUploadStatus(msg, isError, autoHide = true) {
    const el = document.getElementById('upload-status');
    if (!el) return;
    el.textContent = msg;
    el.className = 'upload-status ' + (isError ? 'err' : 'ok');
    el.style.display = 'block';
    clearTimeout(el._hideTimer);
    if (autoHide) el._hideTimer = setTimeout(() => { el.style.display = 'none'; }, 8000);
}

function setupFileUpload() {
    const input  = document.getElementById('image-upload');
    const camera = document.getElementById('camera-capture');
    const handler = async (e) => {
        const files = Array.from(e.target.files);
        let added = 0;
        const failedFiles = [];
        let quotaFull = false;
        showUploadStatus(`Käsitellään ${files.length} kuvaa…`, false, false);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (quotaFull) break;
            if (files.length > 1) showUploadStatus(`Käsitellään ${i + 1}/${files.length}…`, false, false);
            let dataUrl;
            try {
                dataUrl = await compressImage(file, 800, 0.65);
            } catch (err) {
                const reason = err.message === 'decode'
                    ? 'ei-tuettu muoto (HEIC?)'
                    : err.message === 'timeout'
                    ? 'liian hidas'
                    : 'lukuvirhe';
                failedFiles.push(`${file.name} (${reason})`);
                continue;
            }
            // Try saving one image at a time to detect quota early
            const prev = [...state.eggs];
            state.eggs.push({ id: Date.now() + Math.random(), dataUrl, name: file.name });
            try {
                saveEggs();
                added++;
            } catch (err) {
                // Quota exceeded — roll back this image
                state.eggs = prev;
                quotaFull = true;
            }
        }

        renderSettingsList();
        input.value = '';

        if (quotaFull) {
            showUploadStatus(`Tallennustila täynnä! Lisätty ${added}/${files.length} kuvaa. Poista vanhoja kuvia ensin.`, true);
        } else if (failedFiles.length > 0) {
            const names = failedFiles.join(', ');
            showUploadStatus(`${added} lisätty. Epäonnistui: ${names}`, true);
        } else if (added > 0) {
            showUploadStatus(`✓ ${added} kuva${added > 1 ? 'a' : ''} lisätty!`, false);
        }
    };
    input.addEventListener('change', handler);
    camera.addEventListener('change', handler);
}

async function compressImage(file, maxPx, quality) {
    // Convert HEIC/HEIF to JPEG first (iPhone default format)
    const isHeic = file.type === 'image/heic' || file.type === 'image/heif' ||
                   /\.hei[cf]$/i.test(file.name);
    if (isHeic) {
        if (typeof heic2any === 'undefined') throw new Error('decode');
        const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.85 })
            .catch(() => { throw new Error('decode'); });
        file = blob instanceof Array ? blob[0] : blob;
    }

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('timeout')), 20000);
        const done = (val) => { clearTimeout(timeout); resolve(val); };
        const fail = (err) => { clearTimeout(timeout); reject(err); };

        const reader = new FileReader();
        reader.onerror = () => fail(new Error('read'));
        reader.onload = (ev) => {
            const img = new Image();
            img.onerror = () => fail(new Error('decode'));
            img.onload = () => {
                try {
                    let w = img.width, h = img.height;
                    if (w > maxPx || h > maxPx) {
                        if (w >= h) { h = Math.round(h * maxPx / w); w = maxPx; }
                        else        { w = Math.round(w * maxPx / h); h = maxPx; }
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = w; canvas.height = h;
                    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                    done(canvas.toDataURL('image/jpeg', quality));
                } catch (e) { fail(e); }
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function renderSettingsList() {
    updateStorageIndicator();
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

function stripEmoji(str) {
    return str.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{20D0}-\u{20FF}]/gu, '').replace(/\s{2,}/g, ' ').trim();
}

function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
