import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    standalone: true,
    imports: [NgIf],
})
export class SpinnerComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  private subscription: Subscription;

  constructor(private spinnerService: SpinnerService) {}

  ngOnInit(): void {
    this.subscription = this.spinnerService.isLoading.subscribe((loading: boolean) => {
      this.isLoading = loading;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
