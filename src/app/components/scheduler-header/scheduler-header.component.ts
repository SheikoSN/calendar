import { Component, OnInit } from '@angular/core';
import { Observable, Subject, from, combineLatest, BehaviorSubject, ReplaySubject } from "rxjs";
import { startWith, delay } from "rxjs/operators";
import { ScheduleConfigService } from "../../services/schedule-config.service";

@Component({
  selector: 'scheduler-header',
  templateUrl: 'scheduler-header.component.html',
  styleUrls: ['./scheduler-header.component.scss']
})
export class SchedulerHeader implements OnInit{

  private currentViewType: string;
  public startTime: any = null;
  public endTime: any = null;
  public weekNumber: any = 0;
  public currentMonth: any = "";
  public currentDay: any = "";
  public startTimeFormatted: string = "";
  public endTimeFormatted: string = "";

  constructor(private scheduleConfigService: ScheduleConfigService) {
    this.currentMonth = '';
  }

  ngOnInit() {
    let { scheduleConfigService } = this;
    this.currentMonth = "";
    scheduleConfigService.currentViewTypeSource.subscribe((nextView) => {
      //@TODO: Make view as enum
      this.currentViewType = nextView;
    });

    scheduleConfigService.currentDateSource.pipe(startWith(null), delay(0)).subscribe((currDate) => {
      if(!currDate) return;

      this.startTime = currDate.intervalStart;
      this.endTime = currDate.intervalEnd;
      this.currentDay = currDate.intervalStart.format('dddd, DD');
      this.weekNumber = currDate.intervalStart.week();
      this.currentMonth = currDate.intervalStart.format('MMMM YYYY');
      this.startTimeFormatted = currDate.intervalStart.format('dddd, DD');
      this.endTimeFormatted = currDate.intervalEnd.subtract(1, 'day').format('dddd, DD');
    })
  }

  switchView(viewType: string) {
    this.scheduleConfigService.setNextView(viewType);
  }

  next() {
    this.scheduleConfigService.next();
  }

  prev() {
    this.scheduleConfigService.prev();
  }
}
