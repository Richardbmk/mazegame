// Accessing objects from the library Matterjs
const { Engine, Render, Runner, World, Bodies } = Matter;

// Create the engine
const engine = Engine.create();

const { world } = engine;

// Create render
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 800,
        height: 600
    }
});

// Create runner
Render.run(render);
Runner.run(Runner.create(), engine);

// Add bodies
const shape = Bodies.rectangle(200, 200, 50, 50, {
    isStatic: true
});

World.add(world, shape)