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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const ChartComponent = ({ rows, columns, column_types }) => {
  const [chartType, setChartType] = useState("Bar");

  // Filter columns to include only numerical columns
  const numericalColumns = columns.filter(
    (col) => column_types[col] === "numerical"
  );

  // Convert row data into a format suitable for chart.js
  const chartData = {
    labels: numericalColumns,
    datasets: rows.map((row, index) => ({
      label: `Row ${index + 1}`,
      data: numericalColumns.map((col) => row[col]),
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
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Ethnicity Distribution",
      },
    },
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
      <div className="flex justify-center w-full">
        <div className={`${chartType === "Pie" ? "w-[50%]" : "w-[80%]"}`}>
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
