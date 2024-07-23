import { Component, computed, inject } from '@angular/core';
import { TypedMessageComponent } from '../../../components/shared/typed-message/typed-message.component';
import { TokenManagerService } from '../../../infra/services/token/token-manager.service';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [TypedMessageComponent],
	templateUrl: './home.component.html',
})
export class HomeComponent {
	/**
	 * SERVICES
	 */
	private readonly tokenManagerService = inject(TokenManagerService);

	/**
	 * SIGNALS AND VARS
	 */
	protected helloMessage = computed(() => {
		let user: string | undefined;
		user = this.tokenManagerService.tokenData()?.name ?? 'Unknown';
		return [
			`Hello <span class="font-mono text-lg font-medium text-dongs-500">${user}</span><span class="text-xl">&#9996;</span>`,
			`What shall we do today..^1000 I dunno about you but I'll have great weak <span class="text-xl">&#9994;</span>^5000`,
		];
	});
}
