import { DOCUMENT } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeManagerService } from './infra/services/theme/theme-manager.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet],
	templateUrl: './app.component.html',
})
export class AppComponent {
	/**
	 * SERVICES
	 */
	private readonly themeManagerService = inject(ThemeManagerService);
	private readonly documentService = inject(DOCUMENT);

	constructor() {
		effect(() => {
			this.documentService.body.classList.toggle('dark', this.themeManagerService.darkTheme());
		});
	}
}
