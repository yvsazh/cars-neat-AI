class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.pos = createVector(this.x, this.y);

        this.width = 20;
        this.height = 40;
        this.selected = false;

		this.speed=0;
		this.acceleration=0.2;
		this.maxSpeed=3;
		this.friction=0.05;
		this.angle=0;

        this.dead = false;
        this.timer = 0;
        this.deadTimer = 200;
        this.img = car;

        this.controls = {
            right: false,
            left: false,
            up: false,
            down: false,
        };
        this.rewards = [
            new Boundary(20, 193, 96, 195),

            new Boundary(20, 125.5, 94, 135.5),

            new Boundary(60, 54, 111, 107),

            new Boundary(122, 45.5, 147, 99.5),

            new Boundary(188, 42, 200, 99),

            new Boundary(250, 44.5, 258, 106.5),

            new Boundary(311, 38, 316, 105),

            new Boundary(373, 37.5, 337, 111.5),

            new Boundary(413, 69, 363, 142),

            new Boundary(455, 108.5, 379, 159.5),

            new Boundary(461, 153, 387, 188),

            new Boundary(465, 189, 395, 232),

            new Boundary(469, 223, 421, 283),

            new Boundary(513, 240, 495, 306),

            new Boundary(556, 243, 555, 315),

            new Boundary(596, 242, 598, 313),

            new Boundary(646, 243.5, 648, 312.5),

            new Boundary(689, 240, 693, 315),

            new Boundary(749, 237.5, 716, 331.5),

            new Boundary(719, 337, 829, 335),

            new Boundary(709, 358, 831, 392),

            new Boundary(702, 371, 836, 465),

            new Boundary(675, 368, 684, 464),

            new Boundary(623, 367, 594, 470),

            new Boundary(532, 369.5, 523, 469.5),

            new Boundary(480, 367, 449, 474),

            new Boundary(427, 367.5, 376, 440.5),

            new Boundary(354, 343, 341, 438),

            new Boundary(260, 360, 260, 447),

            new Boundary(176, 373, 176, 453),

            new Boundary(124, 381, 108, 455),

            new Boundary(97, 351, 34, 438),

            new Boundary(97, 321.5, 22, 340.5),

            new Boundary(95, 277, 24, 278),
            new Boundary(343, 40, 326, 105),

            new Boundary(392, 52.666664123535156, 347, 122.66666412353516),
            
            new Boundary(429, 87.33332824707031, 372, 145.3333282470703),
            
            new Boundary(457, 131, 384, 170),
            
            new Boundary(462, 169.66666412353516, 391, 207.66666412353516),
            
            new Boundary(466, 206.3333282470703, 399, 251.3333282470703),
            
            new Boundary(475, 226, 440, 287),
            
            new Boundary(503, 235.3333282470703, 476, 294.3333282470703),
            
            new Boundary(523, 245.66666412353516, 515, 315.66666412353516),
            
            new Boundary(765, 244.66666793823242, 718, 327.6666679382324),
            
            new Boundary(779, 252.66666793823242, 721, 332.6666679382324),
            
            new Boundary(805, 263.6666679382324, 722, 333.6666679382324),
            
            new Boundary(824, 294.6666679382324, 722, 336.6666679382324),
            
            new Boundary(826, 353.6666679382324, 715, 345.6666679382324),
            
            new Boundary(828, 372.6666679382324, 709, 358.6666679382324),
            
            new Boundary(832, 408.6666679382324, 706, 365.6666679382324),
        ]

        this.rays = [];
        let rays = 15;
        for (let a = 0; a < 360; a += 360 / rays) {
          this.rays.push(new Ray(this.pos, radians(a)));
        }

        // neat stuff
        this.fitness = 0;
        this.vision = [];
        this.decisions = [];
        this.unadjustedFitness;
        this.lifespan = 0;
        this.bestScore = 0;
        this.dead = false;
        this.score = 0;
        this.gen = 0;
    
        this.genomeInputs = rays;
        this.genomeOutputs = 4;
        this.brain = new Genome(this.genomeInputs, this.genomeOutputs);
    }

    update() {
        this.lifespan++;
        this.timer ++;

        if (this.timer > this.deadTimer) {
            this.dead = true;
            this.score -= 50;
        }
        this.decide();
        this.move();
        this.look();
        this.collide();
    }
    getVertices() {
        const halfWidth = this.width/2;
        const halfHeight = this.height/2;
        const angleCos = cos(this.angle);
        const angleSin = sin(this.angle);

        // Позиции вершин относительно центра машины
        const verticesRelative = [
            createVector(0, 0),
            createVector(0, -halfHeight),
            createVector(halfWidth+halfWidth+halfWidth+halfWidth, -halfHeight),
            createVector(halfWidth+halfWidth+halfWidth+halfWidth, 0)
        ];

        // Поворот вершин на угол машины и трансляция в абсолютные координаты
        const vertices = verticesRelative.map(vertex => {
            const rotatedX = vertex.x * angleSin - vertex.y * angleCos + this.x;
            const rotatedY = vertex.x * angleCos + vertex.y * angleSin + this.y;
            return createVector(rotatedX, rotatedY);
        });

        return vertices;
    }

    collide() {
        // Получаем вершины машины
        const vertices = this.getVertices();
        stroke(255, 0, 0)
        strokeWeight(2); 
		

        for (var wall of walls) {
            for (let i = 0; i < vertices.length; i++) {
                const currentVertex = vertices[i];
                const nextVertex = vertices[(i + 1) % vertices.length];
                if (debugMode) {
                    line(currentVertex.x, currentVertex.y, nextVertex.x, nextVertex.y);
                }
                
                if (wall.checkIntersection(currentVertex.x, currentVertex.y, nextVertex.x, nextVertex.y)) {
                    this.dead = true;
                    this.score -= 100;
                    return; 
                }
            }
        }

        for (var wall of this.rewards) {
            for (let i = 0; i < vertices.length; i++) {
                const currentVertex = vertices[i];
                const nextVertex = vertices[(i + 1) % vertices.length];
                if (wall.checkIntersection(currentVertex.x, currentVertex.y, nextVertex.x, nextVertex.y)) {
                    this.score += 80;
                    wall.a = createVector(10000, 10000);
                    wall.b = createVector(10000, 10000);
                    this.timer = 0;
                    return
                }
            }
        }
    }        

    move () {
		if(this.controls.up){
			this.speed+=this.acceleration;
		}
		if(this.controls.down){
			this.speed-=this.acceleration;
		}

		if(this.speed>this.maxSpeed){
			this.speed=this.maxSpeed;
		}
		if(this.speed<-this.maxSpeed/2){
			this.speed=-this.maxSpeed/2;
		}

		if(this.speed>0){
			this.speed-=this.friction;
		}
		if(this.speed<0){
			this.speed+=this.friction;
		}
		if(Math.abs(this.speed)<this.friction){
			this.speed=0;
		}

		if(this.speed!=0){
			const flip=this.speed>0?1:-1;
			if(this.controls.left){
				this.angle+=0.03*flip;
			}
			if(this.controls.right){
				this.angle-=0.03*flip;
			}
		}

		this.x-=Math.sin(this.angle)*this.speed;
		this.y-=Math.cos(this.angle)*this.speed;

        this.pos.x = this.x;
        this.pos.y = this.y;
    }


    show() {
        if (this.selected) {
            this.img = selectedCar;
        }  else{
            this.img = car;
        }
        

        rectMode(CORNER);
        push()
        translate(this.x, this.y);
        rotate(-this.angle);
        image(this.img, 0, 0, this.width, this.height);
        pop();

        if (this.selected && debugMode) {
            for (var wall of this.rewards) {
                stroke(0, 0, 255);
                wall.draw();
            }
        }
    }
	look(){
        this.vision = [];
        for (let ray of this.rays) {
            let closest = null;
            let record = Infinity;
            for (let wall of walls) {
                let pt = ray.cast(wall);
                if (pt) {
                    const d = p5.Vector.dist(this.pos, pt);
                    if (d < record) {
                        closest = pt;
                        record = d;
                    }
                }
            }
            if (closest) {
                if (this.selected) {
                    fill(0, 255, 0)
                    stroke(0, 255, 0)
                    ellipse(closest.x, closest.y, 4);
                }
                this.vision.push(dist(this.pos.x, this.pos.y, closest.x, closest.y));
            }
        }
    }
    decide() {
        var decision = this.decisions.findIndex(el => el == Math.max.apply(null, this.decisions));
        if (decision == 0) {
            this.controls.up = true;
        }
        if (decision == 1) {
            this.controls.right = true;
        }
        if (decision == 2) {
            this.controls.left = true;
        }
        if (decision == 3) {
            this.controls.down = true;
        }
    }
    think() {
        this.decisions = this.brain.feedForward(this.vision);
    }
    clone() {
        var clone = new Player(playerStartX, playerStartY);
        clone.brain = this.brain.clone();
        clone.fitness = this.fitness;
        clone.brain.generateNetwork();
        clone.gen = this.gen;
        clone.bestScore = this.score;
        return clone;
    }
    cloneForReplay() {
        var clone = new Player(playerStartX, playerStartY);
        clone.brain = this.brain.clone();
        clone.fitness = this.fitness;
        clone.brain.generateNetwork();
        clone.gen = this.gen;
        clone.bestScore = this.score;
        return clone;
    }
    calculateFitness() {
        this.fitness = 1 + this.score * this.score + this.lifespan / 20.0;
    }
    crossover(parent2) {
        var child = new Player(playerStartX, playerStartY);
        child.brain = this.brain.crossover(parent2.brain);
        child.brain.generateNetwork();
        return child;
      }
}