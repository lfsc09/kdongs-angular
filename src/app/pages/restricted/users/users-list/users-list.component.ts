import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight, faFilter, faPlus, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { KdsDatapoolService } from '../../../../components/shared/kds/kds-datapool/kds-datapool.service';
import { KdsLoadingInfiniteComponent } from '../../../../components/shared/kds/kds-loading-infinite/kds-loading-infinite.component';

@Component({
	selector: 'app-users-list',
	standalone: true,
	imports: [FontAwesomeModule, RouterLink, KdsLoadingInfiniteComponent],
	providers: [KdsDatapoolService],
	templateUrl: './users-list.component.html',
})
export class UsersListComponent {
	/**
	 * SERVICES
	 */
	protected readonly kdsDatapoolService = inject(KdsDatapoolService);

	/**
	 * SIGNALS
	 */
	protected icons = signal({
		faPlus: faPlus,
		faFilter: faFilter,
		faSquareCheck: faSquareCheck,
		faAngleLeft: faAngleLeft,
		faAngleRight: faAngleRight,
		faAnglesLeft: faAnglesLeft,
		faAnglesRight: faAnglesRight,
	});
	protected usersDatapool = this.kdsDatapoolService.getDatapool();
}
