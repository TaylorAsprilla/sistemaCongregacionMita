import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: true,
  imports: [],
})
export class SpinnerComponent implements OnInit, OnDestroy {
  private spinnerService = inject(SpinnerService);

  isLoading: boolean = false;
  private subscription: Subscription;

  ngOnInit(): void {
    this.subscription = this.spinnerService.isLoading.subscribe((loading: boolean) => {
      this.isLoading = loading;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
