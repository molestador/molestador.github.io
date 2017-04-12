/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__images__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__input__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sound__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__collision__ = __webpack_require__(1);
/* harmony export (immutable) */ __webpack_exports__["init"] = init;





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
        this.context.drawImage(__WEBPACK_IMPORTED_MODULE_0__images__["a" /* default */].background, this.x, this.y);
        this.context.drawImage(__WEBPACK_IMPORTED_MODULE_0__images__["a" /* default */].background, this.x + 960, this.y);
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
            this.context.drawImage(__WEBPACK_IMPORTED_MODULE_0__images__["a" /* default */].bullet, this.x, this.y);
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
                bullet.init(0, 0, __WEBPACK_IMPORTED_MODULE_0__images__["a" /* default */].bullet.width,
                    __WEBPACK_IMPORTED_MODULE_0__images__["a" /* default */].bullet.height);
                bullet.collidableWith = 'enemy';
                bullet.type = 'bullet';
                pool[i] = bullet;
            }
        } else if (obj === 'enemy') {
            for (let i = 0; i < size; i += 1) {
                const enemy = new Enemy();
                enemy.init(0, 0, __WEBPACK_IMPORTED_MODULE_0__images__["a" /* default */].enemy.width, __WEBPACK_IMPORTED_MODULE_0__images__["a" /* default */].enemy.height);
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
        this.context.drawImage(__WEBPACK_IMPORTED_MODULE_0__images__["a" /* default */].spaceship, this.x, this.y);
    };
    this.move = function () {
        this.moveLeft = () => this.x -= this.speed;
        this.moveRight = () => this.x += this.speed;
        this.moveUp = () => this.y -= this.speed;
        this.moveDown = () => this.y += this.speed;

        counter += 1;

        this.context.clearRect(this.x, this.y, this.width, this.height);

        if (__WEBPACK_IMPORTED_MODULE_1__input__["a" /* default */].isDown(__WEBPACK_IMPORTED_MODULE_1__input__["a" /* default */].LEFT) || __WEBPACK_IMPORTED_MODULE_1__input__["a" /* default */].isDown(__WEBPACK_IMPORTED_MODULE_1__input__["a" /* default */].VIMLEFT)) {
            this.moveLeft();
            if (this.x <= 0) {
                this.x = 0;
            }
        }
        if (__WEBPACK_IMPORTED_MODULE_1__input__["a" /* default */].isDown(__WEBPACK_IMPORTED_MODULE_1__input__["a" /* default */].RIGHT) || __WEBPACK_IMPORTED_MODULE_1__input__["a" /* default */].isDown(__WEBPACK_IMPORTED_MODULE_1__input__["a" /* default */].VIMRIGHT)) {
            this.moveRight();
            if (this.x >= this.canvasWidth - this.width) {
                this.x = this.canvasWidth - this.width;
            }
        }
        if (__WEBPACK_IMPORTED_MODULE_1__input__["a" /* default */].isDown(__WEBPACK_IMPORTED_MODULE_1__input__["a" /* default */].DOWN) || __WEBPACK_IMPORTED_MODULE_1__input__["a" /* default */].isDown(__WEBPACK_IMPORTED_MODULE_1__input__["a" /* default */].VIMDOWN)) {
            this.moveDown();
            if (this.y >= this.canvasHeight - this.height) {
                this.y = this.canvasHeight - this.height;
            }
        }
        if (__WEBPACK_IMPORTED_MODULE_1__input__["a" /* default */].isDown(__WEBPACK_IMPORTED_MODULE_1__input__["a" /* default */].UP) || __WEBPACK_IMPORTED_MODULE_1__input__["a" /* default */].isDown(__WEBPACK_IMPORTED_MODULE_1__input__["a" /* default */].VIMUP)) {
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
        if (__WEBPACK_IMPORTED_MODULE_1__input__["a" /* default */].isDown(__WEBPACK_IMPORTED_MODULE_1__input__["a" /* default */].SPACE) && counter >= fireRate && !this.isColliding) {
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
            this.context.drawImage(__WEBPACK_IMPORTED_MODULE_0__images__["a" /* default */].enemy, this.x, this.y);
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

        this.laser = new __WEBPACK_IMPORTED_MODULE_2__sound__["a" /* default */](10);
        this.laser.init('laser');

        this.explosion = new __WEBPACK_IMPORTED_MODULE_2__sound__["a" /* default */](20);
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
            this.ship.init(shipStartX, shipStartY, __WEBPACK_IMPORTED_MODULE_0__images__["a" /* default */].spaceship.width,
                __WEBPACK_IMPORTED_MODULE_0__images__["a" /* default */].spaceship.height);

            this.enemyPool = new Pool(40);
            this.enemyPool.init('enemy');

            this.quadTree = new __WEBPACK_IMPORTED_MODULE_3__collision__["a" /* default */]({
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
function init() {
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


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

function QuadTree(boundBox, lvl) {
    const maxObjects = 10;
    this.bounds = boundBox || {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    };
    let objects = [];
    this.nodes = [];
    const level = lvl || 0;
    const maxLevels = 5;

    this.clear = function () {
        objects = [];
        for (let i = 0; i < this.nodes.length; i += 1) {
            this.nodes[i].clear();
        }
        this.nodes = [];
    };
    this.getAllObjects = function (returnedObjects) {
        for (let i = 0; i < this.nodes.length; i += 1) {
            this.nodes[i].getAllObjects(returnedObjects);
        }
        for (let i = 0, len = objects.length; i < len; i += 1) {
            returnedObjects.push(objects[i]);
        }
        return returnedObjects;
    };
    this.findObjects = function (returnedObjects, obj) {
        if (typeof obj === 'undefined') {
            console.log('UNDEFINED OBJECT');
            return;
        }
        const index = this.getIndex(obj);
        if (index !== -1 && this.nodes.length) {
            this.nodes[index].findObjects(returnedObjects, obj);
        }
        for (let i = 0, len = objects.length; i < len; i += 1) {
            returnedObjects.push(objects[i]);
        }
    };
    this.insert = function (obj) {
        if (typeof obj === 'undefined') {
            return;
        }
        if (obj instanceof Array) {
            for (let i = 0, len = obj.length; i < len; i += 1) {
                this.insert(obj[i]);
            }
            return;
        }
        if (this.nodes.length) {
            const index = this.getIndex(obj);
            if (index !== -1) {
                this.nodes[index].insert(obj);
                return;
            }
        }
        objects.push(obj);
        if (objects.length > maxObjects && level < maxLevels) {
            if (this.nodes[0] == null) {
                this.split();
            }
            let i = 0;
            while (i < objects.length) {
                const index = this.getIndex(objects[i]);
                if (index !== -1) {
                    this.nodes[index].insert((objects.splice(i, 1))[0]);
                } else {
                    i += 1;
                }
            }
        }
    };

    this.getIndex = function (obj) {
        let index = -1;
        const verticalMidpoint = this.bounds.x + this.bounds.width / 2;
        const horizontalMidpoint = this.bounds.y + this.bounds.height / 2;
        const topQuadrant = (obj.y < horizontalMidpoint && obj.y + obj.height < horizontalMidpoint);
        const bottomQuadrant = (obj.y > horizontalMidpoint);
        if (obj.x < verticalMidpoint &&
            obj.x + obj.width < verticalMidpoint) {
            if (topQuadrant) {
                index = 1;
            } else if (bottomQuadrant) {
                index = 2;
            }
        } else if (obj.x > verticalMidpoint) {
            if (topQuadrant) {
                index = 0;
            } else if (bottomQuadrant) {
                index = 3;
            }
        }
        return index;
    };
    this.split = function () {
        const subWidth = (this.bounds.width / 2) | 0;
        const subHeight = (this.bounds.height / 2) | 0;
        this.nodes[0] = new QuadTree({
            x: this.bounds.x + subWidth,
            y: this.bounds.y,
            width: subWidth,
            height: subHeight,
        }, level + 1);
        this.nodes[1] = new QuadTree({
            x: this.bounds.x,
            y: this.bounds.y,
            width: subWidth,
            height: subHeight,
        }, level + 1);
        this.nodes[2] = new QuadTree({
            x: this.bounds.x,
            y: this.bounds.y + subHeight,
            width: subWidth,
            height: subHeight,
        }, level + 1);
        this.nodes[3] = new QuadTree({
            x: this.bounds.x + subWidth,
            y: this.bounds.y + subHeight,
            width: subWidth,
            height: subHeight,
        }, level + 1);
    };
}

/* harmony default export */ __webpack_exports__["a"] = (QuadTree);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main__ = __webpack_require__(0);



const imageRepository = new function () {
    this.background = new Image();
    this.spaceship = new Image();
    this.bullet = new Image();
    this.enemy = new Image();

    const numImages = 4;
    let numLoaded = 0;
    function imageLoaded() {
        numLoaded += 1;
        if (numLoaded === numImages) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__main__["init"])();
        }
    }
    this.background.onload = function () {
        imageLoaded();
    };
    this.spaceship.onload = function () {
        imageLoaded();
    };
    this.bullet.onload = function () {
        imageLoaded();
    };
    this.enemy.onload = function () {
        imageLoaded();
    };

    this.background.src = './img/space.png';
    this.spaceship.src = './img/ship.png';
    this.bullet.src = './img/bullet2.png';
    this.enemy.src = './img/enemy.png';
}();

/* harmony default export */ __webpack_exports__["a"] = (imageRepository);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const Key = {
    _pressed: {},
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    VIMLEFT: 72,
    VIMRIGHT: 76,
    VIMDOWN: 74,
    VIMUP: 75,

    isDown(keyCode) {
        return this._pressed[keyCode];
    },

    onKeydown(event) {
        this._pressed[event.keyCode] = true;
    },

    onKeyup(event) {
        delete this._pressed[event.keyCode];
    },
};

window.addEventListener('keyup', (event) => { Key.onKeyup(event); }, false);
window.addEventListener('keydown', (event) => { Key.onKeydown(event); }, false);

/* harmony default export */ __webpack_exports__["a"] = (Key);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function SoundPool(maxSize) {
    const size = maxSize;
    const pool = [];
    this.pool = pool;
    let currSound = 0;

    this.init = function (obj) {
        if (obj === 'laser') {
            for (let i = 0; i < size; i += 1) {
                const laser = new Audio('./sound/laser.wav');
                laser.volume = 0.10;
                laser.load();
                pool[i] = laser;
            }
        } else if (obj === 'explosion') {
            for (let i = 0; i < size; i += 1) {
                const explosion = new Audio('./sound/explosion.wav');
                explosion.volume = 0.1;
                explosion.load();
                pool[i] = explosion;
            }
        }
    };

    this.get = function () {
        if (pool[currSound].currentTime === 0 || pool[currSound].ended) {
            pool[currSound].play();
        }
        currSound = (currSound + 1) % size;
    };
}

/* harmony default export */ __webpack_exports__["a"] = (SoundPool);


/***/ })
/******/ ]);