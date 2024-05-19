import React from 'react';

function DataTable({ csvData }) {
    console.log(csvData)
    const getLimitedData = () => {
        const limit = Math.ceil(csvData.length * 0.1); // 10% of the data
        return csvData.slice(0, limit);
    };
  return (
    <div className="data-table">
        <h2>Data</h2>
      <table>
        <thead>
          <tr>
            {csvData.length > 0 && Object.keys(csvData[0]).map((key, index) => (
              <th key={index}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {getLimitedData().map((row, rowIndex) => (
            <tr key={rowIndex} style={{textAlign:'start'}}>
              {Object.values(row).map((value, colIndex) => (
                <td key={colIndex} style={{textAlign:'start'}}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
