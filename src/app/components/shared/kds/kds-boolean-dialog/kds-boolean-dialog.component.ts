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
			class="min-w-64 select-none rounded-md border border-slate-900/10 bg-zinc-50 px-6 py-4 shadow-sm backdrop:bg-zinc-200/40 backdrop:backdrop-blur-[2px] dark:border-slate-50/10 dark:bg-slate-900 dark:backdrop:bg-slate-900/80"
			#dialogRef
		>
			<ng-content>
				<p>Are you sure about this?</p>
			</ng-content>
			<div class="mt-6 flex flex-row items-center justify-between">
				<button
					type="button"
					class="group/link flex flex-row items-center rounded-lg bg-zinc-50 px-3 py-1.5 text-sm text-red-400 active:scale-95 dark:bg-slate-900"
					(click)="handleCancel()"
				>
					Cancel
				</button>
				<button
					type="button"
					class="flex flex-row items-center rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-semibold text-dongs-500 active:scale-95 dark:bg-slate-800"
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
