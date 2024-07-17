import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { TokenManagerService } from '../../../../infra/services/token/token-manager.service';
import { KdsCircularProgressComponent } from '../../kds/kds-circular-progress/kds-circular-progress.component';
import { NavModulesService } from '../nav-modules/nav-modules.service';

@Component({
	selector: 'app-nav-top',
	standalone: true,
	imports: [KdsCircularProgressComponent, AsyncPipe, CommonModule],
	templateUrl: './nav-top.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavTopComponent {
	/**
	 * SERVICES
	 */
	protected readonly tokenManagerService = inject(TokenManagerService);
	protected readonly navModulesService = inject(NavModulesService);

	/**
	 * SIGNALS AND OBSERVABLES
	 */
	protected tokenExpLeftPercentage$ = this.tokenManagerService.tokenExpLeft$.pipe(map((value: number) => (value / environment.token.lifespan) * 100));
}
