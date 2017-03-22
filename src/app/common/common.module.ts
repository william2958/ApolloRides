import { NgModule } from '@angular/core';

import { SimpleModalComponent } from './simple-modal.component';
import { ModalTriggerDirective } from './modal-trigger.directive';
import { MaterialModule } from '@angular/material';
import { PhoneNumberPipe } from './phonenumber.pipe';
import { LongDatePipe } from './longdate.pipe';

@NgModule ({
	declarations: [
		SimpleModalComponent,
		ModalTriggerDirective,
		PhoneNumberPipe,
		LongDatePipe
	],
	imports: [
		MaterialModule
	],
	exports: [
		SimpleModalComponent,
		ModalTriggerDirective,
		PhoneNumberPipe,
		LongDatePipe
	]
})

export class CommonRideshareModule {}