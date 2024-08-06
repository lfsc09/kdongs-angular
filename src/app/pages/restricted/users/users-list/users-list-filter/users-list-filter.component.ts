import { AfterViewInit, Component, ElementRef, model, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleXmark, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-users-list-filter',
	standalone: true,
	imports: [FontAwesomeModule, ReactiveFormsModule],
	templateUrl: './users-list-filter.component.html',
})
export class UsersListFilterComponent implements AfterViewInit {
	/**
	 * SIGNALS
	 */
	protected icons = signal({
		faCircleXmark: faCircleXmark,
		faPaperPlane: faPaperPlane,
	});
	open = model.required<boolean>();
	private currPageRef = viewChild<ElementRef<HTMLInputElement>>('currPageRef');

	ngAfterViewInit(): void {
		this.currPageRef()?.nativeElement.focus();
	}

	/**
	 * FUNCTIONS
	 */
	protected handleClose(): void {
		this.open.set(false);
	}
}
