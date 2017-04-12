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

export default SoundPool;
