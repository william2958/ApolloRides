import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../user/auth.service';
import { NavBarService } from '../nav/navbar.service';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor (
		private authService: AuthService, 
		private navbarService: NavBarService,
		private router: Router
	) {}

	canActivate() {
		if (this.authService.currentUser) {
			return true;
		} else {
			console.log("Unauthorized by guard")
			this.navbarService.showLoginModal();
			this.router.navigate(['/'])
			return false;
		}
	}

}