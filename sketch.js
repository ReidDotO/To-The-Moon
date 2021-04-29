let dogeP;
let dogeRocket, asteroid, dogecoin;
let scoreCount;
let t = 0;
let l = 0;
let obs = [];
let coins = [];
let gameOver = 2;
let play;
let space1, space2;
let spaceX;
let stonkLine;

function preload() {

  dogeRocket = loadImage("dogerocket.png");
  asteroid = loadImage("asteroid.png")
  dogecoin = loadImage("Dogecoin.png")
  space1 = loadImage("space.jpg");
  space2 = loadImage("space.jpg");
}

function setup() {
  createCanvas(600, 600);
  imageMode(CENTER);
  angleMode(DEGREES);
  dogeP = new Doge(150, 200);
  obs[0] = new Obstacle();
  coins[0] = new Coin();
  scoreCount = new ScoreCounter();
  stonkLine = new Stonk();

  play = createButton('PLAY');
  play.position(width / 2 - 50, height - 150);
  play.size(100, 50);
  play.mousePressed(played);

  spaceX = width / 2;
}

function draw() {
  image(space1, spaceX, height / 2, 960, 600);
  image(space2, spaceX + 960, height / 2, 960, 600);

  spaceX--;

  if (spaceX < -800) {
    spaceX = width / 2;
  }

  if (gameOver == 2) {

    textAlign(CENTER);
    textSize(48);
    fill('yellow');
    text("TO THE MOON", width / 2, 100);
    image(dogeRocket, width / 2 + 30, height / 2, 500, 350);

    textSize(24);
    fill(255);
    text("Press the spacebar to go up. Avoid obstacles\n and collect DogeCoin to make more money",
      width / 2, 550);
  }

  if (gameOver == 0) {

    stonkLine.map(dogeP.y);
    stonkLine.display();

    dogeP.move(3);
    dogeP.display();

    if (obs[t].x < 300) {
      t++;
      obs[t] = new Obstacle();
    }

    if (coins[l].x < -100) {
      l++;
      coins[l] = new Coin();
    }
    coins[l].move();
    coins[l].display();

    for (let i = 0; i < obs.length; i++) {

      obs[i].move();
      obs[i].display();
    }
    scoreCount.count();
    scoreCount.bonus(coins[l].collected);
    scoreCount.display();

    stonkLine.reset(scoreCount.score);
  }

  if (t > 1) {
    dogeP.collide(obs[t - 1].x, obs[t - 1].top, obs[t - 1].bottom, 50);
  } else {
    dogeP.collide(obs[0].x, obs[0].top, obs[0].bottom, 50);
  }
  coins[l].collect(dogeP.x, dogeP.y, 50);


}

class Doge {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.yMove = 3;
  }

  move(yUp) {

    this.yMove = lerp(this.yMove, yUp, 0.1);
    this.y += this.yMove;

    if (this.y > height) {
      this.yMove = 0;
    }
    if (this.y < 0) {
      this.y = 1;
    }
  }

  collide(thisx, top, bottom, otherr) {
    if (dist(this.x, this.y, thisx, top) < (otherr) ||
      dist(this.x, this.y, thisx, bottom) < (otherr) ||
      this.y > height) {

      noStroke();
      textAlign(CENTER);
      textSize(32);
      fill('yellow');
      text("GAME OVER", width / 2, height / 2);
      textSize(24);
      fill(255);
      text("REFRESH TO PLAY AGAIN", width / 2, height / 2 + 40);
      gameOver = 1;
    }
  }

  display() {

    //circle(this.x, this.y, 20);
    image(dogeRocket, this.x, this.y, 150, 100);
  }
}

class Obstacle {
  constructor() {
    this.top = random(50, height - 350);
    this.bottom = this.top + random(200, 325);
    this.x = width - 5;
    this.rot = 1;
  }

  move() {

    this.x -= 2;
    this.rot += 1;
  }

  display() {
    push();
    translate(this.x, this.top);
    rotate(this.rot);
    image(asteroid, 0, 0, 75, 75);
    pop();

    push();
    translate(this.x, this.bottom);
    rotate(this.rot + 90);
    image(asteroid, 0, 0, 75, 75);
    pop();
  }
}

class Coin {
  constructor() {
    this.y = random(0, height);
    this.x = width - 5;
    this.collected = 0;
  }

  move() {
    this.x -= 2;
  }

  collect(thisx, thisy, otherr) {
    if (dist(this.x, this.y, thisx, thisy) < (otherr)) {
      this.collected = 1;
    }
  }

  display() {
    if (this.collected == 0) {
      push();
      translate(this.x, this.y);
      image(dogecoin, 0, 0, 50, 50);
      pop();
    }
  }
}

class ScoreCounter {
  constructor() {
    this.score = 0;
    this.added = 0;
  }
  count() {
    this.score += 1;
  }
  bonus(add) {

    if (add == 0) {
      this.added = 0;
    }

    if (this.added == 0) {
      if (add == 1) {
        this.score += 500;
        this.added = 1;
      }
    }
  }
  display() {
    noStroke();
    textSize(24);
    fill('green');
    text("$" + round(this.score), width / 2, 50);
  }
}

class Stonk {
  constructor() {
    this.high = 300;
    this.low = 300;
    this.shipY = 200;
    this.first = 300
    this.second = 300;
    this.time = 350;
  }
  map(y) {

    this.shipY = y;

    noFill();
    strokeWeight(3);

    if (this.shipY < this.high) {
      this.high = this.shipY;
      this.second = this.high;
      this.first = this.low;
    }
    if (this.shipY > this.low) {
      this.low = this.shipY;
      this.second = this.low;
      this.first = this.high;
    }
    if (this.second > this.first) {
      stroke('red');
    } else {
      stroke('green');
    }
  }
  reset(num) {
    if (num - this.time > 350) {
      this.high = 300;
      this.low = 300;
      this.time = num;
    }
  }
  display() {
    beginShape();
    vertex(0, height / 2);
    vertex(50, this.first);
    vertex(100, this.second);
    vertex(150, this.shipY);
    endShape();
  }
}

function keyPressed() {
  if (gameOver == 0) {
    if (keyCode === 32) {
      dogeP.move(-150);
    }
  }
}

function played() {
  gameOver = 0;
  play.hide();
}