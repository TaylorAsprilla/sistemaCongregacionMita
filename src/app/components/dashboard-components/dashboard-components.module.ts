import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivityComponent } from './activity-timeline/activity.component';
import { CustomerSupportComponent } from './customer-support/cs.component';
import { DashboardRoutes } from './dashboard-components.routing';
import { EarningComponent } from './earning-report/earning-report.component';
import { FeedsComponent } from './feeds/feeds.component';
import { IncomeCounterComponent } from './income-counter/income-counter.component';
import { PageAnalyzerComponent } from './page-analyzer/pa.component';
import { ProfileComponent } from './profile/profile.component';
import { ProjectCounterComponent } from './project-counter/project-counter.component';
import { ProjectComponent } from './project/project.component';
import { RecentcommentComponent } from './recent-comment/recent-comment.component';
import { RecentmessageComponent } from './recent-message/recent-message.component';
import { SocialSliderComponent } from './social-slider/social-slider.component';
import { TodoComponent } from './to-do/todo.component';
import { TotalEarningComponent } from './total-earnings/te.component';
import { WidgetComponent } from './widget/widget.component';

@NgModule({
  imports: [FormsModule, CommonModule, NgbModule, RouterModule.forChild(DashboardRoutes)],
  declarations: [
    IncomeCounterComponent,
    ProjectCounterComponent,
    ProjectComponent,
    RecentcommentComponent,
    RecentmessageComponent,
    SocialSliderComponent,
    TodoComponent,
    ProfileComponent,
    PageAnalyzerComponent,
    WidgetComponent,
    CustomerSupportComponent,
    TotalEarningComponent,
    FeedsComponent,
    EarningComponent,
    ActivityComponent,
  ],
  exports: [
    IncomeCounterComponent,
    ProjectCounterComponent,
    ProjectComponent,
    RecentcommentComponent,
    RecentmessageComponent,
    SocialSliderComponent,
    TodoComponent,
    ProfileComponent,
    PageAnalyzerComponent,
    WidgetComponent,
    CustomerSupportComponent,
    TotalEarningComponent,
    FeedsComponent,
    EarningComponent,
    ActivityComponent,
  ],
})
export class DashboardComponentsModule {}
