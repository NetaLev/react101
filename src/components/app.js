import * as React from "react"
import * as csv from "csvtojson"
import { rawData } from "../data/raw.data"
import { DAILY_BUDJET, CATEGORY_INDEX } from '../data/constants';
import { Button } from "./button"
import { Table } from "./table"

export class App extends React.Component {
  state = {
    csv: rawData,
    data: [],
    headers: [],
  }

  componentDidMount() {
    this.parseCsvData(rawData);
  }

  handleTextAreaChange = (ev) => {
    let new_csv = ev.target.value;

    this.setState({
      csv: new_csv,
    });

    this.parseCsvData(new_csv);
  }

  parseCsvData = (rawData) => {
    let new_data = [];
    let new_headers = [];

    csv({
      noheader: false
    }).fromString(rawData)
      .on('header', (header) => {
        new_headers = header;
      })
      .on('csv', (csvRow, rowIndex) => {
        new_data.push(csvRow);
      })
      .on('done', () => {
        this.setState({
          data: new_data,
          headers: new_headers
        });
      });
  }

  calculateShares = () => {
    const { data } = this.state;

    var regex_only_digits_dots = /[^0-9\.-]+/g;

    const additionReducer = (total, x) => total + x;
    const prices = data.map(x => Number(x[CATEGORY_INDEX.PRICE].replace(regex_only_digits_dots,"")));

    const total = prices.reduce(additionReducer, 0);
    const total_extra = prices.map(x => x - DAILY_BUDJET)
      .filter(x => x > 0)
      .reduce(additionReducer, 0);

    return {
      company_share: total - total_extra,
      employee_share: total_extra
    };
  }

  generateReport = () => {
    //console.log("start generate report...")
    const shares = this.calculateShares();
    return this.renderReport(shares);
  }

  renderReport = (shares) => {
    const shareStyle = {paddingLeft: "50px"}
    return (
    <div>
      <div>Company share: <span style={shareStyle}>{shares.company_share}</span></div>
      <div>Employee share: <span style={shareStyle}>{shares.employee_share}</span></div>
    </div>
    );
  }

  render() {
    const { csv, data, headers } = this.state
    const scrollBoxStyle = {
      height: "400px",
      width: "800px",
      border: "1px solid rgb(169, 169, 169)",
      overflow: "auto"
    };
    const renderedReport = this.generateReport();


    return (
    <div className="flexbox-column" style={{ padding: 16, alignItems: "left" }}>
      <div style={{ fontSize: 24, paddingBottom: 16 }}>10bis Report</div>

      <div style={{ paddingBottom: 16, width: "100%" }}>
        <textarea style={{ height: 200, width: "100%" }} value={csv} onChange={this.handleTextAreaChange} />
      </div>

      <div style={scrollBoxStyle}>
        <Table categories={headers} data={data} />
      </div>

      <div>
        {renderedReport}
      </div>
    </div>
    );
  }
}