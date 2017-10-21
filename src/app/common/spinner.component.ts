import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './spinner.service';

@Component({
	selector: 'spinner',
	templateUrl: './spinner.component.html', 
	styles: [`
		md-spinner {
			position: absolute;
			left: 10px;
			z-index: 99999;
			width: 50px;
			height: 50px;
			top: 10px;
		}
	`]
})

export class SpinnerComponent implements OnInit {

	showSpinner: boolean = false;

	constructor (
		private spinnerService: SpinnerService
	){}

	ngOnInit() {
		this.spinnerService.showSpinner.subscribe((newValue: boolean) => {
			this.showSpinner = newValue;
			console.log("Showing values");
		})
	}

}