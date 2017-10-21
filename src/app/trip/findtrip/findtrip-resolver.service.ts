import { Injectable, Inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { TripService } from '../index';
import { SpinnerService } from '../../common/spinner.service';
import { TOASTR_TOKEN } from '../../common/toastr.service';

@Injectable()
export class FindTripResolver implements Resolve<any> {

	constructor ( 
		private tripService: TripService, 
		private spinnerService: SpinnerService,
		@Inject(TOASTR_TOKEN) private toastr: any ) {
		
	}

	// put :any because there are two different return types
	resolve(route: ActivatedRouteSnapshot) : any {
		if (this.tripService.cached != route.params['from']+route.params['to']+route.params['date']) {
			// Get New data
			console.log("Getting fresh data");
			this.spinnerService.spinnerOn()
			return this.tripService.searchTrips(route.params['from'], route.params['to'], route.params['date'])
				.catch((err:any) => {
					this.spinnerService.spinnerOff();
					console.log("There was an error", err);
					this.toastr.error(err);
					// this.toastr.error("The date you search with must be after today!")
					return err;
				})
		} else {
			// Fetching Cached Data
			console.log("Fetching Cached Data");
			return this.tripService.getFoundTrips();
		}
		
	}

}