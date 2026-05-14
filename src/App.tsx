import { useMemo, useState } from 'react'
import groundFloorOptimized from '../plan-graphics/ground-floor-optimized.svg'
import levelOneOptimized from '../plan-graphics/level-1-optimized.svg'
import './App.css'

type MoodPreset = 'neon-chinatown' | 'family-carnival' | 'festival-premium'
type DeliverableView = 'hero' | 'walkthrough' | 'builder' | 'prompt-lab'

type VideoBeat = {
  title: string
  lens: string
  atmosphere: string
  action: string
  deliverable: string
}

type DesignState = {
  prompt: string
  mood: MoodPreset
  neonIntensity: number
  culturalPattern: number
  familyActivation: number
  foodStallDensity: number
  immersiveLighting: number
  budgetLevel: number
  walkwayWidth: number
  stageEnergy: number
}

type ConceptFrame = {
  title: string
  headline: string
  description: string
  angle: string
  visualFocus: string
  cameraMove: string
  prompt: string
  palette: string[]
  tags: string[]
}

type FeatureCard = {
  title: string
  blurb: string
  accent: string
}

type PlanUpgrade = {
  title: string
  level: string
  summary: string
  move: string
  benefit: string
  tags: string[]
  image: string
}

type WalkthroughHotspot = {
  title: string
  duration: string
  detail: string
}

const moodLabels: Record<MoodPreset, string> = {
  'neon-chinatown': 'Neon Chinatown Night Market',
  'family-carnival': 'Family Carnival Food Playground',
  'festival-premium': 'Festival Premium Entertainment Precinct',
}

const basePrompt =
  'Burwood Night Market, iconic neon food destination, cinematic Chinatown atmosphere, premium night dining, energetic walkway experiences, immersive family-friendly entertainment, polished architectural visualisation'

const initialState: DesignState = {
  prompt: basePrompt,
  mood: 'neon-chinatown',
  neonIntensity: 84,
  culturalPattern: 72,
  familyActivation: 62,
  foodStallDensity: 76,
  immersiveLighting: 88,
  budgetLevel: 74,
  walkwayWidth: 60,
  stageEnergy: 70,
}

const featureCards: FeatureCard[] = [
  {
    title: '100+ late-night flavours',
    blurb: 'Street snacks, signature noodles, dessert bars, and after-dark treats all in one glowing destination.',
    accent: 'pink',
  },
  {
    title: 'Live music and weekend buzz',
    blurb: 'A walk-through precinct that feels alive with performance pockets, social moments, and festival energy.',
    accent: 'orange',
  },
  {
    title: 'Family-friendly night out',
    blurb: 'Easy circulation, playful moments, and photo-friendly attractions for every age group.',
    accent: 'cyan',
  },
]

const planUpgrades: PlanUpgrade[] = [
  {
    title: 'Ground Floor Market Spine',
    level: 'Ground Floor',
    summary: 'Turn the long retail strip into a clear night-market promenade with kiosks, signature signage, and an arrival-to-escalator food trail.',
    move: 'Create a centreline flow with food kiosks on both sides, a stronger front entry identity, and visible feature lighting drawing people toward the escalator.',
    benefit: 'Makes the whole floor feel active from the street and gives every tenancy better exposure.',
    tags: ['arrival magnet', 'kiosk rhythm', 'frontage activation'],
    image: groundFloorOptimized,
  },
  {
    title: 'Escalator Glow Core',
    level: 'Ground + Level 1',
    summary: 'Use the escalator as the visual anchor so movement between levels feels like part of the attraction.',
    move: 'Wrap the escalator zone with hanging lanterns, digital signage, and overhead feature lighting that can be seen from multiple viewpoints.',
    benefit: 'Improves vertical movement and creates a memorable social-media moment in the middle of the venue.',
    tags: ['vertical reveal', 'light feature', 'social hotspot'],
    image: groundFloorOptimized,
  },
  {
    title: 'Level 1 Dining Cluster',
    level: 'Level 1',
    summary: 'Consolidate seating, service, and late-night snack offers into a stronger dining destination around the upper circulation zone.',
    move: 'Introduce clustered seating, dessert counters, and a compact live-performance or busking edge near the open areas.',
    benefit: 'Keeps people upstairs longer and creates a second energy zone instead of a pass-through level.',
    tags: ['upper-level dwell', 'dessert zone', 'late-night seating'],
    image: levelOneOptimized,
  },
  {
    title: 'Family Photo + Festival Corner',
    level: 'Level 1',
    summary: 'Reserve one highlighted pocket for family-friendly attraction pieces and seasonal campaign moments.',
    move: 'Build a photo wall, festival backdrop, and flexible activation corner that can change for launches, holidays, or themed nights.',
    benefit: 'Adds repeat-visit value and gives the market a shareable identity beyond food alone.',
    tags: ['campaign corner', 'family drawcard', 'repeat visits'],
    image: levelOneOptimized,
  },
]

const sliderCopy = {
  neonIntensity: 'Neon intensity',
  culturalPattern: 'Cultural pattern density',
  familyActivation: 'Family activation level',
  foodStallDensity: 'Food stall density',
  immersiveLighting: 'Immersive lighting',
  budgetLevel: 'Budget ambition',
  walkwayWidth: 'Walkway openness',
  stageEnergy: 'Performance energy',
} as const

const walkthroughHotspots: WalkthroughHotspot[] = [
  {
    title: 'Gateway arrival shot',
    duration: '0:00 - 0:08',
    detail: 'Street-to-entry reveal with neon arch, signage glow, and first food cues pulling people in.',
  },
  {
    title: 'Ground floor market spine',
    duration: '0:08 - 0:20',
    detail: 'Forward motion through the kiosk corridor, showing steam, queues, lights, and late-night social energy.',
  },
  {
    title: 'Escalator glow transition',
    duration: '0:20 - 0:30',
    detail: 'A vertical hero moment with lanterns, overhead lighting, and a wider precinct reveal.',
  },
  {
    title: 'Level 1 dining + photo zone',
    duration: '0:30 - 0:40',
    detail: 'Dessert bars, seating clusters, and a high-shareability campaign corner working together.',
  },
  {
    title: 'Final destination-wide close',
    duration: '0:40 - 0:48',
    detail: 'Big finishing frame showing both levels as one bright, active, must-visit night destination.',
  },
]

const videoBeats: VideoBeat[] = [
  {
    title: 'Street arrival hero',
    lens: '24mm establishing shot',
    atmosphere: 'Glowing entry arch, lantern rhythm, warm dusk sky, first crowds arriving',
    action: 'Camera glides from footpath into the market threshold as signage and food cues come alive.',
    deliverable: 'Use as the opening hero frame and first 8 seconds of the cut.',
  },
  {
    title: 'Market spine energy',
    lens: '35mm forward tracking',
    atmosphere: 'Steam, queues, grill fire, side seating, bright stall markers',
    action: 'Move down the ground-floor food corridor with layered pedestrian motion and food theatre on both sides.',
    deliverable: 'Primary movement section for the middle of the film.',
  },
  {
    title: 'Escalator reveal',
    lens: 'Wide atrium lift shot',
    atmosphere: 'Feature lighting, hanging décor, vertical reveal to upper level activity',
    action: 'Rise with the escalator and widen to show the venue turning into one connected destination.',
    deliverable: 'Signature transition beat and most shareable motion shot.',
  },
  {
    title: 'Dining finale',
    lens: '50mm lifestyle close and wide pull-back',
    atmosphere: 'Dessert counters, family groups, photo wall, lively upper-level seating',
    action: 'Land in the level 1 zone, then finish on a broad destination-wide closing shot.',
    deliverable: 'Closing beat plus thumbnail-ready final frame.',
  },
]

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value))
}

function App() {
  const [design, setDesign] = useState<DesignState>(initialState)
  const [view, setView] = useState<DeliverableView>('walkthrough')

  const scoreCard = useMemo(() => {
    const foodBuzz = clamp(
      design.neonIntensity * 0.22 +
        design.immersiveLighting * 0.18 +
        design.foodStallDensity * 0.26 +
        design.stageEnergy * 0.18 +
        design.culturalPattern * 0.16,
    )

    const familyAppeal = clamp(
      design.familyActivation * 0.4 +
        design.walkwayWidth * 0.2 +
        design.foodStallDensity * 0.15 +
        design.immersiveLighting * 0.1 +
        design.stageEnergy * 0.15,
    )

    const nightEnergy = clamp(
      design.stageEnergy * 0.34 +
        design.neonIntensity * 0.26 +
        design.immersiveLighting * 0.2 +
        design.culturalPattern * 0.2,
    )

    return {
      foodBuzz: Math.round(foodBuzz),
      familyAppeal: Math.round(familyAppeal),
      nightEnergy: Math.round(nightEnergy),
    }
  }, [design])

  const livePrompt = useMemo(() => {
    const moodSentence =
      design.mood === 'neon-chinatown'
        ? 'electric Chinatown night market mood with magenta glow, animated signs, lantern rhythm, and busy dining lanes'
        : design.mood === 'family-carnival'
          ? 'playful all-ages night market with bright attractions, lively food stalls, open circulation, and friendly entertainment energy'
          : 'premium festival-style hospitality destination with sleek lighting, polished materials, destination dining, and elevated event drama'

    return [
      design.prompt,
      `Mood direction: ${moodSentence}.`,
      `Neon intensity ${design.neonIntensity}/100.`,
      `Cultural pattern density ${design.culturalPattern}/100 with lantern runs, Chinatown-inspired details, glowing murals, and premium signage.`,
      `Family activation ${design.familyActivation}/100 with interactive play, seating pockets, and crowd-friendly circulation.`,
      `Food stall density ${design.foodStallDensity}/100 with layered kiosks, dessert corners, grill smoke, and social dining clusters.`,
      `Immersive lighting ${design.immersiveLighting}/100 for cinematic night atmosphere and vibrant photography moments.`,
      `Budget ambition ${design.budgetLevel}/100 balancing wow factor and buildable feature moments.`,
      `Walkway openness ${design.walkwayWidth}/100 to keep the market feeling busy but comfortable.`,
      `Performance energy ${design.stageEnergy}/100 with buskers, projection moments, and weekend stage atmosphere.`,
      'Architectural concept render, glossy campaign-ready presentation image, exciting but believable visitor atmosphere, no direct reuse of source photos.',
    ].join(' ')
  }, [design])

  const conceptFrames = useMemo<ConceptFrame[]>(() => {
    const familyMode = design.familyActivation > 60 ? 'strong family activity near upper level attractions' : 'lighter family moments around dining edges'
    const stageMode = design.stageEnergy > 68 ? 'visible live music and performance glow' : 'social dining with ambient movement and subtle event cues'

    return [
      {
        title: 'Gateway Arrival',
        headline: 'Step into Burwood’s brightest food adventure',
        description: 'A high-impact entrance concept with bold neon, layered lanterns, and a queue-friendly social arrival moment.',
        angle: 'Hero street view from the front entry',
        visualFocus: 'Iconic gateway arch, animated signs, crowd magnet frontage',
        cameraMove: 'Slow cinematic push from the footpath into the market',
        prompt: `${livePrompt} Focus on a spectacular market entrance with glowing gateway arch, premium event atmosphere, crowded but inviting threshold.`,
        palette: ['#ff4fd8', '#ff8a34', '#4f46e5'],
        tags: ['entry icon', 'night glow', 'street magnet'],
      },
      {
        title: 'Dining Laneway',
        headline: 'Follow the smoke, lights, and late-night flavour',
        description: 'The central dining spine packed with food theatre, colourful seating, and social energy from every angle.',
        angle: 'Wide interior shot through the dining corridor',
        visualFocus: 'Food kiosks, open kitchens, lantern canopies, crowd energy',
        cameraMove: 'Side glide through stalls, then settle on a dining cluster',
        prompt: `${livePrompt} Focus on rich dining laneway, ${stageMode}, warm food lighting, layered signage, animated hospitality energy.`,
        palette: ['#ff7a18', '#ff3cac', '#784ba0'],
        tags: ['food theatre', 'late-night vibe', 'crowd pulse'],
      },
      {
        title: 'Escalator Reveal',
        headline: 'Every level feels like part of the show',
        description: 'A vertical reveal sequence that turns circulation into an attraction, with hanging décor and dramatic light trails.',
        angle: 'Atrium scene across escalators and upper-level overlook',
        visualFocus: 'Suspended décor, upward motion, layered visibility',
        cameraMove: 'Lift with the escalator and reveal the full market in one shot',
        prompt: `${livePrompt} Focus on escalator reveal, suspended neon ribbons, immersive ceiling treatment, cinematic upward movement, ${familyMode}.`,
        palette: ['#00dbde', '#6a11cb', '#fc466b'],
        tags: ['vertical wow', 'atrium theatre', 'walk-in reveal'],
      },
      {
        title: 'Festival Photo Spot',
        headline: 'Grab the photo everyone will post tonight',
        description: 'A high-shareability campaign zone designed for selfies, group shots, and seasonal event overlays.',
        angle: 'Front-facing portrait composition',
        visualFocus: 'Interactive sign wall, spotlight glow, celebratory backdrop',
        cameraMove: 'Short dolly-in to a perfect social sharing frame',
        prompt: `${livePrompt} Focus on viral photo moment, eye-catching lighting, festival-ready backdrop, branded visitor hotspot.`,
        palette: ['#f9d423', '#ff4e50', '#7f00ff'],
        tags: ['photo hotspot', 'shareable', 'festival scene'],
      },
    ]
  }, [design, livePrompt])

  const walkthroughScript = useMemo(
    () => [
      'Scene 01. Open outside the venue at dusk with the glowing gateway pulling families and friend groups in from the street edge.',
      'Scene 02. Cross the threshold and reveal the ground-floor market spine, with food kiosks, steam, signage, and fast-moving late-night energy on both sides.',
      'Scene 03. Use the escalator core as the hero transition shot, lifting the camera through hanging lights into a wider destination reveal.',
      'Scene 04. Pan across level 1 dining, dessert-and-tea moments, and a social backdrop zone where people stop, stay, and take photos.',
      'Scene 05. Finish on a big destination frame showing both levels working together as one bright, memorable, must-visit night market.',
    ],
    [],
  )

  const builderNotes = useMemo(
    () => [
      `Design ambition is currently ${design.budgetLevel >= 75 ? 'premium and destination-led' : design.budgetLevel >= 55 ? 'mid-premium and event-friendly' : 'leaner and more tactical'} with lighting as a major identity tool.`,
      `${design.walkwayWidth >= 60 ? 'Keep circulation broad enough for families, queues, and slow social browsing.' : 'Review crowd pinch points carefully so busy food zones still feel comfortable.'}`,
      `${design.neonIntensity >= 80 ? 'Neon, LED signage, and façade glow should be coordinated early as a signature package.' : 'Lighting can stay expressive but needs tighter cost and maintenance control.'}`,
      `${design.familyActivation >= 60 ? 'Include safe touchpoints, flexible seating, and a family-friendly pause zone near key attractions.' : 'Keep family use secondary to dining and event energy.'}`,
      'The uploaded floor plans suggest a strong opportunity to organise the ground floor as a linear arrival market and the upper floor as a dining and activation layer around the escalator reveal.',
      'If an interactive 3D walk-through is needed, reserve a PlayCanvas scene for the gateway, dining lane, escalator reveal, and photo zone as four navigable hotspots.',
    ],
    [design],
  )

  const setSlider = (key: keyof Omit<DesignState, 'prompt' | 'mood'>, value: number) => {
    setDesign((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="design-site">
      <header className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Burwood Night Market</span>
          <h1>Eat late, wander longer, and find the brightest night in Burwood</h1>
          <p>
            Street food, glowing laneways, family fun, live moments, and photo-worthy corners all come together in one unforgettable night market experience.
          </p>
          <div className="hero-actions">
            <button onClick={() => setView('hero')}>Explore the highlights</button>
            <button className="secondary" onClick={() => setView('walkthrough')}>
              Watch the walk-in story
            </button>
          </div>
        </div>
        <div className="hero-card showcase-card">
          <div className="showcase-art">
            <div className="light-orb orb-one" />
            <div className="light-orb orb-two" />
            <div className="light-orb orb-three" />
            <div className="market-skyline">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="hero-card-body">
            <strong>{moodLabels[design.mood]}</strong>
            <span>Food. Lights. Music. Family fun. The kind of place you spot once and immediately want to walk into.</span>
          </div>
        </div>
      </header>

      <section className="feature-strip">
        {featureCards.map((card) => (
          <article key={card.title} className={`feature-card ${card.accent}`}>
            <h2>{card.title}</h2>
            <p>{card.blurb}</p>
          </article>
        ))}
      </section>

      <section className="score-strip">
        <article>
          <span>Food buzz</span>
          <strong>{scoreCard.foodBuzz}</strong>
        </article>
        <article>
          <span>Family appeal</span>
          <strong>{scoreCard.familyAppeal}</strong>
        </article>
        <article>
          <span>Night energy</span>
          <strong>{scoreCard.nightEnergy}</strong>
        </article>
      </section>

      <section className="toolbar">
        <div className="view-tabs">
          {[
            ['walkthrough', 'Walk-in video'],
            ['hero', 'Highlights'],
            ['builder', 'Build notes'],
            ['prompt-lab', 'Prompt editor'],
          ].map(([key, label]) => (
            <button
              key={key}
              className={view === key ? 'active' : ''}
              onClick={() => setView(key as DeliverableView)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="preset-switcher">
          {(
            [
              ['neon-chinatown', 'Neon Chinatown'],
              ['family-carnival', 'Family Carnival'],
              ['festival-premium', 'Festival Premium'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              className={design.mood === key ? 'active' : ''}
              onClick={() => setDesign((current) => ({ ...current, mood: key }))}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="workspace-grid">
        <aside className="control-panel">
          <div className="panel-header">
            <h2>Experience tuning</h2>
            <p>Adjust the destination mood, then reuse the live prompt for concept renders, hero images, or future campaign content.</p>
          </div>

          <label className="prompt-block">
            <span>Master prompt</span>
            <textarea
              value={design.prompt}
              onChange={(event) => setDesign((current) => ({ ...current, prompt: event.target.value }))}
              rows={8}
            />
          </label>

          <div className="sliders">
            {(Object.keys(sliderCopy) as Array<keyof typeof sliderCopy>).map((key) => (
              <label key={key} className="slider-row">
                <div>
                  <span>{sliderCopy[key]}</span>
                  <strong>{design[key]}</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={design[key]}
                  onChange={(event) => setSlider(key, Number(event.target.value))}
                />
              </label>
            ))}
          </div>
        </aside>

        <main className="preview-panel">
          {view === 'hero' && (
            <div className="design-board">
              <div className="section-title">
                <h2>Concept art boards</h2>
                <p>Marketing-style concept visuals that sell the atmosphere, arrival energy, food buzz, and shareable moments of the Burwood night market vision.</p>
              </div>
              <div className="concept-grid">
                {conceptFrames.map((frame) => (
                  <article key={frame.title} className="concept-card">
                    <div className="concept-visual" aria-hidden="true">
                      <div className="concept-art" style={{ background: `linear-gradient(135deg, ${frame.palette.join(', ')})` }}>
                        <div className="art-glow" />
                        <div className="art-lantern-row">
                          <span />
                          <span />
                          <span />
                          <span />
                        </div>
                        <div className="art-silhouette" />
                      </div>
                      <div className="concept-tags">
                        {frame.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="concept-card-body">
                      <small className="card-kicker">{frame.title}</small>
                      <h3>{frame.headline}</h3>
                      <p>{frame.description}</p>
                      <ul>
                        <li><strong>Angle:</strong> {frame.angle}</li>
                        <li><strong>Focus:</strong> {frame.visualFocus}</li>
                        <li><strong>Camera move:</strong> {frame.cameraMove}</li>
                      </ul>
                      <details>
                        <summary>Image prompt</summary>
                        <p>{frame.prompt}</p>
                      </details>
                    </div>
                  </article>
                ))}
              </div>

              <div className="section-title section-spaced">
                <h2>Design optimisation boards</h2>
                <p>Concept-driven design boards derived from the floor plans, showing how the venue can be reorganised into a stronger night market destination without publishing the original raw plans.</p>
              </div>
              <div className="design-proof-strip">
                <article>
                  <strong>Real design boards included</strong>
                  <p>These are not placeholders. The two plan graphics below are the actual optimised venue diagrams now published on the live site.</p>
                </article>
                <article>
                  <strong>Ground floor focus</strong>
                  <p>Arrival identity, kiosk rhythm, and stronger pull from the street edge toward the escalator core.</p>
                </article>
                <article>
                  <strong>Level 1 focus</strong>
                  <p>Dining dwell time, family photo moments, dessert clustering, and a clearer second energy zone.</p>
                </article>
              </div>
              <div className="upgrade-grid">
                {planUpgrades.map((plan) => (
                  <article key={plan.title} className="upgrade-card">
                    <div className="upgrade-visual">
                      <img src={plan.image} alt={`${plan.title} design optimisation plan`} className="upgrade-image" />
                    </div>
                    <div className="concept-card-body">
                      <small className="card-kicker">{plan.level}</small>
                      <h3>{plan.title}</h3>
                      <p>{plan.summary}</p>
                      <ul>
                        <li><strong>Design move:</strong> {plan.move}</li>
                        <li><strong>Visitor benefit:</strong> {plan.benefit}</li>
                      </ul>
                      <div className="concept-tags">
                        {plan.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {view === 'walkthrough' && (
            <div className="walkthrough-board">
              <div className="section-title">
                <h2>Walk-in video + PlayCanvas prototype</h2>
                <p>A defined walk-through deliverable for a 48-second concept film now, with a PlayCanvas-ready hotspot structure for a browser demo next.</p>
              </div>
              <div className="walkthrough-promo">
                <div className="walkthrough-player">
                  <div className="player-status">
                    <span className="status-dot" aria-hidden="true" />
                    Video deliverable status: treatment, shot list, and keyframes ready for production
                  </div>
                  <div className="player-screen">
                    <div className="player-overlay">
                      <span className="player-badge">48 sec concept film</span>
                      <h3>Burwood Night Market walk-in experience</h3>
                      <p>Entry glow, market spine energy, escalator reveal, upper dining atmosphere, and a final destination-wide hero close.</p>
                    </div>
                    <div className="player-play" aria-hidden="true">▶</div>
                  </div>
                  <div className="video-deliverable-copy">
                    <strong>What is live right now</strong>
                    <p>The site now includes the real video treatment, the exact scene order, and four production-ready keyframe directions. The final rendered film still needs to be produced separately.</p>
                  </div>
                </div>
                <div className="walkthrough-side">
                  <div className="deliverable-note">
                    <small className="card-kicker">Production intent</small>
                    <h3>What this video should sell</h3>
                    <ul>
                      <li>Show the project as a real family-and-friends night destination, not only a plan drawing.</li>
                      <li>Connect ground floor food energy and level 1 dwell time in one smooth cinematic route.</li>
                      <li>Give stakeholders a ready treatment for AI film output or a later PlayCanvas build.</li>
                    </ul>
                    <div className="playcanvas-cta">
                      <strong>PlayCanvas next step</strong>
                      <p>Use the official PlayCanvas toolchain to turn these five beats into a lightweight browser walk-through with clickable hotspots, camera rails, and ambient sound.</p>
                      <a href="https://github.com/playcanvas" target="_blank" rel="noreferrer">Open PlayCanvas resources</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="video-hero">
                <div className="storyboard-panel">
                  <div className="storyboard-frame frame-one"><span>Street arrival</span></div>
                  <div className="storyboard-frame frame-two"><span>Market spine</span></div>
                  <div className="storyboard-frame frame-three"><span>Escalator lift</span></div>
                  <div className="storyboard-frame frame-four"><span>Dining finale</span></div>
                </div>
                <div>
                  <h3>Video direction</h3>
                  <p>
                    Produce this as a smooth night-time walk-through with cinematic camera motion, warm food theatre, glowing signage,
                    active crowd movement, and a closing festival-style hero shot that feels ready for launch marketing.
                  </p>
                  <ol>
                    {walkthroughScript.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ol>
                  <div className="playcanvas-note">
                    <strong>PlayCanvas option</strong>
                    <p>Use these scenes as the first hotspot map for a browser walk-through, guided fly-through, or click-to-explore demo.</p>
                  </div>
                  <div className="video-beat-list">
                    {videoBeats.map((beat) => (
                      <article key={beat.title}>
                        <small>{beat.lens}</small>
                        <strong>{beat.title}</strong>
                        <p><strong>Atmosphere:</strong> {beat.atmosphere}</p>
                        <p><strong>Action:</strong> {beat.action}</p>
                        <p><strong>Deliverable:</strong> {beat.deliverable}</p>
                      </article>
                    ))}
                  </div>
                  <div className="hotspot-list">
                    {walkthroughHotspots.map((spot) => (
                      <article key={spot.title}>
                        <small>{spot.duration}</small>
                        <strong>{spot.title}</strong>
                        <p>{spot.detail}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'builder' && (
            <div className="builder-board">
              <div className="section-title">
                <h2>Build notes</h2>
                <p>Key translation points from eye-catching night market concept into a coordinated build package.</p>
              </div>
              <div className="builder-layout">
                <div className="builder-diagram">
                  <div className="diagram-band top">Gateway lighting and arrival signage</div>
                  <div className="diagram-band middle">Dining lane, kiosks, and social seating spine</div>
                  <div className="diagram-band bottom">Escalator reveal zone and family-friendly attraction edge</div>
                </div>
                <div className="builder-notes">
                  {builderNotes.map((note) => (
                    <article key={note}>
                      <strong>Coordination note</strong>
                      <p>{note}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === 'prompt-lab' && (
            <div className="prompt-lab">
              <div className="section-title">
                <h2>Render prompt studio</h2>
                <p>Use this to generate stronger concept images, walk-through keyframes, or future motion tests.</p>
              </div>
              <div className="prompt-layout">
                <div className="prompt-preview">
                  <h3>Live render prompt</h3>
                  <pre>{livePrompt}</pre>
                </div>
                <div className="prompt-reference">
                  <h3>Creative output targets</h3>
                  <div className="mini-gallery">
                    {conceptFrames.map((frame) => (
                      <article key={frame.title}>
                        <div className="mini-palette" aria-hidden="true">
                          {frame.palette.map((chip) => (
                            <span key={chip} style={{ background: chip }} />
                          ))}
                        </div>
                        <div>
                          <strong>{frame.title}</strong>
                          <span>{frame.headline}</span>
                          <small>{frame.tags.join(' · ')}</small>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </section>
    </div>
  )
}

export default App
