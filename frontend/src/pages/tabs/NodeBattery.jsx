import React, { useState } from "react";
import {useDateContext} from '../../contexts/DateContext';
import {useNodeContext} from '../../contexts/NodeContext';
import "./NodeBattery.css";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function NodeBattery() {
  const {nodeData} = useNodeContext();
  const {month,setMonth,year,setYear} = useDateContext();
  const [threshold, setThreshold] = useState(10); //Critical Battery Threshold
  const [nodeId, setNodeId] = useState('');
  const [batteryPercentage, setBatteryPercentage] = useState('');
  const [error, setError] = useState('');

  const [sortedNodes, setSortedNodes] = useState(Object.values(nodeData).filter((node) => node.battery_health <= 10));

    //functions to select dates of data
    const handleChangeMonth=(e)=>{
      setMonth(parseInt(e.target.value));
    };
    const handleChangeYear =(e)=>{
      setYear(parseInt(e.target.value));
    };

  //handle change of threshold value
  const handleThresholdChange = (newThreshold) => {
    setThreshold(newThreshold);
    setSortedNodes(Object.values(nodeData).filter((node) => node.battery_health <= newThreshold));
  }


  const handleNodeChange = (e) => {
    const value = e.target.value;
    if (Number.isInteger(Number(value))) {
      setNodeId(value);
      setError('');
    }
    else {
      setError('Enter a valid integer for Node ID');
    }
  };

  const handleCheckBattery = () => {
    const nodeIdInt = parseInt(nodeId);
    if (!isNaN(nodeIdInt)) {
      const selectedNode = nodeData.find((node) => node.node_id === nodeIdInt);
      if (selectedNode) {
        setBatteryPercentage(selectedNode.battery_health);
        setError('');
      }
      else {
        setBatteryPercentage('');
        setError('Node ID not found')
      }
    }
    else {
      setError('Enter a valid integer for Node ID');
    }
  };

  const getBatteryBarColor = (percentage) => {
    if (percentage <= 10) {
      return 'red';
    }
    else if (percentage <= 40) {
      return 'yellow';
    }
    else {
      return 'green';
    }
  };
  const handleNodeClick = (clicked) => {
    setNodeId(clicked.node_id);
    setBatteryPercentage(clicked.battery_health);
  }
  return (
    <div className="battery-container">
      <span className="battery-span">
        <div className="battery-div">
          <div className="battery-div2">
            <div className="date-selector">
          <label htmlFor="month">Month: </label>
                <select id="month" value={month} onChange={handleChangeMonth}>
                    {Array.from({length:12},(_, i) => i+1).map((month)=>(
                        <option key={month} value={month}>{month}</option>
                    ))}
                </select>
                <label htmlFor="year">Year: </label>
                <input type="number" id="year" value={year} onChange={handleChangeYear}/>
                </div>
            <span className="battery-span2">
              <div className="battery-id">Node ID</div>
              <input className="battery-div3"
                type="text"
                id="nodeBatteryId"
                value={nodeId}
                onChange={handleNodeChange}
              />
              <div className="battery-div4">
                <button
                  onClick={handleCheckBattery}
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/0986cc36e8b05190ed4fbb682c882eda47787ae7a212d63a05bd74e32df1bf2d?apiKey=b5d446799a5e4e7ab3e01b97a5ff1ee2&"
                  className="battery-search"
                >
                  Select
                </button>
              </div>
            </span>
            <div>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {batteryPercentage && (
                <p style={{
                  fontWeight: 'bold', fontSize: '2vw'
                }}>
                  Battery Percentage: {batteryPercentage}%</p>
              )}
              <div
                className="battery-bar"
                style={{
                  width: batteryPercentage ? `${batteryPercentage}%` : '0',
                  backgroundColor: batteryPercentage ? getBatteryBarColor(batteryPercentage) : 'transparent',
                }}
              />

            </div>
            <div className="battery-threshold">
              <label>Critical Battery Threshold: {threshold} </label>
              <Slider
                min={0}
                max={100}
                defaultValue={threshold}
                value={threshold}
                onChange={handleThresholdChange}
              />
            </div>
          </div>
          <span className="battery-health">
            <h2>Critical Nodes  (&lt; {threshold}%)</h2>
            <div className="critical-container">

              {sortedNodes.map((node) => (
                <div
                  key={node.node_id}
                  className="critical-node"
                  onClick={() => handleNodeClick(node)}
                >
                  {node.node_id}
                </div>
              ))}
            </div>
          </span>
        </div>
      </span>
    </div>
  );
}

export default NodeBattery;