const rand = _ => Math.random() /2 + 0.5;
const randb = _ => Math.random();
const rnd = x => Math.round(x * 1000)/1000;
const tanh = x => (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
const dtanh = x => 1 - (x * x);
const lr = 0.03;

class node{
    constructor(prevLayerNodes){
        this.w = [];
        for(let n = 0; n < prevLayerNodes; n++)
            this.w.push(rand());

        this.b = randb();
        this.a = 0;
    }

    activate(inputs){
        let z = 0;
        for(let n = 0; n < inputs.length; n++)
            z += inputs[n] * this.w[n];

        this.a = tanh(z + this.b);
        return this.a;
    }
}

class perceptron{
    constructor(input, hidden){
        this.inputLayer = input;

        this.hLayer = [];
        for(let n = 0; n < hidden; n++)
            this.hLayer.push(new node(input));
        
        this.outNode = new node(hidden);
    }

    forward(testCase){
        this.hLayer.forEach(n => n.activate(testCase));
        let hiddenOutput = this.hLayer.map(n => n.a);
        return this.outNode.activate(hiddenOutput);
    }

    backprop(testCase, targetActivation){
        let outputGradient = (targetActivation - this.outNode.a) * dtanh(this.outNode.a);
        this.outNode.w = this.outNode.w.map((w, i) => w += lr * outputGradient * this.hLayer[i].a);
        this.outNode.b += lr * outputGradient;

        for(let n = 0; n < this.hLayer.length; n++){
            let node = this.hLayer[n];
            let gradient = outputGradient * this.outNode.w[n] * dtanh(node.a);
            node.w = node.w.map((w, i) => w += lr * gradient * testCase[i]);
            node.b += lr * gradient;
        }
    }

    train(inputs, targets){
        const maxEpochs = 50000;
        const goodEnough = 0.003;
        const costInterval = dataIsXOR(targets) ? 200 : 10;
        const costs = [];

        for(let e = 0; e < maxEpochs; e++){
            let avgCost = 0;
            for(let t = 0; t < inputs.length; t++){
                let testCase = inputs[t];
                let output = this.forward(testCase);
                this.backprop(testCase, targets[t]);

                if(e % costInterval == 0)
                    avgCost += Math.pow(output - targets[t], 2);
            }
            if(e % costInterval == 0){
                costs.push(avgCost/4);
                if(avgCost/4 < goodEnough)
                    return costs;
            }
        }
        return costs;
    }

    test(inputs){
        return inputs.map(i => rnd(this.forward(i)));
    }
}

let input = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
]

let targetXOR = [0, 1, 1, 0];
let targetOR = [0, 1, 1, 1];
let targetAND = [0, 0, 0, 1];

function dataIsXOR(data){
    return [0, 1, 1, 0].every((e, i) => e === data[i]);
}

function startPerceptron(targetOutput){
    let p = new perceptron(2, 3, 1);
    let costs = p.train(input, targetOutput);
    let results = p.test(input);

    return [results, costs];
}7

onmessage = function(e) {
    console.log('started training on worker thread');
    let results = startPerceptron(JSON.parse(e.data));
    console.log('finished training')
    postMessage(JSON.stringify(results));
}