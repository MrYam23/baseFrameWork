import { HttpClient } from '@angular/common/http';
import { Component , OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


interface SwapiTitleResponse {
  title: any; // Adjust the type of 'results' based on the actual data structure
}
interface SwapiNameResponse {
  name: any; // Adjust the type of 'results' based on the actual data structure
}

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit {
  
  @Input() person: any;

  constructor(private activatedRoute: ActivatedRoute,
    public http: HttpClient,
  ) {}
  
  films: any = []
  starships: any = []
  vehicles: any = []
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const term = params['term'];
    });

    if(this.person && this.person.films.length > 0){
      this.person.films.forEach((item:any)=>{
        if(item){
          this.http.get<SwapiTitleResponse>(item).subscribe(resp=>{
            if(resp && Object.keys(resp).length > 0){
                this.films.push(resp.title)
            }
          })
        }
      })
    }
   
    if(this.person && this.person.starships.length > 0){
      this.person.starships.forEach((item:any)=>{
        if(item){
          this.http.get<SwapiNameResponse>(item).subscribe(resp=>{
            if(resp && Object.keys(resp).length > 0){
                this.starships.push(resp.name)
            }
          })
        }
      })
    }

    if(this.person && this.person.vehicles.length > 0){
      this.person.vehicles.forEach((item:any)=>{
        if(item){
          this.http.get<SwapiNameResponse>(item).subscribe(resp=>{
            if(resp && Object.keys(resp).length > 0){
                this.vehicles.push(resp.name)
            }
          })
        }
      })
    }

  }
}
