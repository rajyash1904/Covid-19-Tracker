import './App.css';
import {MenuItem, FormControl,Select,Card,CardContent} from "@material-ui/core";
import { useEffect, useState } from 'react';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { SortData } from './util';
import LineGraph from './LineGraph';


//https://disease.sh/v3/covid-19/countries    country list api

function App() {
  const [countries,setCountries]= useState([]);
  const [country,setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");

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
            <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
            {/*Infoboxes */}
            <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
            {/*InfoBoxes */}
            <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
          </div>
            {/*Map */}
            <Map/>
        </div>

        <Card className="app__right">
          <CardContent color="textSecondary">
            <div className="app__information">
              {/* Table*/}
              <h3>Live Cases By Country</h3>
              <Table countries={tableData}/>
              {/* Graph*/}
              <h3>Worldwide new {casesType}</h3>
              <LineGraph caseType={casesType}/>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}

export default App;
