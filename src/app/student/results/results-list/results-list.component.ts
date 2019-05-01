import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../../core/auth.service';
import { AppComponent } from '../../../app.component';
import { ResultService } from '../result.service';
import { Result, DailyPoints } from '../result';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.scss'],
})
export class ResultsListComponent implements OnInit {

  // get user:
  showSpinner = true;
  // for modal window:
  tutorial = false; // show the instructions

  results: Observable<Result[] | null>;
  dailyPoints: Observable<DailyPoints[] | null>;

  // graph info:
  last7Dates: string[] = [];
  last7Days: string[] = [];
  last7Results: number[] = [];


  constructor(private auth: AuthService, private resultService: ResultService,
    private appComponent: AppComponent) {
    // TODO - posložiti vrijednosti

    // this.cUser = this.resultService.getUserData();
    this.dailyPoints = this.resultService.getDailyPoints(this.auth.currentUserKey);
    this.results = this.resultService.getResults(this.auth.currentUserKey);
    
    this.results.subscribe(data => {
      if (data) {
        var res = data as Result[];
      }
    });

    this.dailyPoints.subscribe(data => {
      if (data) {
        var res = data as DailyPoints[];
        
        // check all the points:
        this.last7Dates = this.getLast7Days();
        this.last7Results = [0, 0, 0, 0, 0, 0, 0];

        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < this.last7Dates.length; j++) {
            // provjeriti postojeće dane - ako su isti, na taj j dodati rezultat:
            if (this.last7Dates[j] == data[i].date) {
              this.last7Results[j] = data[i].points;
            }
          }
        }
        /*
        console.log(this.last7Dates);
        console.log(this.last7Results);
        */
        this.change();
      }
    });
  }

  ngOnInit() {
    this.results.subscribe((x) => {
      this.showSpinner = false;
    });
  }

  // get the last 7 days to pick results:
  getLast7Days(): string[] {
    var date = new Date();
    var dates = [];

    this.getDaysOfWeek(date.getDay());

    for (var i = 0; i < 7; i++) {
      // XXX - remove the spaces from locale date:
      dates.push(date.toLocaleDateString().replace(/\s/g, ""));
      // XXX - get the last 7 days (date--):
      date.setDate(date.getDate() - 1);
    }
    return dates;
  }

  // write the days of a week instead dates:
  getDaysOfWeek(first: number) {
    this.last7Days = [];
    var days = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];

    var i = 0;
    for(i = first; i < 7; i++) {
      this.last7Days.push(days[i]);
    }
    for(i = 0; i < first; i++) {
      this.last7Days.push(days[i]);
    }
  }











  /*********** CHARTS **********/

  // lineChart - points and days:
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  /*
  public lineChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Dnevni bodovi'},
  ];
  public lineChartLabels:Array<any> = ['pon', 'uto', 'sri', 'čet', 'pet', 'sub', 'ned'];
  */
  public lineChartData:Array<any> = [
    {data: this.last7Results, label: 'Bodovi'},
  ];
  public lineChartLabels: Array<any> = [7, 6, 5, 4, 3, 2, 1];

  public lineChartOptions:any = {
    responsive: true
  };

  public lineChartColors: Array<any> = [
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  

  // update the chart:
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  
  change() {
    this.last7Results.reverse();
    this.last7Dates.reverse();

    this.lineChartData = [{
      label: "Bodovi",
      data: this.last7Results
    }];
    
    this.lineChartLabels = this.last7Days;
    
    setTimeout(() => {
      if (this.chart && this.chart.chart && this.chart.chart.config) {
        this.chart.chart.config.data.labels = this.lineChartLabels;
        this.chart.chart.update();
      }
    });
  }
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
}

