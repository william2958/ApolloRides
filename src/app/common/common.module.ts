import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimpleModalComponent } from './index';
import { ModalTriggerDirective } from './index';
import { MaterialModule } from '@angular/material';
import { PhoneNumberPipe } from './index';
import { SpinnerComponent } from './spinner.component';
import { SpinnerService } from './spinner.service';

@NgModule ({
	imports: [
		CommonModule,
		MaterialModule
	],
	declarations: [
		SimpleModalComponent,
		ModalTriggerDirective,
		PhoneNumberPipe,
		SpinnerComponent
	],
	providers: [
		SpinnerService
	],
	exports: [
		SimpleModalComponent,
		ModalTriggerDirective,
		PhoneNumberPipe,
		SpinnerComponent
	]
})

export class CommonRideshareModule {}