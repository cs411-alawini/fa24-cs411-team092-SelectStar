
import './App.css';
import React from 'react';
import Dashboard from "./pages/Dashboard/Dashboard";
import Header from './components/Header/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InventoryAnalysis from './components/InventoryAnalysis/InventoryAnalysis';
import AdminPortal from './components/AdminPortal/AdminPortal';

function App() {

  return (
    <Router>
    <div className="app">
      <Header />
      
      <Routes>
        <Route path="/analyst-dashboard" element={<Dashboard />} />
        <Route path="/admin-portal" element={<AdminPortal />} />
        <Route path="/inventory-analysis" element={<InventoryAnalysis />} />
      </Routes>
    
    </div>
    </Router>
  );
}

export default App;
