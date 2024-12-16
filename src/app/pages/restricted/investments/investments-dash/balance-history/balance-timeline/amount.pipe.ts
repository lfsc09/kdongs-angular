import { formatCurrency } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'amount',
	standalone: true,
})
export class AmountPipe implements PipeTransform {
	transform(value: number, currencyOnUse: string): string {
		return `[${value > 0 ? '+' : '-'} ${formatCurrency(Math.abs(value), 'pt-br', currencyOnUse, '0.0-2')}]`;
	}
}
