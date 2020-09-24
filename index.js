// Accessing objects from the library Matterjs
const { 
    Engine,
    Render,
    Runner,
    World,
    Bodies
 } = Matter;

// Variable definiton
width = 800;
height = 600;
cells = 3;


// Create the engine
const engine = Engine.create();

const { world } = engine;

// Create render
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: true,
        width,
        height
    }
});

// Create runner
Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
    Bodies.rectangle(width / 2, 0, width, 40, {isStatic: true}),
    Bodies.rectangle(width / 2, height, width, 40, {isStatic: true}),
    Bodies.rectangle(0, height / 2, 40, height, {isStatic: true}),
    Bodies.rectangle(width, height / 2, 40, height, {isStatic: true}),
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




const grid = Array(cells).fill(null).map(() => Array(cells).fill(false));

const verticals = Array(cells).fill(null).map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1).fill(null).map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

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
            nextRow >= cells ||
            nextColumn < 0 ||
            nextColumn >= cells
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
            movingThrougCells(startRow, startColumn);
        }

        // Visit that next cell
    

    // console.log(neighbors);
};

movingThrougCells(startRow, startColumn);





