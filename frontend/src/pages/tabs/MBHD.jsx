import React, { useEffect, useState } from "react";
import {useDateContext} from '../../contexts/DateContext';
import {useTreeContext} from '../../contexts/TreeContext';
import "./MBHD.css";
import MBHDGraph from '../../components/MBHDGraph';

function MBHD() {
  const {month,setMonth,year,setYear} =useDateContext();
  const {treeData,setTreeData} = useTreeContext();
  
  const maxMBHD = treeData ? Math.max(...treeData.map((node) => (node.bh_diameter))):0; //0 if there is no data
  const minMBHD = treeData ? Math.min(...treeData.map((node) => (node.bh_diameter))):0;
  const [nodeId, setNodeId] = useState('');
  const [mbhd, setMBHD] = useState('');
  const [error, setError] = useState('');

  //for filtering
  const [minValue, setMinValue] = useState(minMBHD ? minMBHD : 0);
  const [maxValue, setMaxValue] = useState(maxMBHD ? maxMBHD : 0);
  const [rangeSet, setRangeSet] = useState(false);
  const [rangeError, setRangeError] = useState('');
  const [sortedNodes, setSortedNodes] = useState([]);
  useEffect(() => { setSortedNodes(treeData) }, [treeData]);

  //functions to select dates of data
  const handleChangeMonth=(e)=>{
    setMonth(parseInt(e.target.value));
    
  };
  const handleChangeYear =(e)=>{
    setYear(parseInt(e.target.value));
  };
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
  const handleCheckError = () => {
    const nodeIdInt = parseInt(nodeId);
    if (!isNaN(nodeIdInt)) {
      const selectedNode = treeData.find((node) => node.node_id === nodeIdInt);
      if (selectedNode) {
        setMBHD(selectedNode.bh_diameter);
        setError('');
      }
      else {
        setMBHD('');
        setError('Node ID not found')
      }
    }
    else {
      setError('Enter a valid integer for Node ID');
    }
  };
  const handleNodeClick = (clicked) => {
    setNodeId(clicked.node_id);
    setMBHD(clicked.bh_diameter);
  }
  //for filtering
  const handleSortAscending = () => {
    let filteredData = [...treeData];
    if (rangeSet) {
      const min = parseFloat(minValue);
      const max = parseFloat(maxValue);

      if (!isNaN(min) && !isNaN(max) && min <= max) {
        filteredData = filteredData.filter((node) => node.bh_diameter >= min && node.bh_diameter <= max);
        setRangeSet(true);
        setRangeError('');
      }
      else {
        setRangeSet(false);
        setRangeError('Invalid Range');
      }
    }
    setSortedNodes(filteredData.sort((a, b) => a.bh_diameter - b.bh_diameter));

  };
  const handleSortDescending = () => {
    let filteredData = [...treeData];
    if (rangeSet) {
      const min = parseFloat(minValue);
      const max = parseFloat(maxValue);

      if (!isNaN(min) && !isNaN(max) && min <= max) {
        filteredData = filteredData.filter((node) => node.bh_diameter >= min && node.bh_diameter <= max);
        setRangeSet(true);
        setRangeError('');
      }
      else {
        setRangeSet(false);
        setRangeError('Invalid Range');
      }
    }
    setSortedNodes(filteredData.sort((a, b) => b.bh_diameter - a.bh_diameter));
  }
  const handleSetRange = () => {
    let filteredData = [...treeData];
    const min = parseFloat(minValue);
    const max = parseFloat(maxValue);
    if (!isNaN(min) && !isNaN(max) && (min <= max)) {
      setRangeSet(true);
      setRangeError('');
      //by default sort ascending
      filteredData = filteredData.filter((node) => node.bh_diameter >= min && node.bh_diameter <= max);
      setSortedNodes(filteredData.sort((a, b) => a.bh_diameter - b.bh_diameter));
    }
    else {
      setRangeSet(false);
      setRangeError("Invalid Range");
    }

  };

  const handleResetFilter = () => {
    setSortedNodes([...treeData]);
    setMinValue('');
    setMaxValue('');
    setRangeSet(false);
    setRangeError('');
  };
  //handle bar graph click
  const handleIntervalClick = (interval) => {
    const filtered = treeData.filter((node) => node.bh_diameter >= interval.min && node.bh_diameter < interval.max).sort((a, b) => a.bh_diameter - b.bh_diameter);

    setMinValue(interval.min);
    setMaxValue(interval.max);
    setRangeSet(true);
    setSortedNodes(filtered);
  }
  return (

    <div className="MBHD-container">
      
      <span className="MBHD-span">
        <div className="MBHD-div">
          <div className="MBHD-div2">
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
            <span className="MBHD-span2">
              <div className="MBHD-id">Node ID</div>
              <input className="MBHD-div3"
                type="text"
                id="nodeMBHDId"
                value={nodeId}
                onChange={handleNodeChange}
              />
              <div className="MBHD-div4">
                <button
                  onClick={handleCheckError}
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/0986cc36e8b05190ed4fbb682c882eda47787ae7a212d63a05bd74e32df1bf2d?apiKey=b5d446799a5e4e7ab3e01b97a5ff1ee2&"
                  className="MBHD-search"
                >
                  Select
                </button>
              </div>
            </span>
            <div>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {mbhd && (
                <p style={{
                  fontWeight: 'bold', fontSize: '2vw'
                }}>
                  Mean Breast Height Diameter: {mbhd} cm</p>
              )}
            </div>
            <div className="MBHD-range">
              <label htmlFor="minValue">
                Min
              </label>
              <input
                type="number"
                id="minValue"
                min={minMBHD}
                max={maxMBHD}
                placeholder={minMBHD}
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
              />
              <label htmlFor="maxValue">
                Max
              </label>
              <input
                type="number"
                id="maxValue"
                min={minMBHD}
                max={maxMBHD}
                placeholder={maxMBHD}
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
              />
              <button onClick={handleSetRange}>Set Range</button>
            </div>
            <div className="MBHD-filters">
              <button onClick={handleSortAscending}>Sort Ascending</button>
              <button onClick={handleSortDescending}>Sort Descending</button>
              <button onClick={handleResetFilter}>Reset</button>
            </div>
            {rangeError && <div style={{ color: 'red' }}>{rangeError}</div>}
            {rangeSet && !rangeError && (
              <div>
                Range set: {minValue === '' ? `${minMBHD}` : minValue} to {maxValue === '' ? `${maxMBHD}` : maxValue}
              </div>
            )}

            <h2>Nodes</h2>

            <div className="MBHD-grid">
              {sortedNodes.map((node) => (
                <div
                  key={node.node_id}
                  className="MBHD-node"
                  onClick={() => handleNodeClick(node)}
                >
                  {node.node_id}
                </div>
              ))}
            </div>
          </div>

          <span className="MBHD-chart-container">
            <div className="MBHD-distribution">
              Distribution of Diameter Ranges over all Nodes
            </div>
            <div className="MBHD-chart">
              <MBHDGraph data={treeData} onIntervalClick={handleIntervalClick} />
            </div>
          </span>
        </div>
      </span>
    </div>
  );
}

export default MBHD;