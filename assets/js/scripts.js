const matterContainer = document.getElementById('anim_container');
const thickness = 60;

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

// create an engine
var engine = Engine.create();
engine.gravity.y = 0.5

// create a renderer
var render = Render.create({
    element: matterContainer,
    engine: engine,
    options: {
        width: matterContainer.clientWidth,
        height: matterContainer.clientHeight,
        background: "transparent",
        wireframes: false,
        showAngleIndicator: false
    }
});

// create two boxes and a ground
var boxA = Bodies.rectangle(350, 0, 100, 100, {
    restitution: 0.4,
    friction: 0.3,
    frictionAir: 0.005,
    render: {
        fillStyle: "#203d6c",
    }
});
var boxB = Bodies.circle(450, 400, 100, {
    restitution: 0.8,
    friction: 0.3,
    frictionAir: 0.005,
    render: {
        fillStyle: "#907e66",
    }
}, 1000);


var ground = Bodies.rectangle(matterContainer.clientWidth / 2, matterContainer.clientHeight + thickness / 2 , matterContainer.clientWidth, thickness, { isStatic: true });

var topWall = Bodies.rectangle(
    matterContainer.clientWidth / 2,
    0 - thickness / 2,
    matterContainer.clientWidth,
    thickness,
    {
        isStatic: true
    }
);

var leftWall = Bodies.rectangle(
    0 - thickness / 2,
    matterContainer.clientHeight / 2,
    thickness,
    matterContainer.clientHeight * 5,
    {
        isStatic: true
    }
);

var rightWall = Bodies.rectangle(
    matterContainer.clientWidth + thickness / 2,
    matterContainer.clientHeight / 2,
    thickness,
    matterContainer.clientHeight * 5,
    {
        isStatic: true
    }
);

// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB, ground, topWall, leftWall, rightWall]);

let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
})

Composite.add(engine.world, mouseConstraint)

// allow scroll through the canvas
mouseConstraint.mouse.element.removeEventListener(
    'mousewheel',
    mouseConstraint.mouse.mousewheel
)
mouseConstraint.mouse.element.removeEventListener(
    'DOMMouseScroll',
    mouseConstraint.mouse.mousewheel
)


// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

function handleResize(container){
    render.canvas.width = container.clientWidth
    render.canvas.height = container.clientHeight

    Matter.Body.setPosition(
        ground,
        Matter.Vector.create(
            container.clientWidth / 2,
            container.clientHeight + thickness / 2
        )
    )

    Matter.Body.setPosition(
        rightWall,
        (
            Matter.Vector.create(
                container.clientWidth + thickness / 2,
                container.clientHeight / 2
            )
        )
    )
}

window.addEventListener("resize", ()=> handleResize(matterContainer))