import { Component, Input, OnInit } from '@angular/core';
import { ITrip } from '../../shared/index';

@Component({
	selector: 'trip-thumbnail',
	templateUrl: './trip-thumbnail.component.html',
	styleUrls: ['./trip-thumbnail.component.css']
})

export class TripThumbnailComponent implements OnInit {

	@Input() trip:any;
	@Input() showDate: string;

	hours: number;
	minutes;
	pm: string;
	date: any;
	
	ngOnInit() {
		let dateEpoch = this.trip.date;
		let time = new Date(dateEpoch*1000);
		this.hours = time.getHours();
		this.minutes = time.getMinutes();
		this.date = time;

		if (this.minutes < 10) {
			this.minutes = "0"+this.minutes;
		}
		// Filter the hours so it displays properly
		if (this.hours == 0) {
			this.hours = 12;
		}
		if (this.hours > 12) {
			this.hours = this.hours - 12;
			this.pm = "PM";
		} else {
			this.pm = "AM";
		}
	}

}