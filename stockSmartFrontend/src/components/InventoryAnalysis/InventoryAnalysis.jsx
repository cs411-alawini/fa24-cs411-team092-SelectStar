import React, { useEffect, useState } from 'react';
import './InventoryAnalysis.css';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const InventoryAnalysis = () => {
  const [chartOneData, setChartOneData] = useState([]);
  const [chartTwoData, setChartTwoData] = useState([]);
  const [chartThreeData, setChartThreeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseOne = await fetch('http://localhost:8000/analyst/AnalystChartOneView');
        const responseTwo = await fetch('http://localhost:8000/analyst/AnalystChartTwoView');
        const responseThree = await fetch('http://localhost:8000/analyst/AnalystChartThreeView');

        const dataOne = await responseOne.json();
        const dataTwo = await responseTwo.json();
        const dataThree = await responseThree.json();

        setChartOneData(dataOne.data || []);
        setChartTwoData(dataTwo.data || []);
        setChartThreeData(dataThree.data || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentStockData = {
    labels: chartOneData?.map((item) => item['Product Name']) || [],
    datasets: [
      {
        label: 'Current Stock',
        data: chartOneData?.map((item) => item.Quantity) || [],
        backgroundColor: 'rgba(53, 162, 235, 0.8)',
        barThickness: 20,
      },
    ],
  };

  const categoryData = {
    labels: chartTwoData?.map((item) => item['Product Name']) || [],
    datasets: [
      {
        label: 'Quantity',
        data: chartTwoData?.map((item) => item.Quantity) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
      },
    ],
  };

  const expiryData = {
    labels: chartThreeData?.map((item) => item['Product Name']) || [],
    datasets: [
      {
        label: 'Quantity',
        data: chartThreeData?.map((item) => item.Quantity) || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12 },
        },
      },
      title: { display: true },
    },
    layout: {
      padding: { top: 20, left: 10, right: 10, bottom: 10 },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // Switch axis to make it horizontal
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12 },
        },
      },
      title: { display: true, text: 'Current Stock Levels' },
    },
    layout: {
      padding: { top: 20, left: 10, right: 10, bottom: 10 },
    },
    scales: {
      y: {
        ticks: {
          autoSkip: false,
          maxTicksLimit: 20,
        },
      },
      x: {
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const doughnutOptions = {
    ...options,
    plugins: {
      ...options.plugins,
      title: { display: true, text: 'Top Products' },
    },
  };

  const lineOptions = {
    ...options,
    plugins: {
      ...options.plugins,
      title: { display: true, text: 'Products Near Expiry' },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="inventory-analysis-container">
      <div className="content">
        <main className="main-content">
          <h2 className="main-title">Current Inventory Analysis</h2>
          {isLoading ? (
            'Loading...'
          ) : (
            <div className="charts-grid">
              <div className="chart-container">
  <div style={{ height: '400px', overflowY: 'scroll', padding: '10px' }}>
    <Bar options={barOptions} data={currentStockData} />
  </div>
</div>

              <div className="chart-container">
                <div style={{ height: '400px', padding: '10px' }}>
                  <Doughnut options={doughnutOptions} data={categoryData} />
                </div>
              </div>

              <div className="chart-container">
                <div style={{ height: '400px', padding: '10px' }}>
                  <Line options={lineOptions} data={expiryData} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default InventoryAnalysis;
