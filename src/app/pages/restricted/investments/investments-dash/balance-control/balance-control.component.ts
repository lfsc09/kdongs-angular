import { Component, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAnglesRight, faCircleDown, faCircleUp } from '@fortawesome/free-solid-svg-icons';
import { Currency } from '../../../../../infra/gateways/investments/investments-gateway.model';
import { KDS } from '../../../../../infra/util/kds.util';

@Component({
	selector: 'app-balance-control',
	standalone: true,
	imports: [FontAwesomeModule, ReactiveFormsModule],
	templateUrl: './balance-control.component.html',
	styles: `
		:host {
			@apply desktop-2k:col-span-2;
		}
	`,
})
export class BalanceControlComponent implements OnInit {
	/**
	 * SERVICES
	 */
	private formBuilder = inject(FormBuilder);

	/**
	 * SIGNALS
	 */
	selectedWalletCurrency = input.required<Currency>();
	protected icons = signal({
		faAnglesRight: faAnglesRight,
		faCircleDown: faCircleDown,
		faCircleUp: faCircleUp,
	});
	protected balanceAction = signal<BalanceAction>('deposit');
	protected balanceDepositForm = this.formBuilder.group({
		balance_id: [''],
		localDate: [KDS.todayLocalTZ(), [Validators.required]],
		institution: ['', [Validators.required]],
		details: [''],
		originCurrency: ['', [Validators.required]],
		originAmount: ['', [Validators.required]],
		originExchGrossRate: [{ value: '', disabled: true }],
		originExchOpFee: [{ value: '', disabled: true }],
		originExchVetRate: [{ value: '', disabled: true }],
		resultCurrency: ['', [Validators.required]],
		resultAmount: [{ value: '', disabled: true }, [Validators.required]],
	});
	protected balanceWithdrawForm = this.formBuilder.group({
		balance_id: [''],
		localDate: [KDS.todayLocalTZ(), [Validators.required]],
		institution: ['', [Validators.required]],
		details: [''],
		resultCurrency: ['', [Validators.required]],
		resultAmount: ['', [Validators.required]],
	});
	private balanceDepositFormRef = viewChild<HTMLFormElement>('balanceDepositFormRef');
	private balanceWithdrawFormRef = viewChild<HTMLFormElement>('balanceWithdrawFormRef');

	ngOnInit(): void {
		this.balanceDepositForm.get('originCurrency')!.setValue(this.selectedWalletCurrency());
		this.balanceDepositForm.get('resultCurrency')!.setValue(this.selectedWalletCurrency());
		this.balanceWithdrawForm.get('resultCurrency')!.setValue(this.selectedWalletCurrency());
	}

	/**
	 * FUNCTIONS
	 */
	exposeBalanceDepositFormUpdate(values: BalanceDepositForm): void {
		if (!values?.balance_id) {
			console.error('Unknown Balance Item to Change');
			return;
		}
		this.balanceDepositForm.get('balance_id')!.setValue(values.balance_id);
		this.balanceAction.set('deposit');
		for (let [fieldName, control] of Object.entries(this.balanceDepositForm.controls)) control.setValue(values?.[fieldName as keyof BalanceDepositForm] ?? '');
		if (this.balanceDepositForm.get('originCurrency')!.value === this.balanceDepositForm.get('resultCurrency')!.value) {
			this.balanceDepositForm.get('resultAmount')!.disable();
			this.balanceDepositForm.get('originExchGrossRate')!.disable();
			this.balanceDepositForm.get('originExchOpFee')!.disable();
			this.balanceDepositForm.get('originExchVetRate')!.disable();
		} else {
			this.balanceDepositForm.get('resultAmount')!.enable();
			this.balanceDepositForm.get('originExchGrossRate')!.enable();
			this.balanceDepositForm.get('originExchOpFee')!.enable();
			this.balanceDepositForm.get('originExchVetRate')!.enable();
		}
	}

	exposeBalanceWithdrawFormUpdate(values: BalanceWithdrawForm): void {
		if (!values?.balance_id) {
			console.error('Unknown Balance Item to Change');
			return;
		}
		this.balanceWithdrawForm.get('balance_id')!.setValue(values.balance_id);
		this.balanceAction.set('withdraw');
		for (let [fieldName, control] of Object.entries(this.balanceWithdrawForm.controls)) control.setValue(values?.[fieldName as keyof BalanceWithdrawForm] ?? '');
	}

	protected updateBalanceAction(value: BalanceAction): void {
		this.balanceAction.set(value);
        this.clearForm();
	}

	protected clearForm(): void {
		if (this.balanceAction() === 'deposit') {
			this.balanceDepositFormRef()?.['resetForm']();
			this.balanceDepositForm.reset({
				localDate: KDS.todayLocalTZ(),
				originCurrency: this.selectedWalletCurrency(),
				resultCurrency: this.selectedWalletCurrency(),
			});
			this.balanceDepositForm.get('originExchGrossRate')!.disable();
			this.balanceDepositForm.get('originExchOpFee')!.disable();
			this.balanceDepositForm.get('originExchVetRate')!.disable();
			this.balanceDepositForm.get('resultAmount')!.disable();
		} else if (this.balanceAction() === 'withdraw') {
			this.balanceWithdrawFormRef()?.['resetForm']();
			this.balanceWithdrawForm.reset({ localDate: KDS.todayLocalTZ(), resultCurrency: this.selectedWalletCurrency() });
		}
	}

	protected handleOriginCurrencyChange(): void {
		if (this.balanceDepositForm.get('originCurrency')!.value === this.balanceDepositForm.get('resultCurrency')!.value) {
			this.balanceDepositForm.get('resultAmount')!.disable();
			this.balanceDepositForm.get('resultAmount')!.setValue(this.balanceDepositForm.get('originAmount')!.value);
			this.balanceDepositForm.get('originExchGrossRate')!.disable();
			this.balanceDepositForm.get('originExchGrossRate')!.setValue('');
			this.balanceDepositForm.get('originExchOpFee')!.disable();
			this.balanceDepositForm.get('originExchOpFee')!.setValue('');
			this.balanceDepositForm.get('originExchVetRate')!.disable();
			this.balanceDepositForm.get('originExchVetRate')!.setValue('');
		} else {
			this.balanceDepositForm.get('resultAmount')!.setValue('');
			this.balanceDepositForm.get('resultAmount')!.enable();
			this.balanceDepositForm.get('originExchGrossRate')!.enable();
			this.balanceDepositForm.get('originExchOpFee')!.enable();
			this.balanceDepositForm.get('originExchVetRate')!.enable();
		}
	}

	protected handleOriginAmountChange(): void {
		if (this.balanceDepositForm.get('originCurrency')!.value === this.balanceDepositForm.get('resultCurrency')!.value) {
			this.balanceDepositForm.get('resultAmount')!.setValue(this.balanceDepositForm.get('originAmount')!.value);
		} else {
			this.handleAutoResultAmountCalc();
		}
	}

	protected handleAutoVETCalc(): void {
		if (this.balanceDepositForm.get('originExchGrossRate')!.value && this.balanceDepositForm.get('originExchOpFee')!.value) {
			const grossRate = parseFloat(this.balanceDepositForm.get('originExchGrossRate')!.value!);
			const opFee = parseFloat(this.balanceDepositForm.get('originExchOpFee')!.value!);
			const vetRate = grossRate + (opFee / 100) * grossRate;
			this.balanceDepositForm.get('originExchVetRate')!.setValue(vetRate.toFixed(3));
		} else {
			this.balanceDepositForm.get('originExchVetRate')!.setValue('');
		}
		this.handleAutoResultAmountCalc();
	}

	protected handleAutoResultAmountCalc(): void {
		if (this.balanceDepositForm.get('originAmount')!.value && this.balanceDepositForm.get('originExchVetRate')!.value) {
			const originAmount = parseFloat(this.balanceDepositForm.get('originAmount')!.value!);
			const vetRate = parseFloat(this.balanceDepositForm.get('originExchVetRate')!.value!);
			const resultAmount = originAmount * vetRate;
			this.balanceDepositForm.get('resultAmount')!.setValue(resultAmount.toFixed(2));
		} else {
			this.balanceDepositForm.get('resultAmount')!.setValue('');
		}
	}

	protected handleDepositFormSubmit(): void {
		/** TODO: handleDepositSubmit */
		if (this.balanceDepositForm.valid) {
			this.balanceDepositForm.reset({ localDate: KDS.todayLocalTZ(), originCurrency: this.selectedWalletCurrency(), resultCurrency: this.selectedWalletCurrency() });
			this.balanceDepositFormRef()?.['resetForm']();
		} else this.balanceDepositForm.markAllAsTouched();
	}

	protected handleWithdrawFormSubmit(): void {
		/** TODO: handleWithdrawSubmit */
		if (this.balanceWithdrawForm.valid) {
			this.balanceWithdrawForm.reset({ localDate: KDS.todayLocalTZ(), resultCurrency: this.selectedWalletCurrency() });
			this.balanceWithdrawFormRef()?.['resetForm']();
		} else this.balanceWithdrawForm.markAllAsTouched();
	}
}

export type BalanceAction = 'deposit' | 'withdraw';

export type BalanceDepositForm = {
	balance_id?: string;
	localDate?: string;
	institution?: string;
	details?: string;
	originCurrency?: string;
	originAmount?: string;
	originExchGrossRate?: string;
	originExchOpFee?: string;
	originExchVetRate?: string;
	resultCurrency?: string;
	resultAmount?: string;
};

export type BalanceWithdrawForm = {
	balance_id?: string;
	localDate?: string;
	institution?: string;
	details?: string;
	resultCurrency?: string;
	resultAmount?: string;
};
