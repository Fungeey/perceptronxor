'use strict';

const input = document.querySelector('#booleanInput');
const element = React.createElement;
const tableDot = element("div", {className: "tableDot"}, null);

function parseExpression(text){
    var chars = text.split("");
    var table = [];

    // count number of letters 

    // number of elements is (2^n + 1)(n + 1)
    //rows = 2^n+1
    //cols = n + 1

    // for(var i = 0; i < 2; i+ )
    
    return "asdf";
}

input.value = "abf000011101110";

const e = React.createElement;
class TruthTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {text: "", table: [        //or
            ['a', 'b', 'f'],
            [0, 0, 0],
            [0, 1, 1],
            [1, 0, 1],
            [1, 1, 0]
        ]};

        // var text = e.target.value.toLowerCase();
        // this.setState({text: text, table: parseExpression(text)});
        // console.log(this.state.text);

        input.addEventListener("input", (e) => {                //or change event
            var text = e.target.value.toLowerCase();
            this.setState({text: text, table: parseExpression(text)});
            console.log(this.state.text);
        });
    }

    renderTableHeader(){
        return element("tr", null,
            this.state.table[0].map((hr, i) =>{
                return element("th", {key: i}, hr);
            })
        );
    }

    renderTableData(){
        // for every row except first, return a tr element.
        // For every column in the row, return a td element.
        console.log(this.state.table);
        return this.state.table.slice(1).map((row, i) => {
            return element("tr", null,
                row.map((col, i) =>{
                    return element("td", {key: i}, col, col ? tableDot : null);
                })
            )
        });
    }

    render() {
        return element(
            "table",
            {className: "truthtable"},
            element("tbody", null, this.renderTableHeader(), this.renderTableData())
        );
    }
}

const domContainer = document.querySelector('#truthTableContainer');
ReactDOM.render(e(TruthTable), domContainer);


// ['a', 'b', 'c', 'f'],
// [0, 0, 0, 0],
// [0, 0, 1, 1],
// [0, 1, 0, 1],
// [0, 1, 1, 0],
// [1, 0, 0, 0],
// [1, 0, 1, 1],
// [1, 1, 0, 1],
// [1, 1, 1, 0]