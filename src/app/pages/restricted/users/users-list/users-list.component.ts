import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight, faEye, faEyeSlash, faFilter, faGear, faPen, faPlus, faShare } from '@fortawesome/free-solid-svg-icons';
import { KdsBooleanDialogComponent } from '../../../../components/shared/kds/kds-boolean-dialog/kds-boolean-dialog.component';
import { KdsDatapool } from '../../../../components/shared/kds/kds-datapool/kds-datapool.model';
import { KdsLoadingSpinnerComponent } from '../../../../components/shared/kds/kds-loading-spinner/kds-loading-spinner.component';
import { DatapoolUser } from '../../../../infra/gateways/users/users-gateway.model';
import { UsersGatewayService } from '../../../../infra/gateways/users/users-gateway.service';
import { TokenManagerService } from '../../../../infra/services/token/token-manager.service';
import { UsersListFilterComponent } from './users-list-filter/users-list-filter.component';
import { UsersListFilterOutput } from './users-list-filter/users-list-filter.model';

@Component({
	selector: 'app-users-list',
	standalone: true,
	imports: [FontAwesomeModule, RouterLink, KdsLoadingSpinnerComponent, KdsBooleanDialogComponent, UsersListFilterComponent],
	providers: [UsersGatewayService],
	templateUrl: './users-list.component.html',
	host: {
		'(document:keyup.Control./)': 'handleFilterDialogToogle()',
	},
})
export class UsersListComponent extends KdsDatapool<DatapoolUser> {
	/**
	 * SERVICES
	 */
	protected readonly tokenManagerService = inject(TokenManagerService);
	private readonly usersGatewayService = inject(UsersGatewayService);

	/**
	 * SIGNALS
	 */
	protected icons = signal({
		faPlus: faPlus,
		faFilter: faFilter,
		faAngleLeft: faAngleLeft,
		faAngleRight: faAngleRight,
		faAnglesLeft: faAnglesLeft,
		faAnglesRight: faAnglesRight,
		faGear: faGear,
		faShare: faShare,
		faPen: faPen,
		faEye: faEye,
		faEyeSlash: faEyeSlash,
	});
	/**
	 * Deactivation/Reactivation dialog
	 */
	protected confirmDialogRef = viewChild<KdsBooleanDialogComponent<string>>('confirmDialogRef');
	protected confirmDialogData = signal<{ type: 'deactivate' | 'reactivate'; userId: string; username: string } | null>(null);
	/**
	 * Filter dialog
	 */
	protected filterDialogOpen = signal<boolean>(true);

	constructor() {
		super();
        // TODO: Cleanup for multiple requests 
		effect(async () => {
			untracked(() => this.loadingDatapool.set(true));
			const response = await this.usersGatewayService.getDatapoolFake(this.triggerControls());
			// TODO: Maybe also update `currPageIdx` if requested page was invalid and corrected by API
            untracked(() => {
                if (response) this.updateKdsDatapool(response);
                else this.resetKdsDatapool();
                this.loadingDatapool.set(false);
            });
		});
	}

	/**
	 * FUNCTIONS
	 */

	/**
	 * Deactivation/Reactivation dialog
	 */
	protected handleConfirmDeactivate(userId: string): void {
		const username = this.datapool().pagePool.find((u) => u.id === userId)?.username;
		if (username) {
			this.confirmDialogData.set({
				type: 'deactivate',
				userId,
				username,
			});
			this.confirmDialogRef()?.dialogRef()?.nativeElement.showModal();
		} else console.warn('User not found in table');
	}

	protected handleConfirmReactivate(userId: string): void {
		const username = this.datapool().pagePool.find((u) => u.id === userId)?.username;
		if (username) {
			this.confirmDialogData.set({
				type: 'reactivate',
				userId,
				username,
			});
			this.confirmDialogRef()?.dialogRef()?.nativeElement.showModal();
		} else console.warn('User not found in table');
	}

	protected handleConfirmation(userId: string | null | undefined): void {
		if (userId) {
			if (this.confirmDialogData()?.type === 'deactivate') console.log(`Delete the fucker ${userId}`);
			else if (this.confirmDialogData()?.type === 'reactivate') console.log(`Reactivate the fucker ${userId}`);
		}
	}

	/**
	 * Filter dialog
	 */
	protected handleFilterDialogToogle(): void {
		this.filterDialogOpen.update((currState) => !currState);
	}

	protected handleReceiveFilterDialogData(data: UsersListFilterOutput): void {
		this.updateTriggerControls(data.currPageIdx, data.itemsPerPage);
	}
}
