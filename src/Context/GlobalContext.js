import { createContext } from "react";

export class covidDataService{

    baseUrl = "https://disease.sh/v3/covid-19/";
    
    async getForAll(){
        const url = this.baseUrl + "all";
        const response = await fetch(url);
        const body = await response.json();
        return body;
    }

    async getForCountries(){
        const url = this.baseUrl + "countries";
        const response = await fetch(url);
        const body = await response.json();
        return body;
    }

    async getForCountry(countryCode){
        const url = `${this.baseUrl}countries/${countryCode}`;
        const response = await fetch(url);
        const body = await response.json();
        return body;
    }
}

export const GlobalContext = createContext(new covidDataService());