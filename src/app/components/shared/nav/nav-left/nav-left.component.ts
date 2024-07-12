import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHouse, faMagnifyingGlass, faUsersGear } from '@fortawesome/free-solid-svg-icons';
import { TokenManagerService } from '../../../../infra/services/token/token-manager.service';
import { ViewportMatchDirective } from '../../../../infra/directives/viewport/viewport-match.directive';
import { NavLeftService } from './nav-left.service';

@Component({
	selector: 'app-nav-left',
	standalone: true,
	imports: [RouterLink, RouterLinkActive, ViewportMatchDirective, FontAwesomeModule],
	templateUrl: './nav-left.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavLeftComponent implements AfterViewInit {
	/**
	 * SERVICES
	 */
	readonly navLeftService = inject(NavLeftService);

	/**
	 * SIGNALS AND OBSERVABLES
	 */
	protected icons = signal({
		faMagnifyingGlass: faMagnifyingGlass,
		faHouse: faHouse,
		faUsersGear: faUsersGear,
	});
	protected searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

	ngAfterViewInit(): void {
		this.searchInput()?.nativeElement.focus();
	}
}
