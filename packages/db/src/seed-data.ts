export const DEFAULT_CATEGORIES = [
  { name: 'Entertainment', color: '#8B5CF6', icon: 'tv', sortOrder: 0 },
  { name: 'Productivity', color: '#3B82F6', icon: 'briefcase', sortOrder: 1 },
  { name: 'Streaming', color: '#EC4899', icon: 'play', sortOrder: 2 },
  { name: 'Music', color: '#10B981', icon: 'music', sortOrder: 3 },
  { name: 'Cloud & Storage', color: '#6366F1', icon: 'cloud', sortOrder: 4 },
  { name: 'News & Reading', color: '#F59E0B', icon: 'newspaper', sortOrder: 5 },
  { name: 'Gaming', color: '#EF4444', icon: 'gamepad-2', sortOrder: 6 },
  { name: 'Health & Fitness', color: '#14B8A6', icon: 'heart-pulse', sortOrder: 7 },
  { name: 'Food & Delivery', color: '#F97316', icon: 'utensils', sortOrder: 8 },
  { name: 'Shopping', color: '#A855F7', icon: 'shopping-bag', sortOrder: 9 },
  { name: 'Utilities', color: '#64748B', icon: 'settings', sortOrder: 10 },
  { name: 'Other', color: '#9CA3AF', icon: 'circle', sortOrder: 11 },
] as const;

export type DefaultCategory = (typeof DEFAULT_CATEGORIES)[number];

export const POPULAR_SERVICES = [
  // Streaming
  { name: 'Netflix', category: 'Streaming', defaultPrice: 15.49, cycle: 'monthly', logo: 'netflix', color: '#E50914' },
  { name: 'Disney+', category: 'Streaming', defaultPrice: 13.99, cycle: 'monthly', logo: 'disney-plus', color: '#113CCF' },
  { name: 'HBO Max', category: 'Streaming', defaultPrice: 15.99, cycle: 'monthly', logo: 'hbo', color: '#B535F6' },
  { name: 'Hulu', category: 'Streaming', defaultPrice: 7.99, cycle: 'monthly', logo: 'hulu', color: '#1CE783' },
  { name: 'Amazon Prime', category: 'Streaming', defaultPrice: 14.99, cycle: 'monthly', logo: 'amazon', color: '#FF9900' },
  { name: 'Apple TV+', category: 'Streaming', defaultPrice: 9.99, cycle: 'monthly', logo: 'apple', color: '#000000' },
  { name: 'YouTube Premium', category: 'Streaming', defaultPrice: 13.99, cycle: 'monthly', logo: 'youtube', color: '#FF0000' },
  { name: 'Crunchyroll', category: 'Streaming', defaultPrice: 7.99, cycle: 'monthly', logo: 'crunchyroll', color: '#F47521' },

  // Music
  { name: 'Spotify', category: 'Music', defaultPrice: 10.99, cycle: 'monthly', logo: 'spotify', color: '#1DB954' },
  { name: 'Apple Music', category: 'Music', defaultPrice: 10.99, cycle: 'monthly', logo: 'apple', color: '#FC3C44' },
  { name: 'Tidal', category: 'Music', defaultPrice: 10.99, cycle: 'monthly', logo: 'tidal', color: '#000000' },

  // Productivity
  { name: 'Microsoft 365', category: 'Productivity', defaultPrice: 6.99, cycle: 'monthly', logo: 'microsoft', color: '#0078D4' },
  { name: 'Google One', category: 'Cloud & Storage', defaultPrice: 2.99, cycle: 'monthly', logo: 'google', color: '#4285F4' },
  { name: 'iCloud+', category: 'Cloud & Storage', defaultPrice: 2.99, cycle: 'monthly', logo: 'apple', color: '#3693F3' },
  { name: 'Notion', category: 'Productivity', defaultPrice: 8.00, cycle: 'monthly', logo: 'notion', color: '#000000' },
  { name: 'Todoist', category: 'Productivity', defaultPrice: 4.00, cycle: 'monthly', logo: 'todoist', color: '#E44332' },

  // AI Tools
  { name: 'ChatGPT Plus', category: 'Productivity', defaultPrice: 20.00, cycle: 'monthly', logo: 'openai', color: '#10A37F' },
  { name: 'Claude Pro', category: 'Productivity', defaultPrice: 20.00, cycle: 'monthly', logo: 'anthropic', color: '#D97706' },
  { name: 'GitHub Copilot', category: 'Productivity', defaultPrice: 10.00, cycle: 'monthly', logo: 'github', color: '#000000' },
  { name: 'Midjourney', category: 'Productivity', defaultPrice: 10.00, cycle: 'monthly', logo: 'midjourney', color: '#000000' },

  // Security & VPN
  { name: '1Password', category: 'Utilities', defaultPrice: 2.99, cycle: 'monthly', logo: '1password', color: '#0572EC' },
  { name: 'NordVPN', category: 'Utilities', defaultPrice: 12.99, cycle: 'monthly', logo: 'nordvpn', color: '#4687FF' },
  { name: 'Bitwarden', category: 'Utilities', defaultPrice: 0.83, cycle: 'monthly', logo: 'bitwarden', color: '#175DDC' },

  // Creative
  { name: 'Adobe Creative Cloud', category: 'Productivity', defaultPrice: 54.99, cycle: 'monthly', logo: 'adobe', color: '#FF0000' },
  { name: 'Figma', category: 'Productivity', defaultPrice: 12.00, cycle: 'monthly', logo: 'figma', color: '#F24E1E' },
  { name: 'Canva Pro', category: 'Productivity', defaultPrice: 12.99, cycle: 'monthly', logo: 'canva', color: '#00C4CC' },

  // Gaming
  { name: 'Xbox Game Pass', category: 'Gaming', defaultPrice: 16.99, cycle: 'monthly', logo: 'xbox', color: '#107C10' },
  { name: 'PlayStation Plus', category: 'Gaming', defaultPrice: 9.99, cycle: 'monthly', logo: 'playstation', color: '#003791' },
  { name: 'Nintendo Switch Online', category: 'Gaming', defaultPrice: 3.99, cycle: 'monthly', logo: 'nintendo', color: '#E60012' },

  // Health & Fitness
  { name: 'Strava', category: 'Health & Fitness', defaultPrice: 11.99, cycle: 'monthly', logo: 'strava', color: '#FC4C02' },
  { name: 'Headspace', category: 'Health & Fitness', defaultPrice: 12.99, cycle: 'monthly', logo: 'headspace', color: '#F47D31' },
  { name: 'Calm', category: 'Health & Fitness', defaultPrice: 14.99, cycle: 'monthly', logo: 'calm', color: '#6A8FB7' },

  // News & Reading
  { name: 'Medium', category: 'News & Reading', defaultPrice: 5.00, cycle: 'monthly', logo: 'medium', color: '#000000' },
  { name: 'Audible', category: 'News & Reading', defaultPrice: 14.95, cycle: 'monthly', logo: 'audible', color: '#F8991C' },
  { name: 'Kindle Unlimited', category: 'News & Reading', defaultPrice: 11.99, cycle: 'monthly', logo: 'kindle', color: '#FF9900' },
] as const;

export type PopularService = (typeof POPULAR_SERVICES)[number];
