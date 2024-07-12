import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeManagerService } from './infra/services/theme/theme-manager.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet],
	templateUrl: './app.component.html',
    host: {
        '[class.dark]': 'useDarkTheme()'
    }
})
export class AppComponent {
	/**
	 * SERVICES
	 */
	private readonly themeManagerService = inject(ThemeManagerService);

	/**
	 * SIGNALS AND
	 */
	protected useDarkTheme = this.themeManagerService.darkTheme;
}
