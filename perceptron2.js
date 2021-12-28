const rand = _ => Math.random() /2 + 0.5;
const randb = _ => Math.random();
const rnd = x => Math.round(x * 1000)/1000;
// const sig = x => 1 / (1 + Math.exp(-x));
// const dsig = x =>  x * (1-x);
const tanh = x => (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
const dtanh = x => 1 - (x * x);

//neuron 1
let w11, w21, b1;
//neuron 2
let w12, w22, b2;
//neuron 3
let w31, w32, b3;

function reset(){
    //neuron 1
    w11 = rand();
    w21 = rand();
    b1 = randb();
    //neuron 2
    w12 = rand();
    w22 = rand();
    b2 = randb();
    //neuron 3
    w31 = rand();
    w32 = rand();
    b3 = randb();
}

function forward(x1, x2){
    const a1 = tanh(x1 * w11 + x2 * w21 + b1);
    const a2 = tanh(x1 * w12 + x2 * w22 + b2);
    const a3 = tanh(a1 * w31 + a2 * w32 + b3);

    if(isNaN(a1) || isNaN(a2) || isNaN(a3))
        throw "NaN";

    return [a1, a2, a3];
}

function backprop(x1, x2, a, t){
    let lr = 0.03;
    
    // adjust node 3 (output node)
    let outputGradient = (t - a[2]) * dtanh(a[2]);
    w31 += lr * outputGradient * a[0];
    w32 += lr * outputGradient * a[1];
    b3 += lr * outputGradient;

    // adjust node 1
    let hiddenGradient1 = outputGradient * w31 * dtanh(a[0]);
    w11 += lr * hiddenGradient1 * x1;
    w21 += lr * hiddenGradient1 * x2;
    b1 += lr * hiddenGradient1;

    //adjust node 2
    let hiddenGradient2 = outputGradient * w32 * dtanh(a[1]);
    w21 += lr * hiddenGradient2 * x1;
    w22 += lr * hiddenGradient2 * x2;
    b2 += lr * hiddenGradient2;
}

function train(input, target){
    const maxEpochs = 50000;
    const goodEnough = 0.003;
    const costInterval = 10;

    const costs = [];
    for(let e = 0; e < maxEpochs; e++){
        let avgcost = 0;
        for(let t = 0; t < 4; t++){
            let a = forward(input[t][0], input[t][1]);
            backprop(input[t][0], input[t][1], a, target[t]);

            if(e % costInterval == 0)
                avgcost += Math.pow(a[2] - target[t], 2);
        }
        if(e % costInterval == 0){
            costs.push(avgcost/4);
            if(avgcost/4 < goodEnough)
                return costs;
        }
    }
    return costs;
}

function test(input){
    const outputs = [];
    for(let t = 0; t < 4; t++){
        let a = forward(input[t][0], input[t][1]);
        outputs.push(rnd(a[2]));
    }
    return outputs;
}

function printWB(){
    console.log("Printing weights and biases");
    //neuron 1
    console.log("  w11: " + w11);
    console.log("  w21: " + w21);
    console.log("  b1 : " + b1 );

    //neuron 2
    console.log("  w12: " + w12);
    console.log("  w22: " + w22);
    console.log("  b2 : " + b2 );

    //neuron 3
    console.log("  w31: " + w31);
    console.log("  w32: " + w32);
    console.log("  b3 : " + b3 );
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

function startPerceptron(targetOutput){
    let costs = [];
    let done = false;

    while(!done){
        try {
            reset();
            costs = train(input, targetOutput);
            done = true;
        }
        catch(e) {
            // sometimes the weight values grow very large (> 700) which causes the tanh function to output NaN
            // since tanh is implemented with exponent functions the values get so large that it becomes NaN
            // this only happens sometimes, the only way i know to fix it is to restart
            console.log("we done goofed");
        }
    }

    let results = test(input);
    console.log(results);
    return [results, costs];
}

startPerceptron(targetXOR);