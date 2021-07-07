const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

var canW, canH;

let engine;
let world;
var ground, rope, link;
var fruit;
var fruit_con;

var bgImage, bunnyImage, fruitImg;

var bunny;
var blinkAnim, eatAnim, sadAnim;
var sadSound, eatingSound, airSound, ropeSound, bgSound;

var cutBtn, blower, muteBtn;

//For C33
var cutBtn2, cutBt3, rope2, rope3, fruit_con2, fruit_con3;

function preload() {
  bgImage = loadImage("background.png");
  bunnyImage = loadImage("Rabbit-01.png");
  fruitImg = loadImage("melon.png");
  blinkAnim = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  eatAnim = loadAnimation(
    "eat_0.png",
    "eat_1.png",
    "eat_2.png",
    "eat_3.png",
    "eat_4.png"
  );
  sadAnim = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");

  sadSound = loadSound("sad.wav");
  eatingSound = loadSound("eating_sound.mp3");
  bgSound = loadSound("sound1.mp3");
  ropeSound = loadSound("rope_cut.mp3");
  airSound = loadSound("air.wav");

  eatAnim.looping = false;
  //blinkAnim.playing = false;  //can make the animation stop and display a still image
  sadAnim.looping = false;
}

function setup() {
  var isMobile = /iPhone|iPod|iPad|Android/i.test(navigator.userAgent);
  if (isMobile) {
    canW = displayWidth+80;
    canH = displayHeight;
  }
  else {
    canW = 500; //windowWidth
    canH = 700; //windowHeight
  }

  createCanvas(canW, canH);

  engine = Engine.create();
  world = engine.world;

  ground = new Ground(width/2, height, width, 20);

  //rope = new Rope(7, { x: 245, y: 30 });

  // For C33
  rope = new Rope(12, { x: 40, y: 30 });
  rope2 = new Rope(7, { x: 370, y: 40 });
  rope3 = new Rope(4, { x: 400, y: 225 });

  let fruit_options = {
    density: 0.001,
  };
  fruit = Bodies.circle(250, 300, 15, fruit_options);
  World.add(world, fruit); // Dont add it to world when fruit is added to composite.

  //Alternative :
  //We can add the fruit to composite to avoid too much of vibration / disturbance for fruit when creating the constraint directly.
  
  //Composite.add(rope.body, fruit);

  // We can also create the constraint directly with the last 2nd rectangle and fruit without adding to Composite.

  fruit_con = new Link(rope, fruit);

  fruit_con2 = new Link(rope2, fruit);
  fruit_con3 = new Link(rope3, fruit);



  //For C33


  blinkAnim.frameDelay = 20;
  eatAnim.frameDelay = 20;
  bunny = createSprite(450, canH-80, 100, 100);
  bunny.addAnimation("blink", blinkAnim);
  bunny.addAnimation("eat", eatAnim);
  bunny.addAnimation("sad", sadAnim);
  bunny.changeAnimation("blink");
  bunny.scale = 0.2;

  cutBtn = createImg("cut_btn.png");
  cutBtn.size(60, 60);
  // cutBtn.position(220, 20);
  cutBtn.position(20, 30); // For C33
  cutBtn.mouseClicked(drop); //mouseClicked for Image, mousePressed for createButton

  //For C33
  cutBtn2 = createImg("cut_btn.png");
  cutBtn2.size(60, 60);
  cutBtn2.position(330, 35);
  cutBtn2.mouseClicked(drop2);

  cutBtn3 = createImg("cut_btn.png");
  cutBtn3.size(60, 60);
  cutBtn3.position(360, 200);
  cutBtn3.mouseClicked(drop3);

  //Only for C32
  // blower = createImg("balloon.png");
  // blower.size(150, 100);
  // blower.position(10, 250);
  // blower.mouseClicked(airBlow);

  bgSound.play();
  bgSound.setVolume(0.1);

  muteBtn = createImg("mute.png");
  muteBtn.position(450, 20);
  muteBtn.size(30, 30);
  muteBtn.mouseClicked(mute);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  textSize(50);
  
}

function draw() {
  background(51);
  image(bgImage, width / 2, height / 2, width, height);
  Engine.update(engine);
  ground.show();
  rope.show();

  //For C33
  rope2.show();
  rope3.show();

  if (fruit != null)
    image(fruitImg, fruit.position.x, fruit.position.y, 60, 60);

  if (detectCollision(fruit, bunny) == true) {
    bunny.changeAnimation("eat");
    eatingSound.play();
  }
  if (fruit != null && fruit.position.y >= canH-50) {
    bunny.changeAnimation("sad");
    bgSound.stop();
    sadSound.play();
    fruit = null; //this set to null to avoid the sadSound being played repeatedly.
  }

  drawSprites();
}

function drop() {
  ropeSound.play();
  rope.break();
  fruit_con.detach();
  fruit_con = null;
}

function detectCollision(body, sprite) {
  if (body != null) {
    let distance = dist(
      body.position.x,
      body.position.y,
      sprite.position.x,
      sprite.position.y
    );
    if (distance <= 80) {
      World.remove(world, fruit);
      fruit = null;
      return true;
    } else {
      return false;
    }
  }
}

function airBlow() {
  Matter.Body.applyForce(fruit, { x: 0, y: 0 }, { x: 0.01, y: 0 });
  airSound.play();
}

function mute() {
  if (bgSound.isPlaying()) {
    bgSound.stop();
  } else {
    bgSound.play();
  }
}


// For C33
function drop2() {
  ropeSound.play();
  rope2.break();
  fruit_con2.detach();
  fruit_con2 = null;
}


function drop3() {
  ropeSound.play();
  rope3.break();
  fruit_con3.detach();
  fruit_con3 = null;
}