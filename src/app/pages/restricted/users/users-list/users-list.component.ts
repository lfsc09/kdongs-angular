import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight, faFilter, faPlus, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { KdsDatapoolService } from '../../../../components/shared/kds/kds-datapool/kds-datapool.service';
import { KdsLoadingInfiniteComponent } from '../../../../components/shared/kds/kds-loading-infinite/kds-loading-infinite.component';
import { UsersGatewayService } from '../../../../infra/gateways/users/users-gateway.service';
import { DatapoolUser } from '../../../../infra/gateways/users/users-gateway.model';

@Component({
	selector: 'app-users-list',
	standalone: true,
	imports: [FontAwesomeModule, RouterLink, KdsLoadingInfiniteComponent],
	providers: [KdsDatapoolService, UsersGatewayService],
	templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit {
	/**
	 * SERVICES
	 */
	protected readonly kdsDatapoolService = inject(KdsDatapoolService);
	private readonly usersGatewayService = inject(UsersGatewayService);

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
    protected loading = signal<boolean>(false);

	async ngOnInit(): Promise<void> {
		this.loading.set(true);
		const response = await this.usersGatewayService.getDatapoolFake({ currPageIdx: 0, rowsPerPage: 5 });
		this.loading.set(false);
		if (response) this.kdsDatapoolService.newDataReceived<DatapoolUser>(response);
	}
}
