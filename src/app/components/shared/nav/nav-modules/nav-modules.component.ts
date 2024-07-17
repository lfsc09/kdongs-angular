import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleHalfStroke, faHouse, faMagnifyingGlass, faPowerOff, faUsersGear } from '@fortawesome/free-solid-svg-icons';
import { ViewportMatchDirective } from '../../../../infra/directives/viewport/viewport-match.directive';
import { ThemeManagerService } from '../../../../infra/services/theme/theme-manager.service';
import { TokenManagerService } from '../../../../infra/services/token/token-manager.service';
import { NavModulesService } from './nav-modules.service';

@Component({
	selector: 'app-nav-modules',
	standalone: true,
	imports: [RouterLink, RouterLinkActive, ViewportMatchDirective, FontAwesomeModule],
	templateUrl: './nav-modules.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavModulesComponent implements AfterViewInit {
	/**
	 * SERVICES
	 */
	protected readonly tokenManagerService = inject(TokenManagerService);
	protected readonly themeManagerService = inject(ThemeManagerService);
	protected readonly navModulesService = inject(NavModulesService);

	/**
	 * SIGNALS AND OBSERVABLES
	 */
	protected icons = signal({
		faPowerOff: faPowerOff,
		faCircleHalfStroke: faCircleHalfStroke,
		faMagnifyingGlass: faMagnifyingGlass,
		faHouse: faHouse,
		faUsersGear: faUsersGear,
	});
	protected useDarkTheme = this.themeManagerService.darkTheme;
	protected searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

	ngAfterViewInit(): void {
		this.searchInput()?.nativeElement.focus();
	}
}
