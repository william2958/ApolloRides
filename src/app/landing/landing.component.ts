import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../user/auth.service';

@Component({
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.css']
})

export class LandingComponent implements OnInit {
	mouseoverForm: boolean = false;

	constructor (
		private authService: AuthService, 
		private router: Router
	) {}

	ngOnInit() {
	}

	search(formValues) {
		var date = new Date(formValues.date);
		console.log("Date 1 is: ", formValues.date);
		this.router.navigate(['trip', 'searchtrips', formValues.fromLocation.toLocaleLowerCase(), formValues.toLocation.toLocaleLowerCase(), date.getTime()]);
	}

	cancel() {
		// console.log(this.containerEl)
		
	}

	checkError(formValues) {
		if (formValues.invalid) {
			this.mouseoverForm = true;
		} else {
			this.search(formValues.value)
		}
	}

}