import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { TripService } from '../../index';
import { AuthService } from '../../../user/auth.service';

@Injectable()
export class TripDetailResolver implements Resolve<any> {

  constructor (
    private tripService: TripService,
    private authService: AuthService
  ) {

  }

  resolve(route: ActivatedRouteSnapshot) {
    console.log("Getting a trip detail", route.params['id'])
    if (this.authService.currentUser) {
      console.log("Trip detail current user: ", this.authService.currentUser);
      if (this.authService.currentUser.trips_accepted.indexOf(route.params['id']) > -1) {
        console.log("This is an accepted trip detail")
        return this.tripService.getAuthorizedTrip(route.params['id'])
          .do((resp: any) => {
            console.log("The response from the server is: ", resp)
          });
      } else {
        return this.tripService.getTrip(route.params['id'])
          .do((resp: any) => {
            console.log("The response from the server is: ", resp)
          });
      }
    } else {
      return this.tripService.getTrip(route.params['id'])
        .do((resp: any) => {
          console.log("The response from the server is: ", resp)
        });
    }

  }

}
