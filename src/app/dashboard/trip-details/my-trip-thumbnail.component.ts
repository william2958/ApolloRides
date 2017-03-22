import { Component, Input, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { ITrip } from '../../trip/index';
import { Router } from '@angular/router';
import { JQ_TOKEN } from '../../common/jQuery.service';
import { AuthService } from '../../user/auth.service';

@Component({
	selector: 'my-trip-thumbnail',
	templateUrl: './my-trip-thumbnail.component.html',
	styleUrls: ['./my-trip-thumbnail.component.css']
})

export class MyTripThumbnailComponent {

	accepted: boolean;

	@Input() trip: ITrip;
	@Input() request: boolean;
	@Input() listing: boolean;
	@Input() expired: boolean;
	@Output() cancelRequest = new EventEmitter();

	constructor (
		private router: Router, 
		private authService: AuthService,
		@Inject(JQ_TOKEN) private $: any) {

	}

	ngOnInit() {
		console.log("Trip comopnoent: ", this.trip);
		if (this.trip.accepted_users.indexOf(this.authService.currentUser.id) > -1) {
			this.accepted = true;
		} else {
			this.accepted = false;
		}
	}

	cancel() {
		this.cancelRequest.emit(this.trip);
	}

	showDetails() {
		if (this.request) {
			this.router.navigate(['dashboard', 'request', this.trip.id]);
		} else {
			this.router.navigate(['dashboard', 'listing', this.trip.id]);
		}
	}

}