// ======================================================
// БИОЕГЭ С ЛЮБОВЬЮ
// ИНТЕРАКТИВНАЯ ЛАБОРАТОРИЯ МИТОЗА
// ======================================================

let stage = 0;
let playing = false;
let lastChange = 0;
let canvasWidth = 1100;
let canvasHeight = 760;

const AUTO_DELAY = 3500;

const stages = [
  {
    name: "Интерфаза",
    title: "Подготовка клетки к делению",
    description: "Клетка растёт и готовится к делению. В S-периоде происходит удвоение ДНК. Каждая хромосома после репликации состоит из двух сестринских хроматид.",
    note: "Важно: интерфаза не является стадией митоза."
  },
  {
    name: "Профаза",
    title: "Спирализация хромосом",
    description: "Хроматин уплотняется, становятся заметны двухроматидные хромосомы. Начинает формироваться веретено деления. Ядерная оболочка постепенно разрушается.",
    note: "Каждая хромосома состоит из двух сестринских хроматид."
  },
  {
    name: "Метафаза",
    title: "Хромосомы на экваторе клетки",
    description: "Хромосомы располагаются в экваториальной плоскости клетки. Нити веретена деления прикрепляются к кинетохорам сестринских хроматид.",
    note: "Хромосомы максимально спирализованы."
  },
  {
    name: "Анафаза",
    title: "Расхождение хроматид",
    description: "Центромеры делятся. Сестринские хроматиды отделяются друг от друга и становятся самостоятельными дочерними хромосомами. Они движутся к противоположным полюсам клетки.",
    note: "Число хромосом в одной клетке временно удваивается."
  },
  {
    name: "Телофаза",
    title: "Формирование двух ядер",
    description: "Хромосомы достигают полюсов клетки и деспирализуются. Вокруг каждого набора хромосом формируется ядерная оболочка. Веретено деления исчезает.",
    note: "Формируются два дочерних ядра."
  },
  {
    name: "Цитокинез",
    title: "Образование дочерних клеток",
    description: "Цитоплазма разделяется. Из одной материнской клетки образуются две дочерние клетки с одинаковым набором хромосом.",
    note: "При обычном митозе дочерние клетки генетически идентичны друг другу."
  }
];

function setup() {
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("laboratory");
  textFont("Arial");
  textAlign(CENTER, CENTER);
}

function draw() {
  background("#fffdf8");

  drawHeader();
  drawProgress();
  drawCell();
  drawInformation();
  drawControls();

  if (playing && millis() - lastChange > AUTO_DELAY) {
    nextStage();
  }
}

function drawHeader() {
  fill("#205535");
  noStroke();
  textSize(28);
  textStyle(BOLD);
  text("МИТОЗ — ДЕЛЕНИЕ КЛЕТКИ", width / 2, 35);

  textStyle(NORMAL);
  fill("#68766a");
  textSize(15);
  text("Интерактивная модель стадий клеточного деления", width / 2, 65);
}

function drawProgress() {
  let names = ["Интерфаза", "Профаза", "Метафаза", "Анафаза", "Телофаза", "Цитокинез"];
  let x0 = 100;
  let y = 112;
  let stepWidth = 180;

  for (let i = 0; i < names.length; i++) {
    let x = x0 + i * stepWidth;

    fill(i === stage ? "#28613d" : (i < stage ? "#a9c8a8" : "#e5eadf"));
    noStroke();
    circle(x, y, 22);

    fill(i === stage || i < stage ? "#ffffff" : "#68766a");
    textSize(11);
    textStyle(BOLD);
    text(i + 1, x, y);

    fill(i === stage ? "#205535" : "#68766a");
    textStyle(NORMAL);
    textSize(12);
    text(names[i], x, y + 23);

    if (i < names.length - 1) {
      stroke("#cbd8c8");
      strokeWeight(3);
      line(x + 14, y, x + stepWidth - 14, y);
    }
  }
  noStroke();
}

function drawCell() {
  let cx = width / 2;
  let cy = 365;
  let rx = 285;
  let ry = 190;

  // Цитоплазма и мембрана
  fill("#eef5e9");
  stroke("#4d8058");
  strokeWeight(4);
  ellipse(cx, cy, rx * 2, ry * 2);

  // Центросомы
  drawCentrosomes(cx, cy);

  // Содержание клетки по стадиям
  if (stage === 0) {
    drawInterphase(cx, cy);
  } else if (stage === 1) {
    drawProphase(cx, cy);
  } else if (stage === 2) {
    drawMetaphase(cx, cy);
  } else if (stage === 3) {
    drawAnaphase(cx, cy);
  } else if (stage === 4) {
    drawTelophase(cx, cy);
  } else {
    drawCytokinesis(cx, cy);
  }
}

function drawCentrosomes(cx, cy) {
  if (stage === 0) return;

  let leftX = cx - 225;
  let rightX = cx + 225;

  if (stage === 1) {
    leftX = cx - 170;
    rightX = cx + 170;
  }

  if (stage >= 2) {
    leftX = cx - 220;
    rightX = cx + 220;
  }

  drawAster(leftX, cy);
  drawAster(rightX, cy);
}

function drawAster(x, y) {
  stroke("#b18b38");
  strokeWeight(2);

  for (let a = 0; a < TWO_PI; a += PI / 4) {
    line(
      x - cos(a) * 17,
      y - sin(a) * 17,
      x + cos(a) * 25,
      y + sin(a) * 25
    );
  }

  noStroke();
  fill("#d4ad50");
  circle(x, y, 17);
}

function drawInterphase(cx, cy) {
  // Ядро
  fill("#dce9f5");
  stroke("#6b91b5");
  strokeWeight(3);
  ellipse(cx, cy, 205, 145);

  // Ядрышко
  noStroke();
  fill("#7b9dbb");
  circle(cx + 35, cy - 15, 25);

  // Распределённый хроматин
  stroke("#557ba0");
  strokeWeight(3);
  noFill();

  for (let i = 0; i < 9; i++) {
    let x = cx - 65 + (i % 3) * 55;
    let y = cy - 40 + floor(i / 3) * 40;
    beginShape();
    for (let j = 0; j < 5; j++) {
      curveVertex(x + random(-10, 10), y + random(-10, 10));
    }
    endShape();
  }

  noStroke();
  fill("#205535");
  textSize(14);
  text("Ядро", cx, cy + 105);
}

function drawProphase(cx, cy) {
  // Разрушающаяся ядерная оболочка
  noFill();
  stroke("#789bb8");
  strokeWeight(2);
  drawingContext.setLineDash([8, 7]);
  arc(cx, cy, 195, 145, PI, TWO_PI);
  arc(cx, cy, 195, 145, 0, PI);
  drawingContext.setLineDash([]);

  // Конденсированные хромосомы
  for (let i = 0; i < 6; i++) {
    let x = cx - 100 + i * 40;
    let y = cy + (i % 2 === 0 ? -30 : 30);
    drawChromosome(x, y, 0.8);
  }

  drawSpindle(cx, cy, false);
}

function drawMetaphase(cx, cy) {
  drawSpindle(cx, cy, true);

  // Экваториальная плоскость
  stroke("#b18b38");
  strokeWeight(2);
  drawingContext.setLineDash([6, 6]);
  line(cx, cy - 140, cx, cy + 140);
  drawingContext.setLineDash([]);

  // Хромосомы на экваторе
  for (let i = 0; i < 6; i++) {
    let y = cy - 100 + i * 40;
    drawChromosome(cx, y, 0.75);
  }

  noStroke();
  fill("#8b6c2e");
  textSize(13);
  text("Экваториальная плоскость", cx, cy + 150);
}

function drawSpindle(cx, cy, full) {
  let left = cx - 220;
  let right = cx + 220;

  stroke("#b7a06a");
  strokeWeight(1.5);

  for (let i = 0; i < 6; i++) {
    let y = cy - 100 + i * 40;

    if (full) {
      line(left, cy, cx, y);
      line(right, cy, cx, y);
    } else {
      line(left, cy, cx + 40, y);
      line(right, cy, cx - 40, y);
    }
  }
  noStroke();
}

function drawAnaphase(cx, cy) {
  stroke("#b7a06a");
  strokeWeight(1.5);

  for (let i = 0; i < 6; i++) {
    let y = cy - 100 + i * 40;
    let offset = 105 + (i % 3) * 15;

    line(cx - 220, cy, cx - offset, y);
    line(cx + 220, cy, cx + offset, y);

    drawChromatid(cx - offset, y, -1);
    drawChromatid(cx + offset, y, 1);
  }

  noStroke();
}

function drawTelophase(cx, cy) {
  // Два новых ядра
  for (let side of [-1, 1]) {
    let nx = cx + side * 125;

    fill("#dce9f5");
    stroke("#6b91b5");
    strokeWeight(3);
    ellipse(nx, cy, 125, 115);

    for (let i = 0; i < 4; i++) {
      drawChromosome(nx - 25 + i * 17, cy + (i % 2) * 15, 0.35);
    }
  }
}

function drawCytokinesis(cx, cy) {
  // Две дочерние клетки
  for (let side of [-1, 1]) {
    let nx = cx + side * 140;

    fill("#eef5e9");
    stroke("#4d8058");
    strokeWeight(4);
    ellipse(nx, cy, 250, 290);

    fill("#dce9f5");
    stroke("#6b91b5");
    strokeWeight(3);
    ellipse(nx, cy, 100, 85);

    for (let i = 0; i < 4; i++) {
      drawChromosome(nx - 20 + i * 13, cy + (i % 2) * 12, 0.3);
    }
  }
}

function drawChromosome(x, y, scaleValue) {
  push();
  translate(x, y);
  scale(scaleValue);

  stroke("#b34f61");
  strokeWeight(8);
  strokeCap(ROUND);

  line(-17, -24, 17, 24);
  line(17, -24, -17, 24);

  noStroke();
  fill("#8f3548");
  circle(0, 0, 10);

  pop();
}

function drawChromatid(x, y, direction) {
  push();
  translate(x, y);
  rotate(direction * 0.15);

  stroke("#b34f61");
  strokeWeight(7);
  strokeCap(ROUND);
  line(0, -20, 0, 20);

  noStroke();
  fill("#8f3548");
  circle(0, 0, 9);

  pop();
}

function drawInformation() {
  let y = 585;

  fill("#205535");
  noStroke();
  textStyle(BOLD);
  textSize(23);
  text(stages[stage].name, width / 2, y);

  textStyle(BOLD);
  textSize(16);
  fill("#42654a");
  text(stages[stage].title, width / 2, y + 30);

  textStyle(NORMAL);
  textSize(14);
  fill("#53665a");

  let words = stages[stage].description;
  text(words, width / 2, y + 65, 900, 48);

  fill("#9b772e");
  textStyle(BOLD);
  textSize(13);
  text(stages[stage].note, width / 2, y + 120);

  textStyle(NORMAL);
}

function drawControls() {
  let y = 700;
  let buttons = [
    { x: 270, w: 125, label: "← Назад" },
    { x: 415, w: 125, label: "Далее →" },
    { x: 560, w: 190, label: playing ? "Пауза" : "Автоматически" },
    { x: 770, w: 130, label: "Сначала" }
  ];

  for (let b of buttons) {
    let active = mouseX >= b.x && mouseX <= b.x + b.w &&
                 mouseY >= y - 20 && mouseY <= y + 20;

    fill(active ? "#19482c" : "#28613d");
    noStroke();
    rect(b.x, y - 20, b.w, 40, 9);

    fill("#ffffff");
    textSize(13);
    textStyle(BOLD);
    text(b.label, b.x + b.w / 2, y);
  }

  textStyle(NORMAL);
}

function mousePressed() {
  let y = 700;

  if (mouseY < y - 20 || mouseY > y + 20) return;

  if (mouseX >= 270 && mouseX <= 395) {
    previousStage();
  } else if (mouseX >= 415 && mouseX <= 540) {
    nextStage();
  } else if (mouseX >= 560 && mouseX <= 750) {
    playing = !playing;
    lastChange = millis();
  } else if (mouseX >= 770 && mouseX <= 900) {
    stage = 0;
    playing = false;
  }
}

function nextStage() {
  if (stage < stages.length - 1) {
    stage++;
  } else {
    playing = false;
  }
  lastChange = millis();
}

function previousStage() {
  if (stage > 0) {
    stage--;
  }
  playing = false;
  lastChange = millis();
}
