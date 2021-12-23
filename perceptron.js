const lr = 0.2;

function rand(){
    return Math.floor(Math.random() * 10)/10;
}

class Neuron{
    constructor(prevLayerNeurons){
        this.weights = [];      //set of weights for each node in the previous layer
        this.bias = Math.floor((Math.random() * 2 - 1) * 10)/10;          // one bias
        this.activation = 0;
        this.z = 0;

        for(var i = 0; i < prevLayerNeurons; i++){
            this.weights.push(rand());
        }
    }

    sigmoid(x){
        return 1 / (1 + Math.exp(-x))
    }

    delsigmoid(x){
        return this.sigmoid(x) * (1 - this.sigmoid(x));
    }

    // delsigmoid(x){
    //     return Math.exp(-x)/Math.pow(Math.exp(-x) + 1, 2);
    // }

    evaluate(prevLayerActivations){
        this.activation = 0;
        prevLayerActivations.forEach((a, i) => {
            this.activation += a * this.weights[i];
        });
        this.z = this.activation + this.bias;
        this.activation = this.sigmoid(this.activation + this.bias);
        return this.activation;
    }

    adjust(prevLayerActivations, target){
        // Adjust weights with delta w.
        for(var i = 0; i < this.weights.length; i++){
            var deltaW = prevLayerActivations[i] * this.delsigmoid(this.z) * 2 * (this.activation - target);
            this.weights[i] -= lr * deltaW;
        }

        // Adjust bias
        var deltaB = this.delsigmoid(this.z) * 2 * (this.activation - target);
        this.bias -= lr * deltaB;
        
        // calculate the desired activation for this neuron.
        var targetActivation = this.delsigmoid(this.z) * 2 * (this.activation - target);
        return targetActivation;
    }
}

class Layer{
    constructor(neurons, prevLayerNeurons){
        this.neurons = [];
        this.activations = [];

        for(var i = 0; i < neurons; i++){
            this.neurons.push(new Neuron(prevLayerNeurons));
        }
    }

    evaluate(prevLayerActivations){
        this.activations = [];
        this.neurons.forEach(n => {
            var a = n.evaluate(prevLayerActivations);
            this.activations.push(a);
        });
    }

    backProp(prevLayerActivations, target){
        var targetActivations = [];
        this.neurons.forEach(n => {
            var asdf = n.adjust(prevLayerActivations, target);
            targetActivations.push(asdf);
        });

        return targetActivations;
    }
}

class Perceptron{
    constructor(input, target){
        this.input = input;
        this.target = target;

        this.hiddenLayer = new Layer(2, 2);        // 2 hidden nodes
        this.outputLayer = new Layer(1, 2);
    }

    cost(output, t){
        return Math.pow(output - this.target[t], 2);
    }

    rnd(x){
        return Math.round(x * 1000)/1000;
    }

    train(progress){
        var outputs = [];
        for(var i = 0; i < 10000; i++){
            for(var t = 0; t < 4; t++){
                this.hiddenLayer.evaluate(this.input[t]);
                this.outputLayer.evaluate(this.hiddenLayer.activations);
                this.backProp(t);
                outputs[t] = this.rnd(this.outputLayer.activations[0]);
            }
            progress(outputs);
        }
    }

    backProp(testCase){
        var outputLayerTargets = this.outputLayer.backProp(this.hiddenLayer.activations, this.target[testCase]);
        this.hiddenLayer.backProp(this.input[testCase], outputLayerTargets);
    }

    test(){
        var results = [];
        for(var t = 0; t < 4; t++){
            this.hiddenLayer.evaluate(this.input[t]);
            this.outputLayer.evaluate(this.hiddenLayer.activations);
            
            var result = this.rnd(this.outputLayer.activations[0]);
            var cost = this.rnd(this.cost(result, t));
            results[t] = [result, cost];
        }
        return results;
    }
}

var input = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
];

var targetXOR = [0, 1, 1, 0];
var targetOR = [0, 1, 1, 1];
var targetAND = [0, 0, 0, 1];

function startPerceptron(targetOutput, progress){
    var p = new Perceptron(input, targetOutput);
    p.train(progress);
    return p.test();
}

//startNN(targetXOR);