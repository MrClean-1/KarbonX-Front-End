import React from "react";
import "./BaseMenu.css";
import {Link, useLocation} from "react-router-dom";
function BaseMenu() {
    const location = useLocation();
    const selectedPage = location.pathname;
    return (
        <div className="div">
          <div className="column">
            <div className="div-2">
                <Link to="/Dashboard" >
              <img
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/987f323a518c1bd4978d0a51bb668ad92dc925562baf1fb9dc1ee593960bd39a?apiKey=b5d446799a5e4e7ab3e01b97a5ff1ee2&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/987f323a518c1bd4978d0a51bb668ad92dc925562baf1fb9dc1ee593960bd39a?apiKey=b5d446799a5e4e7ab3e01b97a5ff1ee2&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/987f323a518c1bd4978d0a51bb668ad92dc925562baf1fb9dc1ee593960bd39a?apiKey=b5d446799a5e4e7ab3e01b97a5ff1ee2&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/987f323a518c1bd4978d0a51bb668ad92dc925562baf1fb9dc1ee593960bd39a?apiKey=b5d446799a5e4e7ab3e01b97a5ff1ee2&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/987f323a518c1bd4978d0a51bb668ad92dc925562baf1fb9dc1ee593960bd39a?apiKey=b5d446799a5e4e7ab3e01b97a5ff1ee2&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/987f323a518c1bd4978d0a51bb668ad92dc925562baf1fb9dc1ee593960bd39a?apiKey=b5d446799a5e4e7ab3e01b97a5ff1ee2&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/987f323a518c1bd4978d0a51bb668ad92dc925562baf1fb9dc1ee593960bd39a?apiKey=b5d446799a5e4e7ab3e01b97a5ff1ee2&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/987f323a518c1bd4978d0a51bb668ad92dc925562baf1fb9dc1ee593960bd39a?apiKey=b5d446799a5e4e7ab3e01b97a5ff1ee2&"
                className="img"
              />
              </Link>
              <div className="div-3" >
                <Link to="/Dashboard" style={{textDecoration:'none'}}>
                <button className="div-4" style={{backgroundColor:selectedPage==='/Dashboard' ? '#6c6c6c': '#231f20'}}>Dashboard</button>
                </Link>
                <Link to="/TreeInfo" style={{textDecoration:'none'}}>
                <button className="div-4" style={{backgroundColor:selectedPage==='/TreeInfo' ? '#6c6c6c': '#231f20'}}>Tree Information</button>
                </Link>
                <Link to="/Health" style={{textDecoration:'none'}}>
                <button className="div-4" style={{backgroundColor:selectedPage==='/Health' ? '#6c6c6c': '#231f20'}}>Health Information</button>
                </Link>
                <Link to="/Geolocation" style={{textDecoration:'none'}}>
                <button className="div-4" style={{backgroundColor:selectedPage==='/Geolocation' ? '#6c6c6c': '#231f20'}}>
                  Geolocation Data
                  <br />
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
    );
  }
  
  export default BaseMenu;