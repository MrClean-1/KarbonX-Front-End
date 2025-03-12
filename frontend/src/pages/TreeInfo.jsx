import React, { useState } from "react";
import "./TreeInfo.css";
import apiServices from "../apiConnection/apiService";
import {useDateContext} from "../contexts/DateContext";
import { useEffect } from "react";
import { useTreeContext } from '../contexts/TreeContext';
import MBHD from "./tabs/MBHD";
import CarbonMass from "./tabs/CarbonMass";

function TreeInfo() {
    //const nodeList = useNodeContext();
    const {month,year} = useDateContext();
    const [selectedTab, setSelectedTab] = useState('opt1');
    const {treeData, setTreeData} = useTreeContext();
    useEffect(() => {
        apiServices.getTreeInfo(month,year).then(response => {
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
    const handleTabSelect = (tab) => {
        setSelectedTab(tab);
    };
    return (
        <div className="titleDiv">
            <h1 className="title">Tree Information</h1>
        <div >
            <div className="tabs">
                <div className="opt1" onClick={() => handleTabSelect('opt1')} style={{ backgroundColor: selectedTab === 'opt1' ? '#6c6c6c' : '#231f20' }}>
                    Mean Breast Height Diameter
                </div>
                <div className="separator"></div>
                <div className="opt2" onClick={() => handleTabSelect('opt2')} style={{ backgroundColor: selectedTab === 'opt2' ? '#6c6c6c' : '#231f20' }}>
                    Carbon Mass
                </div>
            </div>
            <div className="tree-content">
                {selectedTab === 'opt1' ? <MBHD  /> : <CarbonMass  />}
            </div>
        </div>
        </div>
    );
}

export default TreeInfo;
