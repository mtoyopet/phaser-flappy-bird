
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 2800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

let bird;
let totalDelta = 0;
const VELOCITY = 200;
const FLAP_VELOCITY = 250;
const birdInitialPosition = { x: config.width / 10, y: config.height / 2 };
let pipeVerticalDistanceRange = [150, 250];
let pipeHorizontalDistanceRange = [400, 700];
let pipeHorizontalDistance = 0;
let PIPES_TO_RENDER = 4;
let pipes;

// loading your asset such as images & animations
function preload () {
  this.load.image('sky', 'assets/sky.png')
  this.load.image('bird', 'assets/bird.png')
  this.load.image('pipe', 'assets/pipe.png')
}

// initializing instance of objects
function create () {
  this.add.image(0, 0, 'sky').setOrigin(0, 0);
  bird = this.physics.add.sprite(config.width / 10, config.height / 2, 'bird').setOrigin(0, 0)
  bird.body.gravity.y = VELOCITY

  pipes = this.physics.add.group()

  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    let upperPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 1);
    let lowerPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 0);
    placePipe(upperPipe, lowerPipe);
  }

  this.input.on('pointerdown', flap)
  this.input.keyboard.on('keydown-SPACE', flap)
}

function placePipe (upperPipe, lowerPipe) {
  pipeHorizontalDistance += 400
  let pipeVerticalDistance = Phaser.Math.Between(pipeVerticalDistanceRange[0], pipeVerticalDistanceRange[1]);
  let pipeVerticalPosition = Phaser.Math.Between(0 + 20, config.height - 20 - pipeVerticalDistance);

  upperPipe.x = pipeHorizontalDistance;
  upperPipe.y = pipeVerticalPosition;

  lowerPipe.x = upperPipe.x;
  lowerPipe.y = upperPipe.y + pipeVerticalDistance;

  upperPipe.body.velocity.x = -200;
  lowerPipe.body.velocity.x = -200;  
}

function flap () {
  bird.body.velocity.y = -FLAP_VELOCITY
}

// 60pfs (60 times per second screen are updated)
function update (time, delta) {
  if (bird.y >= config.height || bird.y < 0 - bird.y) {
    restartGame()
  }
}

function restartGame () {
  bird.x = birdInitialPosition.x
  bird.y = birdInitialPosition.y
  bird.body.velocity.y = 0
}
new Phaser.Game(config)
