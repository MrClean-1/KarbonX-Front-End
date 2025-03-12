
import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {NodeProvider} from './contexts/NodeContext';
import {DateProvider} from './contexts/DateContext';
import {TreeProvider} from './contexts/TreeContext';
import BaseMenu from "./components/BaseMenu";
import HomePage from "./pages/HomePage";
import Geolocation from "./pages/Geolocation";
import Health from "./pages/Health";
import TreeInfo from "./pages/TreeInfo";

function App() {
  return (
    <DateProvider>
    <TreeProvider>
    <NodeProvider>
    <Router>
      <div style={{display:'flex'}}>
         <BaseMenu/>
         <div style={{display:'flex', flexDirection:'column', flexGrow:1}}>
              <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/Dashboard" element={<HomePage/>} />
                <Route path="/Geolocation" element={<Geolocation/>} />
                <Route path="/Health" element={<Health/>} />
                <Route path="/TreeInfo" element={<TreeInfo/>} />
              </Routes>
              </div>
              </div>
            </Router>
    </NodeProvider>
    </TreeProvider>
    </DateProvider>
          
  );
}

export default App;
