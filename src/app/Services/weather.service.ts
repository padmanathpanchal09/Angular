import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationDetails } from '../Models/LocationDetails';
import { WeatherDetails } from '../Models/WeatherDetails';
import { TemperatureData } from '../Models/TemperatureData';
import { TodayData } from '../Models/TodayData';
import { WeekData } from '../Models/WeekData';
import { Observable } from 'rxjs';
import { EnvironmentalVariables } from '../environment/environmentVariables';
import { response } from 'express';
import { TodaysWeatherHighlight } from '../Models/TodayWeatherHighlight';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {


  // variable which will be filled by API's Endpoints
  locationDetails?: LocationDetails;
  weatherDetails?:WeatherDetails;

  // varibale that have extracted data from the api endpoint variables
  temperatureData?: TemperatureData = new TemperatureData(); // left-container

  todayData?: TodayData[] = []; //right- containr
  weekData?:WeekData[]  = []; //right-container
  todaysWeatherHighlight?:TodaysWeatherHighlight = new TodaysWeatherHighlight(); // right-containe

  //varibles to be used for Api calls
  cityName:string = 'Mumbai';
  language:string = 'en-US';
  date:string = '20200622';
  units:string = 'm';

  //variable holding current time
  currentTime:Date;

    // varibale to control tabs
    today:boolean =false;
    week:boolean = true;
    // varibles to contro metric value
    celsius:boolean =true;
    fahrenheit:boolean = false;


  
  constructor(private httpClient:HttpClient) {
    this.getData();

   
  }

      getSummaryImage(summary:string):string{
        //base folder address containg the images
        var baseAddress = 'assets/';
        // respected images name
        var cloudSunny = 'cloudyandsunny.png'
        var rainSunny = 'rainyandsunny.png';
        var windy = 'windy.png';
        var sunny = 'sun.png'
        var rainy = 'rainy.png'

        if(String(summary).includes("partly Cloudy") ||  String(summary).includes("P Cloudy")) return baseAddress + cloudSunny;
        else if(String(summary).includes("partly Rainy") ||  String(summary).includes("P Rainy")) return baseAddress + rainSunny;
        else if(String(summary).includes("wind")) return baseAddress + windy;
        else if(String(summary).includes("Rain")) return baseAddress+rainy;
        else if(String(summary).includes("Sun")) return baseAddress + sunny;

        return baseAddress + cloudSunny;
      }



      //Method to create chunk of left container using model temperature data
      fillTemperatureDataModel(){

          this.currentTime = new Date();
          //setting left-container data model property

          this.temperatureData.day = this.weatherDetails['v3-wx-observations-current'].dayOfWeek;
          this.temperatureData.time = `${String(this.currentTime.getHours()).padStart(2,'0')}:${String(this.currentTime.getHours()).padStart(2,'0')}`
          this.temperatureData.temperature = this.weatherDetails['v3-wx-observations-current'].temperature;
          this.temperatureData.location = `${this.locationDetails.location.city[0]},${this.locationDetails.location.country[0]}`
          this.temperatureData.rainPercent = this.weatherDetails['v3-wx-observations-current'].precip24Hour;
          this.temperatureData.summaryPhrase = this.weatherDetails['v3-wx-observations-current'].wxPhraseShort;
          this.temperatureData.summaryImage = this.getSummaryImage(this.temperatureData.summaryPhrase);
      }


       //Method to create chunk of right container using model week data

       fillWeekData(){
            var weekCount =0;
            
            while(weekCount < 7){
              this.weekData.push(new WeekData());
              this.weekData[weekCount].day = this.weatherDetails['v3-wx-forecast-daily-15day'].dayOfWeek[weekCount].slice(0,3);
              this.weekData[weekCount].tempMax =this.weatherDetails['v3-wx-forecast-daily-15day'].calendarDayTemperatureMax[weekCount];
              this.weekData[weekCount].tempMin = this.weatherDetails['v3-wx-forecast-daily-15day'].calendarDayTemperatureMin[weekCount];
              this.weekData[weekCount].summaryImage = this.getSummaryImage(this.weatherDetails['v3-wx-forecast-daily-15day'].narrative[weekCount]);
              ++weekCount;  
            }     
       } 
       getTimeFromString(localTime:string){
        return localTime.slice(11,16);

       }

       fillTodaysWeatherHighlight(){
        this.todaysWeatherHighlight.airQuality = this.weatherDetails['v3-wx-globalAirQuality'].globalairquality.airQualityCategoryIndex;
        this.todaysWeatherHighlight.humidity =this.weatherDetails['v3-wx-observations-current'].relativeHumidity;
        this.todaysWeatherHighlight.sunrise = this.getTimeFromString(this.weatherDetails['v3-wx-observations-current'].sunriseTimeLocal);
        this.todaysWeatherHighlight.sunset = this.getTimeFromString(this.weatherDetails['v3-wx-observations-current'].sunsetTimeLocal);
        this.todaysWeatherHighlight.uvIndex =this.weatherDetails['v3-wx-observations-current'].uvIndex;
        this.todaysWeatherHighlight.visibility = this.weatherDetails['v3-wx-observations-current'].visibility;
        this.todaysWeatherHighlight.windStatus = this.weatherDetails['v3-wx-observations-current'].windSpeed;


       }
       
       //Method to create chunk of right container using model week data
       fillTodayData(){
        var todayCount = 0;
        while(todayCount < 7){
          this.todayData.push(new TodayData());
          this.todayData[todayCount].time =this.weatherDetails['v3-wx-forecast-hourly-10day'].validTimeLocal[todayCount].slice(11,16);
          this.todayData[todayCount].temperature = this.weatherDetails['v3-wx-forecast-hourly-10day'].temperature[todayCount];
          this.todayData[todayCount].summaryImage = this.getSummaryImage(this.weatherDetails['v3-wx-forecast-hourly-10day'].wxPhraseShort[todayCount]);
          ++todayCount;
        }
       }

       //Method to get todays highlight data from the base var




      //method to create useful data chunks for UI usin the data received from api
      prepareData():void{
        this.fillTemperatureDataModel();
        this.fillWeekData();
        this.fillTodayData();
        this.fillTodaysWeatherHighlight();
        

      }

      celsiusToFahrenheit(celsius:number){
        return +((celsius * 1.8) + 32).toFixed(2); 

      }
      FahrenheitToCelsius(fahrenheit:number){
        return  +((fahrenheit - 32) * 0.555).toFixed(2); 

      }

      // method get location details from the api using the var name cityName as the input
  getLocationDetails(cityName:string,language:string):Observable<LocationDetails>{
    return this.httpClient.get<LocationDetails>(EnvironmentalVariables.weatherApiLocationBaseURL,{
      headers:new HttpHeaders()
      .set(EnvironmentalVariables.XRapidAPIKeyName, EnvironmentalVariables.XRapidAPIKeyValue)
      .set(EnvironmentalVariables.XRapidAPIHostName,EnvironmentalVariables.XRapidAPIHostValue),
      params: new HttpParams()
      .set('query',cityName)
      .set('language',language)
    });

  }

  getWeatherReport(date:string,latitude:number,longitude:number,language:string,units:string):Observable<WeatherDetails>{

    return this.httpClient.get<WeatherDetails>(EnvironmentalVariables.weatherApiForcastBaseURL,{

      headers: new HttpHeaders()
      .set(EnvironmentalVariables.XRapidAPIKeyName, EnvironmentalVariables.XRapidAPIKeyValue)
        .set(EnvironmentalVariables.XRapidAPIHostName,EnvironmentalVariables.XRapidAPIHostValue),
        params: new HttpParams()
        .set('date',date)
        .set('latitude',latitude)
        .set('longitude',longitude)
        .set('language',language)
        .set('units',units)
    });
  }

  getData(){

    this.todayData = [];
    this.weekData = [];
    this.temperatureData  = new TemperatureData();
    this.todaysWeatherHighlight = new TodaysWeatherHighlight();
    var latitude = 0;
    var longitude = 0;

    
    this.getLocationDetails(this.cityName,this.language).subscribe({
      next:(response)=>{
      this.locationDetails= response;
      latitude = this.locationDetails?.location.latitude[0];
      longitude = this.locationDetails?.location.longitude[0];

        // once get the value for latitude and lngitud we can call for the  get weather report method
        this.getWeatherReport(this.date, latitude, longitude, this.language, this.units).subscribe({
          next: (response) => {
            this.weatherDetails = response;


            this.prepareData();
            
          },
        });
      }
    });



  }


  
}
