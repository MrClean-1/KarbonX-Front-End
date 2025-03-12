import React, { useState } from "react";
import {useDateContext} from '../../contexts/DateContext';
import {useNodeContext} from '../../contexts/NodeContext';
import "./NodeHealth.css";

function NodeHealth() {
  const {nodeData}=useNodeContext();
  const {month,setMonth,year,setYear} = useDateContext();
  const [nodeId, setNodeId] = useState('');
  const [nodeError, setNodeError] = useState('');
  const [error, setError] = useState('');

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
      const selectedNode = nodeData.find((node) => node.node_id === nodeIdInt);
      if (selectedNode) {
        setNodeError(selectedNode.error_status);
        setError('');
      }
      else {
        setNodeError('');
        setError('Node ID not found')
      }
    }
    else {
      setError('Enter a valid integer for Node ID');
    }
  };
  const handleNodeClick = (clicked) => {
    setNodeId(clicked.node_id);
    setNodeError(clicked.error_status);
  }
  return (
    <div className="health-container">
      <span className="health-span">
        <div className="health-div">
          <div className="health-div2">
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
            <span className="health-span2">
              <div className="health-id">Node ID</div>
              <input className="health-div3"
                type="text"
                id="nodeHealthId"
                value={nodeId}
                onChange={handleNodeChange}
              />
              <div className="health-div4">
                <button
                  onClick={handleCheckError}
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/0986cc36e8b05190ed4fbb682c882eda47787ae7a212d63a05bd74e32df1bf2d?apiKey=b5d446799a5e4e7ab3e01b97a5ff1ee2&"
                  className="health-search"
                >
                  Select
                </button>
              </div>
            </span>
            <div>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {nodeError !== '' && (
                <p style={{
                  fontWeight: 'bold', fontSize: '2vw'
                }}>
                  Error Status: {nodeError}</p>
              )}

            </div>

          </div>
          <span className="error-health">
            <h2>Node with Errors</h2>
            <div className="error-container">
              {Object.values(nodeData).filter((node) => node.error_status !== 0).map((node) => (
                <div
                  key={node.node_id}
                  className="error-node"
                  onClick={() => handleNodeClick(node)}
                >
                  {node.node_id}
                </div>
              ))}
            </div>
          </span>
          <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {nodeError && (
              <p style={{
                fontWeight: 'bold', fontSize: '2vw'
              }}>
                Error Status: {nodeError}</p>
            )}
          </div>
        </div>
      </span>
    </div>
  );
}

export default NodeHealth;