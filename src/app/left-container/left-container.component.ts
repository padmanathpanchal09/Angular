import { Component } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faLocation } from '@fortawesome/free-solid-svg-icons';
import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { faCloudRain } from '@fortawesome/free-solid-svg-icons';
import { WeatherService } from '../Services/weather.service';



@Component({
  selector: 'app-left-container',
  templateUrl: './left-container.component.html',
  styleUrl: './left-container.component.css'
})
export class LeftContainerComponent {


  //varibale for font awesome icons


  // variables for left nav bar search icon
  faMagnifyingGlass: any = faMagnifyingGlass;
  faLocation: any = faLocation;
  // variable for temp summary
  faCloud:any = faCloud;
  faCloudRain:any = faCloudRain;

  constructor(public weatherService:WeatherService){}

  onSearch(location:string){
    let trimedName = location.trim();
    if(trimedName === ""){
      this.weatherService.cityName = "Mumbai";
      this.weatherService.getData();

    }else{
      this.weatherService.cityName = location;
      this.weatherService.getData();
    }
  }

}
