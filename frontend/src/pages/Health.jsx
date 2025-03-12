import React, { useState } from "react";
import "./Health.css";
import apiServices from "../apiConnection/apiService";
import { useNodeContext } from '../contexts/NodeContext';
import { useDateContext } from '../contexts/DateContext';
import NodeHealth from "./tabs/NodeHealth";
import NodeBattery from "./tabs/NodeBattery";
import { useEffect } from "react";
function Health() {
    const {month,year} = useDateContext();
    const {nodeData, setNodeData,generateDates} = useNodeContext();

    useEffect(() => {
        const dates = generateDates(month,year);
        apiServices.getNodeHealth(dates).then(response => {
            if(response.status!== 200){
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
    const [selectedTab, setSelectedTab] = useState('opt1');
    const handleTabSelect = (tab) => {
        setSelectedTab(tab);
    };
    return (
        <div className="titleDiv">
            <h1 className="title">Health Information</h1>
        <div>
            <div className="tabs">
                <div className="opt1" onClick={() => handleTabSelect('opt1')} style={{ backgroundColor: selectedTab === 'opt1' ? '#6c6c6c' : '#231f20' }}>
                    Node Health
                </div>
                <div className="separator"></div>
                <div className="opt2" onClick={() => handleTabSelect('opt2')} style={{ backgroundColor: selectedTab === 'opt2' ? '#6c6c6c' : '#231f20' }}>
                    Node Battery
                </div>
            </div>
            <div className="health-content">
                {selectedTab === 'opt1' ? <NodeHealth  /> : <NodeBattery  />}
            </div>
        </div>
        </div>
    );
}

export default Health;