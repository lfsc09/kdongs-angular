import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
	IconDefinition,
	faChartPie,
	faCircleHalfStroke,
	faCreditCard,
	faHouse,
	faMagnifyingGlass,
	faMagnifyingGlassChart,
	faPowerOff,
	faUsersGear,
} from '@fortawesome/free-solid-svg-icons';
import { ViewportMatchDirective } from '../../../infra/directives/viewport/viewport-match.directive';
import { ThemeManagerService } from '../../../infra/services/theme/theme-manager.service';
import { TokenManagerService } from '../../../infra/services/token/token-manager.service';
import { NavModulesService } from './nav-modules.service';

@Component({
	selector: 'app-nav-modules',
	standalone: true,
	imports: [RouterLink, RouterLinkActive, ViewportMatchDirective, FontAwesomeModule],
	host: {
		'(document:keydown.Escape)': 'navModulesService.handleClose()',
		'(document:keydown.Control.;)': 'handleInputFocus()',
	},
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
	protected icons = signal<{ [key: string]: IconDefinition }>({
		faPowerOff: faPowerOff,
		faCircleHalfStroke: faCircleHalfStroke,
		faMagnifyingGlass: faMagnifyingGlass,
		faHouse: faHouse,
		faUsersGear: faUsersGear,
		faChartPie: faChartPie,
		faCreditCard: faCreditCard,
		faMagnifyingGlassChart: faMagnifyingGlassChart,
	});
	protected useDarkTheme = this.themeManagerService.darkTheme;
	protected searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

	ngAfterViewInit(): void {
		this.searchInput()?.nativeElement.focus();
	}

	/**
	 * FUNCTIONS
	 */
	handleInputFocus() {
		this.searchInput()?.nativeElement.focus();
	}
}
