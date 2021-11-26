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

export const SortData = (data) => data.sort((a,b)=>(a.cases>b.cases?-1:1));

export const prettyPrintStat = (stat) => stat ? `+${numeral(stat).format("0.0a")}` : "+0";

//DRAW circles on the map with interactive tooltip
export const showDataOnMap = (data, casesType='cases')=> (
    data.map(country=> (
        <Circle 
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
                    <div className="info-confirmed" >Cases: {numeral(country.cases).format("0,0")}</div>
                    <div className="info-recovered" >Recovered: {numeral(country.cases).format("0,0")}</div>
                    <div className="info-deaths" >Deaths: {numeral(country.cases).format("0,0")}</div>
                </div>
            </Popup>
        </Circle>
    ))
);