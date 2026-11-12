let stage = 0;
let playing = false;
let lastChange = 0;

const AUTO_DELAY = 3500;

let startButtonElement;

const stages = [
  {
    name: "Интерфаза G₁",
    title: "Рост и подготовка клетки",
    description: "Клетка растёт, синтезирует белки, увеличивается количество органоидов. Хромосомы однохроматидные, количество ДНК ещё не удвоилось.",
    chromosomes: "2n = 4",
    chromatids: "4",
    dna: "2c",
    event: "Подготовка к репликации ДНК"
  },
  {
    name: "Интерфаза S",
    title: "Репликация ДНК",
    description: "Происходит удвоение молекул ДНК. Каждая хромосома становится двухроматидной. Число хромосом не меняется.",
    chromosomes: "2n = 4",
    chromatids: "8",
    dna: "4c",
    event: "У каждой хромосомы две сестринские хроматиды"
  },
  {
    name: "Профаза",
    title: "Спирализация хромосом",
    description: "Хромосомы спирализуются и становятся хорошо заметными. Начинается распад ядерной оболочки и ядрышек. Формируется веретено деления.",
    chromosomes: "2n = 4",
    chromatids: "8",
    dna: "4c",
    event: "Ядерная оболочка постепенно разрушается"
  },
  {
    name: "Метафаза",
    title: "Экваториальная плоскость",
    description: "Двухроматидные хромосомы располагаются в экваториальной плоскости клетки. Нити веретена деления прикрепляются к кинетохорам в области центромер.",
    chromosomes: "2n = 4",
    chromatids: "8",
    dna: "4c",
    event: "Хромосомы выстроены по экватору"
  },
  {
    name: "Анафаза",
    title: "Расхождение хромосом",
    description: "Центромерные области разделяются. Сестринские хроматиды расходятся к противоположным полюсам. Каждая хроматида становится самостоятельной однохроматидной хромосомой.",
    chromosomes: "4n = 8",
    chromatids: "8 однохроматидных хромосом",
    dna: "4c",
    event: "В одной клетке временно 8 хромосом и 8 молекул ДНК"
  },
  {
    name: "Телофаза",
    title: "Образование двух ядер",
    description: "Хромосомы деспирализуются. Восстанавливаются ядерные оболочки и ядрышки. В каждом формирующемся ядре находится диплоидный набор хромосом.",
    chromosomes: "2n = 4 в каждом ядре",
    chromatids: "4 однохроматидные хромосомы",
    dna: "2c в каждом ядре",
    event: "Формируются два дочерних ядра"
  },
  {
    name: "Цитокинез",
    title: "Разделение цитоплазмы",
    description: "Цитоплазма разделяется. Образуются две дочерние клетки с одинаковым набором хромосом и количеством ДНК.",
    chromosomes: "2n = 4 в каждой клетке",
    chromatids: "4 однохроматидные хромосомы",
    dna: "2c в каждой клетке",
    event: "Образуются две генетически идентичные клетки"
  }
];

const chromosomeColors = [
  [35, 135, 95],
  [100, 175, 125],
  [65, 115, 190],
  [125, 155, 215]
];

const COLORS = {
  background: [248, 250, 242],
  darkGreen: [30, 82, 57],
  green: [45, 110, 70],
  lightGreen: [231, 244, 226],
  violet: [104, 76, 155],
  violetLight: [225, 220, 247],
  gold: [220, 150, 40],
  text: [55, 65, 55],
  muted: [90, 105, 95]
};

// ======================================================
// НАСТРОЙКА
// ======================================================

function setup() {
  const cnv = createCanvas(1200, 760);

  cnv.style("width", "100%");
  cnv.style("height", "auto");
  cnv.style("display", "block");

  textFont("Arial");
  lastChange = millis();

  createControlPanel(cnv.elt);
}

// ======================================================
// СОЗДАНИЕ НАСТОЯЩЕЙ ПАНЕЛИ УПРАВЛЕНИЯ
// ======================================================

function createControlPanel(canvasElement) {
  const panel = document.createElement("div");

  panel.style.display = "flex";
  panel.style.flexWrap = "wrap";
  panel.style.justifyContent = "center";
  panel.style.alignItems = "center";
  panel.style.gap = "12px";
  panel.style.padding = "16px 10px";
  panel.style.width = "100%";
  panel.style.boxSizing = "border-box";
  panel.style.background = "#f8faf2";

  canvasElement.parentNode.insertBefore(
    panel,
    canvasElement.nextSibling
  );

  createHtmlButton(panel, "◀ Назад", false, () => {
    previousStage();
    playing = false;
    updateStartButton();
  });

  startButtonElement = createHtmlButton(
    panel,
    "▶ Старт",
    true,
    () => {
      playing = !playing;
      lastChange = millis();
      updateStartButton();
    }
  );

  createHtmlButton(panel, "Далее ▶", false, () => {
    nextStage();
    playing = false;
    updateStartButton();
  });

  createHtmlButton(panel, "Сначала", false, () => {
    stage = 0;
    playing = false;
    lastChange = millis();
    updateStartButton();
  });

  const hint = document.createElement("div");
  hint.textContent = "Управление: ← →, пробел — пауза / продолжить";

  hint.style.width = "100%";
  hint.style.textAlign = "center";
  hint.style.fontSize = "13px";
  hint.style.color = "#4b5f4b";
  hint.style.paddingTop = "4px";

  panel.appendChild(hint);
}

function createHtmlButton(parent, label, primary, action) {
  const button = document.createElement("button");

  button.type = "button";
  button.textContent = label;

  button.style.padding = "11px 20px";
  button.style.borderRadius = "10px";
  button.style.border = primary
    ? "1.5px solid #2d6e46"
    : "1.5px solid #a5bea5";

  button.style.background = primary ? "#2d6e46" : "#ffffff";
  button.style.color = primary ? "#ffffff" : "#235a37";
  button.style.fontSize = "14px";
  button.style.fontWeight = "bold";
  button.style.cursor = "pointer";
  button.style.minWidth = "100px";

  button.addEventListener("click", action);

  button.addEventListener("mouseenter", () => {
    button.style.opacity = "0.82";
  });

  button.addEventListener("mouseleave", () => {
    button.style.opacity = "1";
  });

  parent.appendChild(button);

  return button;
}

function updateStartButton() {
  if (!startButtonElement) return;

  startButtonElement.textContent = playing
    ? "Пауза"
    : "▶ Старт";
}

// ======================================================
// ОСНОВНОЙ ЦИКЛ
// ======================================================

function draw() {
  background(...COLORS.background);

  drawHeader();
  drawTimeline();
  drawCellArea();
  drawInformationPanel();

  if (playing && millis() - lastChange >= AUTO_DELAY) {
    if (stage < stages.length - 1) {
      stage++;
    }

    lastChange = millis();

    if (stage === stages.length - 1) {
      playing = false;
      updateStartButton();
    }
  }
}

// ======================================================
// ЗАГОЛОВОК
// ======================================================

function drawHeader() {
  noStroke();

  fill(...COLORS.darkGreen);
  textAlign(CENTER, CENTER);
  textSize(30);
  textStyle(BOLD);
  text("МИТОЗ — ДЕЛЕНИЕ КЛЕТКИ", 600, 35);

  fill(75, 100, 78);
  textSize(16);
  textStyle(NORMAL);
  text(
    "Интерактивная модель для подготовки к ЕГЭ по биологии",
    600,
    66
  );

  stroke(200, 215, 198);
  strokeWeight(1);
  line(40, 90, 1160, 90);
}

// ======================================================
// ШКАЛА ЭТАПОВ
// ======================================================

function drawTimeline() {
  const x0 = 95;
  const gap = 155;
  const y = 130;

  stroke(190, 205, 183);
  strokeWeight(4);
  line(x0, y, x0 + gap * 6, y);

  for (let i = 0; i < stages.length; i++) {
    const x = x0 + i * gap;
    const active = i === stage;
    const completed = i < stage;

    noStroke();

    if (active) {
      fill(...COLORS.gold);
    } else if (completed) {
      fill(45, 135, 85);
    } else {
      fill(195, 210, 190);
    }

    circle(x, y, active ? 25 : 17);

    if (active) {
      noFill();
      stroke(104, 76, 155);
      strokeWeight(3);
      circle(x, y, 34);
    }

    noStroke();
    textAlign(CENTER, CENTER);

    if (active) {
      fill(104, 76, 155);
      textSize(14);
      textStyle(BOLD);
    } else if (completed) {
      fill(45, 110, 85);
      textSize(13);
      textStyle(BOLD);
    } else {
      fill(80, 100, 115);
      textSize(13);
      textStyle(BOLD);
    }

    text(stages[i].name, x, y + 38);
  }

  textStyle(NORMAL);
}

// ======================================================
// ОБЛАСТЬ КЛЕТКИ
// ======================================================

function drawCellArea() {
  rectMode(CORNER);

  fill(255);
  stroke(215, 225, 210);
  strokeWeight(1);
  rect(35, 180, 730, 475, 22);

  noStroke();
  fill(...COLORS.darkGreen);
  textAlign(CENTER, CENTER);
  textSize(19);
  textStyle(BOLD);
  text("МОДЕЛЬ КЛЕТКИ", 400, 207);
  textStyle(NORMAL);

  if (stage === 6) {
    drawDaughterCells();
    return;
  }

  drawCellOutline();

  if (stage === 0) drawInterphase(false);
  else if (stage === 1) drawInterphase(true);
  else if (stage === 2) drawProphase();
  else if (stage === 3) drawMetaphase();
  else if (stage === 4) drawAnaphase();
  else if (stage === 5) drawTelophase();
}

function drawCellOutline() {
  fill(...COLORS.lightGreen);
  stroke(75, 140, 90);
  strokeWeight(4);
  ellipse(400, 430, 590, 355);
}

// ======================================================
// ИНТЕРФАЗА G1 И S
// ======================================================

function drawInterphase(isSPhase) {
  fill(...COLORS.violetLight);
  stroke(125, 105, 175);
  strokeWeight(3);
  ellipse(400, 430, 270, 230);

  const positions = [
    { x: 315, y: 385, color: chromosomeColors[0] },
    { x: 365, y: 385, color: chromosomeColors[1] },
    { x: 315, y: 465, color: chromosomeColors[2] },
    { x: 365, y: 465, color: chromosomeColors[3] }
  ];

  drawPairLabel(340, 350, "I пара");
  drawPairLabel(340, 510, "II пара");

  for (let i = 0; i < positions.length; i++) {
    const p = positions[i];

    if (isSPhase) {
      drawSisterChromatids(p.x, p.y, p.color);
    } else {
      drawSingleChromatin(p.x, p.y, p.color);
    }
  }

  noStroke();
  fill(145, 110, 185);
  circle(400, 430, 30);

  if (isSPhase) {
    fill(35, 95, 60);
    textAlign(CENTER, CENTER);
    textSize(15);
    textStyle(BOLD);
    text("Каждая хромосома удвоилась", 400, 625);
    textStyle(NORMAL);
  }
}

function drawPairLabel(x, y, label) {
  noStroke();
  fill(65, 90, 70);
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  text(label, x, y);
  textStyle(NORMAL);
}

function drawSingleChromatin(x, y, col) {
  push();

  noFill();
  stroke(col[0], col[1], col[2]);
  strokeWeight(4);

  beginShape();

  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const px = x + t * 38;
    const py = y + sin(t * 4 * PI) * 8;
    vertex(px, py);
  }

  endShape();
  pop();
}

function drawSisterChromatids(x, y, col) {
  push();

  noFill();
  stroke(col[0], col[1], col[2]);
  strokeWeight(4);

  beginShape();

  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const px = x + t * 38;
    const py = y - 7 + sin(t * 4 * PI) * 7;
    vertex(px, py);
  }

  endShape();

  beginShape();

  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const px = x + t * 38;
    const py = y + 7 + sin(t * 4 * PI + 0.25) * 7;
    vertex(px, py);
  }

  endShape();

  stroke(45, 55, 50);
  strokeWeight(5);
  line(x + 19, y - 7, x + 19, y + 7);

  noStroke();
  fill(45, 55, 50);
  circle(x + 19, y, 8);

  pop();
}

// ======================================================
// ХРОМОСОМЫ
// ======================================================

function drawChromosome(x, y, size, col, angle = 0) {
  push();

  translate(x, y);
  rotate(angle);

  stroke(col[0], col[1], col[2]);
  strokeWeight(9);
  strokeCap(ROUND);

  line(-size / 2, -size / 2, size / 2, size / 2);
  line(-size / 2, size / 2, size / 2, -size / 2);

  noStroke();
  fill(45, 55, 50);
  circle(0, 0, 11);

  pop();
}

function drawSingleChromosome(x, y, size, col, direction) {
  push();

  translate(x, y);

  stroke(col[0], col[1], col[2]);
  strokeWeight(8);
  strokeCap(ROUND);
  noFill();

  beginShape();
  vertex(-size / 2, direction * size / 2);
  vertex(0, 0);
  vertex(size / 2, direction * size / 2);
  endShape();

  noStroke();
  fill(45, 55, 50);
  circle(0, 0, 9);

  pop();
}

// ======================================================
// ЦЕНТРОСОМЫ И ВЕРЕТЕНО ДЕЛЕНИЯ
// ======================================================

function drawCentrosomes() {
  noStroke();
  fill(220, 160, 55);

  circle(170, 430, 25);
  circle(630, 430, 25);

  fill(105, 80, 35);
  textAlign(CENTER, CENTER);
  textSize(12);
  text("Полюс", 170, 455);
  text("Полюс", 630, 455);
}

function drawSpindle() {
  stroke(110, 165, 155, 160);
  strokeWeight(2);

  for (let i = 0; i < 4; i++) {
    const y = 345 + i * 55;
    line(170, 430, 400, y);
    line(630, 430, 400, y);
  }
}

// ======================================================
// ПРОФАЗА
// ======================================================

function drawProphase() {
  noFill();
  stroke(125, 100, 175);
  strokeWeight(4);

  arc(400, 430, 260, 220, -2.8, -2.1);
  arc(400, 430, 260, 220, -1.6, -0.8);
  arc(400, 430, 260, 220, 0.1, 0.8);
  arc(400, 430, 260, 220, 1.4, 2.1);
  arc(400, 430, 260, 220, 2.6, 3.2);

  drawCentrosomes();
  drawSpindle();

  for (let i = 0; i < 4; i++) {
    const x = 315 + (i % 2) * 170;
    const y = 375 + floor(i / 2) * 100;

    drawChromosome(x, y, 48, chromosomeColors[i]);
  }

  noStroke();
  fill(90, 75, 125);
  textAlign(CENTER, CENTER);
  textSize(12);
  text("Фрагменты ядерной оболочки", 400, 590);
}

// ======================================================
// МЕТАФАЗА
// ======================================================

function drawMetaphase() {
  drawCentrosomes();
  drawSpindle();

  drawingContext.setLineDash([7, 7]);
  stroke(130, 165, 125);
  strokeWeight(2);
  line(400, 270, 400, 585);
  drawingContext.setLineDash([]);

  for (let i = 0; i < 4; i++) {
    drawChromosome(
      400,
      345 + i * 55,
      42,
      chromosomeColors[i]
    );
  }

  noStroke();
  fill(35, 95, 60);
  textAlign(CENTER, CENTER);
  textSize(15);
  textStyle(BOLD);
  text("Экваториальная плоскость", 400, 635);
  textStyle(NORMAL);
}

// ======================================================
// АНАФАЗА
// ======================================================

function drawAnaphase() {
  drawCentrosomes();

  for (let i = 0; i < 4; i++) {
    const y = 335 + i * 55;

    drawSingleChromosome(
      275, y, 34, chromosomeColors[i], 1
    );

    drawSingleChromosome(
      525, y, 34, chromosomeColors[i], -1
    );
  }

  stroke(110, 165, 155, 150);
  strokeWeight(2);

  for (let i = 0; i < 4; i++) {
    const y = 335 + i * 55;
    line(170, 430, 275, y);
    line(630, 430, 525, y);
  }

  noStroke();
  fill(35, 95, 60);
  textAlign(CENTER, CENTER);
  textSize(15);
  textStyle(BOLD);
  text("По 4 хромосомы у каждого полюса", 400, 635);
  textStyle(NORMAL);
}

// ======================================================
// ТЕЛОФАЗА
// ======================================================

function drawTelophase() {
  for (const side of [-1, 1]) {
    const x = 400 + side * 145;

    fill(225, 220, 247);
    stroke(125, 105, 175);
    strokeWeight(3);
    ellipse(x, 430, 165, 150);

    noStroke();
    fill(145, 110, 185);
    circle(x, 430, 24);

    for (let i = 0; i < 4; i++) {
      drawSingleChromatin(
        x - 40 + (i % 2) * 30,
        405 + floor(i / 2) * 45,
        chromosomeColors[i]
      );
    }
  }
}

// ======================================================
// ЦИТОКИНЕЗ
// ======================================================

function drawDaughterCells() {
  for (const side of [-1, 1]) {
    const x = 400 + side * 175;

    fill(231, 244, 226);
    stroke(75, 140, 90);
    strokeWeight(4);
    ellipse(x, 430, 270, 245);

    fill(225, 220, 247);
    stroke(125, 105, 175);
    strokeWeight(3);
    circle(x, 430, 115);

    noStroke();
    fill(145, 110, 185);
    circle(x, 430, 18);

    for (let i = 0; i < 4; i++) {
      drawSingleChromatin(
        x - 40 + (i % 2) * 30,
        405 + floor(i / 2) * 45,
        chromosomeColors[i]
      );
    }
  }

  noStroke();
  fill(35, 95, 60);
  textAlign(CENTER, CENTER);
  textSize(16);
  textStyle(BOLD);
  text("Две генетически идентичные дочерние клетки", 400, 590);
  textStyle(NORMAL);
}

// ======================================================
// ИНФОРМАЦИОННАЯ ПАНЕЛЬ
// ======================================================

function drawInformationPanel() {
  rectMode(CORNER);

  fill(255);
  stroke(215, 225, 210);
  strokeWeight(1);
  rect(785, 180, 380, 475, 22);

  const s = stages[stage];

  noStroke();
  fill(104, 76, 155);
  textAlign(CENTER, CENTER);
  textSize(26);
  textStyle(BOLD);
  text(s.name, 975, 215);

  fill(175, 110, 25);
  textSize(17);
  text(s.title, 975, 250);

  fill(...COLORS.text);
  textAlign(LEFT, TOP);
  textSize(15);
  textStyle(NORMAL);
  textLeading(21);
  text(s.description, 810, 280, 330, 100);

  fill(30, 85, 55);
  textSize(16);
  textStyle(BOLD);
  text("ПОКАЗАТЕЛИ КЛЕТКИ", 810, 397);

  fill(55, 65, 55);
  textSize(14);
  textStyle(BOLD);
  text("Хромосомный набор:", 810, 425);

  fill(175, 105, 20);
  textAlign(RIGHT, CENTER);
  textSize(16);
  text(s.chromosomes, 1140, 448);

  fill(55, 65, 55);
  textAlign(LEFT, CENTER);
  textSize(14);
  textStyle(BOLD);
  text("Хроматиды / хромосомы:", 810, 475);

  fill(175, 105, 20);
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text(s.chromatids, 810, 495, 330, 35);

  fill(55, 65, 55);
  textAlign(LEFT, CENTER);
  textSize(14);
  textStyle(BOLD);
  text("Количество ДНК:", 810, 535);

  fill(175, 105, 20);
  textAlign(RIGHT, CENTER);
  textSize(16);
  text(s.dna, 1140, 555);

  noStroke();
  fill(229, 241, 222);
  rect(810, 580, 330, 55, 12);

  fill(35, 90, 55);
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  text("ВАЖНО ДЛЯ ЕГЭ", 825, 586);

  fill(50, 70, 55);
  textSize(12);
  textStyle(NORMAL);
  text(s.event, 825, 605, 300, 27);

  textAlign(CENTER, CENTER);
}

// ======================================================
// УПРАВЛЕНИЕ ЭТАПАМИ
// ======================================================

function nextStage() {
  stage = Math.min(stage + 1, stages.length - 1);

  if (stage === stages.length - 1) {
    playing = false;
  }

  lastChange = millis();
  updateStartButton();
}

function previousStage() {
  stage = Math.max(stage - 1, 0);
  lastChange = millis();
  updateStartButton();
}

// ======================================================
// КЛАВИАТУРА
// ======================================================

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    nextStage();
    playing = false;
    updateStartButton();
    return false;
  }

  if (keyCode === LEFT_ARROW) {
    previousStage();
    playing = false;
    updateStartButton();
    return false;
  }

  if (key === " ") {
    playing = !playing;
    lastChange = millis();
    updateStartButton();
    return false;
  }

  if (key === "r" || key === "R") {
    stage = 0;
    playing = false;
    lastChange = millis();
    updateStartButton();
    return false;
  }
}
