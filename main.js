'use strict';

var data = [
    [0],
    [1],
    [1],
    [0]
];

function toggleValue(button, num){
    if(data[num] === 1){
        data[num] = 0;
        button.innerHTML = 0;
    }else{
        data[num] = 1;
        button.innerHTML = "<div class = 'buttonDot'>1</div>";
    }
}

var outputs = [];
for(var i = 0; i < 4; i++){
    var row = document.getElementById("nn" + i);
    outputs.push(row);
    console.log(row);
}

function startTrain(){
    var results = startPerceptron(data, progress);
    console.log("done");

    outputs.forEach((o, i) => {
        o.innerHTML = results[i][0];
    });
}

function progress(results){
    
}