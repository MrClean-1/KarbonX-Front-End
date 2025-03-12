
import React, { useState, useEffect } from "react";
import {useDateContext} from '../../contexts/DateContext';
import {useTreeContext} from '../../contexts/TreeContext';
import "./CarbonMass.css";
import CarbonGraph from '../../components/CarbonGraph';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
function CarbonMass() {
  const {month,setMonth,year,setYear} = useDateContext();
  const {treeData,setTreeData} = useTreeContext();

  //function for calculating carbon mass
  const calculateCarbon = () => {
    //calculating carbon mass
    treeData.forEach(node => {

      //Using North Central - KS, ND, NE, SD (122)
      //Calculating Gross cubic-foot volume (VOLCFGRS) in ft^3
      //where x1 = breast height diameter, x2 = height
      //using gross cubic foot volume coefficients b1,b2,b3,b4,and b5
      //IF x1^2 * x2 <= b1, VOLCFGRS = b2 + b3 * x1^2 * x2
      //IF x1^2 * x2 > b1, VOLCFGRS = b4 + b5 * x1^2 * x2
      //IF VOLCFGRS <= 0, SET TO 0.1

      //converting height and mbhd to inches for calculations
      //assuming height is approximately 2.75 times the mbhd
      const height = 0.393701 * node.bh_diameter * 2.75;
      const mbhd = 0.393701 * node.bh_diameter;



      //coefficients from coefficient table RMRS_coefs_9
      const b1 = 0.0810724804;
      const b2 = 0.00198351037;
      const b3 = -0.1253489396;
      const b4 = 0.003604219;
      const b5 = 0.00015;

      //check x1^2 * x2
      const x1sqred = mbhd * mbhd;

      const x1x2 = x1sqred * height;
      let VOLCFGRS = 0.1;
      if (x1x2 <= b1) {
        VOLCFGRS = b2 + (b3 * x1sqred * height);

      }
      else {
        VOLCFGRS = b4 + (b5 * x1sqred * height);
      }
      if (VOLCFGRS <= 0) {
        VOLCFGRS = 0.1;
      }

      //Calculating Sound cubic-foot volume (VOLCFSND) in ft^3
      //VOLCFSND = VOLCFGRS(1-(b1*b2/100))
      //Using sound coefficients b1 and b2 (assuming trees are growing stock treeclcd = 2)
      //coefficients from table Snd_coefs_1
      const sb1 = 0.78;
      const sb2 = 0.1;

      const VOLCFSND = VOLCFGRS * (1 - (sb1 * sb2 / 100));


      //calculating bole biomass (DRYBIO_BOLE)
      //bolewood biomass = Vgw * SGgw * W;
      //Vgw = VOLCFSND of green wood in central stem
      // SGgw = basic specific gravity of wood 
      // W = weight of ft^3 of water(62.4lb)
      const SGgw = 0.4; //from table
      const W = 62.4;
      const bole_biomass = VOLCFSND * SGgw * W
      //bole bark biomass = Vgw * BV% * SGgb * W
      //BV% = bark as percentage of wood volume
      const SGgb = 0.35;  //from table
      const BV = 0.256; //from table
      const bole_bark_biomass = VOLCFSND * BV * SGgb * W
      const total_bole_biomass = bole_biomass + bole_bark_biomass;
      //calculating component ratio method adjustment factors (CRMadjfac)
      //CRMadjfac = Bodt/MST
      //Bodt = total oven-dry biomass, MST= merchantable oven-dry bole biomass
      const MST = total_bole_biomass * 0.8978947;
      const CRMadj = total_bole_biomass / MST;

      //calculating stump volume (outside and inside bark) and biomass (DRYBIO_STUMP)
      //using coefficients A and B
      const A_in = 0.90698
      const B_in = 0.08469;
      const A_out = 1;
      const B_out = 0.08091;
      //calculating (A-B)^2
      const ABsqred_in = (A_in - B_in) * (A_in - B_in);
      const ABsqred_out = (A_out - B_out) * (A_out - B_out);
      const stump_volume_outside = Math.PI * x1sqred / (4 * 144) * ((ABsqred_out * 1 + 11 * B_out * (A_out - B_out) * Math.log(1 + 1) - 30.25 / (1 + 1) * B_out * B_out) - (ABsqred_out * 0 + 11 * B_out * (A_out - B_out) * Math.log(0 + 1) - 30.25 / (0 + 1) * B_out * B_out));
      const stump_volume_inside = Math.PI * x1sqred / (4 * 144) * ((ABsqred_in * 1 + 11 * B_in * (A_in - B_in) * Math.log(1 + 1) - 30.25 / (1 + 1) * B_in * B_in) - (ABsqred_in * 0 + 11 * B_in * (A_in - B_in) * Math.log(0 + 1) - 30.25 / (0 + 1) * B_in * B_in));
      //calculating stump wood biomass, stump bark biomass, total stump biomass
      const stump_wood_biomass = stump_volume_inside * SGgw * W;
      const stump_bark_biomass = (stump_volume_outside - stump_volume_inside) * SGgb * W;
      const total_stump_biomass = (stump_wood_biomass + stump_bark_biomass) * CRMadj;



      //calculating top and branch biomass (DRYBIO_TOP)
      //calculating foliage oven-dry biomass, stump oven-dry biomass, total aboveground oven-dry biomass
      const fol_param0 = -2.9584;
      const fol_param1 = 4.4766;
      const fol_ratio = Math.exp(fol_param0 + (fol_param1 / mbhd));
      const fol_biomass = fol_ratio * total_bole_biomass;


      const tot_param0 = -2.5356;
      const tot_param1 = 2.4349;
      const tot_biomass = Math.exp(tot_param0 + tot_param1 * Math.log(mbhd));


      const stp_biomass = B_in * total_bole_biomass;

      const top_branch_biomass = (tot_biomass - MST - stp_biomass - fol_biomass) * CRMadj;
      //calculating total above ground biomass
      const total_aboveground_biomass = total_bole_biomass + total_stump_biomass + top_branch_biomass;
      const CMass = total_aboveground_biomass * 0.47;
      node.CMass = CMass;
    })
  }
  calculateCarbon();

  const maxCMass =treeData ? Math.max(...treeData.map((node) => (node.CMass))) : 0; //0 if list is empty
  const minCMass = treeData ?  Math.min(...treeData.map((node) => (node.CMass))):0;

  const [nodeId, setNodeId] = useState('');
  const [CMass, setCMass] = useState('');
  const [error, setError] = useState('');

  //for filtering
  const [sortedNodes, setSortedNodes] = useState([]);
  useEffect(() => { setSortedNodes(treeData) }, [treeData]);

  const [minValue, setMinValue] = useState(minCMass ? minCMass : 0);
  const [maxValue, setMaxValue] = useState(maxCMass ? maxCMass : 0);
  const [rangeSet, setRangeSet] = useState(false);
  const [rangeError, setRangeError] = useState('');

  //for extrapolating carbon mass
  const numberOfNodes =treeData.length;
  const totalCMass = treeData.reduce((acc, node) => acc + node.CMass, 0);
  const averageCMass = numberOfNodes === 0 ? 0 : totalCMass / numberOfNodes;

  const [numNodes, setNumNodes] = useState(numberOfNodes); //number of nodes to extrapolate data to
  const [expCMass, setExpCMass] = useState(averageCMass * numberOfNodes); //value of CMass extrapolated

    //functions to select dates of data
    const handleChangeMonth=(e)=>{
      setMonth(parseInt(e.target.value));
    };
    const handleChangeYear =(e)=>{
      setYear(parseInt(e.target.value));
    };

  //handle bar graph click
  const handleIntervalClick = (interval) => {
    const filtered = treeData.filter((node) => node.CMass >= interval.min && node.CMass < interval.max).sort((a, b) => a.CMass - b.CMass);
    setMinValue(interval.min);
    setMaxValue(interval.max);
    setRangeSet(true);
    setSortedNodes(filtered);
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
  const handleCheckError = () => {
    const nodeIdInt = parseInt(nodeId);
    if (!isNaN(nodeIdInt)) {
      const selectedNode = treeData.find((node) => node.NodeId === nodeIdInt);
      if (selectedNode) {
        setCMass(selectedNode.CMass);
        setError('');
      }
      else {
        setCMass('');
        setError('Node ID not found')
      }
    }
    else {
      setError('Enter a valid integer for Node ID');
    }
  };
  const handleNodeClick = (clicked) => {
    setNodeId(clicked.node_id);
    setCMass(clicked.CMass);
  }
  //for filtering
  const handleSortAscending = () => {
    let filteredData = [...treeData];
    if (rangeSet) {
      const min = parseFloat(minValue);
      const max = parseFloat(maxValue);

      if (!isNaN(min) && !isNaN(max) && min <= max) {
        filteredData = filteredData.filter((node) => node.CMass >= min && node.CMass <= max);
        setRangeSet(true);
        setRangeError('');
      }
      else {
        setRangeSet(false);
        setRangeError('Invalid Range');
      }
    }
    setSortedNodes(filteredData.sort((a, b) => a.CMass - b.CMass));

  };
  const handleSortDescending = () => {
    let filteredData = [...treeData];
    if (rangeSet) {
      const min = parseFloat(minValue);
      const max = parseFloat(maxValue);

      if (!isNaN(min) && !isNaN(max) && min <= max) {
        filteredData = filteredData.filter((node) => node.CMass >= min && node.CMass <= max);
        setRangeSet(true);
        setRangeError('');
      }
      else {
        setRangeSet(false);
        setRangeError('Invalid Range');
      }
    }
    setSortedNodes(filteredData.sort((a, b) => b.CMass - a.CMass));
  }
  const handleSetRange = () => {
    let filteredData = [...treeData];
    const min = parseFloat(minValue);
    const max = parseFloat(maxValue);
    if (!isNaN(min) && !isNaN(max) && (min <= max)) {
      setRangeSet(true);
      setRangeError('');
      //by default sort ascending
      filteredData = filteredData.filter((node) => node.CMass >= min && node.CMass <= max);
      setSortedNodes(filteredData.sort((a, b) => a.CMass - b.CMass));
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

  //handling extrapolating CMass
  const handleExtrapolation = (value) => {
    setNumNodes(value);

    const newCarbon = value * averageCMass;
    setExpCMass(newCarbon);
  }
  return (
    <div className="CMass-container">
      <span className="CMass-span">
        <div className="CMass-div">
          <div className="CMass-div2">
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
            <span className="CMass-span2">
              <div className="CMass-id">Node ID</div>
              <input className="CMass-div3"
                type="text"
                id="nodeCMassId"
                value={nodeId}
                onChange={handleNodeChange}
              />
              <div className="CMass-div4">
                <button
                  onClick={handleCheckError}
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/0986cc36e8b05190ed4fbb682c882eda47787ae7a212d63a05bd74e32df1bf2d?apiKey=b5d446799a5e4e7ab3e01b97a5ff1ee2&"
                  className="CMass-search"
                >
                  Select
                </button>
              </div>
            </span>
            <div>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {CMass && (
                <p style={{
                  fontWeight: 'bold', fontSize: '2vw'
                }}>
                  Carbon Mass: {CMass} lb</p>
              )}
            </div>
            <div className="CMass-range">
              <label htmlFor="minValue">
                Min
              </label>
              <input
                type="number"
                id="minValue"
                min={minCMass}
                max={maxCMass}
                placeholder={minCMass}
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
              />
              <label htmlFor="maxValue">
                Max
              </label>
              <input
                type="number"
                id="maxValue"
                min={minCMass}
                max={maxCMass}
                placeholder={maxCMass}
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
              />
              <button onClick={handleSetRange}>Set Range</button>
            </div>
            <div className="CMass-filters">
              <button onClick={handleSortAscending}>Sort Ascending</button>
              <button onClick={handleSortDescending}>Sort Descending</button>
              <button onClick={handleResetFilter}>Reset</button>
            </div>
            {rangeError && <div style={{ color: 'red' }}>{rangeError}</div>}
            {rangeSet && !rangeError && (
              <div>
                Range set: {minValue === '' ? `${minCMass}` : minValue} to {maxValue === '' ? `${maxCMass}` : maxValue}
              </div>
            )}

            <h2>Nodes</h2>

            <div className="CMass-grid">
              {sortedNodes.map((node) => (
                <div
                  key={node.node_id}
                  className="CMass-node"
                  onClick={() => handleNodeClick(node)}
                >
                  {node.node_id}
                </div>
              ))}
            </div>
          </div>
          <span className="Carbon-chart-container">
            <div className="Carbon-distribution">
              Distribution of Carbon Mass ranges over all Nodes
            </div>
            <div className="Carbon-chart">
              <CarbonGraph data={treeData} onIntervalClick={handleIntervalClick} calculateCarbon={calculateCarbon} />
            </div>

            <h2>Carbon Mass Extrapolator</h2>

            <label htmlFor="numNodeInput">Number of Nodes:</label>
            <input
              id="numNodeInput"
              type="number"
              min={numberOfNodes}
              value={numNodes}
              onChange={(event) => handleExtrapolation(parseInt(event.target.value))}
            />
            <p> Extrapolated Carbon Mass: {expCMass}</p>
            <Slider
              min={numberOfNodes}
              max={numberOfNodes + 1000} //set maximum to min + 1000
              value={numNodes}
              onChange={handleExtrapolation}
            />
          </span>
        </div>
      </span>
    </div>
  );
}

export default CarbonMass;