import fs from 'fs'

const svgWrap = (title, subtitle, body, legend) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1600" y2="1000" gradientUnits="userSpaceOnUse">
      <stop stop-color="#120D20"/>
      <stop offset="1" stop-color="#1B2740"/>
    </linearGradient>
    <linearGradient id="titleGlow" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#FF4FD8"/>
      <stop offset="1" stop-color="#22D3EE"/>
    </linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="18"/></filter>
  </defs>
  <rect width="1600" height="1000" rx="32" fill="url(#bg)"/>
  <circle cx="180" cy="140" r="120" fill="#FF4FD8" fill-opacity="0.12" filter="url(#blur)"/>
  <circle cx="1380" cy="150" r="140" fill="#22D3EE" fill-opacity="0.10" filter="url(#blur)"/>
  <text x="90" y="90" fill="#FDFDFF" font-size="46" font-family="Arial, Helvetica, sans-serif" font-weight="700">${title}</text>
  <text x="90" y="132" fill="#AFC0E8" font-size="24" font-family="Arial, Helvetica, sans-serif">${subtitle}</text>
  ${body}
  ${legend}
</svg>`

const legend = `
  <g transform="translate(1120 770)">
    <rect width="380" height="170" rx="24" fill="rgba(8,12,24,0.55)" stroke="rgba(255,255,255,0.12)"/>
    <text x="28" y="40" fill="#FFFFFF" font-size="24" font-family="Arial, Helvetica, sans-serif" font-weight="700">Design key</text>
    <rect x="30" y="62" width="24" height="24" rx="8" fill="#FF9F1C"/><text x="70" y="80" fill="#D6DDF4" font-size="20" font-family="Arial, Helvetica, sans-serif">Food kiosks / active retail</text>
    <rect x="30" y="98" width="24" height="24" rx="8" fill="#2DD4BF"/><text x="70" y="116" fill="#D6DDF4" font-size="20" font-family="Arial, Helvetica, sans-serif">Seating / dwell zone</text>
    <rect x="30" y="134" width="24" height="24" rx="8" fill="#F472B6"/><text x="70" y="152" fill="#D6DDF4" font-size="20" font-family="Arial, Helvetica, sans-serif">Activation / photo / event zone</text>
    <path d="M245 145 C280 130, 320 118, 345 92" stroke="#38BDF8" stroke-width="10" stroke-linecap="round"/>
    <text x="250" y="152" fill="#D6DDF4" font-size="20" font-family="Arial, Helvetica, sans-serif">Primary visitor flow</text>
  </g>`

const gfBody = `
  <g transform="translate(90 190)">
    <rect width="1370" height="500" rx="34" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.16)" stroke-width="3"/>
    <rect x="55" y="50" width="250" height="180" rx="28" fill="#F472B6" fill-opacity="0.22" stroke="#F472B6"/>
    <text x="84" y="122" fill="#FFF" font-size="28" font-family="Arial, Helvetica, sans-serif" font-weight="700">Feature Entry Gate</text>
    <text x="84" y="160" fill="#E6D7F5" font-size="20" font-family="Arial, Helvetica, sans-serif">Neon portal, signature signage, queue-ready arrival</text>

    <rect x="360" y="82" width="860" height="96" rx="26" fill="#FF9F1C" fill-opacity="0.22" stroke="#FF9F1C"/>
    <text x="390" y="140" fill="#FFF" font-size="30" font-family="Arial, Helvetica, sans-serif" font-weight="700">Primary Market Spine</text>
    <text x="390" y="170" fill="#FBE7C3" font-size="20" font-family="Arial, Helvetica, sans-serif">Street-food kiosks, dessert bars, high-visibility retail line</text>

    <rect x="360" y="228" width="310" height="156" rx="26" fill="#2DD4BF" fill-opacity="0.18" stroke="#2DD4BF"/>
    <text x="390" y="288" fill="#FFF" font-size="28" font-family="Arial, Helvetica, sans-serif" font-weight="700">Social Seating Pocket</text>
    <text x="390" y="324" fill="#D4FFF7" font-size="20" font-family="Arial, Helvetica, sans-serif">Flexible tables for snack, pause, and group dwell</text>

    <rect x="710" y="228" width="240" height="156" rx="26" fill="#F472B6" fill-opacity="0.18" stroke="#F472B6"/>
    <text x="740" y="288" fill="#FFF" font-size="28" font-family="Arial, Helvetica, sans-serif" font-weight="700">Live Demo Edge</text>
    <text x="740" y="324" fill="#FBE1F0" font-size="20" font-family="Arial, Helvetica, sans-serif">Chef moments, launch pop-ups, rotating activations</text>

    <rect x="990" y="220" width="230" height="174" rx="100" fill="#38BDF8" fill-opacity="0.20" stroke="#38BDF8" stroke-width="4"/>
    <text x="1038" y="290" fill="#FFF" font-size="28" font-family="Arial, Helvetica, sans-serif" font-weight="700">Escalator Core</text>
    <text x="1028" y="328" fill="#D8F3FF" font-size="20" font-family="Arial, Helvetica, sans-serif">Light feature, level transition, visual anchor</text>

    <rect x="1248" y="76" width="78" height="352" rx="18" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" stroke-dasharray="10 10"/>
    <text x="1220" y="460" fill="#C8D3EF" font-size="18" font-family="Arial, Helvetica, sans-serif">Service / support strip</text>

    <path d="M220 308 C360 306, 520 302, 650 302 C790 302, 900 306, 1065 308" stroke="#38BDF8" stroke-width="16" stroke-linecap="round"/>
    <path d="M1065 308 C1120 308, 1175 290, 1220 246" stroke="#38BDF8" stroke-width="16" stroke-linecap="round"/>

    <circle cx="220" cy="308" r="14" fill="#38BDF8"/>
    <circle cx="650" cy="302" r="14" fill="#38BDF8"/>
    <circle cx="1065" cy="308" r="14" fill="#38BDF8"/>

    <text x="82" y="454" fill="#FFFFFF" font-size="22" font-family="Arial, Helvetica, sans-serif" font-weight="700">Planning intent</text>
    <text x="82" y="488" fill="#C8D3EF" font-size="20" font-family="Arial, Helvetica, sans-serif">Create a clear arrival-to-escalator dining journey that makes every tenancy visible from the main flow.</text>
  </g>`

const l1Body = `
  <g transform="translate(90 190)">
    <rect width="1370" height="500" rx="34" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.16)" stroke-width="3"/>
    <rect x="110" y="120" width="340" height="160" rx="28" fill="#2DD4BF" fill-opacity="0.18" stroke="#2DD4BF"/>
    <text x="144" y="184" fill="#FFF" font-size="28" font-family="Arial, Helvetica, sans-serif" font-weight="700">Main Dining Terrace</text>
    <text x="144" y="220" fill="#D4FFF7" font-size="20" font-family="Arial, Helvetica, sans-serif">Longer-stay seating for families, friends, and shared meals</text>

    <rect x="492" y="86" width="260" height="126" rx="26" fill="#FF9F1C" fill-opacity="0.20" stroke="#FF9F1C"/>
    <text x="526" y="142" fill="#FFF" font-size="28" font-family="Arial, Helvetica, sans-serif" font-weight="700">Dessert + Tea Row</text>
    <text x="526" y="176" fill="#FBE7C3" font-size="20" font-family="Arial, Helvetica, sans-serif">Sweet drinks, dessert theatre, late-night linger</text>

    <rect x="850" y="92" width="250" height="138" rx="26" fill="#F472B6" fill-opacity="0.20" stroke="#F472B6"/>
    <text x="882" y="150" fill="#FFF" font-size="28" font-family="Arial, Helvetica, sans-serif" font-weight="700">Photo Event Zone</text>
    <text x="882" y="184" fill="#FBE1F0" font-size="20" font-family="Arial, Helvetica, sans-serif">Seasonal backdrop, launch moment, social share wall</text>

    <rect x="560" y="250" width="260" height="176" rx="100" fill="#38BDF8" fill-opacity="0.20" stroke="#38BDF8" stroke-width="4"/>
    <text x="606" y="324" fill="#FFF" font-size="28" font-family="Arial, Helvetica, sans-serif" font-weight="700">Escalator Hub</text>
    <text x="594" y="362" fill="#D8F3FF" font-size="20" font-family="Arial, Helvetica, sans-serif">Upper-level reveal and circulation anchor</text>

    <rect x="910" y="286" width="300" height="134" rx="26" fill="#FF9F1C" fill-opacity="0.16" stroke="#FF9F1C" stroke-dasharray="12 10"/>
    <text x="944" y="344" fill="#FFF" font-size="26" font-family="Arial, Helvetica, sans-serif" font-weight="700">Flexible Pop-up Strip</text>
    <text x="944" y="378" fill="#FBE7C3" font-size="19" font-family="Arial, Helvetica, sans-serif">Rotating brands, themed booths, campaign vendor slots</text>

    <path d="M190 330 C320 330, 410 310, 560 310" stroke="#38BDF8" stroke-width="16" stroke-linecap="round"/>
    <path d="M820 310 C900 310, 980 260, 1100 176" stroke="#38BDF8" stroke-width="16" stroke-linecap="round"/>

    <circle cx="190" cy="330" r="14" fill="#38BDF8"/>
    <circle cx="560" cy="310" r="14" fill="#38BDF8"/>
    <circle cx="1100" cy="176" r="14" fill="#38BDF8"/>

    <text x="110" y="456" fill="#FFFFFF" font-size="22" font-family="Arial, Helvetica, sans-serif" font-weight="700">Planning intent</text>
    <text x="110" y="490" fill="#C8D3EF" font-size="20" font-family="Arial, Helvetica, sans-serif">Build a strong upper-level reason to stay with dining, desserts, social moments, and visible festival activity.</text>
  </g>`

fs.writeFileSync('plan-graphics/ground-floor-optimized.svg', svgWrap('Ground Floor Optimisation Plan', 'Burwood Night Market, design-style layout strategy', gfBody, legend))
fs.writeFileSync('plan-graphics/level-1-optimized.svg', svgWrap('Level 1 Optimisation Plan', 'Burwood Night Market, upper-level dining and activation strategy', l1Body, legend))
