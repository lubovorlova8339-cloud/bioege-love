let notice = "";
let noticeTimer = 0;

// ======================================================
// БИОЕГЭ С ЛЮБОВЬЮ
// СВЕТОВАЯ ФАЗА ФОТОСИНТЕЗА — ИНТЕРАКТИВНАЯ ЛАБОРАТОРИЯ
// p5.js
// ======================================================

let W = 1100, H = 760;

let state = {
  ps2: false,
  water: false,
  ps1: false,
  nadph: false,
  nadphCount: 0,
  etcStep: 0,
  lumenH: 0,
  atp: 0,
  oxygen: 0,
  cyclic: false,
  hint: false
};

let electronParticles = [];
let oxygenParticles = [];
let protonParticles = [];
let flowingProtons = [];
let flash = 0;

const pathX = [145, 265, 395, 525, 655, 785, 900];

const buttons = [
  {x:15, y:625, w:168, h:43, label:"☀ СВЕТ ФС II", action:"ps2"},
  {x:195, y:625, w:168, h:43, label:"H₂O ФОТОЛИЗ", action:"water"},
  {x:375, y:625, w:168, h:43, label:"e⁻ ПЕРЕНОС", action:"etc"},
  {x:555, y:625, w:168, h:43, label:"☀ СВЕТ ФС I", action:"ps1"},
  {x:735, y:625, w:168, h:43, label:"НАДФ⁺ → НАДФ·Н", action:"nadph"},
  {x:915, y:625, w:170, h:43, label:"АТФ-СИНТАЗА", action:"atp"},
  {x:175, y:680, w:220, h:42, label:"ЦИКЛИЧЕСКИЙ ПОТОК", action:"cycle"},
  {x:440, y:680, w:180, h:42, label:"↻ СБРОС", action:"reset"},
  {x:665, y:680, w:260, h:42, label:"? ПОМОЩЬ УЧЕНИКУ", action:"hint"}
];

function setup() {
  createCanvas(W, H);
  textFont("Arial");
  frameRate(60);
}

function draw() {
  background(250, 252, 247);

  updateElectrons();

  drawHeader();
  drawStroma();
  drawLumen();
  drawMembrane();
  drawComplexes();
  drawElectronTransport();
  drawOxygen();
  drawProtons();
  drawChargeIndicators();
  drawProducts();
  drawStatus();
  drawButtons();
  drawHint();
  drawNotice();

  flash = max(0, flash - 3);
}

// ---------------- ЗАГОЛОВОК ----------------

function drawHeader() {
  fill(39, 92, 54);
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(25);
  text("СВЕТОВАЯ ФАЗА ФОТОСИНТЕЗА", W/2, 35);

  textStyle(NORMAL);
  textSize(13);
  fill(105);
  text("Виртуальная лаборатория | БИОЕГЭ с Любовью", W/2, 58);

  fill(205, 153, 40);
  textSize(12);
  text("УПРАВЛЯЙ ПРОЦЕССОМ САМОСТОЯТЕЛЬНО", W/2, 82);
}

// ---------------- СТРОМА ----------------

function drawStroma() {
  noStroke();
  fill(235, 244, 227);
  rect(15, 95, 1070, 175, 14);

  fill(46, 104, 60);
  textAlign(LEFT);
  textStyle(BOLD);
  textSize(16);
  text("СТРОМА ХЛОРОПЛАСТА", 35, 120);

  fill(65, 100, 70);
  textStyle(NORMAL);
  textSize(12);
  text("НАДФ⁺ • НАДФ·Н • АДФ • Фн", 35, 145);
}

// ---------------- ЛЮМЕН ----------------

function drawLumen() {
  noStroke();
  fill(226, 240, 249);
  rect(15, 425, 1070, 155, 14);

  fill(39, 111, 155);
  textAlign(LEFT);
  textStyle(BOLD);
  textSize(16);
  text("ЛЮМЕН ТИЛАКОИДА", 35, 555);

  fill(70, 120, 155);
  textStyle(NORMAL);
  textSize(12);
  text("Здесь накапливаются протоны H⁺", 35, 575);
}

// ---------------- МЕМБРАНА ----------------

function drawMembrane() {
  noStroke();
  fill(172, 205, 147);
  rect(15, 270, 1070, 155);

  fill(123, 177, 111);
  rect(15, 270, 1070, 13, 6);
  rect(15, 412, 1070, 13, 6);

  for (let x = 25; x < 1080; x += 22) {
    fill(226, 241, 204);
    circle(x, 275, 9);
    circle(x, 419, 9);

    stroke(100, 145, 95);
    strokeWeight(2);
    line(x, 281, x, 300);
    line(x, 413, x, 394);
    noStroke();
  }

  fill(65, 108, 60);
  textAlign(CENTER);
  textSize(11);
  text("ТИЛАКОИДНАЯ МЕМБРАНА", W/2, 350);
}

// ---------------- БЕЛКОВЫЕ КОМПЛЕКСЫ ----------------

function drawComplexes() {
  complex(145, "ФС II", "P680", color(238, 190, 83));
  complex(395, "Цитохром", "b₆f", color(218, 145, 130));
  complex(655, "ФС I", "P700", color(140, 182, 222));

  drawATPase();

  drawCarrier(265, "PQ", "пластохинон");
  drawCarrier(525, "PC", "пластоцианин");
  drawCarrier(785, "Fd", "ферредоксин");

  fill(249, 231, 175);
  stroke(177, 143, 60);
  strokeWeight(2);
  rect(875, 155, 95, 58, 12);

  noStroke();
  fill(80, 65, 30);
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(13);
  text("НАДФ⁺-", 922, 178);
  text("редуктаза", 922, 195);

  fill(50);
  textSize(13);
  text("H₂O", 145, 238);

  if (state.ps2) drawLight(145);
  if (state.ps1 && !state.cyclic) drawLight(655);
}

function complex(x, name, sub, c) {
  stroke(100, 110, 85);
  strokeWeight(2);
  fill(c);
  rect(x-38, 255, 76, 190, 17);

  noStroke();
  fill(45, 48, 38);
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(16);
  text(name, x, 340);

  textStyle(NORMAL);
  textSize(13);
  text(sub, x, 362);

  let active = name === "ФС II" ? state.ps2 :
               name === "ФС I" ? state.ps1 :
               state.etcStep >= 2;

  fill(active ? color(64, 160, 82) : color(160, 160, 150));
  circle(x, 270, 10);
}

function drawCarrier(x, name, sub) {
  fill(248, 249, 232);
  stroke(125, 145, 95);
  strokeWeight(2);
  circle(x, 350, 43);

  noStroke();
  fill(45, 75, 48);
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(14);
  text(name, x, 354);

  fill(60);
  textStyle(NORMAL);
  textSize(10);
  text(sub, x, 460);
}

function drawATPase() {
  fill(157, 198, 135);
  stroke(67, 121, 74);
  strokeWeight(3);
  ellipse(1020, 225, 70, 65);

  rect(1000, 260, 40, 190, 15);

  fill(237, 250, 228);
  noStroke();
  rect(1011, 275, 18, 158, 8);

  stroke(75, 130, 80);
  strokeWeight(3);
  line(1020, 290, 1020, 425);

  fill(55, 105, 64);
  noStroke();
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(12);
  text("АТФ", 1020, 229);

  fill(40);
  textSize(11);
  textStyle(NORMAL);
  text("синтаза", 1020, 242);
  text("H⁺", 1020, 365);
  text("канал", 1020, 380);
}

// ---------------- ЭЛЕКТРОННАЯ ЦЕПЬ ----------------

function drawElectronTransport() {
  let xs = [183, 265, 357, 395, 485, 525, 617, 655, 785, 875];

  stroke(164, 132, 45);
  strokeWeight(3);

  for (let i = 0; i < xs.length-1; i++) {
    line(xs[i], 330, xs[i+1], 330);
  }

  noStroke();
  fill(150, 112, 37);
  textAlign(CENTER);
  textSize(11);
  text("Перенос электронов по ЭТЦ", 470, 248);

  for (let e of electronParticles) {
    if (e.consumed) continue;

    fill(255, 218, 55);
    stroke(160, 120, 20);
    strokeWeight(2);
    circle(e.x, e.y, 19);

    noStroke();
    fill(40);
    textSize(10);
    textAlign(CENTER, CENTER);
    text("e⁻", e.x, e.y);
  }

  arrow(190, 330, 245, 330, color(166, 126, 30));
  arrow(430, 330, 495, 330, color(166, 126, 30));
  arrow(560, 330, 625, 330, color(166, 126, 30));
  arrow(700, 330, 770, 330, color(166, 126, 30));
}

function updateElectrons() {
  for (let e of electronParticles) {
    if (e.x < e.targetX) {
      e.x = min(e.x + e.speed, e.targetX);
    }

    if (e.consumed && e.x >= 900) {
      e.finished = true;
    }
  }

  electronParticles = electronParticles.filter(e => !e.finished);
}

function arrow(x1, y1, x2, y2, c) {
  stroke(c);
  strokeWeight(2);
  line(x1, y1, x2, y2);

  let a = atan2(y2-y1, x2-x1);

  push();
  translate(x2, y2);
  rotate(a);
  fill(c);
  noStroke();
  triangle(0, 0, -9, -5, -9, 5);
  pop();
}

// ---------------- СВЕТ ----------------

function drawLight(x) {
  stroke(235, 174, 40);
  strokeWeight(3);

  for (let i = -2; i <= 2; i++) {
    line(x+i*12, 135, x+i*8, 250);
  }

  noStroke();
  fill(245, 192, 52);
  circle(x, 145, 17);
}

// ---------------- КИСЛОРОД ----------------

function drawOxygen() {
  for (let p of oxygenParticles) {
    p.y -= p.speed;
    p.x += sin(frameCount*0.05 + p.phase)*0.6;
    p.life--;

    fill(100, 170, 220, map(p.life, 0, 100, 0, 255));
    noStroke();
    circle(p.x, p.y, 23);

    fill(30);
    textAlign(CENTER);
    textSize(10);
    text("O₂", p.x, p.y+3);
  }

  oxygenParticles = oxygenParticles.filter(p => p.life > 0);
}

// ---------------- ПРОТОНЫ ----------------

function drawProtons() {
  for (let p of protonParticles) {
    p.x += sin(frameCount*0.04+p.phase)*0.3;
    p.y += sin(frameCount*0.06+p.phase)*0.2;

    fill(76, 164, 216);
    stroke(35, 110, 160);
    strokeWeight(1);
    circle(p.x, p.y, 21);

    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(11);
    text("H⁺", p.x, p.y);
  }

  for (let p of flowingProtons) {
    p.y -= 2.3;
    p.life--;

    fill(50, 145, 210);
    circle(1020, p.y, 21);

    fill(255);
    textSize(10);
    textAlign(CENTER, CENTER);
    text("H⁺", 1020, p.y);
  }

  flowingProtons = flowingProtons.filter(p => p.life > 0);

  if (flowingProtons.length > 0) {
    arrow(1050, 440, 1050, 260, color(35, 130, 195));
  }
}

// ---------------- ЗАРЯДЫ ----------------

function drawChargeIndicators() {
  let lumenCharge = state.lumenH;
  let stromaCharge = max(0, state.lumenH - flowingProtons.length);

  fill(48, 100, 58);
  textAlign(LEFT);
  textStyle(BOLD);
  textSize(14);
  text("СТРОМА", 35, 170);

  fill(55, 105, 65);
  textSize(23);
  text("− ".repeat(min(6, stromaCharge)), 35, 195);

  fill(40, 100, 155);
  textSize(14);
  text("ЛЮМЕН", 35, 490);

  fill(40, 120, 175);
  textSize(23);
  text("+ ".repeat(min(8, lumenCharge)), 35, 520);

  fill(50);
  textSize(11);
  textStyle(NORMAL);
  text("Условная визуализация разности зарядов", 35, 540);
}

// ---------------- ПРОДУКТЫ ----------------

function drawProducts() {
  productCard(190, 490, "КИСЛОРОД", "O₂", state.oxygen,
              color(109, 174, 216));

  productCard(850, 120, "ВОССТАНОВЛЕННЫЙ", "НАДФ·Н",
              state.nadphCount, color(215, 184, 89));

  productCard(940, 490, "АТФ", "АТФ", state.atp,
              color(125, 185, 112));
}

function productCard(x, y, title, formula, amount, c) {
  fill(c);
  noStroke();
  rect(x-53, y-30, 106, 54, 9);

  fill(40);
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(11);
  text(title, x, y-11);

  textSize(15);
  text(formula + (amount > 0 ? " ×"+amount : ""), x, y+9);
}

// ---------------- СОСТОЯНИЕ ----------------

function drawStatus() {
  fill(40, 80, 48);
  textAlign(LEFT);
  textSize(13);
  textStyle(BOLD);

  text("ПРОТОНЫ В ЛЮМЕНЕ: " + state.lumenH, 35, 605);
  text("АТФ: " + state.atp, 360, 605);
  text("O₂: " + state.oxygen, 520, 605);
  text("НАДФ·Н: " + state.nadphCount, 680, 605);

  fill(90);
  textStyle(NORMAL);
  textAlign(RIGHT);
  textSize(11);
  text("Все количества условные, не стехиометрические", 1070, 605);
}

// ---------------- КНОПКИ ----------------

function drawButtons() {
  for (let b of buttons) {
    let active =
      (b.action === "ps2" && state.ps2) ||
      (b.action === "water" && state.water) ||
      (b.action === "ps1" && state.ps1) ||
      (b.action === "nadph" && state.nadph) ||
      (b.action === "cycle" && state.cyclic);

    fill(active ? color(190, 220, 175) : color(49, 111, 66));
    stroke(35, 90, 48);
    strokeWeight(1);
    rect(b.x, b.y, b.w, b.h, 9);

    noStroke();
    fill(active ? color(35, 80, 40) : color(255));
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(11);
    text(b.label, b.x+b.w/2, b.y+b.h/2);
  }
}

// ---------------- ПОДСКАЗКИ ----------------

function drawHint() {
  if (!state.hint) return;

  let boxX = 315;
  let boxY = 100;
  let boxW = 490;
  let boxH = 155;

  fill(255, 250, 225);
  stroke(192, 155, 65);
  strokeWeight(1.5);
  rect(boxX, boxY, boxW, boxH, 12);

  noStroke();
  fill(55);

  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(14);
  text("ПОДСКАЗКА УЧЕНИКУ", boxX + 20, boxY + 15);

  textStyle(NORMAL);
  textSize(12);
  textLeading(18);

  let hintText =
    "1. Активируй ФС II светом.\n" +
    "2. Проведи фотолиз воды.\n" +
    "3. Перемести электроны по ЭТЦ.\n" +
    "4. Активируй ФС I и восстанови НАДФ⁺.\n" +
    "5. Накопи H⁺ и запусти АТФ-синтазу.";

  text(
    hintText,
    boxX + 20,
    boxY + 43,
    boxW - 40,
    boxH - 53
  );
}

// ---------------- ДЕЙСТВИЯ ----------------

function mousePressed() {
  for (let b of buttons) {
    if (mouseX >= b.x && mouseX <= b.x+b.w &&
        mouseY >= b.y && mouseY <= b.y+b.h) {
      action(b.action);
      return;
    }
  }
}

function action(name) {
  if (name === "ps2") {
    state.ps2 = true;
    flash = 255;
    message("ФС II активирована светом.");
  }

  if (name === "water") {
    if (!state.ps2) return message("Сначала освети ФС II!");

    state.water = true;
    state.oxygen++;
    state.lumenH += 4;

    oxygenParticles.push({
      x:145,
      y:250,
      speed:1.8,
      life:100,
      phase:random(TWO_PI)
    });

    addProtons(4);

    // Четыре электрона после фотолиза воды
    for (let i = 0; i < 4; i++) {
      electronParticles.push({
        x:145,
        y:315 + i*10,
        targetX:145,
        speed:2.1 + random(0, 0.5),
        consumed:false,
        finished:false
      });
    }

    message("Фотолиз: поступили четыре электрона, образовался O₂.");
  }

  if (name === "etc") {
    if (!state.ps2) return message("Сначала активируй ФС II!");

    let moved = false;

    for (let e of electronParticles) {
      if (!e.consumed && e.targetX < 785) {
        let nextX = pathX.find(x => x > e.targetX + 1);

        if (nextX !== undefined) {
          e.targetX = nextX;
          moved = true;
        }
      }
    }

    if (!moved) {
      return message("Электроны уже дошли до ферредоксина.");
    }

    state.etcStep = min(5, state.etcStep + 1);

    if (state.etcStep === 2) {
      state.lumenH += 2;
      addProtons(2);
    }

    message("Электроны движутся по электрон-транспортной цепи.");
  }

  if (name === "ps1") {
    let atPSI = electronParticles.some(e =>
      !e.consumed && e.x >= 655
    );

    if (!atPSI) {
      return message("Сначала доставь электроны к ФС I!");
    }

    state.ps1 = true;
    flash = 255;
    message("ФС I активирована светом.");
  }

  if (name === "nadph") {
    if (!state.ps1) return message("Сначала освети ФС I!");

    if (state.cyclic) {
      return message("При циклическом потоке НАДФ·Н не образуется!");
    }

    let available = electronParticles.filter(e =>
      !e.consumed && e.x >= 785 && e.targetX >= 785
    );

    let pairs = floor(available.length / 2);

    if (pairs < 1) {
      return message("Нужно доставить к ферредоксину ещё два электрона!");
    }

    let used = pairs * 2;
    let selected = available.slice(0, used);

    for (let e of selected) {
      e.consumed = true;
      e.targetX = 900;
    }

    state.nadphCount += pairs;
    state.nadph = true;

    message("Образовалось молекул НАДФ·Н: " + pairs);
  }

  if (name === "atp") {
    if (state.lumenH < 2) {
      return message("Сначала накопи протоны в люмене!");
    }

    state.lumenH -= 2;
    state.atp++;

    for (let i = 0; i < 2; i++) {
      flowingProtons.push({
        y:430-i*25,
        life:90
      });
    }

    message("Протоны проходят через АТФ-синтазу. Образуется АТФ.");
  }

  if (name === "cycle") {
    state.cyclic = !state.cyclic;

    if (state.cyclic) {
      message("Циклический поток: ФС I → Fd → b₆f → PC → ФС I. Без O₂ и НАДФ·Н.");
    } else {
      message("Линейный транспорт снова доступен.");
    }
  }

  if (name === "reset") resetAll();

  if (name === "hint") state.hint = !state.hint;
}

// ---------------- ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ ----------------

function addProtons(n) {
  for (let i = 0; i < n; i++) {
    protonParticles.push({
      x:random(180, 950),
      y:random(455, 525),
      phase:random(TWO_PI)
    });
  }
}

function message(msg) {
  notice = msg;
  noticeTimer = 240;
}

// ---------------- ОБНОВЛЁННАЯ РАМКА СООБЩЕНИЙ ----------------

function drawNotice() {
  if (noticeTimer > 0) {
    let boxX = 250;
    let boxY = 510;
    let boxW = 600;
    let boxH = 76;

    fill(255, 248, 218);
    stroke(190, 150, 60);
    strokeWeight(1.5);
    rect(boxX, boxY, boxW, boxH, 12);

    noStroke();
    fill(65);
    textAlign(CENTER, CENTER);
    textStyle(NORMAL);

    let fontSize = notice.length > 85 ? 11 : 13;
    textSize(fontSize);
    textLeading(16);

    text(
      notice,
      boxX + 18,
      boxY + 8,
      boxW - 36,
      boxH - 16
    );

    noticeTimer--;
  }
}

// ---------------- СБРОС ----------------

function resetAll() {
  state = {
    ps2:false,
    water:false,
    ps1:false,
    nadph:false,
    nadphCount:0,
    etcStep:0,
    lumenH:0,
    atp:0,
    oxygen:0,
    cyclic:false,
    hint:false
  };

  electronParticles = [];
  oxygenParticles = [];
  protonParticles = [];
  flowingProtons = [];

  notice = "";
  noticeTimer = 0;
  flash = 0;
}
