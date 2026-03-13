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

    correction() {
        return this.impulse * (1 - this.impulse);
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
        this.learningRate = 0.25;
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

    train(inputSample, outputSample) {
        let i = 0;
        let fault = null;
        let desire = null;
        let correction = null;

        this.stimulate(inputSample);
        this.pulsate();

        let faults = new Array(this.outputs.length);

        for (let output of this.outputs) {
            desire = outputSample[i];

            let impulse = output.impulse;

            fault = desire - impulse;

            faults[i] = fault;

            i++;
        }

        let corrections = new Array(this.outputs.length);

        i = 0;

        for (let output of this.outputs) {
            correction = output.correction() * faults[i] * this.learningRate;

            corrections[i] = correction;

            i++;
        }

        i = 0;

        for (let output of this.outputs) {
            let synapses = output.inputs;

            let j = 0;

            for (let synapse of synapses) {
                let delta = corrections[i] * synapse.input.impulse;

                synapse.weight += delta;

                synapses[j] = synapse;

                j++;
            }

            output.inputs = synapses;
            output.bias += corrections[i];

            this.outputs[i] = output;

            i++;
        }

        let hiddenFaults = new Array(this.interkneurons.length);

        i = 0;

        for (let interkneuron of this.interkneurons) {
            let synapses = interkneuron.outputs;

            fault = 0;

            let j = 0;

            for (let synapse of synapses) {
                fault += synapse.weight * faults[j];

                j++;
            }

            hiddenFaults[i] = fault;

            i++;
        }

        i = 0;

        corrections = new Array(this.interkneurons.length);

        for (let interkneuron of this.interkneurons) {
            correction = interkneuron.correction() * hiddenFaults[i] * this.learningRate;

            corrections[i] = correction;

            i++;
        }

        i = 0;

        for (let interkneuron of this.interkneurons) {
            let synapses = interkneuron.inputs;
            let j = 0;

            for (let synapse of synapses) {
                let delta = corrections[i] * synapse.input.impulse;

                synapse.weight += delta;

                synapses[j] = synapse;

                j++;
            }

            interkneuron.bias += corrections[i];
            interkneuron.inputs = synapses;

            this.interkneurons[i] = interkneuron;

            i++;
        }
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

function floatToHexColor2(value) {
  // Clamp value to [0,1]
  value = Math.min(Math.max(value, 0), 1);

  // Scale to 24-bit color space (0x000000 – 0xFFFFFF)
  let intVal = Math.floor(value * 0xFFFFFF);

  // Convert to hex and pad with leading zeros
  let hex = intVal.toString(16).padStart(6, "0");

  return "#" + hex;
}

console.log(floatToHexColor(0.25)); // reddish tone
console.log(floatToHexColor(0.75)); // greenish tone