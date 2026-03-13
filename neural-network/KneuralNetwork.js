class Kneuron {
    constructor() {
        this.inputs = [];
        this.outputs = [];
        this.bias = Math.random() * 2 - 1;
        this.impulse = 0;
    }

    pulsate() {
        if (this.inputs.length > 0) {
            this.impulse = 0;

            for (let synapse of this.inputs) {
                this.impulse += synapse.input.impulse * synapse.weight;
            }

            this.impulse += this.bias;
            this.impulse = this.activation();
        }
    }

    activation() {
        return 1 / (1 + Math.exp(-this.impulse));   // Sigmoid function
    }
}

class Synapse {
    constructor() {
        this.input = null;
        this.output = null;
        this.weight = Math.random() * 2 - 1;
    }
}

export class KneuralNetwork {
    constructor(dimension) {
        this.dimension = dimension;
        this.inputs = [];
        this.interkneurons = [];
        this.outputs = [];
    }

    create() {
        for (let i = 0; i < this.dimension.input; i++) {
            const kneuron = new Kneuron();

            this.inputs.push(kneuron);
        }

        for (let i = 0; i < this.dimension.topology; i++) {
            const kneuron = new Kneuron();

            this.interkneurons.push(kneuron);
        }

        for (let i = 0; i < this.dimension.output; i++) {
            const kneuron = new Kneuron();

            this.outputs.push(kneuron);
        }

        for (let input of this.inputs) {
            for (let interkneuron of this.interkneurons) {
                const synapse = new Synapse();

                synapse.input = input;
                synapse.output = interkneuron;

                input.outputs.push(synapse);
                interkneuron.inputs.push(synapse);
            }
        }

        for (let output of this.outputs) {
            for (let interkneuron of this.interkneurons) {
                const synapse = new Synapse();

                synapse.input = interkneuron;
                synapse.output = output;

                interkneuron.outputs.push(synapse);
                output.inputs.push(synapse);
            }
        }
    }

    stimulate(impulses) {
        let i = 0;

        for (let kneuron of this.inputs) {
            kneuron.impulse = impulses[i];

            i++;
        }
    }

    pulsate() {
        for (let kneuron of this.inputs) {
            kneuron.pulsate();
        }

        for (let kneuron of this.interkneurons) {
            kneuron.pulsate();
        }

        for (let kneuron of this.outputs) {
            kneuron.pulsate();
        }
    }

    stimuli() {
        let impulses = [];
        let i = 0;

        for (let kneuron of this.outputs) {
            impulses[i] = kneuron.impulse;

            i++;
        }

        return impulses;
    }

    visualize() {
        const canvas = document.getElementById("canvas");

        let y = 50;

        for (let kneuron of this.inputs) {
            const node = document.createElementNS("http://www.w3.org/2000/svg", "circle");

            node.setAttribute("cx", 50);
            node.setAttribute("cy", y);
            node.setAttribute("r", 25);
            //node.setAttribute("fill", "blue");
            node.setAttribute("fill", floatToHexColor(kneuron.impulse));

            canvas.appendChild(node);

            y += 60;
        }

        y = 50;

        for (let kneuron of this.outputs) {
            const node = document.createElementNS("http://www.w3.org/2000/svg", "circle");

            node.setAttribute("cx", 250);
            node.setAttribute("cy", y);
            node.setAttribute("r", 25);
            //node.setAttribute("fill", "blue");
            node.setAttribute("fill", floatToHexColor(kneuron.impulse));

            canvas.appendChild(node);

            y += 60;
        }

        y = 50;

        for (let kneuron of this.interkneurons) {
            const node = document.createElementNS("http://www.w3.org/2000/svg", "circle");

            node.setAttribute("cx", 150);
            node.setAttribute("cy", y);
            node.setAttribute("r", 25);
            //node.setAttribute("fill", "blue");
            node.setAttribute("fill", floatToHexColor(kneuron.impulse));

            canvas.appendChild(node);

            let y2 = 60;
            let i = 0;

            for (let synapse of kneuron.inputs) {
                const connector = document.createElementNS("http://www.w3.org/2000/svg", "line");

                connector.setAttribute("x1", 145);
                connector.setAttribute("y1", y);
                connector.setAttribute("x2", 50);
                connector.setAttribute("y2", i * y2 + 50);
                connector.setAttribute("stroke", "#333");
                connector.setAttribute("stroke-width", 1);

                canvas.appendChild(connector);

                i++;
            }

            y2 = 60;
            i = 0;

            for (let synapse of kneuron.outputs) {
                const connector = document.createElementNS("http://www.w3.org/2000/svg", "line");

                connector.setAttribute("x1", 155);
                connector.setAttribute("y1", y);
                connector.setAttribute("x2", 250);
                connector.setAttribute("y2", i * y2 + 50);
                connector.setAttribute("stroke", "#333");
                connector.setAttribute("stroke-width", 1);

                canvas.appendChild(connector);

                i++;
            }

            y += 60;
        }
    }
}

function floatToHexColor(value) {
    const clamped = Math.max(0, Math.min(1, value));
    const r = Math.floor(clamped * 255);
    const g = Math.floor((1 - clamped) * 255);
    const b = 128; // fixed mid-blue

    const toHex = n => n.toString(16).padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

console.log(floatToHexColor(0.25)); // reddish tone
console.log(floatToHexColor(0.75)); // greenish tone