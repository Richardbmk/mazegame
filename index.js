// Accessing objects from the library Matterjs
const { 
    Engine,
    Render,
    Runner,
    World,
    Bodies, 
    Body,
    Events
 } = Matter;

// Variable definiton
const cellsHorizontal = 16;
const cellsVertical = 8;
width = window.innerWidth;
height = window.innerHeight;


// Length of the cell
const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;


// Create the engine
const engine = Engine.create();

// Disable gravity
engine.world.gravity.y = 0;

const { world } = engine;

// Create render
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        width,
        height
    }
});

// Create runner
Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
    Bodies.rectangle(width / 2, 0, width, 2, {isStatic: true}),
    Bodies.rectangle(width / 2, height, width, 2, {isStatic: true}),
    Bodies.rectangle(0, height / 2, 2, height, {isStatic: true}),
    Bodies.rectangle(width, height / 2, 2, height, {isStatic: true}),
    ];

World.add(world, walls);


// Maze generazion
const shuffle = (arr) => {
    let counter = arr.length;

    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);

        counter--;

        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    return arr;
}




const grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false));

const verticals = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal - 1).fill(false));

const horizontals = Array(cellsVertical - 1).fill(null).map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);


const movingThrougCells = (row, column) => {
    // If we already visited this cells at [row, column], then return 
    if (grid[row][column]) {
        return;
    }

    // Mark the cells as visited
    grid[row][column] = true;

    // Assemble randomly-ordered list of neighbors
    const neighbors = shuffle([
        [row - 1, column, 'up'],
        [row, column + 1, 'right'],
        [row + 1, column, 'down'],
        [row, column - 1, 'left']
    ]);

    // An acction for each neighbor i have around me...
    for (let neighbor of neighbors) {
            // Destructuring
        const [nextRow, nextColumn, direction] = neighbor;

        // Check out if the neighbor is in the bounderies
        if (
            nextRow < 0 ||
            nextRow >= cellsVertical ||
            nextColumn < 0 ||
            nextColumn >= cellsHorizontal
           ) {
            continue;
        }

        // If we have visited that neighbor, continue to next neighbor 
        if (grid[nextRow][nextColumn]){
            continue;
        }

        // moving and removing verticals and horizontals cells
            // Horizontal moves
            if (direction === 'left') {
                verticals[row][column - 1] = true;
            } else if (direction === 'right') {
                verticals[row][column] = true;
            // Verticals moves
            } else if (direction === 'up') {
                horizontals[row - 1][column] = true;
            } else if (direction === 'down') {
                horizontals[row][column] = true;
            }
            movingThrougCells(nextRow, nextColumn);
        }
    // console.log(neighbors);
};

movingThrougCells(startRow, startColumn);



// Generating horizontals walls randomly
horizontals.forEach((row, rowIndex) => {
    console.log(row);
    row.forEach((open, columnIndex) => {
        if (open){
            return;
        }

        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX / 2,
            rowIndex * unitLengthY + unitLengthY,
            unitLengthX,
            10,
            {
                label: 'wall',
                isStatic: true,
                render: {
                    fillStyle: 'blue'
                }
            }
        );
        World.add(world, wall);
    });
});

// Generating verticals walls randomly
verticals.forEach((row, rowIndex) => {
    console.log(row, rowIndex);
    row.forEach((open, columnIndex) => {
        if(open) {
            return;
        }

        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX,
            rowIndex * unitLengthY + unitLengthY / 2,
            10,
            unitLengthY,
            {
                label: 'wall',
                isStatic: true, 
                render: {
                    fillStyle: 'blue'
                }
            }
        );
        World.add(world, wall);
    });
});

// Drawing the goal of the maze
const goal = Bodies.rectangle(
    width - unitLengthX / 2,
    height - unitLengthY / 2,
    unitLengthX * 0.7,
    unitLengthY * 0.7,
    {
        label: 'goal',
        isStatic: true,
        render: {
            fillStyle: 'green'
        }
    }
);
World.add(world, goal);

// Drawing the ball of the maze
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(
    unitLengthX / 2, 
    unitLengthY / 2, 
    ballRadius,
    {
        label: 'ball',
        render: {
            fillStyle: 'red'
        }
    }
);

World.add(world, ball);

document.addEventListener('keydown', e => {
    const {x, y} = ball.velocity;
    console.log(x,y);
    if (e.key === 'w') {
        // console.log('move up');
        Body.setVelocity(ball, {x, y: y - 5});
    }

    if (e.key === 'd') {
        // console.log('move right');
        Body.setVelocity(ball, {x: x + 5, y});
    }

    if (e.key === 'a') {
        // console.log('move left');
        Body.setVelocity(ball, {x: x - 5, y});
    }

    if (e.key === 's') {
        // console.log('move down');
        Body.setVelocity(ball, {x, y: y + 5});
    }
});

Events.on(engine, 'collisionStart', e => {
    // console.log(e);
    e.pairs.forEach((collision) => {
        // console.log(collision);
        const labels = ['ball', 'goal'];

        if (
            labels.includes(collision.bodyA.label) &&
            labels.includes(collision.bodyB.label)
        ) {
            document.querySelector('.winner').classList.remove('hidden')
            // console.log('You just won the Maze game!');
            world.gravity.y = 1;
            world.bodies.forEach(body => {
                if (body.label === 'wall') {
                    Body.setStatic(body, false);
                }
            });
        }
    });
});






