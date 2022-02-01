import './App.css';
import 'animate.css';
import {MenuItem, FormControl,Select,Card,CardContent, withStyles} from "@material-ui/core";
import { useContext, useEffect, useMemo, useState} from 'react';
import InfoBox from './Info/InfoBox';
import Mp from './Map/Mp';
import Table from './Table/Table';
import { SortData, prettyPrintStat } from './util';
import LineGraph from './Graphs/LineGraph';
import "leaflet/dist/leaflet.css";
import { GlobalContext } from './Context/GlobalContext';

const WorldCenter = {
  lat: 34.80746,
  long: -40.4796,
};

const MenuStyles = theme => ({
  whiteColor: {
    color: "white"
  }
});

function HomeApp(props) {
  const [worldInfo, setWorldInfo] = useState({});
  const [countriesData, setCountriesData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("worldwide");
  const [casesType, setCasesType] = useState("cases");
  const [mapParams, setMapParams] = useState({lat: WorldCenter.lat, long: WorldCenter.long, zoom: 3});

  const covidDataService = useContext(GlobalContext);

  useEffect(()=>{

    const fetchAllData = async () => {
      const data = await covidDataService.getForAll();
      setWorldInfo(data);
    };

    const getContriesData = async () => {
      const data = await covidDataService.getForCountries();
      setCountriesData(data);
    };

    fetchAllData();
    getContriesData();

  },[covidDataService]);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setSelectedCountry(countryCode);
    if (countryCode === 'worldwide') {
      setMapParams({
        lat: WorldCenter.lat,
        long: WorldCenter.long,
        zoom: 3,
      });
    } else {
      const chosenCountry = countriesData.filter((country) => {
        if (country.country === countryCode) {
          return true;
        }
        return false;
      });
      setMapParams({
        lat: chosenCountry[0].countryInfo.lat,
        long: chosenCountry[0].countryInfo.long,
        zoom: 5,
      });
    }
  };

  const tableData = useMemo(() => {
    const sortedData = SortData(countriesData);
    return sortedData;
  }, [countriesData]);

  return (
    <>
      <div className="App">
        <div className="app__left">
          {/*Header */}
          <div className="app_header animate__animated animate__backInDown">
            {/*Title + Select drop down */}
            <h1>Covid-19 Tracker</h1>
            <FormControl className="app_dropdown">
              <Select
                onChange={onCountryChange}
                value ={selectedCountry}
                classes={{
                  root: props.classes.whiteColor,
                  icon: props.classes.whiteColor,
                }}
              >
                <MenuItem value="worldwide">Worldwide</MenuItem>
                {countriesData.map((country)=>(<MenuItem key={country.country} value={country.country}>{country.country}</MenuItem>))}
              </Select>
            </FormControl>
          </div>
          <div className="app__stats">
            {/*Infoboxes */}
            <InfoBox 
              isRed = {true}
              active = {casesType==="cases"}
              onClick= {e=> setCasesType('cases')}
              title="Coronavirus Cases" 
              cases={prettyPrintStat(worldInfo.todayCases)} 
              total={prettyPrintStat(worldInfo.cases)}/>
            {/*Infoboxes */}
            <InfoBox 
              isRed = {false}
              active = {casesType==="recovered"}
              onClick = {e => setCasesType('recovered')}
              title="Recovered" 
              cases={prettyPrintStat(worldInfo.todayRecovered)} 
              total={prettyPrintStat(worldInfo.recovered)}/>
            {/*InfoBoxes */}
            <InfoBox 
              isRed = {true}
              active = {casesType==="deaths"}
              onClick = {e => setCasesType('deaths')}
              title="Deaths" 
              cases={prettyPrintStat(worldInfo.todayDeaths)} 
              total={prettyPrintStat(worldInfo.deaths)}/>
          </div>
            {/*Map */}
            <Mp casesType={casesType} countries={countriesData} center={[mapParams.lat, mapParams.long]} zoom={mapParams.zoom}/>
        </div>

        <Card>
          <CardContent color="textSecondary">
            <div className="app__information">
              {/* Table*/}
              <h3>Live Cases By Country</h3>
              <Table countries={tableData}/>
              {/* Graph*/}
              <h3 className="app__graphTitle">{selectedCountry === 'worldwide' ? 'Worldwide' : selectedCountry} {casesType}</h3>
              <LineGraph className="app__graph" caseType={casesType} country={selectedCountry}/>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

const App = withStyles(MenuStyles)(HomeApp);
export default App;
