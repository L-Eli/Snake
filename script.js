class Game {
    constructor(board) {
        this.board = board;
        this.ctx = this.board.getContext('2d');

        this.length = 3;
        this.score = 0;
        this.size = {
            width: this.board.clientWidth,
            height: this.board.clientHeight,
        };
        this.board.width = this.size.width;
        this.board.height = this.size.height;

        this.snake = new Snake(this.size.width / 2, this.size.height / 2);
        this.food = new Food();

        this.bindHandlers();
        this.playInterval();
    }

    get length() {
        return this._length;
    }

    set length(length) {
        this._length = length;

        document.getElementById('length').innerText = this._length;
    }

    get score() {
        return this._score;
    }

    set score(score) {
        this._score = score;

        document.getElementById('score').innerText = this._score;
    }

    bindHandlers() {
        this.board.addEventListener('mousemove', event => {
            this.snake.setDirection(event.offsetX, event.offsetY);
        });

        this.board.addEventListener('mouseleave', () => {
            this.snake.setDirection(this.snake.head.x, this.snake.head.y);
        });
    }

    playInterval() {
        this.interval = requestAnimationFrame(() => {
            if (this.snakeAteFood()) {
                this.length++;
                this.score += 40;
                this.snake.grow();
                this.food.randPosition();
            }

            this.snake.move();
            this.draw();
            this.playInterval();
        });
    }

    snakeAteFood() {
        return 14 > Math.sqrt(Math.pow(this.snake.head.x - this.food.position.x, 2) + Math.pow(this.snake.head.y - this.food.position.y, 2));
    }

    draw() {
        let ctx = this.ctx;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.size.width, this.size.height);

        for (let i = 0; i < this.snake.bodies.length; i++) {
            ctx.beginPath();
            ctx.fillStyle = '#666699';
            ctx.arc(this.snake.bodies[i].x, this.snake.bodies[i].y, 10, 0, 2 * Math.PI);
            ctx.fill();
        }

        ctx.beginPath();
        ctx.fillStyle = '#333399';
        ctx.arc(this.snake.head.x, this.snake.head.y, 14, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = '#993333';
        ctx.arc(this.food.position.x, this.food.position.y, 8, 0, 2 * Math.PI);
        ctx.fill();
    }
}

class Snake {
    constructor(x, y) {
        this.head = {
            x,
            y
        };

        this.bodies = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
        this.speed = {
            horizontal: 0,
            vertical: 0,
        };
    }

    setDirection(x, y) {
        let directionX = x - this.head.x;
        let directionY = y - this.head.y;
        let radius = Math.sqrt(Math.pow(directionX, 2) + Math.pow(directionY, 2));

        if (radius) {
            this.speed.horizontal = directionX / radius * 2;
            this.speed.vertical = directionY / radius * 2;
        } else {
            this.speed.horizontal = 0;
            this.speed.vertical = 0;
        }
    }

    move() {
        this.bodies[0] = JSON.parse(JSON.stringify(this.head));

        for (let i = this.bodies.length - 1; i > 0; i--) {
            this.bodies[i] = this.bodies[i - 1];
        }

        this.head.x += this.speed.horizontal;
        this.head.y += this.speed.vertical;
    }

    grow() {
        for (let i = 0; i < 10; i++) {
            this.bodies.push({});
        }
    }
}

class Food {
    constructor() {
        this.position = {
            x: 0,
            y: 0,
        };

        this.randPosition();
    }

    randPosition() {
        this.position.x = Math.random() * 1080;
        this.position.y = Math.random() * 768;
    }
}

const game = new Game(document.getElementById('gameBoard'));
