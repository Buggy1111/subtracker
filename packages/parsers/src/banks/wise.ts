import type { BankParser, ParsedTransaction } from '../types';

export const wiseParser: BankParser = {
  id: 'wise',
  name: 'Wise (TransferWise)',
  country: 'INTL',
  dateFormat: 'YYYY-MM-DD',
  encoding: 'utf-8',

  detect(headers) {
    const expected = ['TransferWise ID', 'Date', 'Amount', 'Currency', 'Description'];
    const matches = expected.filter(h => headers.includes(h)).length;
    return (matches / expected.length) * 100;
  },

  parse(headers, rows) {
    const dateIdx = headers.indexOf('Date');
    const amountIdx = headers.indexOf('Amount');
    const currencyIdx = headers.indexOf('Currency');
    const descIdx = headers.indexOf('Description');
    const refIdx = headers.indexOf('TransferWise ID');

    return rows.map(row => {
      const rawAmount = parseFloat(row[amountIdx] || '0');

      return {
        date: new Date(row[dateIdx] || ''),
        amount: Math.abs(rawAmount),
        type: rawAmount < 0 ? 'debit' : 'credit',
        description: row[descIdx] || '',
        counterparty: row[descIdx] || undefined,
        reference: row[refIdx] || undefined,
        currency: row[currencyIdx] || 'USD',
        rawRow: Object.fromEntries(headers.map((h, i) => [h, row[i] || ''])),
      } satisfies ParsedTransaction;
    });
  },
};
