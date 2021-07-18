import './App.css';
import {MenuItem, FormControl,Select,Card,CardContent} from "@material-ui/core";
import { useEffect, useState } from 'react';
import InfoBox from './InfoBox';
import Mp from './Mp';
import Table from './Table';
import { SortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";


//https://disease.sh/v3/covid-19/countries    country list api

function App() {
  const [countries,setCountries]= useState([]);
  const [country,setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response)=> response.json())
    .then((data)=>{
      setCountryInfo(data);
    });
  },[]);

  useEffect(()=>{
    const getContriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=> response.json())
      .then((data) => {
        const countries = data.map((country)=>(
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));
        const sortedData = SortData(data);  
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };
    getContriesData();
  },[]);

  /**
  *https://disease.sh/v3/covid-19/countries/{country} for particular country Info 
  * https://disease.sh/v3/covid-19/all  for worldwide option
  */
  const onCountryChange = async (event)=>{
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode==="worldwide"? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then((response)=> response.json())
    .then((data)=>{
      setCountryInfo(data);

      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    });
  };

  return (
      <div className="App">
        <div className="app__left">
          {/*Header */}
          <div className="app_header">
            {/*Title + Select drop down */}
            <h1>COVID-19 TRACKER</h1>
            <FormControl className="app_dropdown">
              <Select variant= "outlined" onChange={onCountryChange} value={country}>
                <MenuItem value="worldwide">Worldwide</MenuItem>
                {countries.map((country)=>(<MenuItem value={country.value}>{country.name}</MenuItem>))}
              </Select>
            </FormControl>
          </div>
          <div className="app__stats">
            {/*Infoboxes */}
            <InfoBox 
              isRed
              active = {casesType==="cases"}
              onClick= {e=> setCasesType('cases')}
              title="Coronavirus Cases" 
              cases={prettyPrintStat(countryInfo.todayCases)} 
              total={prettyPrintStat(countryInfo.cases)}/>
            {/*Infoboxes */}
            <InfoBox 
              active = {casesType==="recovered"}
              onClick = {e => setCasesType('recovered')}
              title="Recovered" 
              cases={prettyPrintStat(countryInfo.todayRecovered)} 
              total={prettyPrintStat(countryInfo.recovered)}/>
            {/*InfoBoxes */}
            <InfoBox 
              isRed
              active = {casesType==="deaths"}
              onClick = {e => setCasesType('deaths')}
              title="Deaths" 
              cases={prettyPrintStat(countryInfo.todayDeaths)} 
              total={prettyPrintStat(countryInfo.deaths)}/>
          </div>
            {/*Map */}
            <Mp casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
        </div>

        <Card className="app__right">
          <CardContent color="textSecondary">
            <div className="app__information">
              {/* Table*/}
              <h3>Live Cases By Country</h3>
              <Table countries={tableData}/>
              {/* Graph*/}
              <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
              <LineGraph className="app__graph" caseType={casesType}/>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}

export default App;
