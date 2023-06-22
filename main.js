const canvas = document.getElementById("myCanvas");
canvas.width = 300;

const ctx = canvas.getContext("2d");
const nLanes = 5;
const road = new Road(canvas.width / 2, canvas.width * 0.9, nLanes);
const car = new Car(road.getLaneCenter(Math.floor(nLanes / 2)), 100, 30, 50);

animate();

function animate() {
    car.update(road.borders);

    canvas.height = window.innerHeight;
    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7);
    road.draw(ctx);
    car.draw(ctx);
    requestAnimationFrame(animate);
}
