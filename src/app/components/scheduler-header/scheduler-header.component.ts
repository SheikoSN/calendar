import { Component, OnInit } from '@angular/core';
import { startWith, delay } from 'rxjs/operators';
import { ScheduleConfigService } from '../../services/schedule-config.service';

@Component({
  selector: 'app-scheduler-header',
  templateUrl: 'scheduler-header.component.html',
  styleUrls: ['./scheduler-header.component.scss']
})

export class SchedulerHeaderComponent implements OnInit {
  public startTime: Date = null;
  public endTime: Date = null;
  public weekNumber = 0;
  public currentMonth: string;
  public currentDay = '';
  public startTimeFormatted  = '';
  public endTimeFormatted = '';
  public currentViewType: string;

  constructor(private scheduleConfigService: ScheduleConfigService) {
    this.currentMonth = '';
  }

  ngOnInit() {
    const { scheduleConfigService } = this;
    this.currentMonth = '';
    scheduleConfigService.currentViewTypeSource.subscribe((nextView) => {
      this.currentViewType = nextView;
    });

    scheduleConfigService.currentDateSource.pipe(startWith(null), delay(0)).subscribe((currDate) => {
      if (!currDate) {
        return;
      }

      this.startTime = currDate.intervalStart;
      this.endTime = currDate.intervalEnd;
      this.currentDay = currDate.intervalStart.format('dddd, DD');
      this.weekNumber = currDate.intervalStart.week();
      this.currentMonth = currDate.intervalStart.format('MMMM YYYY');
      this.startTimeFormatted = currDate.intervalStart.format('dddd, DD');
      this.endTimeFormatted = currDate.intervalEnd.subtract(1, 'day').format('dddd, DD');
    });
  }

  public switchView(viewType: string): void {
    this.scheduleConfigService.setNextView(viewType);
  }

  public next(): void {
    this.scheduleConfigService.next();
  }

  public prev(): void {
    this.scheduleConfigService.prev();
  }
}
