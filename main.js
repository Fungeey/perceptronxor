'use strict';

const grey = "#f2f2f2";
const darkgrey = "#b3b1b1";
const green = "#9dda92";
const darkgreen = "#44773c";

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
function startTrain(){
    let start = Date.now();

    let results = startPerceptron(data);

    outputs.forEach((o, i) => {
        o.innerText = results[0][i];
        o.style.opacity = 0.5;
    });
     
    let end = Date.now();
    runStats.innerText = results[1].length * 10 + " iterations in " + (end - start) + " ms";

    displayChart(results);
    startFade();
}

function startFade(){
    let opacity = 0;
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
    fadeIn();
}

const chartElement = document.getElementById('errorchart');
const chart2d = chartElement.getContext('2d');
var errorchart = new Chart(chart2d, {
    type: 'line',
    data: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        datasets: [{
            label: 'Mean Squared Cost',
            data: [],
            borderWidth: 1
        }]
    },
    options: {
        pointRadius: 2,
        borderWidth: 10,
        fillColor: darkgrey,
        pointBackgroundColor: darkgrey,
        borderColor: darkgrey
    }
});

function displayChart(results){
    if(errorchart != undefined)
        errorchart.destroy();
        
    setChartValues(results);
}

function setChartValues(results){
    errorchart = new Chart(chart2d, {
        type: 'line',
        data: {
            labels: Array.from(results[1].keys()).map(k => k * 10),
            datasets: [{
                label: 'Mean Squared Cost',
                data: results[1],
                borderWidth: 1
            }]
        },
        options: {
            pointRadius: 2,
            borderWidth: 10,
            fillColor: darkgrey,
            pointBackgroundColor: darkgrey,
            borderColor: darkgrey
        }
    });
}
