// Merchant → category patterns. Order matters: first match wins, so list
// more specific patterns before broader ones (e.g. "Apple Music" before
// anything that would grab bare "apple").
const MERCHANT_PATTERNS: { pattern: RegExp; category: string }[] = [
  // === Video streaming ===
  { pattern: /netflix/i, category: "Streaming" },
  { pattern: /disney(\s|\+|plus)/i, category: "Streaming" },
  { pattern: /\bhbo\b|hbo\s?max|max\.com/i, category: "Streaming" },
  { pattern: /\bhulu\b/i, category: "Streaming" },
  { pattern: /amazon\s?prime|prime\s?video/i, category: "Streaming" },
  { pattern: /apple\s?tv/i, category: "Streaming" },
  { pattern: /youtube\s?premium/i, category: "Streaming" },
  { pattern: /paramount\+?|paramount\s?plus/i, category: "Streaming" },
  { pattern: /peacock(\s?tv|\s?premium)?/i, category: "Streaming" },
  { pattern: /sling\s?tv|sling\.com/i, category: "Streaming" },
  { pattern: /\bstarz\b|showtime/i, category: "Streaming" },
  { pattern: /crunchyroll|funimation/i, category: "Streaming" },
  { pattern: /britbox|bbc\s?iplayer|itv\s?(hub|x)|stv\s?player/i, category: "Streaming" },
  { pattern: /\bdazn\b|fubo(tv|\s)|philo\b|criterion\s?channel/i, category: "Streaming" },
  { pattern: /nebula\.(app|tv)|curiosity\s?stream|mubi|curzon/i, category: "Streaming" },
  { pattern: /\bvoyo\b|prima\s?plus|o2\s?tv|\bt-mobile\s?tv|stream\s?cinema/i, category: "Streaming" },
  { pattern: /plex\s?(pass)?|jellyfin/i, category: "Streaming" },
  { pattern: /vimeo\s?(pro|premium|plus)/i, category: "Streaming" },
  { pattern: /twitch\s?(turbo|prime)/i, category: "Streaming" },

  // === Music streaming ===
  { pattern: /spotify/i, category: "Music" },
  { pattern: /apple\s?music/i, category: "Music" },
  { pattern: /youtube\s?music/i, category: "Music" },
  { pattern: /amazon\s?music/i, category: "Music" },
  { pattern: /tidal|deezer|qobuz|pandora|soundcloud|audiomack/i, category: "Music" },
  { pattern: /bandcamp/i, category: "Music" },

  // === AI tools (categorized as Productivity) ===
  { pattern: /openai|chatgpt/i, category: "Productivity" },
  { pattern: /anthropic|claude(\s|pro|\.ai)/i, category: "Productivity" },
  { pattern: /gemini\s?(advanced|pro)|google\s?ai/i, category: "Productivity" },
  { pattern: /midjourney|runway(ml|\s?ai)?|leonardo\.ai|stable\s?diffusion|dall-?e/i, category: "Productivity" },
  { pattern: /perplexity|poe\.com|character\.ai|mistral\s?ai/i, category: "Productivity" },
  { pattern: /jasper|copy\.ai|writesonic|grammarly|quillbot/i, category: "Productivity" },
  { pattern: /elevenlabs|descript|heygen|synthesia/i, category: "Productivity" },

  // === Dev tools & hosting ===
  { pattern: /github|copilot/i, category: "Productivity" },
  { pattern: /gitlab|bitbucket|gitea/i, category: "Productivity" },
  { pattern: /vercel|netlify|cloudflare(\s?(pro|workers))?|render\.com|railway\.app|fly\.io|heroku/i, category: "Productivity" },
  { pattern: /\baws\b|amazon\s?web|google\s?cloud|\bgcp\b|microsoft\s?azure|\bazure\b/i, category: "Productivity" },
  { pattern: /digitalocean|linode|hetzner|vultr|ovh/i, category: "Productivity" },
  { pattern: /supabase|firebase|planetscale|mongodb\s?atlas|neon\.tech|upstash|redis\s?cloud/i, category: "Productivity" },
  { pattern: /sentry|datadog|new\s?relic|logrocket|posthog|mixpanel|amplitude|heap\.io/i, category: "Productivity" },
  { pattern: /postman|insomnia|bruno/i, category: "Productivity" },
  { pattern: /cursor\.sh|cursor\s?ai|windsurf|zed\.dev|jetbrains|phpstorm|intellij|webstorm|rider/i, category: "Productivity" },
  { pattern: /raycast|alfred|setapp/i, category: "Productivity" },

  // === Productivity apps ===
  { pattern: /microsoft\s?365|office\s?365|microsoft\s?teams/i, category: "Productivity" },
  { pattern: /google\s?workspace|g\s?suite/i, category: "Productivity" },
  { pattern: /figma/i, category: "Productivity" },
  { pattern: /sketch\.com|sketch\s?app/i, category: "Productivity" },
  { pattern: /notion/i, category: "Productivity" },
  { pattern: /evernote|obsidian|logseq|roam\s?research/i, category: "Productivity" },
  { pattern: /todoist|ticktick|things\s?3|omnifocus|\btasks\b/i, category: "Productivity" },
  { pattern: /asana|trello|jira|linear\.app|monday\.com|clickup|basecamp|wrike|shortcut\.com|height\.app/i, category: "Productivity" },
  { pattern: /airtable|coda\.io|smartsheet|quip/i, category: "Productivity" },
  { pattern: /slack/i, category: "Productivity" },
  { pattern: /discord\s?nitro/i, category: "Productivity" },
  { pattern: /zoom(\.us)?/i, category: "Productivity" },
  { pattern: /webex|gotomeeting/i, category: "Productivity" },
  { pattern: /telegram\s?premium/i, category: "Productivity" },
  { pattern: /calendly|savvycal|cal\.com|doodle/i, category: "Productivity" },
  { pattern: /intercom|zendesk|freshdesk|helpscout/i, category: "Productivity" },
  { pattern: /mailchimp|mailerlite|convertkit|beehiiv|buttondown/i, category: "Productivity" },
  { pattern: /hubspot|salesforce|pipedrive|close\.com|attio/i, category: "Productivity" },
  { pattern: /webflow|framer|wix|squarespace|carrd|ghost\.org/i, category: "Productivity" },
  { pattern: /loom|clickup|miro|whimsical|excalidraw/i, category: "Productivity" },

  // === Cloud & Storage ===
  { pattern: /icloud|apple\s?one/i, category: "Cloud & Storage" },
  { pattern: /google\s?(one|drive)/i, category: "Cloud & Storage" },
  { pattern: /dropbox|box\.com|pcloud|mega\.nz|sync\.com|spideroak|idrive|backblaze/i, category: "Cloud & Storage" },
  { pattern: /onedrive/i, category: "Cloud & Storage" },
  { pattern: /proton\s?(drive|mail|pass|vpn)?/i, category: "Cloud & Storage" },
  { pattern: /tresorit|mega\s?cloud/i, category: "Cloud & Storage" },

  // === Design & Creative ===
  { pattern: /adobe(\s?creative|\s?express|\s?stock|\s?photoshop|\s?lightroom)?/i, category: "Productivity" },
  { pattern: /canva\s?(pro)?/i, category: "Productivity" },
  { pattern: /affinity\s?(designer|photo|publisher|v2)/i, category: "Productivity" },
  { pattern: /final\s?cut\s?pro|logic\s?pro|davinci\s?resolve|capcut\s?pro|filmora|camtasia/i, category: "Productivity" },
  { pattern: /unsplash\+?|shutterstock|istockphoto|envato|epidemic\s?sound|artlist/i, category: "Productivity" },

  // === Gaming ===
  { pattern: /xbox|game\s?pass/i, category: "Gaming" },
  { pattern: /playstation|ps\s?plus|psn/i, category: "Gaming" },
  { pattern: /nintendo/i, category: "Gaming" },
  { pattern: /steam\s?(deck|wallet)?/i, category: "Gaming" },
  { pattern: /epic\s?games|ea\s?play|ubisoft\+?|apple\s?arcade|geforce\s?now|luna\s?premium/i, category: "Gaming" },
  { pattern: /humble\s?(bundle|choice|monthly)/i, category: "Gaming" },
  { pattern: /roblox|minecraft\s?realms|fortnite\s?crew/i, category: "Gaming" },

  // === News & Reading ===
  { pattern: /new\s?york\s?times|\bnyt\b/i, category: "News & Reading" },
  { pattern: /wall\s?street\s?journal|\bwsj\b/i, category: "News & Reading" },
  { pattern: /washington\s?post/i, category: "News & Reading" },
  { pattern: /financial\s?times|\bft\.com\b/i, category: "News & Reading" },
  { pattern: /the\s?economist|bloomberg|reuters|\bguardian\b|the\s?atlantic|new\s?yorker|the\s?athletic|stratechery|the\s?information/i, category: "News & Reading" },
  { pattern: /medium\.com|substack|ghost\s?subscribe|patreon|ko-?fi\.com/i, category: "News & Reading" },
  { pattern: /audible|kindle\s?unlimited|scribd|storytel|blinkist|readwise|instapaper|matter\.app|pocket\s?premium/i, category: "News & Reading" },

  // === Health & Fitness ===
  { pattern: /strava|fitbit/i, category: "Health & Fitness" },
  { pattern: /peloton|apple\s?fitness|nike\s?training|freeletics|future\.co|centr/i, category: "Health & Fitness" },
  { pattern: /calm\.com|headspace|insight\s?timer|balance\.app/i, category: "Health & Fitness" },
  { pattern: /myfitnesspal|lose\s?it|noom|cronometer/i, category: "Health & Fitness" },
  { pattern: /whoop|oura(ring)?|eight\s?sleep/i, category: "Health & Fitness" },
  { pattern: /betterhelp|talkspace|cerebral/i, category: "Health & Fitness" },

  // === Food & Delivery ===
  { pattern: /hellofresh|blue\s?apron|home\s?chef|factor75|every\s?plate|gousto/i, category: "Food & Delivery" },
  { pattern: /doordash|dash\s?pass/i, category: "Food & Delivery" },
  { pattern: /uber\s?(eats|one)|postmates|seamless/i, category: "Food & Delivery" },
  { pattern: /grubhub|deliveroo|wolt|just\s?eat|takeaway|foodpanda|zomato|swiggy/i, category: "Food & Delivery" },
  { pattern: /instacart|gopuff|gorillas\b/i, category: "Food & Delivery" },
  { pattern: /rohlik|kosik|kaufland\s?online/i, category: "Food & Delivery" },
  { pattern: /starbucks\s?rewards?/i, category: "Food & Delivery" },

  // === Password / Security / VPN (Utilities) ===
  { pattern: /1password|lastpass|bitwarden|dashlane|nordpass|keeper\s?security|enpass/i, category: "Utilities" },
  { pattern: /nordvpn|expressvpn|surfshark|protonvpn|mullvad|private\s?internet\s?access|\bpia\b|cyberghost|tunnelbear|windscribe|ivpn/i, category: "Utilities" },
  { pattern: /fastmail|tutanota|tuta\.com|zoho\s?mail|hey\.com/i, category: "Utilities" },
  { pattern: /malwarebytes|bitdefender|eset|norton|mcafee|kaspersky|avast\s?(premium|ultimate)|avg\s?(ultimate|internet)/i, category: "Utilities" },
  { pattern: /cloudflare\s?one|\bwarp\+?\b/i, category: "Utilities" },
  { pattern: /duckduckgo\s?(email|pro)|kagi/i, category: "Utilities" },

  // === Shopping / Membership ===
  { pattern: /amazon\s?prime(\s?membership)?/i, category: "Shopping" },
  { pattern: /walmart\+|costco|sam'?s\s?club|bj'?s\s?wholesale/i, category: "Shopping" },
  { pattern: /alza\s?premium|alza\s?plus/i, category: "Shopping" },
  { pattern: /ebay\s?plus|etsy\s?plus/i, category: "Shopping" },

  // === Transportation ===
  { pattern: /tesla\s?(premium|fsd|connectivity)/i, category: "Utilities" },
  { pattern: /zipcar|turo|liftago\s?premium|bolt\s?plus/i, category: "Utilities" },
  { pattern: /lyft\s?pink|uber\s?one/i, category: "Utilities" },

  // === Telecom / Mobile / Internet ===
  { pattern: /verizon|at\s?&\s?t|t-mobile\s?(magenta|plus)|sprint|boost\s?mobile|cricket\s?wireless|mint\s?mobile|google\s?fi/i, category: "Utilities" },
  { pattern: /\bo2\b\s?(mobil|family|premium)|vodafone\s?red|t-?mobile\s?cz/i, category: "Utilities" },

  // === News (Czech/local) ===
  { pattern: /seznam\s?zpravy|lupa\.cz|hn\.cz|forum24|info\.cz|denik\s?n|aktualne\.cz/i, category: "News & Reading" },
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
