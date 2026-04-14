import { describe, it, expect } from 'vitest';
import { renderWelcomeEmail, renderRenewalReminder, renderWeeklyDigest } from '../templates/index';

describe('email templates', () => {
  it('renderWelcomeEmail includes name', () => {
    const html = renderWelcomeEmail('Michal');
    expect(html).toContain('Michal');
    expect(html).toContain('SubTracker');
    expect(html).toContain('Welcome');
  });

  it('renderWelcomeEmail works without name', () => {
    const html = renderWelcomeEmail('');
    expect(html).toContain('Welcome to SubTracker!');
    expect(html).not.toContain('Welcome to SubTracker,');
  });

  it('renderRenewalReminder lists subscriptions', () => {
    const html = renderRenewalReminder([
      { name: 'Netflix', amount: '15.99', currency: 'USD', date: 'Apr 20' },
      { name: 'Spotify', amount: '10.99', currency: 'USD', date: 'Apr 22' },
    ]);
    expect(html).toContain('Netflix');
    expect(html).toContain('Spotify');
    expect(html).toContain('15.99');
    expect(html).toContain('Upcoming Renewals');
  });

  it('renderWeeklyDigest includes stats', () => {
    const html = renderWeeklyDigest({
      monthlySpend: 125.50,
      activeCount: 8,
      upcoming: [{ name: 'Netflix', amount: '$15.99', date: 'Apr 20' }],
    });
    expect(html).toContain('125.50');
    expect(html).toContain('8');
    expect(html).toContain('Netflix');
    expect(html).toContain('Weekly Summary');
  });

  it('all templates produce valid HTML', () => {
    const templates = [
      renderWelcomeEmail('Test'),
      renderRenewalReminder([]),
      renderWeeklyDigest({ monthlySpend: 0, activeCount: 0, upcoming: [] }),
    ];
    for (const html of templates) {
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('</html>');
      expect(html).toContain('SubTracker');
    }
  });
});
