// Accessing objects from the library Matterjs
const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter;

// Variable definiton
width = 800;
height = 600;


// Create the engine
const engine = Engine.create();

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

// move objects in the world
World.add(world, MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)
}))

// Walls
const walls = [
    Bodies.rectangle(400, 0, 800, 40, {isStatic: true}),
    Bodies.rectangle(400, 600, 800, 40, {isStatic: true}),
    Bodies.rectangle(0, 300, 40, 600, {isStatic: true}),
    Bodies.rectangle(800, 300, 40, 600, {isStatic: true}),
    ];

World.add(world, walls);

for (let i = 0; i < 50; i++){
    if (Math.random() > 0.5) {
        World.add(world, Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50));
    } else {
        World.add(world, Bodies.circle(Math.random() * width, Math.random() * height, 35, {
            render: {
                fillStyle: '#f0a500'
            }
        }));
    }
    
}
