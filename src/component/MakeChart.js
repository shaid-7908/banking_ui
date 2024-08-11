import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ results, columns, validColumnPairs }) => {
  // Assuming you want to use the first valid column pair for the chart
  const xField = validColumnPairs[0].x;
  const yField = validColumnPairs[0].y;

  const chartData = {
    labels: results.map((item) => item[xField]),
    datasets: [
      {
        label: yField,
        data: results.map((item) => item[yField]),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
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
        text: `${xField} vs ${yField}`,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default ChartComponent;
