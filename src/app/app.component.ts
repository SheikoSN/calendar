import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, EventEmitter, ViewEncapsulation  } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Schedule } from 'primeng/schedule';
import { ScheduleConfigService } from "./schedule-config.service";
import { DataService } from "./data.service";
import { TestCellsService } from "./test-cells.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, AfterViewInit{
  title = 'app';
  scheduleOptions: any;
  private dataServiceSubscription: Subscription;
  events: any[];
  testCells: any[];

  @ViewChild('schedule') schedule: Schedule;

  constructor(private scheduleConfigService: ScheduleConfigService,
              private dataService: DataService,
              private testCellsService: TestCellsService) {

  }

  ngOnInit() {
    let { schedule } = this;
    console.log('on init', Object.assign({}, schedule));
    this.scheduleOptions = this.scheduleConfigService.getScheduleConfig();

    this.setUpScheduleEvents(schedule);
    schedule.eventRender = ((e, el, view) => {
      //console.log('event reneder', e, el, view)
    });

    this.dataServiceSubscription = this.dataService.dataSource.subscribe((data) => {
      schedule.events = data;
    });

    this.testCellsService.testCellsSubject.subscribe((data) => {
      this.testCells = [...data];
      //console.log('this.testCells', this.testCells)
    });
  }

  ngAfterViewInit() {
    this.scheduleConfigService.onCalendarRendered(this.schedule.schedule);
  }


  setUpScheduleEvents(schedule: Schedule) {
    let { onDayClick } = schedule;
    onDayClick.subscribe(this.dayClicked);
  }

  dayClicked({date, event, view}) {
    console.log('clicked', date, event, view);
  }

  onTestCellToggled(cellId) {
    this.testCellsService.toggleTestCell(cellId);
  }
}
