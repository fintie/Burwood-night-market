import { useMemo, useState } from 'react'
import './App.css'

type MoodPreset = 'neon-chinatown' | 'family-carnival' | 'festival-premium'
type DeliverableView = 'hero' | 'walkthrough' | 'builder' | 'prompt-lab'

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

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value))
}

function App() {
  const [design, setDesign] = useState<DesignState>(initialState)
  const [view, setView] = useState<DeliverableView>('hero')

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
      'Scene 01. Open with Burwood at dusk, neon signs flickering on, and the market drawing people in from the street.',
      'Scene 02. Walk past the glowing entrance arch and reveal the first burst of food stalls, smoke, colour, and crowd movement.',
      'Scene 03. Rise beside the escalator, showing hanging décor, upper-level dining, and an expanding sea of lights.',
      'Scene 04. Sweep through the main dining lane with live cooking, laughter, music, and the signature late-night energy.',
      'Scene 05. End at the hero photo zone and close with a skyline-style market beauty shot inviting everyone back next weekend.',
    ],
    [],
  )

  const builderNotes = useMemo(
    () => [
      `Design ambition is currently ${design.budgetLevel >= 75 ? 'premium and destination-led' : design.budgetLevel >= 55 ? 'mid-premium and event-friendly' : 'leaner and more tactical'} with lighting as a major identity tool.`,
      `${design.walkwayWidth >= 60 ? 'Keep circulation broad enough for families, queues, and slow social browsing.' : 'Review crowd pinch points carefully so busy food zones still feel comfortable.'}`,
      `${design.neonIntensity >= 80 ? 'Neon, LED signage, and façade glow should be coordinated early as a signature package.' : 'Lighting can stay expressive but needs tighter cost and maintenance control.'}`,
      `${design.familyActivation >= 60 ? 'Include safe touchpoints, flexible seating, and a family-friendly pause zone near key attractions.' : 'Keep family use secondary to dining and event energy.'}`,
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
            ['hero', 'Highlights'],
            ['walkthrough', 'Walk-in video'],
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
                <h2>Concept highlights</h2>
                <p>Hero scenes designed to sell the excitement of the market, not explain the process behind it.</p>
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
            </div>
          )}

          {view === 'walkthrough' && (
            <div className="walkthrough-board">
              <div className="section-title">
                <h2>Walk-in video</h2>
                <p>A polished storyboard now, with a clear handoff path to final animation or a PlayCanvas interactive walk-through.</p>
              </div>
              <div className="video-hero">
                <div className="storyboard-panel">
                  <div className="storyboard-frame frame-one"><span>Neon gateway</span></div>
                  <div className="storyboard-frame frame-two"><span>Escalator reveal</span></div>
                  <div className="storyboard-frame frame-three"><span>Dining rush</span></div>
                  <div className="storyboard-frame frame-four"><span>Photo finale</span></div>
                </div>
                <div>
                  <h3>Video direction</h3>
                  <p>
                    Shoot or generate this as a smooth evening walk-through with cinematic camera motion, glowing signage, crowd movement,
                    hero food moments, and a final social-share payoff.
                  </p>
                  <ol>
                    {walkthroughScript.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ol>
                  <div className="playcanvas-note">
                    <strong>PlayCanvas option</strong>
                    <p>Use PlayCanvas to turn these four scenes into clickable hotspots, a guided fly-through, or a browser-based preview walk.</p>
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
