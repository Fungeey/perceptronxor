function rand(){
    // for some reason, initializing the weights to be from [0.5 to 1] makes the network converge almost every time
    // initializing the weights with a range of [0 to 1] makes it 80% reliable. 
    return Math.random() /2 + 0.5;
}

function randb(){
    // initializing bias as -1 is much more reliable than 1
    return -1;
}

function rnd(x){
    return Math.round(x * 1000)/1000;
}

function act(x){
    //return sig(x);
    return tanh(x);
}

function dact(x){
    //return dsig(x);
    return dtanh(x);
}

function sig(x){ 
    return 1 / (1 + Math.exp(-x)); 
}
function dsig(x){ 
    return x * (1-x); 
}

function tanh(x){
    var a = (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
    return a;
}
function dtanh(x){
    var a = 1 - (x * x);
    return a;
}

//neuron 1
var w11, w21, b1;

//neuron 2
var w12, w22, b2;

//neuron 3
var w31, w32, b3;

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

function resetCase(){
    // w11= 0.7019069706058758
    // w21= 0.8354328214486761
    // b1 = -1
    // w12= 0.1989666617037753
    // w22= 0.9585336532101392
    // b2 = -1
    // w31= 0.8876327447188233
    // w32= 0.5915548210791177
    // b3 = -1
}

var a1, a2, a3 = 0;

function forward(x1, x2){
    a1 = act(x1 * w11 + x2 * w21 + b1);
    a2 = act(x1 * w12 + x2 * w22 + b2);
    a3 = act(a1 * w31 + a2 * w32 + b3);

    if(isNaN(a1) || isNaN(a2) || isNaN(a3)) 
        throw "NaN";
}

var lr = 0.05;
function backprop(x1, x2, t){
    // adjust node 3 (output node)
    w31 += lr * (t - a3) * dact(a3) * a1;
    w32 += lr * (t - a3) * dact(a3) * a2;
    b3 += lr * (t - a3) * dact(a3);

    // adjust node 1
    w11 += lr * (t - a3) * dact(a3) * w31 * dact(a1) * x1;
    w21 += lr * (t - a3) * dact(a3) * w31 * dact(a1) * x2;
    b1 += lr * (t - a3) * dact(a3) * w31 * dact(a1);

    //adjust node 2
    w21 += lr * (t - a3) * dact(a3) * w32 * dact(a2) * x1;
    w22 += lr * (t - a3) * dact(a3) * w32 * dact(a2) * x2;
    b2 += lr * (t - a3) * dact(a3) * w32 * dact(a2);
}

function train(input, target){
    for(var e = 0; e < 5000; e++){
        for(var t = 0; t < 4; t++){
            forward(input[t][0], input[t][1]);
            backprop(input[t][0], input[t][1], target[t]);
        }
    }
}

function test(input){
    var outputs = [];
    for(var t = 0; t < 4; t++){
        forward(input[t][0], input[t][1]);
        outputs.push(rnd(a3));
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

var input = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
]

var targetXOR = [0, 1, 1, 0];
var targetOR = [0, 1, 1, 1];
var targetAND = [0, 0, 0, 1];

function startPerceptron(targetOutput){
    var done = false;
    while(!done){
        try {
            reset();
            train(input, targetOutput);
            done = true;
        }
        catch(e) {
            // sometimes the weight values grow very large (> 700) which causes the tanh function to output NaN
            // since tanh is implemented with exponent functions the values get so large that it becomes NaN
            // this only happens sometimes, the only 
            console.log("we done goofed");
        }
    }
    
    var results = test(input);
    //printWB();
    return results;
}

// console.log(startPerceptron(targetXOR));