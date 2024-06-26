import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {MatButton} from '@angular/material/button';
import {ThemePalette} from '@angular/material/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {FloatLabelType} from '@angular/material/form-field';
import {ProgressSpinnerMode, MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

interface SwapiResponse {
  results: any[]; // Adjust the type of 'results' based on the actual data structure
}

interface SwapiNameResponse {
  name: any; // Adjust the type of 'results' based on the actual data structure
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})



export class AppComponent implements OnInit {


  title = 'myFirstApp';
  movieName: any ;
  specieName: any ;
  vehicleName: any ;
  starship: any ;
  birthYear: any[] = [];


  constructor(public http: HttpClient,
    private _formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.getApiData();
    this.getPeopleData();
    this.getMoviesData();
    this.getSpeciesData();
    this.getVehicleData();
    this.getStarshipData();
  }

  open= false;
  getApiData(){
    this.http.get('https://swapi.dev/api/films/1/').subscribe(resp=>{
      console.log(resp);
      this.open = true
    })
  }
  
  peopleList : any = [];
  allperson : any = []
  getPeopleData(){
    this.http.get<SwapiResponse>('https://swapi.dev/api/people/').subscribe(resp=>{
      console.log(resp);
      if(resp && resp.results.length > 0){
        this.peopleList= resp.results
        this.allperson= resp.results
        
      }
    })
  }
  
  movieList: any = {}
  getMoviesData(){
    this.http.get<SwapiResponse>('https://swapi.dev/api/films/').subscribe(resp=>{
      console.log(resp);
      this.movieList = resp.results
    })
  }
  
  species: any;
  getSpeciesData(){
    this.http.get<SwapiResponse>('https://swapi.dev/api/species/').subscribe(resp=>{
      console.log(resp);
      this.species = resp.results
    })
  }
  
  vehicleList: any = {}
  getVehicleData(){
    this.http.get<SwapiResponse>('https://swapi.dev/api/vehicles/').subscribe(resp=>{
      console.log(resp);
      this.vehicleList = resp.results
    })
  }
  
  starShips: any = {}
  getStarshipData(){
    this.http.get<SwapiResponse>('https://swapi.dev/api/starships/').subscribe(resp=>{
      console.log(resp);
      this.starShips = resp.results
    })
  }
  
 
  searchPeople(movieName: any, specieName: any,vehicle: any, starship: any, birthYears: any){ // Search //
    this.peopleList = []
    let filteredList = []

    if(!movieName && !specieName && !vehicle && !starship && !birthYears.length){
      this.peopleList = this.allperson // Reset Character list
    }

    if(movieName && this.movieList.length>0 && !specieName && !vehicle && !starship && birthYears.length == 0){ // SIngle Search Movie //
      this.getMovieCharacter(movieName)
    }

    if(specieName && this.species.length>0 && !movieName && !vehicle && !starship && birthYears.length == 0){ // Single Search Species //
      this.getSpecies(specieName)
    }

    if(vehicle && this.vehicleList.length>0 && !movieName && !specieName && !starship && birthYears.length == 0){ // Single Search Vehicle //
      this.getVehicle(vehicle)
    }

    if(starship && this.starShips.length>0 && !movieName && !specieName && !vehicle && birthYears.length == 0){ // Single Search Starship //
      this.getStarship(starship)
    }

    if((this.birthYear) && !movieName && !specieName && !vehicle && !starship && this.allperson.length>0){ // Single Search Starship //
      this.getBirthList(this.birthYear)
    }

    // Multi Search //

    if(movieName && this.movieList.length > 0 && specieName && this.species
      && !vehicle && !starship && (birthYears.lenght == 0 || !birthYears.length)){ // Multi Search Movie and Specie
      this.getMovieCharacter(movieName);
      this.getSpecies(specieName)
    }

    if(movieName && this.movieList.length > 0 && !specieName && this.vehicleList 
      && vehicle && !starship && (birthYears.lenght == 0 || !birthYears.length)){ // Multi Search Movie and Vehicle
      this.getMovieCharacter(movieName);
      this.getVehicle(vehicle)
    }

    if(movieName && this.movieList.length > 0 && !specieName && this.starShips
      && !vehicle && starship && (birthYears.lenght == 0 || !birthYears.length)){ // Multi Search Movie and Starship
      this.getMovieCharacter(movieName);
      this.getStarship(starship)
    }

    if(movieName && this.movieList.length > 0 && !specieName &&
       !vehicle && !starship && birthYears){ // Multi Search Movie and birthYear
      this.getMovieCharacter(movieName);
      this.getBirthList(birthYears)
    }

    if(movieName && this.movieList.length > 0 && specieName && this.species && 
       !vehicle && !starship && birthYears){ // Multi Search Movie and birthYear and species
      this.getMovieCharacter(movieName);
      this.getBirthList(birthYears)
      this.getSpecies(specieName)
    }

    if(movieName && this.movieList.length > 0 && specieName && this.species && 
       !vehicle && starship && this.starShips && birthYears){ // Multi Search Movie and birthYear and species
      this.getMovieCharacter(movieName);
      this.getBirthList(birthYears)
      this.getSpecies(specieName)
      this.getStarship(starship)
    }

    if(movieName && this.movieList.length > 0 && specieName && this.species.length > 0 && this.vehicleList.length &&
       vehicle && !starship && (!birthYears.lenght || birthYears.length == 0)){ // Multi Search Movie and Species and Vehicle
      this.getMovieCharacter(movieName);
      this.getSpecies(specieName)
      this.getVehicle(vehicle)
    }

    if(movieName && this.movieList.length > 0 && specieName && this.species.length > 0 &&  // Select All //
       vehicle && this.vehicleList.length > 0 && starship && this.starShips.length > 0 
       && birthYears){ 
      this.getMovieCharacter(movieName);
      this.getBirthList(birthYears)
      this.getStarship(starship)
      this.getVehicle(vehicle)
      this.getSpecies(specieName)
    }
    
  }

  resetCharaterList(){
    if(this.allperson && this.allperson.length>0){
      this.peopleList = this.allperson
      this.movieName = null
      this.specieName = null
      this.vehicleName = null
      this.starship = null
      this.birthYear = []
    }
  }


  openPerson = false;
  person: any ={}
  getPersonData(person: any){
   console.log(person)
   this.openPerson =true;
   this.router.navigate(['/character'])
   this.person = person
  }

  getMovieCharacter(movieName: any){
      this.movieList.forEach((item: any)=>{
        if(item.title == movieName &&  item['characters'].length> 0){
          item['characters'].forEach((element: any)=>{
            this.http.get<SwapiNameResponse>(element).subscribe(resp=>{
              if(resp && Object.keys(resp).length > 0){
                  this.peopleList.push(resp);
              }
            })
          })
        }
      })
  }

  getSpecies(specieName: any){
    this.species.forEach((item: any)=>{
      if(item.name == specieName &&  item['people'].length> 0){
        item['people'].forEach((element: any)=>{
          this.http.get<SwapiNameResponse>(element).subscribe(resp=>{
            if(resp && Object.keys(resp).length > 0){
                this.peopleList.push(resp);
            }
          })
        })
      }
    })
  }

  getVehicle(vehicle: any){
    this.vehicleList.forEach((item: any)=>{
      if(item.name == vehicle &&  item['pilots'].length> 0){
        item['pilots'].forEach((element: any)=>{
          this.http.get<SwapiNameResponse>(element).subscribe(resp=>{
            if(resp && Object.keys(resp).length > 0){
                this.peopleList.push(resp);
            }
          })
        })
      }
    })
  }

  getStarship(starship: any){
    this.starShips.forEach((item: any)=>{
      if(item.name == starship &&  item['pilots'].length> 0){
        item['pilots'].forEach((element: any)=>{
          this.http.get<SwapiNameResponse>(element).subscribe(resp=>{
            if(resp && Object.keys(resp).length > 0){
                this.peopleList.push(resp);
            }
          })
        })
      }
    })
  }

  getBirthList(birthYear: any){
    birthYear.forEach((item: any)=>{
      this.allperson.forEach((ele:any)=>{
        if(item == ele.birth_year){
           this.peopleList.push(ele);
        }
      })
    })
  }

  getSpecieName(specieName: any){
    if(specieName){
      this.http.get<SwapiNameResponse>(specieName).subscribe(resp=>{
        if(resp && Object.keys(resp).length > 0){
          return resp.name;
        }
      })
    }
  }
}
