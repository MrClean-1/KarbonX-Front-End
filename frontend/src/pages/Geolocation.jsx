import React, { useState } from "react";
import {MapContainer,TileLayer,Marker,Popup} from 'react-leaflet';
import "./Geolocation.css";
import { useNodeContext } from '../contexts/NodeContext'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import apiServices from "../apiConnection/apiService";
import { useEffect } from "react";

//images for node marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

function Geolocation() {
    const mapRef = React.useRef(null);

    //setting node marker icon
    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconAnchor: [12,41],
        popupAnchor: [1,-34],
        tooltipAnchor:[16,-28],
    })
    L.Marker.prototype.options.icon=DefaultIcon;
    const [data, setData] = useState([]);
   
   
    useEffect(() => {
        apiServices.getCoordinates().then(response => {

            setData(response.data);
        })
            .catch(e => {
                console.log(e);
            });
    }, []);

    //const nodeList = useNodeContext();
    const [hoveredNode, setHoveredNode] = useState(null);

    const handleNodeHover = (latitude, longitude) => {
        setHoveredNode({ latitude, longitude });
    }
    const handleNodeLeave = () => {
        setHoveredNode(null);
    }
    return (
        <div className="titleDiv">
            <h1 className="title">Geolocation Data</h1>
        <div className="geo-container">
        <MapContainer center={[0,0]} zoom={2} style={{height: '100%',width:'100%'}}ref={mapRef}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              
            />
            {data.map(node=>(
                <Marker  key={node.geo_id} position={[node.latitude,node.longitude]}>
                    <Popup>
                        <div>
                            <h3>Node ID: {node.geo_id}</h3>
                            <p>Latitude: {node.latitude}</p>
                            <p>Longitude: {node.longitude}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}

        </MapContainer>
        </div>
        </div>
    );
}

export default Geolocation;