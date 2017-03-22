import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TOASTR_TOKEN } from '../../common/toastr.service';

@Component({
	templateUrl: './changepassword.component.html',
	styleUrls: ['./changepassword.component.css']
})

export class ChangePasswordComponent implements OnInit {
	confirm_token: string;
	passwordsDontMatch: boolean = false;

	constructor (
		private authService: AuthService,
		private route: ActivatedRoute,
		private router: Router,
		@Inject(TOASTR_TOKEN) private toastr: any
	) {}

	ngOnInit() {
		let parameters = <any>this.route.params;
		this.confirm_token = parameters.value.token;
		console.log("Accepted parameter is: ", parameters.value.token)
	}

	changePassword(formValues) {
		console.log(formValues);
		if (formValues.password == formValues.confirm_password) {
			this.authService.changePassword(this.confirm_token, formValues.password).subscribe(
				(data) => {
					console.log("Password Changed!");
					this.toastr.success("Password Changed!");
					this.router.navigate(['/']);
				}, (err) => {
					console.log("There was an error changing the password!");
					this.toastr.error("Password could not be changed!");
				}
			);
		} else {
			this.passwordsDontMatch = true;
		}
		
	}

}