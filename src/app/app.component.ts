import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { TokenManagerService } from './infra/services/token/token-manager.service';
import { ThemeManagerService } from './infra/services/theme/theme-manager.service';

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

    /**
     * SIGNALS AND OBSERVABLES
     */
	private tokenExpLeftSubscription: Subscription | undefined;
	private clearTimeoutProcessToken: ReturnType<typeof setTimeout> | undefined;
    protected useDarkTheme = this.themeManagerService.darkTheme;

	ngOnInit(): void {
		this.tokenExpLeftSubscription = this.tokenManagerService.tokenExpLeft$.subscribe((expLeft: number) => {
			if (expLeft > 0) {
				this.clearTimeoutProcessToken = setTimeout(() => {
					this.tokenManagerService.processToken();
				}, 5000);
			}
		});
	}

	ngOnDestroy(): void {
		this.tokenExpLeftSubscription!.unsubscribe();
		clearTimeout(this.clearTimeoutProcessToken);
	}
}
