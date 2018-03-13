import * as React from "react";
import { CATEGORY_INDEX } from '../data/constants';

const cellStyle = { width: "20%", textAlign: "left", paddingRight: "10px" };

export class TableRow extends React.Component {
    render() {
        const { rowData } = this.props;
        const key = rowData[CATEGORY_INDEX.ID];

        return (
            <tr>
                {rowData.map((cellData, index) => (
                    <td
                        key={`${key}${index}`}
                        style={cellStyle}
                    >
                        {cellData}
                    </td>
                ))}
            </tr>
        );
    }
}

export class Table extends React.Component {
    render() {
        const { data, categories } = this.props;
        return (
            <table>
                <thead>
                    <tr>
                        {categories.map(category => (
                            <th
                                style={cellStyle}
                                key={category}>
                                {category}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map(rowData => (
                        <TableRow key={rowData[CATEGORY_INDEX.ID]} rowData={rowData} />
                    ))}
                </tbody>
            </table>
        );
    }
}