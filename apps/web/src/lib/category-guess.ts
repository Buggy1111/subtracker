const MERCHANT_PATTERNS: { pattern: RegExp; category: string }[] = [
  // Streaming
  { pattern: /netflix/i, category: "Streaming" },
  { pattern: /disney(\s|\+|plus)/i, category: "Streaming" },
  { pattern: /\bhbo\b|hbo\s?max/i, category: "Streaming" },
  { pattern: /\bhulu\b/i, category: "Streaming" },
  { pattern: /amazon\s?prime|prime\s?video/i, category: "Streaming" },
  { pattern: /apple\s?tv/i, category: "Streaming" },
  { pattern: /youtube\s?(premium|music)?/i, category: "Streaming" },
  { pattern: /crunchyroll|paramount|peacock|sling/i, category: "Streaming" },

  // Music
  { pattern: /spotify/i, category: "Music" },
  { pattern: /apple\s?music/i, category: "Music" },
  { pattern: /tidal|deezer|soundcloud/i, category: "Music" },

  // Productivity / AI / Dev
  { pattern: /openai|chatgpt/i, category: "Productivity" },
  { pattern: /anthropic|claude(\s|pro)/i, category: "Productivity" },
  { pattern: /github|copilot/i, category: "Productivity" },
  { pattern: /microsoft\s?365|office\s?365/i, category: "Productivity" },
  { pattern: /figma/i, category: "Productivity" },
  { pattern: /notion/i, category: "Productivity" },
  { pattern: /adobe|creative\s?cloud/i, category: "Productivity" },
  { pattern: /canva/i, category: "Productivity" },
  { pattern: /midjourney/i, category: "Productivity" },
  { pattern: /linear\b|jira|asana|trello|monday\.com|slack/i, category: "Productivity" },
  { pattern: /vercel|netlify|cloudflare|render\.com/i, category: "Productivity" },
  { pattern: /todoist|evernote|basecamp/i, category: "Productivity" },

  // Cloud & Storage
  { pattern: /icloud|apple\s?one/i, category: "Cloud & Storage" },
  { pattern: /google\s?(one|drive|workspace)/i, category: "Cloud & Storage" },
  { pattern: /dropbox|box\.com|pcloud|mega\.nz/i, category: "Cloud & Storage" },
  { pattern: /aws|amazon\s?web|digitalocean|linode|hetzner/i, category: "Cloud & Storage" },

  // Gaming
  { pattern: /xbox|game\s?pass/i, category: "Gaming" },
  { pattern: /playstation|ps\s?plus/i, category: "Gaming" },
  { pattern: /nintendo/i, category: "Gaming" },
  { pattern: /steam/i, category: "Gaming" },
  { pattern: /epic\s?games|ea\s?play|ubisoft/i, category: "Gaming" },

  // News & Reading
  { pattern: /new\s?york\s?times|wsj|washingtonpost|economist|medium|substack/i, category: "News & Reading" },
  { pattern: /audible|kindle|scribd|storytel/i, category: "News & Reading" },

  // Health & Fitness
  { pattern: /strava|fitbit|peloton|calm|headspace|myfitnesspal/i, category: "Health & Fitness" },

  // Food & Delivery
  { pattern: /hellofresh|doordash|uber\s?eats|grubhub|deliveroo|wolt/i, category: "Food & Delivery" },

  // Utilities / Security
  { pattern: /1password|lastpass|bitwarden|dashlane/i, category: "Utilities" },
  { pattern: /nordvpn|expressvpn|surfshark|protonvpn|mullvad/i, category: "Utilities" },
];

/**
 * Best-guess category name for a merchant string. Returns null when nothing
 * matches — the subscription will stay uncategorized instead of being put in
 * a wrong bucket.
 */
export function guessCategoryName(merchant: string): string | null {
  for (const { pattern, category } of MERCHANT_PATTERNS) {
    if (pattern.test(merchant)) return category;
  }
  return null;
}
