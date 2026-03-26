import type { BankParser, ParsedTransaction } from '../types';

export const revolutParser: BankParser = {
  id: 'revolut',
  name: 'Revolut',
  country: 'INTL',
  dateFormat: 'YYYY-MM-DD',
  encoding: 'utf-8',

  detect(headers) {
    const expected = ['Type', 'Product', 'Started Date', 'Completed Date', 'Amount', 'Currency', 'State'];
    const matches = expected.filter(h => headers.includes(h)).length;
    return (matches / expected.length) * 100;
  },

  parse(headers, rows) {
    const descIdx = headers.indexOf('Description');
    const amountIdx = headers.indexOf('Amount');
    const currencyIdx = headers.indexOf('Currency');
    const dateIdx = headers.indexOf('Completed Date');

    return rows.map(row => {
      const rawAmount = parseFloat(row[amountIdx] || '0');
      const dateStr = (row[dateIdx] || '').split(' ')[0]; // Take date part only

      return {
        date: new Date(dateStr),
        amount: Math.abs(rawAmount),
        type: rawAmount < 0 ? 'debit' : 'credit',
        description: row[descIdx] || '',
        counterparty: row[descIdx] || undefined,
        currency: row[currencyIdx] || 'EUR',
        rawRow: Object.fromEntries(headers.map((h, i) => [h, row[i] || ''])),
      } satisfies ParsedTransaction;
    });
  },
};
