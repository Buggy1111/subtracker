const baseStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #09090B; color: #FAFAFA; }
  .container { max-width: 560px; margin: 0 auto; padding: 40px 20px; }
  .card { background: #18181B; border-radius: 12px; padding: 32px; border: 1px solid rgba(255,255,255,0.06); }
  .logo { font-size: 20px; font-weight: 700; color: #6366F1; margin-bottom: 24px; }
  h1 { font-size: 22px; font-weight: 600; margin: 0 0 8px; }
  p { font-size: 14px; line-height: 1.6; color: #A1A1AA; margin: 0 0 16px; }
  .btn { display: inline-block; background: #6366F1; color: #fff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500; }
  .sub-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .sub-name { font-size: 14px; color: #E4E4E7; }
  .sub-amount { font-size: 14px; font-weight: 600; color: #FAFAFA; font-family: monospace; }
  .footer { text-align: center; padding-top: 24px; font-size: 12px; color: #52525B; }
`;

function wrap(content: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${baseStyles}</style></head>
<body><div class="container"><div class="card"><div class="logo">SubTracker</div>${content}</div>
<div class="footer">SubTracker — Your subscription tracker<br>You received this because you signed up at subtracker.app</div></div></body></html>`;
}

export function renderWelcomeEmail(name: string): string {
  return wrap(`
    <h1>Welcome to SubTracker${name ? `, ${name}` : ''}!</h1>
    <p>You're all set to start tracking your subscriptions. Add your first subscription to see where your money goes every month.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://subtracker.app'}/subscriptions/new" class="btn">Add Your First Subscription</a>
  `);
}

export function renderRenewalReminder(subscriptions: { name: string; amount: string; currency: string; date: string }[]): string {
  const rows = subscriptions
    .map((s) => `<div class="sub-row"><span class="sub-name">${s.name}</span><span class="sub-amount">${s.currency} ${s.amount} — ${s.date}</span></div>`)
    .join('');

  return wrap(`
    <h1>Upcoming Renewals</h1>
    <p>These subscriptions are renewing soon:</p>
    ${rows}
    <br>
    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://subtracker.app'}/dashboard" class="btn">View Dashboard</a>
  `);
}

export function renderWeeklyDigest(data: {
  monthlySpend: number;
  activeCount: number;
  upcoming: { name: string; amount: string; date: string }[];
}): string {
  const upcomingRows = data.upcoming
    .map((s) => `<div class="sub-row"><span class="sub-name">${s.name}</span><span class="sub-amount">${s.amount} — ${s.date}</span></div>`)
    .join('');

  return wrap(`
    <h1>Weekly Summary</h1>
    <p>Here's your subscription overview:</p>
    <div class="sub-row"><span class="sub-name">Monthly Spend</span><span class="sub-amount">$${data.monthlySpend.toFixed(2)}</span></div>
    <div class="sub-row"><span class="sub-name">Active Subscriptions</span><span class="sub-amount">${data.activeCount}</span></div>
    ${data.upcoming.length > 0 ? `<br><p><strong>Upcoming this week:</strong></p>${upcomingRows}` : ''}
    <br>
    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://subtracker.app'}/dashboard" class="btn">View Dashboard</a>
  `);
}
