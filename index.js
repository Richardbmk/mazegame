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
cells = 5;


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
const grid = Array(cells).fill(null).map(() => Array(cells).fill(false))

const verticals = Array(cells).fill(null).map(() => Array(cells - 1).fill(false))

const horizontals = Array(cells - 1).fill(null).map(() => Array(cells).fill(false))

console.log(grid);
console.log(verticals);
console.log(horizontals);


