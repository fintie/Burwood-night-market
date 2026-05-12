import fs from 'fs'

const page = ({ title, subtitle, body, notes }) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1800" height="1100" viewBox="0 0 1800 1100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1800" y2="1100" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0E0B18"/>
      <stop offset="1" stop-color="#182842"/>
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#1D1530"/>
      <stop offset="1" stop-color="#16243C"/>
    </linearGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="24"/></filter>
  </defs>
  <rect width="1800" height="1100" rx="36" fill="url(#bg)"/>
  <circle cx="160" cy="130" r="130" fill="#F472B6" fill-opacity="0.12" filter="url(#soft)"/>
  <circle cx="1530" cy="120" r="150" fill="#22D3EE" fill-opacity="0.10" filter="url(#soft)"/>
  <text x="90" y="88" fill="#FAFBFF" font-size="48" font-family="Arial, Helvetica, sans-serif" font-weight="700">${title}</text>
  <text x="90" y="130" fill="#AFC0E8" font-size="24" font-family="Arial, Helvetica, sans-serif">${subtitle}</text>
  <g transform="translate(70 180)">
    <rect width="1140" height="760" rx="34" fill="url(#panel)" stroke="rgba(255,255,255,0.16)" stroke-width="2"/>
    ${body}
  </g>
  <g transform="translate(1240 180)">
    <rect width="490" height="760" rx="32" fill="rgba(10,14,25,0.55)" stroke="rgba(255,255,255,0.12)"/>
    <text x="34" y="52" fill="#FFFFFF" font-size="28" font-family="Arial, Helvetica, sans-serif" font-weight="700">Design legend</text>
    <rect x="36" y="86" width="28" height="28" rx="8" fill="#FFB020"/><text x="82" y="107" fill="#D7E0F7" font-size="21" font-family="Arial, Helvetica, sans-serif">Food kiosks / active frontage</text>
    <rect x="36" y="128" width="28" height="28" rx="8" fill="#22C7A8"/><text x="82" y="149" fill="#D7E0F7" font-size="21" font-family="Arial, Helvetica, sans-serif">Dining / seating dwell zone</text>
    <rect x="36" y="170" width="28" height="28" rx="8" fill="#F472B6"/><text x="82" y="191" fill="#D7E0F7" font-size="21" font-family="Arial, Helvetica, sans-serif">Activation / photo / event zone</text>
    <rect x="36" y="212" width="28" height="28" rx="8" fill="#38BDF8"/><text x="82" y="233" fill="#D7E0F7" font-size="21" font-family="Arial, Helvetica, sans-serif">Escalator / circulation anchor</text>
    <path d="M40 286 C100 286, 140 270, 188 246" stroke="#38BDF8" stroke-width="10" stroke-linecap="round"/>
    <text x="212" y="286" fill="#D7E0F7" font-size="21" font-family="Arial, Helvetica, sans-serif">Primary visitor movement</text>
    <text x="34" y="350" fill="#FFFFFF" font-size="28" font-family="Arial, Helvetica, sans-serif" font-weight="700">Planning notes</text>
    ${notes}
  </g>
</svg>`

const noteBlock = (items) => items.map((item, index) => `
  <circle cx="48" cy="${404 + index * 88}" r="6" fill="#FFB020"/>
  <text x="68" y="${412 + index * 88}" fill="#F6F8FF" font-size="22" font-family="Arial, Helvetica, sans-serif" font-weight="700">${item.title}</text>
  <text x="68" y="${444 + index * 88}" fill="#B8C7E9" font-size="19" font-family="Arial, Helvetica, sans-serif">${item.body}</text>
`).join('')

const label = (x, y, title, body, color) => `
  <g>
    <rect x="${x}" y="${y}" width="290" height="88" rx="18" fill="rgba(7,10,18,0.72)" stroke="${color}"/>
    <text x="${x + 18}" y="${y + 34}" fill="#FFFFFF" font-size="24" font-family="Arial, Helvetica, sans-serif" font-weight="700">${title}</text>
    <text x="${x + 18}" y="${y + 62}" fill="#D9E3F9" font-size="18" font-family="Arial, Helvetica, sans-serif">${body}</text>
  </g>`

const gfBody = `
  <rect x="54" y="58" width="1028" height="630" rx="26" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.14)" stroke-width="2"/>
  <rect x="88" y="132" width="190" height="126" rx="24" fill="#F472B6" fill-opacity="0.24" stroke="#F472B6" stroke-width="2"/>
  <rect x="326" y="132" width="560" height="84" rx="22" fill="#FFB020" fill-opacity="0.24" stroke="#FFB020" stroke-width="2"/>
  <rect x="326" y="254" width="268" height="150" rx="24" fill="#22C7A8" fill-opacity="0.20" stroke="#22C7A8" stroke-width="2"/>
  <rect x="630" y="254" width="220" height="150" rx="24" fill="#F472B6" fill-opacity="0.18" stroke="#F472B6" stroke-width="2"/>
  <rect x="892" y="224" width="132" height="186" rx="66" fill="#38BDF8" fill-opacity="0.22" stroke="#38BDF8" stroke-width="3"/>
  <rect x="928" y="92" width="106" height="92" rx="22" fill="#FFB020" fill-opacity="0.18" stroke="#FFB020" stroke-dasharray="10 10"/>
  <rect x="88" y="446" width="946" height="186" rx="24" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.09)" stroke-dasharray="10 12"/>
  <path d="M185 320 C320 320, 460 318, 602 318 C706 318, 810 320, 956 320" stroke="#38BDF8" stroke-width="16" stroke-linecap="round"/>
  <path d="M956 320 C996 320, 1030 294, 1060 246" stroke="#38BDF8" stroke-width="16" stroke-linecap="round"/>
  <circle cx="185" cy="320" r="12" fill="#38BDF8"/>
  <circle cx="602" cy="318" r="12" fill="#38BDF8"/>
  <circle cx="956" cy="320" r="12" fill="#38BDF8"/>
  <text x="100" y="486" fill="#FFFFFF" font-size="24" font-family="Arial, Helvetica, sans-serif" font-weight="700">Operational layering</text>
  <text x="100" y="524" fill="#C8D3EF" font-size="20" font-family="Arial, Helvetica, sans-serif">Backfill this strip with visible support retail, queue spill control, and secondary merch moments so the floor stays active edge-to-edge.</text>
  ${label(70, 22, 'Feature entry gate', 'Street-facing neon arrival and sign moment', '#F472B6')}
  ${label(338, 22, 'Primary market spine', 'High-traffic kiosk and food frontage run', '#FFB020')}
  ${label(316, 416, 'Social seating pocket', 'Pause, share, and family dwell zone', '#22C7A8')}
  ${label(618, 416, 'Activation strip', 'Demo, pop-up, and festival programming edge', '#F472B6')}
  ${label(834, 438, 'Escalator core', 'Vertical circulation and reveal anchor', '#38BDF8')}
`

const l1Body = `
  <rect x="54" y="58" width="1028" height="630" rx="26" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.14)" stroke-width="2"/>
  <rect x="114" y="158" width="328" height="162" rx="24" fill="#22C7A8" fill-opacity="0.22" stroke="#22C7A8" stroke-width="2"/>
  <rect x="490" y="122" width="242" height="116" rx="24" fill="#FFB020" fill-opacity="0.22" stroke="#FFB020" stroke-width="2"/>
  <rect x="792" y="126" width="236" height="130" rx="24" fill="#F472B6" fill-opacity="0.20" stroke="#F472B6" stroke-width="2"/>
  <rect x="520" y="284" width="210" height="176" rx="80" fill="#38BDF8" fill-opacity="0.22" stroke="#38BDF8" stroke-width="3"/>
  <rect x="812" y="316" width="244" height="120" rx="24" fill="#FFB020" fill-opacity="0.16" stroke="#FFB020" stroke-dasharray="10 10"/>
  <rect x="116" y="480" width="914" height="126" rx="24" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.09)" stroke-dasharray="10 12"/>
  <path d="M176 364 C286 364, 400 346, 520 338" stroke="#38BDF8" stroke-width="16" stroke-linecap="round"/>
  <path d="M730 338 C834 338, 922 286, 1010 202" stroke="#38BDF8" stroke-width="16" stroke-linecap="round"/>
  <circle cx="176" cy="364" r="12" fill="#38BDF8"/>
  <circle cx="520" cy="338" r="12" fill="#38BDF8"/>
  <circle cx="1010" cy="202" r="12" fill="#38BDF8"/>
  <text x="130" y="524" fill="#FFFFFF" font-size="24" font-family="Arial, Helvetica, sans-serif" font-weight="700">Upper-level strategy</text>
  <text x="130" y="560" fill="#C8D3EF" font-size="20" font-family="Arial, Helvetica, sans-serif">Make level 1 a destination, not a pass-through, by clustering dining, dessert theatre, and social-share moments around the circulation core.</text>
  ${label(86, 42, 'Main dining terrace', 'Flexible seating for longer stays and family groups', '#22C7A8')}
  ${label(462, 28, 'Dessert + tea row', 'Late-night drinks, sweets, and queue theatre', '#FFB020')}
  ${label(766, 24, 'Photo event zone', 'Seasonal backdrops and campaign activation', '#F472B6')}
  ${label(472, 474, 'Escalator hub', 'Upper reveal and circulation anchor', '#38BDF8')}
  ${label(790, 462, 'Flexible pop-up strip', 'Rotating vendors and themed booths', '#FFB020')}
`

const gfNotes = noteBlock([
  { title: 'Arrival sequencing', body: 'Front-load identity and glow so the market reads from outside before customers enter.' },
  { title: 'Commercial visibility', body: 'Keep the spine continuous so food tenants benefit from the same primary walk path.' },
  { title: 'Escalator conversion', body: 'Turn the vertical connection into a reason to continue upstairs rather than leave.' },
])

const l1Notes = noteBlock([
  { title: 'Dwell time uplift', body: 'Seat clusters and dessert offers should encourage second-round spending and social pause.' },
  { title: 'Campaign flexibility', body: 'The event/photo zone should support launches, seasonal dressing, and branded content.' },
  { title: 'Level identity', body: 'Differentiate level 1 as a richer stay-and-share environment, not only overflow circulation.' },
])

fs.writeFileSync('/Users/nic/.openclaw/workspace/burwood-night-market/plan-graphics/ground-floor-optimized.svg', page({
  title: 'Ground Floor Optimisation Plan',
  subtitle: 'Burwood Night Market, refined layout and circulation strategy',
  body: gfBody,
  notes: gfNotes,
}))

fs.writeFileSync('/Users/nic/.openclaw/workspace/burwood-night-market/plan-graphics/level-1-optimized.svg', page({
  title: 'Level 1 Optimisation Plan',
  subtitle: 'Burwood Night Market, refined upper-level dining and activation strategy',
  body: l1Body,
  notes: l1Notes,
}))
