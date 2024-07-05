import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../environments/environment';
import { ThemeManagerService } from './infra/services/theme/theme-manager.service';
import { TokenManagerService } from './infra/services/token/token-manager.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet],
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
	/**
	 * SERVICES
	 */
	private tokenManagerService = inject(TokenManagerService);
	private themeManagerService = inject(ThemeManagerService);
	private routerService = inject(Router);

	/**
	 * SIGNALS AND OBSERVABLES
	 */
	private tokenExpLeftSubscription: Subscription | undefined;
	private clearTimeoutProcessToken: ReturnType<typeof setTimeout> | undefined;
	protected useDarkTheme = this.themeManagerService.darkTheme;

	ngOnInit(): void {
		this.tokenExpLeftSubscription = this.tokenManagerService.tokenExpLeft$.subscribe((expLeft: number) => {
			// Register the next tokenProcess if token is still valid
            if (expLeft > 0) {
				this.clearTimeoutProcessToken = setTimeout(() => {
					if (!this.tokenManagerService.processToken()) this.routerService.navigate(['/gate']);
				}, environment.token.interval);
			} 
            // When token gets invalid, or tokenManager was cleaned
            else if (this.clearTimeoutProcessToken !== undefined) {
				clearTimeout(this.clearTimeoutProcessToken);
				this.clearTimeoutProcessToken = undefined;
				this.routerService.navigate(['/gate']);
			}
		});
	}

	ngOnDestroy(): void {
		this.tokenExpLeftSubscription!.unsubscribe();
		clearTimeout(this.clearTimeoutProcessToken);
		this.clearTimeoutProcessToken = undefined;
	}
}
