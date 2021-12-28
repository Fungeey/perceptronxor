'use strict';

const grey = "#f2f2f2";
const darkgrey = "#b3b1b1";
const green = "#9dda92";
const darkgreen = "#418237";

let data = [0, 1, 1, 0];

let buttons = [];
for(let i = 0; i < 4; i++){
    let button = document.getElementById("b" + i);

    if(button.innerText === '0')
        button.firstChild.style.background = grey;
    
    buttons.push(button);  
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

let outputs = [];
for(let i = 0; i < 4; i++)
    outputs.push(document.getElementById("nn" + i));

const runStats = document.getElementById("runStats");
var nnWorker;
let isXOR = true;
function startTrain(){
    let start = Date.now();

    if(typeof(Worker) !== undefined){
        if(typeof(nnWorker) == "undefined")
            nnWorker = new Worker("perceptron.js");
        
        isXOR = dataIsXOR(data);
        nnWorker.postMessage(JSON.stringify(data));
        
        nnWorker.onmessage = function(event){
            let results = JSON.parse(event.data);
            finishAndDisplay(start, results);
        }
    }else{
        let results = startPerceptron(data);
        finishAndDisplay(start, results);
    }
    
    function finishAndDisplay(start, results){    
        displayChart(results);
        startFade(results);

        let end = Date.now();
        runStats.innerText = results[1].length * (isXOR ? 200 : 10) + " iterations in " + (end - start) + " ms";
    }
}

function dataIsXOR(data){
    return [0, 1, 1, 0].every((e, i) => e === data[i]);
}

function startFade(results){

    outputs.forEach((o, i) => {
        o.innerText = results[0][i];
    });

    let opacity = 0;
    function fadeIn() {
        if (opacity < 1) {
           opacity += .1;
           setTimeout(function(){fadeIn()},10);
        }
    
        outputs.forEach(o => o.style.opacity = opacity);
        runStats.style.opacity = opacity/2;
    }
    fadeIn();
}

const chartElement = document.getElementById('errorchart');
const chart2d = chartElement.getContext('2d');
let errorChart = setChartValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], []);

function displayChart(results){
    if(errorChart != undefined)
        errorChart.destroy();
        
    errorChart = setChartValues(Array.from(results[1].keys()).map(k => k * (isXOR ? 200 : 10)), results[1]);
}

function setChartValues(labels, data){
    return new Chart(chart2d, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Mean Squared Cost',
                data: data,
                borderWidth: 1
            }]
        },
        options: {
            pointRadius: 2,
            borderWidth: 10,
            fillColor: darkgreen,
            pointBackgroundColor: darkgreen,
            borderColor: darkgreen
        },
    });
}

function scrollToTop(){
    window.scroll(0, 0);
}