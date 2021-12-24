'use strict';

const grey = "#f2f2f2";
const green = "#A9ED9D";

var data = [
    [0],
    [1],
    [1],
    [0]
];

var buttons = [];
for(var i = 0; i < 4; i++){
    var button = document.getElementById("b" + i);

    if(button.innerText === '0')
        button.firstChild.style.background = grey;

    buttons.push(row);
}

function toggleValue(button, num){
    if(data[num] == 1){
        data[num] = 0;
        button.firstChild.innerText = 0;
        button.firstChild.style.background = grey;
    }else{
        data[num] = 1;
        button.firstChild.innerText = 1;
        button.firstChild.style.background = green;
    }
}

var outputs = [];
for(var i = 0; i < 4; i++){
    var row = document.getElementById("nn" + i);
    outputs.push(row);
}

function startTrain(){
    var results = startPerceptron(data, progress);
    console.log("done");

    outputs.forEach((o, i) => {
        o.innerText = results[i][0];
    });
}

function progress(results){
    
}