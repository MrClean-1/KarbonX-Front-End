
import React, {  useState } from "react";
import {useDateContext} from '../contexts/DateContext';
import "./HomePage.css";
import { useNodeContext } from '../contexts/NodeContext'
import { useTreeContext} from '../contexts/TreeContext'
import { useEffect } from "react";
import apiServices from "../apiConnection/apiService";

function HomePage() {
    const {month,setMonth,year,setYear} = useDateContext();

    const {nodeData, setNodeData,generateDates}= useNodeContext();
    const {treeData, setTreeData} = useTreeContext();


    useEffect(() => {
        const dates = generateDates(month,year);
        apiServices.getNodeMain(dates).then(response => {
            if(response.status!==200){
                setNodeData([]);
            }
            else{
                setNodeData(response.data);
            }
        })
            .catch(e => {
                console.log(e);
            });

    }, [month,year]);

    useEffect(() => {
        apiServices.getTreeMain(month,year).then(response => {

            if(response.status !== 200){
                setTreeData([]);
            }
            else{
                setTreeData(response.data);
            }
        })
            .catch(e => {
                console.log(e);
            });

    }, [month,year]);
    const numNodes = nodeData.length;
    const criticalNodes = nodeData.filter((node) => node.battery_health <= 10);
    const errorNodes = nodeData.filter((node) => node.error_status !== 0);
    const maxMBHD = treeData ? Math.max(...treeData.map((node) => (node.bh_diameter))): 0; //0 if there is no data
    const minMBHD = treeData ? Math.min(...treeData.map((node) => (node.bh_diameter))): 0 ;

    const totalCritical = criticalNodes.length;
    const totalError = errorNodes.length;

    //node searching
    const [nodeId, setNodeId] = useState('');
    const [nodeSelected, setNodeSelected] = useState('');
    const [nodeTreeSelected, setNodeTreeSelected] = useState('');
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
            const selectedTreeNode = treeData.find((node) => node.node_id === nodeIdInt);
            if (selectedNode) {
                setNodeSelected(selectedNode);
                setNodeTreeSelected(selectedTreeNode);
                setError('');
            }
            else {
                setNodeSelected('');
                setError('Node ID not found')
            }
        }
        else {
            setError('Enter a valid integer for Node ID');
        }
    };
    return (
        <div className="titleDiv">
            <h1 className="title">Dashboard</h1>
        <div className="homePage-container">
            <div className="summaryInfo">
            <label htmlFor="month">Month: </label>
                <select id="month" value={month} onChange={handleChangeMonth}>
                    {Array.from({length:12},(_, i) => i+1).map((month)=>(
                        <option key={month} value={month}>{month}</option>
                    ))}
                </select>
                <label htmlFor="year">Year: </label>
                <input type="number" id="year" value={year} onChange={handleChangeYear}/>
                <h2 style={{ fontSize: '2vw', fontWeight: 'bold' }}>Total Number of Nodes : </h2>
                <p style={{ fontSize: '2vw' }}>{numNodes}</p>
                <h2 style={{ fontSize: '2vw', fontWeight: 'bold' }}>Total Number of Critical Batteries (&lt; 10 %): </h2>
                <p style={{ fontSize: '2vw' }}>{totalCritical}</p>
                <h2 style={{ fontSize: '2vw', fontWeight: 'bold' }}>Total Number of Nodes with Errors: </h2>
                <p style={{ fontSize: '2vw' }}>{totalError}</p>
                <h2 style={{ fontSize: '2vw', fontWeight: 'bold' }}>Minimum MBHD: </h2>
                <p style={{ fontSize: '2vw' }}>{minMBHD}</p>
                <h2 style={{ fontSize: '2vw', fontWeight: 'bold' }}>Maximum MBHD: </h2>
                <p style={{ fontSize: '2vw' }}>{maxMBHD}</p>
            </div>
            <div className="nodeSummary">
                <div style={{ display: "flex", flexDirection: 'row', gap: "2vw" }}>
                    <div className="summary-id">Node ID</div>
                    <input className="summary-div"
                        type="text"
                        id="nodeSummaryId"
                        value={nodeId}
                        onChange={handleNodeChange}
                    />
                    <div className="summary-div2">
                        <button
                            onClick={handleCheckError}
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/0986cc36e8b05190ed4fbb682c882eda47787ae7a212d63a05bd74e32df1bf2d?apiKey=b5d446799a5e4e7ab3e01b97a5ff1ee2&"
                            className="summary-search"
                        >
                            Select
                        </button>
                    </div>
                </div>

                <div style={{ display: "flex" }}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {nodeSelected !== '' && (
                        <div>
                            <p style={{
                                fontWeight: 'bold', fontSize: '2vw'
                            }}>
                                NodeID: {nodeSelected.node_id}</p>
                            <p style={{
                                fontWeight: 'bold', fontSize: '2vw'
                            }}>
                                Battery: {nodeSelected.battery_health} %</p>
                            <p style={{
                                fontWeight: 'bold', fontSize: '2vw'
                            }}>
                                ErrorStatus: {nodeSelected.error_status}</p>
                            <p style={{
                                fontWeight: 'bold', fontSize: '2vw'
                            }}>
                                MBHD: {nodeTreeSelected.bh_diameter} cm</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
        </div>
    );
}

export default HomePage;
