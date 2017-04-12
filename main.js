import imageRepository from './images';
import Key from './input';
import SoundPool from './sound';
import QuadTree from './collision';

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
}());

const wrap = document.getElementById('wrap');
const canvasShip = document.createElement('canvas');
canvasShip.setAttribute('id', 'shipCanvas');
canvasShip.style.position = 'absolute';
canvasShip.width = 960;
canvasShip.height = 600;
wrap.appendChild(canvasShip);

const canvas = document.createElement('canvas');
canvas.setAttribute('id', 'mainCanvas');
canvas.width = 960;
canvas.height = 600;
wrap.appendChild(canvas);


function Drawable() {
    this.init = function (x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    };

    this.speed = 0;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.collidableWith = '';
    this.isColliding = false;
    this.type = '';

    this.draw = function () {
    };
    this.move = function () {
    };
    this.isCollidableWith = function (object) {
        return (this.collidableWith === object.type);
    };
}

function Background() {
    this.speed = 2;
    this.draw = function () {
        this.x -= this.speed;
        this.context.drawImage(imageRepository.background, this.x, this.y);
        this.context.drawImage(imageRepository.background, this.x + 960, this.y);
        if (this.x <= -this.canvasWidth) { this.x = 0; }
    };
}

Background.prototype = new Drawable();

function Bullet(obj) {
    this.alive = false;
    const self = obj;

    this.spawn = function (x, y) {
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.alive = true;
    };

    this.draw = function () {
        this.context.clearRect(this.x - 1, this.y - 1, this.width + 1, this.height + 1);
        this.x += this.speed;

        if (this.isColliding) {
            return true;
        } else if (self === 'bullet' && this.x >= this.canvasWidth) {
            return true;
        }

        if (self === 'bullet') {
            this.context.drawImage(imageRepository.bullet, this.x, this.y);
        }
        return false;
    };

    this.clear = function () {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.alive = false;
        this.isColliding = false;
    };
}
Bullet.prototype = new Drawable();


function Pool(maxSize) {
    const size = maxSize;
    const pool = [];

    this.getPool = function () {
        const obj = [];
        for (let i = 0; i < size; i += 1) {
            if (pool[i].alive) {
                obj.push(pool[i]);
            }
        }
        return obj;
    };

    this.init = function (obj) {
        if (obj === 'bullet') {
            for (let i = 0; i < size; i += 1) {
                const bullet = new Bullet('bullet');
                bullet.init(0, 0, imageRepository.bullet.width,
                    imageRepository.bullet.height);
                bullet.collidableWith = 'enemy';
                bullet.type = 'bullet';
                pool[i] = bullet;
            }
        } else if (obj === 'enemy') {
            for (let i = 0; i < size; i += 1) {
                const enemy = new Enemy();
                enemy.init(0, 0, imageRepository.enemy.width, imageRepository.enemy.height);
                enemy.collidableWith = 'ship';
                enemy.type = 'enemy';
                pool[i] = enemy;
            }
        }
    };

    this.get = function (x, y, speed) {
        if (!pool[size - 1].alive) {
            pool[size - 1].spawn(x, y, speed);
            pool.unshift(pool.pop());
        }
    };

    this.getTwo = function (x1, y1, speed1, x2, y2, speed2) {
        if (!pool[size - 1].alive &&
            !pool[size - 2].alive) {
            this.get(x1, y1, speed1);
            this.get(x2, y2, speed2);
        }
    };

    this.animate = function () {
        for (let i = 0; i < size; i += 1) {
            if (pool[i].alive) {
                if (pool[i].draw()) {
                    pool[i].clear();
                    pool.push((pool.splice(i, 1))[0]);
                }
            } else { break; }
        }
    };
}

function Ship() {
    this.speed = 3;
    this.bulletPool = new Pool(30);
    const fireRate = 25;
    let counter = 0;
    this.type = 'ship';
    this.collidableWith = 'enemy';

    this.init = function (x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.alive = true;
        this.isColliding = false;
        this.bulletPool.init('bullet');
    };

    this.draw = function () {
        this.context.drawImage(imageRepository.spaceship, this.x, this.y);
    };
    this.move = function () {
        this.moveLeft = () => this.x -= this.speed;
        this.moveRight = () => this.x += this.speed;
        this.moveUp = () => this.y -= this.speed;
        this.moveDown = () => this.y += this.speed;

        counter += 1;

        this.context.clearRect(this.x, this.y, this.width, this.height);

        if (Key.isDown(Key.LEFT) || Key.isDown(Key.VIMLEFT)) {
            this.moveLeft();
            if (this.x <= 0) {
                this.x = 0;
            }
        }
        if (Key.isDown(Key.RIGHT) || Key.isDown(Key.VIMRIGHT)) {
            this.moveRight();
            if (this.x >= this.canvasWidth - this.width) {
                this.x = this.canvasWidth - this.width;
            }
        }
        if (Key.isDown(Key.DOWN) || Key.isDown(Key.VIMDOWN)) {
            this.moveDown();
            if (this.y >= this.canvasHeight - this.height) {
                this.y = this.canvasHeight - this.height;
            }
        }
        if (Key.isDown(Key.UP) || Key.isDown(Key.VIMUP)) {
            this.moveUp();
            if (this.y <= 0) {
                this.y = 0;
            }
        }

        if (!this.isColliding) {
            this.draw();
        } else {
            this.alive = false;
            this.context.clearRect(this.x, this.y, this.width, this.height);
            game.gameOver();
        }
        if (Key.isDown(Key.SPACE) && counter >= fireRate && !this.isColliding) {
            this.fire();
            counter = 0;
        }
        this.fire = function () {
            this.bulletPool.getTwo(this.x + 89, this.y + 20, 3,
                this.x + 89, this.y + 60, 3);
            game.laser.get();
        };
    };
}

Ship.prototype = new Drawable();

function Enemy() {
    this.alive = false;
    this.collidableWith = 'bullet';
    this.collidableWith = 'ship';
    this.type = 'enemy';

    this.spawn = function (x, y, speed) {
        this.x = 900 + Math.random() * 1000;
        this.y = Math.random() * 600;
        this.speed = speed;
        this.alive = true;
    };

    this.draw = function () {
        this.context.clearRect(this.x, this.y, this.width, this.height);
        this.x -= 7;
        if (!this.isColliding) {
            this.context.drawImage(imageRepository.enemy, this.x, this.y);
            if (this.x < -250) {
                this.context.clearRect(this.x, this.y, this.width, this.height);
                return true;
            }
            return false;
        }

        game.playerScore += 50;
        game.explosion.get();
        return true;
    };

    this.clear = function () {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.alive = false;
        this.isColliding = false;
    };
}

Enemy.prototype = new Drawable();

function Game() {
    this.init = function () {
        this.playerScore = 0;

        this.laser = new SoundPool(10);
        this.laser.init('laser');

        this.explosion = new SoundPool(20);
        this.explosion.init('explosion');


        this.bgMusic = new Audio('./sound/bgm.wav');
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.15;
        this.bgMusic.load();

        this.gameOverMusic = new Audio('./sound/go.wav');
        this.gameOverMusic.volume = 0.6;
        this.gameOverMusic.load();

        this.checkAudio = window.setInterval(() => { checkReadyState(); }, 1000);

        this.canvas = document.getElementById('mainCanvas');
        this.canvasShip = document.getElementById('shipCanvas');

        if (this.canvas.getContext) {
            this.bgContext = this.canvas.getContext('2d');
            this.shipContext = this.canvasShip.getContext('2d');

            Background.prototype.context = this.bgContext;
            Background.prototype.canvasWidth = this.canvas.width;
            Background.prototype.canvasHeight = this.canvas.height;

            Ship.prototype.context = this.shipContext;
            Ship.prototype.canvasWidth = this.canvasShip.width;
            Ship.prototype.canvasHeight = this.canvasShip.height;

            Bullet.prototype.context = this.shipContext;
            Bullet.prototype.canvasWidth = this.canvasShip.width;
            Bullet.prototype.canvasHeight = this.canvasShip.height;

            Enemy.prototype.context = this.shipContext;
            Enemy.prototype.canvasWidth = this.canvasShip.width;
            Enemy.prototype.canvasHeight = this.canvasShip.height;

            this.background = new Background();
            this.background.init(0, 0);

            this.ship = new Ship();

            const shipStartX = 0;
            const shipStartY = this.canvasShip.height / 2 - 50;
            this.ship.init(shipStartX, shipStartY, imageRepository.spaceship.width,
                imageRepository.spaceship.height);

            this.enemyPool = new Pool(40);
            this.enemyPool.init('enemy');

            this.quadTree = new QuadTree({
                x: 0,
                y: 0,
                width: this.canvasShip.width,
                height: this.canvasShip.height,
            });
        }
    };

    this.spawnWave = function () {
        const x = 100;
        const y = 80;
        for (let i = 1; i <= 9; i += 1) {
            this.enemyPool.get(x, y, 2);
        }
    };
}

Game.prototype.start = function () {
    this.ship.draw();
    this.bgMusic.play();
    animate();
};

Game.prototype.gameOver = function () {
    this.bgMusic.pause();
    this.gameOverMusic.currentTime = 0;
    this.gameOverMusic.play();
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('wrapper4').style.display = 'block';
};

const game = new Game();
export function init() {
    game.init();
}

function checkReadyState() {
    if (game.gameOverMusic.readyState === 4 && game.bgMusic.readyState === 4) {
        window.clearInterval(game.checkAudio);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('start').style.display = 'block';
        document.getElementById('start').onclick = function () {
            document.getElementById('start').style.display = 'none';
            document.getElementById('wrapper3').style.display = 'none';
            game.start();
        };
    }
}


function animate() {
    document.getElementById('score').innerHTML = game.playerScore;

    game.quadTree.clear();
    game.quadTree.insert(game.ship);
    game.quadTree.insert(game.ship.bulletPool.getPool());
    game.quadTree.insert(game.enemyPool.getPool());
    detectCollision();
    if (game.enemyPool.getPool().length < 6) {
        game.spawnWave();
    }
    if (game.ship.alive) {
        requestAnimFrame(animate);
        game.background.draw();
        game.ship.move();
        game.ship.bulletPool.animate();
        game.enemyPool.animate();
    }
}

function detectCollision() {
    let obj = [];
    const objects = [];
    game.quadTree.getAllObjects(objects);

    for (let x = 0, len = objects.length; x < len; x += 1) {
        game.quadTree.findObjects(obj = [], objects[x]);

        for (let y = 0, length = obj.length; y < length; y += 1) {
            if (objects[x].collidableWith === obj[y].type &&
                (objects[x].x < obj[y].x + obj[y].width &&
                    objects[x].x + objects[x].width > obj[y].x &&
                    objects[x].y < obj[y].y + obj[y].height &&
                    objects[x].y + objects[x].height > obj[y].y)) {
                objects[x].isColliding = true;
                obj[y].isColliding = true;
            }
        }
    }
}

document.getElementById('mute').onclick = function () {
    if (game.bgMusic.volume > 0) {
        game.bgMusic.volume = 0;
        game.gameOverMusic.volume = 0;
        document.getElementById('mute').innerHTML = 'Music: Off';
    } else {
        game.bgMusic.volume = 0.15;
        game.gameOverMusic.volume = 0.15;
        document.getElementById('mute').innerHTML = 'Music: On';
    }
};
