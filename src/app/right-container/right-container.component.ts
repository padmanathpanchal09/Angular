import { Component } from '@angular/core';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { faFaceFrown } from '@fortawesome/free-solid-svg-icons';
import { WeatherService } from '../Services/weather.service';






@Component({
  selector: 'app-right-container',
  templateUrl: './right-container.component.html',
  styleUrl: './right-container.component.css'
})
export class RightContainerComponent {
  constructor(public weatherService:WeatherService){};


 //variables icon for humidity thumbs up and down
  faThumbsUp:any = faThumbsUp;
  faThumbsDown:any = faThumbsDown;
  faFaceSmile:any = faFaceSmile;
  faFaceFrown:any = faFaceFrown;
  // function to control tab values or tabs states

  // function for click of tab today
  onTodayClick(){
    this.weatherService.week =false;
    this.weatherService.today = true;  
  }
  // function for click of tab week
  onWeekClick(){
    this.weatherService.week =true;
    this.weatherService.today = false;
  }

  // functions to control metric values

    // function for click of tab metric celsius
  onCelsiusClick(){
    this.weatherService.fahrenheit = false;
    this.weatherService.celsius= true;
  }

    // function for click of tab  metric fahrenheit
  onFahrenheitClick(){
    this.weatherService.fahrenheit = true;
    this.weatherService.celsius= false;
  }
}
