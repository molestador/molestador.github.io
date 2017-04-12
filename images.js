
import { init } from './main';

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
            init();
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

export default imageRepository;
