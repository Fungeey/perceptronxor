'use strict';

const element = React.createElement;
const tableDot = element("div", {className: "tableDot"}, null);

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