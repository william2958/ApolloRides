import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { TripService } from '../../trip/index';

@Injectable()
export class ListingDetailResolver implements Resolve<any> {

	constructor (private tripService: TripService) {

	}

	resolve(route: ActivatedRouteSnapshot) {
		return this.tripService.getTripListing(route.params['id'])
			.do((resp: any) => {
				console.log("The response from the server is: ", JSON.parse(resp._body))
			});
	}

}