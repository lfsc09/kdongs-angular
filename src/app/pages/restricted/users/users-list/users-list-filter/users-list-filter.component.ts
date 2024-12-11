import { AfterViewInit, Component, ElementRef, input, model, OnInit, output, signal, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleXmark, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { UsersListFilterOutput } from './users-list-filter.model';

@Component({
	selector: 'app-users-list-filter',
	standalone: true,
	imports: [FontAwesomeModule, ReactiveFormsModule],
	templateUrl: './users-list-filter.component.html',
})
export class UsersListFilterComponent implements OnInit, AfterViewInit {
	/**
	 * SIGNALS
	 */
    open = model.required<boolean>();
	currPageIdx = input.required<number>();
	itemsPerPage = input.required<number>();
	apply = output<UsersListFilterOutput>();
	protected icons = signal({
		faCircleXmark: faCircleXmark,
		faPaperPlane: faPaperPlane,
	});
	protected currPageInput = new FormControl<number>(1, { nonNullable: true });
	protected itemsPerPageInput = new FormControl<number>(15, { nonNullable: true });
	private currPageRef = viewChild<ElementRef<HTMLInputElement>>('currPageRef');

	ngOnInit(): void {
		this.currPageInput.setValue(this.currPageIdx() + 1);
		this.itemsPerPageInput.setValue(this.itemsPerPage());
	}

	ngAfterViewInit(): void {
		this.currPageRef()?.nativeElement.focus();
	}

	/**
	 * FUNCTIONS
	 */
	protected handleClose(): void {
		this.open.set(false);
	}

	protected handleApply(): void {
		this.apply.emit({
			currPageIdx: this.currPageInput.value,
			itemsPerPage: this.itemsPerPageInput.value,
			filters: {
				inactive: false,
				users: [],
				emails: [],
			},
		});
		this.open.set(false);
	}
}
