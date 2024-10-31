import { Component, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';

/**
 * OBS:
 *
 * Keeps in mind that using HTML `<dialog>` does not process click on backdrop for auto-closing the dialog.
 * In fact click on the backdrop are considered as clicks on the Dialog itself.
 */
@Component({
	selector: 'kds-boolean-dialog',
	standalone: true,
	imports: [FontAwesomeModule],
	template: `
		<dialog
			class="min-w-64 select-none rounded-md border border-neutral-900/10 bg-neutral-50 px-6 py-4 shadow-sm ring-0 backdrop:bg-neutral-200/40 backdrop:backdrop-blur-[2px] focus:ring-0 active:ring-0 dark:border-neutral-50/10 dark:bg-neutral-800 dark:backdrop:bg-neutral-900/80"
			#dialogRef
		>
			<ng-content>
				<p>Are you sure about this?</p>
			</ng-content>
			<div class="mt-6 flex flex-row items-center justify-between">
				<button
					type="button"
					class="group/link flex flex-row items-center rounded-lg bg-neutral-50 px-3 py-1.5 text-sm text-red-400 active:scale-95 dark:bg-neutral-800"
					(click)="handleCancel()"
				>
					Cancel
				</button>
				<button
					type="button"
					class="flex flex-row items-center rounded-lg bg-neutral-100 px-6 py-1.5 text-sm font-semibold active:scale-95 dark:bg-neutral-800 dark:brightness-110"
					(click)="handleOk()"
				>
					Yes
				</button>
			</div>
		</dialog>
	`,
})
export class KdsBooleanDialogComponent<T> {
	/**
	 * SIGNALS
	 */
	protected icons = signal({
		faBan: faBan,
	});
	dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialogRef');
	inputData = input.required<T>();
	dialogClose = output<T | null>();

	/**
	 * FUNCTIONS
	 */
	protected handleOk() {
		this.dialogClose.emit(this.inputData()!);
		this.dialogRef()?.nativeElement.close();
	}

	protected handleCancel() {
		this.dialogClose.emit(null);
		this.dialogRef()?.nativeElement.close();
	}
}
