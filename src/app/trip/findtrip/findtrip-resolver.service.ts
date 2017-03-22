import { Injectable, Inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { TripService } from '../index';
import { TOASTR_TOKEN } from '../../common/toastr.service';

@Injectable()
export class FindTripResolver implements Resolve<any> {

	constructor ( 
		private tripService: TripService, 
		@Inject(TOASTR_TOKEN) private toastr: any ) {
		
	}

	// put :any because there are two different return types
	resolve(route: ActivatedRouteSnapshot) : any {
		if (this.tripService.cached != route.params['from']+route.params['to']+route.params['date']) {
			// Get New data
			console.log("Getting fresh data");
			return this.tripService.searchTrips(route.params['from'], route.params['to'], route.params['date'])
				.catch((err:any) => {
					console.log("There was an error");
					this.toastr.error("The date you search with must be after today!")
					return err;
				})
		} else {
			// Fetching Cached Data
			console.log("Fetching Cached Data");
			return this.tripService.getFoundTrips();
		}
		
	}

}