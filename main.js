'use strict';

const grey = "#f2f2f2";
const green = "#9dda92";

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

var runStats = document.getElementById("runStats");
var results = [];
function startTrain(){
    var start = Date.now();

    results = startPerceptron(data);

    outputs.forEach((o, i) => {
        o.innerText = results[0][i];
        o.style.opacity = 0.5;
    });
     
    var end = Date.now();
    runStats.innerText = results[1].length * 10 + " iterations in " + (end - start) + " ms";

    displayChart();
    startFade();
}

var opacity = 0;
function startFade(){
    opacity = 0;
    fadeIn();
}

function fadeIn() {
    if (opacity < 1) {
       opacity += .1;
       setTimeout(function(){fadeIn()},10);
    }

    outputs.forEach(o => {
        o.style.opacity = opacity;
    });
    runStats.style.opacity = opacity/2;
}

const ctx = document.getElementById('errorchart').getContext('2d');
var errorchart;
function displayChart(){
    if(errorchart != undefined)
        errorchart.destroy();

    errorchart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from(results[1].keys()).map(k => k * 10),
            datasets: [{
                label: 'Cost',
                data: results[1],
                borderWidth: 1
            }]
        },
        options: {
            pointRadius: 2,
            borderWidth: 10,
            pointBackgroundColor: "#b3b1b1",
            borderColor: "#b3b1b1"
            
        }
    });
}
