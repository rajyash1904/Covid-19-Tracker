import React from 'react';
import {Map as LeafletMap, TileLayer} from 'react-leaflet';
import "./Map.css";
import numeral from "numeral";
import { Circle, Popup} from "react-leaflet";

const casesTypeColors = {
    cases: {
        hex: "#CC1034",
        half_op: "rgba(204, 16, 52, 0.5)",
        multiplier: 160,
    },
    recovered: {
        hex: "#7dd71d",
        half_op: "rgba(125, 215, 29, 0.5)",
        multiplier: 240,
    },
    deaths: {
        hex: "#fb4443",
        half_op: "rgba(251, 68, 67, 0.5)",
        multiplier: 400,
    },
  };

//DRAW circles on the map with interactive tooltip
export const showDataOnMap = (data, casesType='cases')=> (
    data.map(country=> (
        <Circle 
            key = {country.country}
            center = {[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color = {casesTypeColors[casesType].hex}
            fillColor = {casesTypeColors[casesType].hex}
            radius = {Math.sqrt(country[casesType])*casesTypeColors[casesType].multiplier}
        >
            <Popup>
                <div className="info-container">
                    <div className="info-flag" style={{backgroundImage: `url(${country.countryInfo.flag})`}}> </div>
                    <div className="info-name" >{country.country}</div>
                    <div className="info-stats">
                        <div>Cases: {numeral(country.cases).format("0,0")}</div>
                        <div>Recovered: {numeral(country.recovered).format("0,0")}</div>
                        <div>Deaths: {numeral(country.deaths).format("0,0")}</div>
                    </div>
                </div>
            </Popup>
        </Circle>
    ))
);


function Mp({countries, casesType, center, zoom})
{
    return (
        <div className="map">
           <LeafletMap center={center} zoom ={zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {showDataOnMap(countries, casesType)}
           </LeafletMap>
        </div>
    );
};

export default Mp;