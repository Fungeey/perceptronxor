const lr = 0.1;

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

    evaluate(prevLayerActivations){
        this.activation = 0;
        prevLayerActivations.forEach((a, i) => {
            this.activation += a * this.weights[i];
        });
        this.z = this.activation + this.bias;
        this.activation = this.sigmoid(this.z);
        return this.activation;
    }

    // adjust(prevLayerActivations, target){
    //     // Adjust weights with delta w.
    //     for(var i = 0; i < this.weights.length; i++){
    //         var deltaW = prevLayerActivations[i] * this.delsigmoid(this.z) * 2 * (this.activation - target);
    //         this.weights[i] -= lr * deltaW;
    //     }

    //     // Adjust bias
    //     var deltaB = this.delsigmoid(this.z) * 2 * (this.activation - target);
    //     this.bias -= lr * deltaB;
        
    //     // calculate the desired activation for this neuron.
    //     var targetActivation = this.delsigmoid(this.z) * 2 * (this.activation - target);
    //     return targetActivation;
    // }

    // adjustBad(prevLayerActivations, target){
    //     // Adjust weights with delta w.
    //     for(var i = 0; i < this.weights.length; i++){
    //         var deltaW = prevLayerActivations[i] * this.delsigmoid(this.z) * 2 * (this.activation - target);
    //         this.weights[i] -= lr * deltaW;
    //     }

    //     // Adjust bias
    //     var deltaB = this.delsigmoid(this.z) * 2 * (this.activation - target);
    //     this.bias -= lr * deltaB;
        
    //     // calculate the desired activation for this neuron.
    //     var targetActivation = this.delsigmoid(this.z) * 2 * (this.activation - target);
    //     return targetActivation;
    // }
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

    // backProp(prevLayerActivations, targets){
    //     // calculate error of this layer based upon targets.
    //     var errors = [];
    //     this.neurons.forEach((n, i) => {
    //         errors.push(n - targets[i]);
    //     });

    //     // adjust weights and biases.

    //     return errors;

    //     var targetActivations = [];
    //     this.neurons.forEach(n => {
    //         var asdf = n.adjust(prevLayerActivations, target);
    //         targetActivations.push(asdf);
    //     });

    //     return targetActivations;
    // }
}

class Perceptron{
    constructor(input, target){
        this.input = input;
        this.target = target;

        this.hiddenLayer = new Layer(4, 2);        // 2 hidden nodes
        this.outputLayer = new Layer(1, 4);
    }

    cost(output, t){
        return output - this.target[t];
    }

    rnd(x){
        return Math.round(x * 1000)/1000;
    }

    train(){
        for(var i = 0; i < 50000; i++){
            var outputs = [];
            for(var t = 0; t < 4; t++){
                this.hiddenLayer.evaluate(this.input[t]);
                this.outputLayer.evaluate(this.hiddenLayer.activations);
                this.backProp(t);
                outputs.push(this.outputLayer.neurons[0].activation);
            }
            //console.log(outputs);
        }

    }

    dsigmoid(x){
        // delsigmoid = sigmoid(x) * (1 - sigmoid(x))
        // Since the values we have were already run through sigmoid,
        // we can just plug in x.
        return x * (1 - x);
    }

    backProp(testCase){
        // ------ Output Layer ------

        // There is only one error value, since there is only one output node.
        var output_error = this.outputLayer.activations[0] - this.target[testCase];
        var output_gradient = this.dsigmoid(this.outputLayer.activations[0]) * output_error;

        for(var i = 0; i < this.outputLayer.neurons[0].weights.length; i++){
            // Adjust weights: ∂c/∂w = ∂z/∂w * ∂a/∂z * ∂c/∂a
                //z = wa+b, therefore ∂z/∂w = a
                //a = sigmoid(z), therefore ∂a/∂z = dsigmoid(a)
                //c = (a-y)^2, therefore ∂c/∂a = 2(a-y) 
            var outDeltaW = this.hiddenLayer.activations[i] * output_gradient;
            this.outputLayer.neurons[0].weights[i] -= lr * outDeltaW;
        }
        // Adjust bias: ∂c/∂b = ∂z/∂b * ∂a/∂z * ∂c/∂a
            //z = wa+b, therefore ∂z/∂b = 1
            //a = sigmoid(z), therefore ∂a/∂z = dsigmoid(a)
            //c = (a-y)^2, therefore ∂c/∂a = 2(a-y)
        var outDeltaB = 1 * output_gradient;
        this.outputLayer.neurons[0].bias -= lr * outDeltaB;

        // ------ Hidden Layer ------
        var hidden_errors = [];
        for(var w = 0; w < this.outputLayer.neurons[0].weights.length; w++){
            hidden_errors.push(this.outputLayer.neurons[0].weights[w] * output_gradient);
        }

        // var  = [ 
        //     this.outputLayer.neurons[0].weights[0] * output_error,
        //     this.outputLayer.neurons[0].weights[1] * output_error
        // ];

        for(var w = 0; w < this.hiddenLayer.neurons.length; w++){
            for(var i = 0; i < this.hiddenLayer.neurons[w].weights.length; i++){
                // Adjust weights: ∂c/∂w = ∂z/∂w * ∂a/∂z * ∂c/∂a
                    //z = wa+b, therefore ∂z/∂w = a
                    //a = sigmoid(z), therefore ∂a/∂z = dsigmoid(a)
                    //c = (a-y)^2, therefore ∂c/∂a = 2(a-y)
                var hidDeltaW = this.input[testCase][i] * this.dsigmoid(this.hiddenLayer.activations[i]) * hidden_errors[w];
                this.hiddenLayer.neurons[w].weights[i] -= lr * hidDeltaW;
            }

            // Adjust bias: ∂c/∂b = ∂z/∂b * ∂a/∂z * ∂c/∂a
                //z = wa+b, therefore ∂z/∂b = 1
                //a = sigmoid(z), therefore ∂a/∂z = dsigmoid(a)
                //c = (a-y)^2, therefore ∂c/∂a = 2(a-y)
            var hidDeltaB = 1 * this.dsigmoid(this.hiddenLayer.activations[w]) * hidden_errors[w];
            this.hiddenLayer.neurons[w].bias -= lr * hidDeltaB;
        }
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

function startPerceptron(targetOutput){
    var p = new Perceptron(input, targetOutput);
    p.train();
    return p.test();
}

var result = startPerceptron(targetXOR);
console.table(result);