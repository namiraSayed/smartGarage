import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadService {
  busyReqCount = 0;
  constructor(private spinner:NgxSpinnerService) { }
  busy() {
    this.busyReqCount++;
    this.spinner;
    this.spinner.show(undefined, {
      type: 'ball-scale-ripple',
      bdColor: "rgba(0, 0, 0, 0.8)",
      size: "default",
      color: "#fff"
    })
  }
  idle() {
    this.busyReqCount--;
    if(this.busyReqCount <= 0) {
      this.busyReqCount = 0;
      this.spinner.hide()
    }
  }
}
