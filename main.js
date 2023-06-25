const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 300;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const nLanes = 3;
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, nLanes);

const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
    cars.map((car, i) => {
        car.brain = JSON.parse(localStorage.getItem("bestBrain"));
        if (i != 0) {
            NeuralNetwork.mutate(car.brain, 0.6);
        }
    });
}

const traffic = [
    new Car(
        road.getLaneCenter(Math.floor(nLanes / 2)),
        -100,
        30,
        50,
        "REGULAR",
        2
    ),
    new Car(road.getLaneCenter(0), -300, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(nLanes), -300, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(
        road.getLaneCenter(Math.floor(nLanes / 2)),
        -500,
        30,
        50,
        "REGULAR",
        2
    ),
    new Car(road.getLaneCenter(nLanes), -700, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(
        road.getLaneCenter(Math.floor(nLanes / 2)),
        -900,
        30,
        50,
        "REGULAR",
        2
    ),
    new Car(road.getLaneCenter(0), -1100, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(
        road.getLaneCenter(Math.floor(nLanes / 2)),
        -1300,
        30,
        50,
        "REGULAR",
        2
    ),
    new Car(road.getLaneCenter(nLanes), -1500, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -1700, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(
        road.getLaneCenter(Math.floor(nLanes / 2)),
        -1900,
        30,
        50,
        "REGULAR",
        2
    ),
    new Car(road.getLaneCenter(Math.floor(nLanes / 2)), -2300, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -2500, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(nLanes), -2700, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(Math.floor(nLanes / 2)), -2900, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -3100, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(nLanes), -3300, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(nLanes), -3500, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -3700, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(Math.floor(nLanes / 2)), -3900, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(nLanes), -4100, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -4300, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(Math.floor(nLanes / 2)), -4500, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -4700, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -4900, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(nLanes), -5100, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -5300, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(Math.floor(nLanes / 2)), -5500, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -5700, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(Math.floor(nLanes / 2)), -5900, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(Math.floor(nLanes / 2)), -6100, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(nLanes), -6300, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -6500, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(nLanes), -6700, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(Math.floor(nLanes / 2)), -6900, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -7100, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(nLanes), -7300, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(Math.floor(nLanes / 2)), -7500, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(nLanes), -7700, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(Math.floor(nLanes / 2)), -7900, 30, 50, "REGULAR", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -8100, 30, 50, "REGULAR", 2, getRandomColor()),
];

animate();

function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(N) {
    const cars = [];
    for (let i = 1; i < N; i++) {
        cars.push(
            new Car(
                road.getLaneCenter(Math.floor(nLanes / 2)),
                100,
                30,
                50,
                "AI"
            )
        );
    }

    return cars;
}

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }
    cars.map((car) => car.update(road.borders, traffic));

    const bestCar = cars.find((car) => {
        return car.y == Math.min(...cars.map((car) => car.y));
    });

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "red");
    }

    carCtx.globalAlpha = 0.2;
    cars.map((car) => car.draw(carCtx, "blue"));

    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue", true);
    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}
