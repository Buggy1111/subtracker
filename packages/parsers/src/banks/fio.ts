import type { BankParser, ParsedTransaction } from '../types';
import { parseDate, parseAmount } from '../utils';

export const fioParser: BankParser = {
  id: 'fio',
  name: 'Fio Banka',
  country: 'CZ',
  dateFormat: 'DD.MM.YYYY',
  encoding: 'utf-8',

  detect(headers) {
    const expected = ['ID operace', 'Datum', 'Objem', 'Měna'];
    const matches = expected.filter(h => headers.includes(h)).length;
    return (matches / expected.length) * 100;
  },

  parse(headers, rows) {
    const dateIdx = headers.indexOf('Datum');
    const amountIdx = headers.indexOf('Objem');
    const currencyIdx = headers.indexOf('Měna');
    const counterpartyIdx = headers.indexOf('Název protiúčtu');
    const descIdx = headers.indexOf('Zpráva pro příjemce');
    const refIdx = headers.indexOf('ID operace');

    return rows.map(row => {
      const rawAmount = parseAmount(row[amountIdx] || '0');
      return {
        date: parseDate(row[dateIdx] || ''),
        amount: Math.abs(rawAmount),
        type: rawAmount < 0 ? 'debit' : 'credit',
        description: row[descIdx] || row[counterpartyIdx] || '',
        counterparty: row[counterpartyIdx] || undefined,
        reference: row[refIdx] || undefined,
        currency: row[currencyIdx] || 'CZK',
        rawRow: Object.fromEntries(headers.map((h, i) => [h, row[i] || ''])),
      } satisfies ParsedTransaction;
    });
  },
};
