import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { TOASTR_TOKEN } from '../../common/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	template: '<h1>hello</h1>'
})

export class ConfirmEmailComponent implements OnInit {

	confirm_token: string;

	constructor (
		private authService: AuthService,
		private route: ActivatedRoute,
		private router: Router,
		@Inject(TOASTR_TOKEN) private toastr: any
	) {}

	ngOnInit() {
		console.log("Confirming email...");

		let parameters = <any>this.route.params;
		this.confirm_token = parameters.value.token;
		console.log("Received token is: ", this.confirm_token);

		this.authService.confirmEmail(this.confirm_token).subscribe(
			(data) => {
				console.log("Email confirmed");
				this.toastr.success("Email confirmed!");
				this.router.navigate(['/']);
			}, (err) => {
				console.log("Email could not be confirmed");
				this.toastr.error("An error occurred", "Your email could not be confirmed");
				this.router.navigate(['/']);
			}

		)

	}

}