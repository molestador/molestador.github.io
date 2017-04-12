
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

export default QuadTree;
