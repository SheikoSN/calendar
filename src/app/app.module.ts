import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import * as $ from 'jquery';
import { ScheduleModule } from 'primeng/schedule';
import { FormsModule } from '@angular/forms';

import { ScheduleConfigService } from './schedule-config.service';
import { DatesService } from './dates.service';
import { DataService } from './data.service';
import { TestCellsService } from './test-cells.service';

import { AppComponent } from './app.component';
import { SchedulerHeader } from './scheduler-header/scheduler-header.component'
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [
    AppComponent,
    SchedulerHeader
  ],
  imports: [
    BrowserModule,
    ScheduleModule,
    FormsModule,
    AngularFontAwesomeModule,
  ],
  providers: [ScheduleConfigService, DatesService, DataService, TestCellsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
