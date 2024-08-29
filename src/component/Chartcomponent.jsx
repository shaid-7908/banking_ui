import { useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  zoomPlugin
);

const ChartComponent = ({ rows, valid_column_pairs }) => {
  const [chartType, setChartType] = useState("Bar");
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);
  const [rowCount, setRowCount] = useState(1000); // Add state for the number of rows

  const selectedPair = valid_column_pairs[selectedPairIndex];
  const xColumn = selectedPair[0];
  const yColumn = selectedPair[1];

  // Limit the number of rows based on the user selection
  const limitedRows = rows.slice(0, rowCount);

  const chartData = {
    labels: limitedRows.map((row) => row[xColumn]),
    datasets: [
      {
        label: yColumn,
        data: limitedRows.map((row) => row[yColumn]),
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Chart for ${xColumn} vs ${yColumn}`,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "y",
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
      },
    },
  };

  // Function to validate the row count input
  const handleRowCountChange = (e) => {
    let value = parseInt(e.target.value);
    // Ensure the value is between 10 and 1000
    if (value < 10) value = 10;
    if (value > 1000) value = 1000;
    setRowCount(value);
  };

  const renderChart = () => {
    switch (chartType) {
      case "Bar":
        return <Bar data={chartData} options={options} />;
      case "Line":
        return <Line data={chartData} options={options} />;
      case "Pie":
        return <Pie data={chartData} options={options} />;
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div>
      <div className="mx-2">
        <select
          className="w-[100px] py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-[1px] focus:ring-slate-300 focus:border-slate-300"
          id="chartType"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="Bar">Bar</option>
          <option value="Line">Line</option>
          <option value="Pie">Pie</option>
        </select>
      </div>
      <div className="mx-2 mt-4">
        <select
          className="w-[100px] py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-[1px] focus:ring-slate-300 focus:border-slate-300"
          id="columnPair"
          value={selectedPairIndex}
          onChange={(e) => setSelectedPairIndex(parseInt(e.target.value))}
        >
          {valid_column_pairs.map((pair, index) => (
            <option key={index} value={index}>
              {pair[0]} vs {pair[1]}
            </option>
          ))}
        </select>
      </div>

      {/* New dropdown for selecting the number of rows */}
      <div className="mx-2 mt-4">
        <label htmlFor="rowCount" className="mr-2">
          Rows to Plot:
        </label>
        <input
          className="w-[100px] py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-[1px] focus:ring-slate-300 focus:border-slate-300"
          id="rowCount"
          type="number"
          value={rowCount}
          onChange={handleRowCountChange}
          min={10}
          max={1000}
        />
      </div>

      <div className="flex justify-center w-full">
        <div className={`${chartType === "Pie" ? "w-[50%]" : "w-[80%]"}`}>
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
