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
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

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

  const filterData = (data, query) => {
    if (!query) return data;
    return data.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const generateSuggestions = () => {
    const combinedData = [...chartOneData, ...chartTwoData, ...chartThreeData];
    const uniqueNames = [
      ...new Set(combinedData.map((item) => item['Product Name']?.toLowerCase() || '')),
    ];
    return uniqueNames.filter((name) => name.includes(searchQuery.toLowerCase())).slice(0, 5);
  };

  useEffect(() => {
    if (searchQuery) {
      setSuggestions(generateSuggestions());
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const filteredChartOneData = filterData(chartOneData, searchQuery);
  const filteredChartTwoData = filterData(chartTwoData, searchQuery);
  const filteredChartThreeData = filterData(chartThreeData, searchQuery);

  const currentStockData = {
    labels: filteredChartOneData?.map((item) => item['Product Name']) || [],
    datasets: [
      {
        label: 'Current Stock',
        data: filteredChartOneData?.map((item) => item.Quantity) || [],
        backgroundColor: 'rgba(53, 162, 235, 0.8)',
        barThickness: 20,
      },
    ],
  };

  const categoryData = {
    labels: filteredChartTwoData?.map((item) => item['Product Name']) || [],
    datasets: [
      {
        label: 'Quantity',
        data: filteredChartTwoData?.map((item) => item.Quantity) || [],
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
    labels: filteredChartThreeData?.map((item) => item['Product Name']) || [],
    datasets: [
      {
        label: 'Quantity',
        data: filteredChartThreeData?.map((item) => item.Quantity) || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
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
      y: { ticks: { autoSkip: false, maxTicksLimit: 20 } },
      x: { ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="inventory-analysis-container">
      <div className="content">
        <main className="main-content">

          {/* Search Bar */}
          <div className="search-container" style={{paddingTop: "50px", paddingBottom: "30px"}}>
            <input
              type="text"
              className="search-input"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="suggestion-item"
                    onClick={() => setSearchQuery(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

        <div className="metric-cards">
            <div className="metric-card purple">
              <h3>30,000</h3>
              <p>Total items</p>
              <span className="growth">⬆ 12%</span>
            </div>
            <div className="metric-card blue">
              <h3>270</h3>
              <p>Total orders</p>
              <span className="growth">⬆ 12%</span>
            </div>
            <div className="metric-card orange">
              <h3>1,000</h3>
              <p>Today's revenue</p>
              <span className="growth">⬆ 12%</span>
            </div>
          </div>
          
          {isLoading ? (
            'Loading...'
          ) : (
            <div className="charts-grid">
              <div className="chart-container">
                <Bar options={barOptions} data={currentStockData} />
              </div>
              <div className="chart-container">
                <Doughnut options={barOptions} data={categoryData} />
              </div>
              <div className="chart-container">
                <Line options={barOptions} data={expiryData} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default InventoryAnalysis;