import { Injectable, signal, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { GetInvestmentsBalanceHistoryRequest, GetInvestmentsBalanceHistoryResponse, GetInvestmentsPerformanceRequest, GetInvestmentsPerformanceResponse, IInvestmentsGatewayService } from './investments-gateway.model';

@Injectable()
export class InvestmentsGatewayService implements IInvestmentsGatewayService {
	private _loading = signal<boolean>(false);
	loading: Signal<boolean> = this._loading.asReadonly();

    /**
	 * TODO: When doing the Backend the logic for the @method getInvestmentsPerformance is:
     * 
     *  - The Endpoint will receive a request like @var GetInvestmentsPerformanceRequest.
     *      - `wallets`: The selected Wallets.
     *          - The selected Wallets will be sent as they are in the localStorage, at first the backend don't know if they are valid or not.
     *      - `wallets_info`: Bring or not the information about ALL the User's wallets. (First page load will need this to be @var TRUE)
     *  - Grab or not the info of Wallets, for the Wallets side section.
     *  - Try to get the data from the requested selected wallets.
     *      - If no data could be gotten, then grab the data from the last updated User Wallet.
     *  - At the end return:
     *      - All the wallets, if necessary.
     *      - The data from selected wallets.
     *      - An array of the corrected selected wallets that will be updated on the localStorage.
	 */
	getInvestmentsPerformance(request: GetInvestmentsPerformanceRequest): Observable<GetInvestmentsPerformanceResponse> {
		throw new Error('Method not implemented.');
	}

    getInvestmentsBalanceHistory(request: GetInvestmentsBalanceHistoryRequest): Observable<GetInvestmentsBalanceHistoryResponse> {
        throw new Error('Method not implemented.');
    }
}
