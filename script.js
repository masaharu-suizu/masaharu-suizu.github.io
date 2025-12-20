// ==========================================
//  1. 32x32 ドットアニメーション
// ==========================================
const canvas = document.getElementById('heroCanvas');
const ctxCanvas = canvas.getContext('2d');

// 文字と色の対応表 (パレット)
const palette = {
    '.': 'transparent', // 透明
    'B': '#eda872',     // 茶 (Body)
    'W': '#fffbef',     // 白 (White)
    'K': '#4a3c31',     // 黒/こげ茶 (Kuro)
    'P': '#f7a8b8',     // ピンク (Pink)
    'R': '#e83b3b',     // 赤 (Red)
    'G': '#2b2b2b'      // 影など
};

// 32x32 ドット絵データ (文字列の配列)
const shibaPatterns = [
    // Frame 0: 目パッチリ
    [
        "................................",
        "................................",
        ".........BB............BB.......",
        "........BWWBB........BWWBB......",
        ".......BWWWWBB......BWWWWBB.....",
        ".......BWWWWWB......BWWWWWB.....",
        ".......BBWWWWB......BBWWWWB.....",
        "........BBBBB........BBBBB......",
        "........BBBBB........BBBBB......",
        ".......BBBBBBBBBBBBBBBBBBBB.....",
        "......BBBBBBBBBBBBBBBBBBBBBB....",
        ".....BBBBBBBBBBBBBBBBBBBBBBBB...",
        ".....BBBBWWWBBBBBBBBBBWWWBBBB...",
        ".....BBBBKKKKBBBBBBBBBKKKBBBB...",
        ".....BBBBWKKBBBBBBBBBBKKWBBBB...",
        ".....BBBBBBBBBBBBBBBBBBBBBBBB...",
        ".....BBBBBBBBBBBBBBBBBBBBBBBB...",
        "......BBBBBPPWBBBBBBWPPBBBBB....",
        "......BBBBBWWWWKKKKWWWBBBBB.....",
        ".......BBBBWWWWWWWWWWBBBBBB.....",
        ".......BBBBBWWWWWWWWBBBBBBB.....",
        "........BBBBBBWWWWBBBBBBBB......",
        "........BBBBBBBBBBBBBBBBBB......",
        "......RRRRRRRRRRRRRRRRRRRRRR....",
        ".....RRRRRRRRRRRRRRRRRRRRRRRR...",
        ".....BBBBBBBBBBBBBBBBBBBBBBBB...",
        ".....BBBBBBBBBBBBBBBBBBBBBBBB...",
        ".....BBBBBBBBBBBBBBBBBBBBBBBB...",
        ".....WWWWBBBBBBBBBBBBBBBBWWWW...",
        ".....WWWWBBBBBBBBBBBBBBBBWWWW...",
        ".....WWWWBBBBBBBBBBBBBBBBWWWW...",
        "................................"
    ],
    // Frame 1: まばたき
    [
        "................................",
        ".........BB............BB.......", 
        "........BWWBB........BWWBB......",
        ".......BWWWWBB......BWWWWBB.....",
        ".......BWWWWWB......BWWWWWB.....",
        ".......BBWWWWB......BBWWWWB.....",
        ".......BBWWWWB......BBWWWWB.....",
        "........BBBBB........BBBBB......",
        "........BBBBB........BBBBB......",
        ".......BBBBBBBBBBBBBBBBBBBB.....",
        "......BBBBBBBBBBBBBBBBBBBBBB....",
        ".....BBBBBBBBBBBBBBBBBBBBBBBB...",
        ".....BBBBBBBBBBBBBBBBBBBBBBBB...", 
        ".....BBBBWWWWBBBBBBBBWWWWBBBB...", 
        ".....BBBBKKKBBBBBBBBBBKKKBBBB...",
        ".....BBBBBBBBBBBBBBBBBBBBBBBB...",
        ".....BBBBBBBBBBBBBBBBBBBBBBBB...",
        "......BBBBBPPWBBBBBBWPPBBBBB....",
        "......BBBBBWWWWKKKKWWWBBBBB.....",
        ".......BBBBWWWWWWWWWWBBBBBB.....",
        ".......BBBBBWWWWWWWWBBBBBBB.....",
        "........BBBBBBWWWWBBBBBBBB......",
        "........BBBBBBBBBBBBBBBBBB......",
        "......RRRRRRRRRRRRRRRRRRRRRR....",
        ".....RRRRRRRRRRRRRRRRRRRRRRRR...",
        ".....BBBBBBBBBBBBBBBBBBBBBBBB...",
        ".....BBBBBBBBBBBBBBBBBBBBBBBB...",
        ".....BBBBBBBBBBBBBBBBBBBBBBBB...",
        ".....WWWWBBBBBBBBBBBBBBBBWWWW...",
        ".....WWWWBBBBBBBBBBBBBBBBWWWW...",
        ".....WWWWBBBBBBBBBBBBBBBBWWWW...",
        "................................"
    ]
];

// 描画関数 (32x32対応)
function drawHero(patternIndex) {
    ctxCanvas.clearRect(0, 0, canvas.width, canvas.height);
    const patternStrings = shibaPatterns[patternIndex];

    for (let y = 0; y < 32; y++) {
        // 行の文字列を取得
        const rowString = patternStrings[y];
        for (let x = 0; x < 32; x++) {
            // 1文字取り出す
            const char = rowString[x];
            // パレットから色を取得
            const color = palette[char];
            if (color && color !== 'transparent') {
                ctxCanvas.fillStyle = color;
                ctxCanvas.fillRect(x, y, 1, 1);
            }
        }
    }
}

let currentPattern = 0;
function animateHero() {
    drawHero(currentPattern);
    currentPattern = (currentPattern + 1) % shibaPatterns.length;
    // 800msごとに切り替え (ゆっくりまばたき)
    setTimeout(animateHero, 800);
}
// アニメーション開始
animateHero();


// ==========================================
//  2. 音楽再生機能
// ==========================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let ctx = null; 
let timeoutID = null; 
const tempo = 95; 
const mtof = note => note ? 440 * Math.pow(2, (note - 69) / 12) : 0;

function playNESNote(freq, type, startTime, duration, vol, style) {
    if (!ctx || !freq) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + 0.01);
    let stopTime = startTime + duration;
    if (style === 'staccato') {
        gain.gain.setValueAtTime(vol, startTime + 0.05);
        gain.gain.linearRampToValueAtTime(0, startTime + duration * 0.6);
        stopTime = startTime + duration * 0.7;
    } else if (style === 'fanfare') {
        gain.gain.setValueAtTime(vol, startTime + duration * 0.9);
        gain.gain.linearRampToValueAtTime(0, stopTime);
    } else {
        gain.gain.setValueAtTime(vol, startTime + duration * 0.9);
        gain.gain.linearRampToValueAtTime(0, startTime + duration * 0.95);
    }
    osc.stop(stopTime);
}

// 楽譜データ
const introMelody = [
    {n:55, l:0.33}, {n:55, l:0.33}, {n:55, l:0.33}, {n:55, l:1.0}, 
    {n:55, l:0.5}, {n:58, l:0.5}, {n:62, l:0.5}, {n:65, l:0.5}, {n:67, l:3.0}, {n:null, l:1.0}
];
const introHarmony = [
    {n:43, l:0.33}, {n:43, l:0.33}, {n:43, l:0.33}, {n:43, l:1.0}, 
    {n:43, l:0.5}, {n:46, l:0.5}, {n:50, l:0.5}, {n:53, l:0.5}, {n:55, l:3.0}, {n:null, l:1.0}
];
const partA_Melody = [
    {n:60, l:1.5}, {n:62, l:0.5}, {n:64, l:0.5}, {n:65, l:0.5}, {n:67, l:2.0},
    {n:72, l:1.0}, {n:71, l:0.5}, {n:69, l:0.5}, {n:67, l:2.0},
    {n:65, l:0.5}, {n:64, l:0.5}, {n:62, l:0.5}, {n:60, l:0.5}, {n:62, l:0.5}, {n:64, l:0.5}, {n:60, l:1.0},
    {n:62, l:1.0}, {n:55, l:1.0}, {n:55, l:1.0}, {n:null, l:1.0}
];
const partA_Harmony = [
    {n:64, l:1.5}, {n:65, l:0.5}, {n:67, l:0.5}, {n:69, l:0.5}, {n:71, l:2.0},
    {n:76, l:1.0}, {n:74, l:0.5}, {n:72, l:0.5}, {n:71, l:2.0},
    {n:69, l:0.5}, {n:67, l:0.5}, {n:65, l:0.5}, {n:64, l:0.5}, {n:65, l:0.5}, {n:67, l:0.5}, {n:64, l:1.0},
    {n:59, l:1.0}, {n:50, l:1.0}, {n:50, l:1.0}, {n:null, l:1.0}
];
const partA_Bass = [
    48, 48, 48, 48, 47, 47, 47, 47, 48, 48, 43, 48, 43, 43, 43, 43
];
const partB_Melody = [
    {n:76, l:1.5}, {n:74, l:0.5}, {n:72, l:1.0}, {n:71, l:1.0},
    {n:69, l:1.5}, {n:67, l:0.5}, {n:65, l:2.0},
    {n:64, l:1.5}, {n:65, l:0.5}, {n:67, l:1.0}, {n:60, l:1.0},
    {n:62, l:3.0}, {n:null, l:1.0}
];
const partB_Harmony = [
    {n:72, l:1.5}, {n:71, l:0.5}, {n:69, l:1.0}, {n:67, l:1.0},
    {n:65, l:1.5}, {n:64, l:0.5}, {n:62, l:2.0},
    {n:60, l:1.5}, {n:62, l:0.5}, {n:64, l:1.0}, {n:57, l:1.0},
    {n:59, l:3.0}, {n:null, l:1.0}
];
const partB_Bass = [
    45, 45, 45, 45, 40, 40, 40, 40, 41, 41, 48, 48, 43, 43, 43, 43
];

const fullMelody = [...introMelody, ...partA_Melody, ...partB_Melody, ...partA_Melody];
const fullHarmony = [...introHarmony, ...partA_Harmony, ...partB_Harmony, ...partA_Harmony];
const patternBass = [...partA_Bass, ...partB_Bass, ...partA_Bass];

function setPlayingState(isPlaying) {
    const playBtn = document.getElementById('playBtn');
    const status = document.getElementById('status');
    if (isPlaying) {
        playBtn.disabled = true;
        status.innerText = "♪ さいせい中...";
    } else {
        playBtn.disabled = false;
        status.innerText = "";
    }
}

document.getElementById('playBtn').addEventListener('click', function() {
    if (ctx) ctx.close();
    ctx = new AudioContext();
    setPlayingState(true);
    const beatTime = 60.0 / tempo;
    let currentTime = ctx.currentTime + 0.1;
    let mTime = currentTime;
    fullMelody.forEach((note, i) => {
        const duration = note.l * beatTime;
        if (note.n) playNESNote(mtof(note.n), 'square', mTime, duration, 0.15, 'normal');
        const harm = fullHarmony[i];
        if (harm && harm.n) playNESNote(mtof(harm.n), 'square', mTime, duration, 0.12, 'normal');
        mTime += duration;
    });
    let bTime = currentTime;
    introMelody.forEach(n => bTime += n.l * beatTime); 
    patternBass.forEach(noteNum => {
        if (noteNum) playNESNote(mtof(noteNum), 'triangle', bTime, beatTime, 0.4, 'staccato');
        bTime += beatTime;
    });
    const totalDuration = (mTime - currentTime) * 1000 + 1000;
    timeoutID = setTimeout(() => {
        setPlayingState(false);
        if (ctx) { ctx.close(); ctx = null; }
    }, totalDuration);
});

document.getElementById('stopBtn').addEventListener('click', async function() {
    if (ctx) { await ctx.close(); ctx = null; }
    if (timeoutID) { clearTimeout(timeoutID); timeoutID = null; }
    setPlayingState(false);
    document.getElementById('status').innerText = "■ 停止しました";
});