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
  description: string
  angle: string
  visualFocus: string
  cameraMove: string
  prompt: string
  palette: string[]
  tags: string[]
}

type MoodTile = {
  title: string
  note: string
  palette: string[]
  motifs: string[]
}

const moodLabels: Record<MoodPreset, string> = {
  'neon-chinatown': 'Neon Chinatown Night Market',
  'family-carnival': 'Family Carnival Food Playground',
  'festival-premium': 'Festival Premium Entertainment Precinct',
}

const basePrompt =
  'Burwood Night Food City, immersive Chinatown-inspired hospitality destination, layered lighting, interactive food laneways, bold branded photo moments, escalator activation, premium stakeholder presentation, cinematic architectural visualization'

const initialState: DesignState = {
  prompt: basePrompt,
  mood: 'neon-chinatown',
  neonIntensity: 82,
  culturalPattern: 68,
  familyActivation: 54,
  foodStallDensity: 70,
  immersiveLighting: 85,
  budgetLevel: 72,
  walkwayWidth: 58,
  stageEnergy: 66,
}

const referenceGallery: MoodTile[] = [
  {
    title: 'Night dining mood',
    note: 'Extracted design direction for a neon hospitality heart with layered signage and warm gathering pockets.',
    palette: ['#FF4FD8', '#7C3AED', '#1D4ED8'],
    motifs: ['glowing menus', 'stacked lantern rhythm', 'late-night seating'],
  },
  {
    title: 'Family activation',
    note: 'Concept language for playful dwell zones, soft colour breaks, and all-ages circulation comfort.',
    palette: ['#F59E0B', '#34D399', '#60A5FA'],
    motifs: ['interactive edge', 'festival stalls', 'kid-safe landmarking'],
  },
  {
    title: 'Photo moment',
    note: 'Social-media anchor zone with campaign signage, event overlays, and queue-friendly framing.',
    palette: ['#FB7185', '#F97316', '#FDE047'],
    motifs: ['hero sign wall', 'portrait spotlight', 'event-ready backdrop'],
  },
  {
    title: 'Escalator feature zone',
    note: 'Vertical circulation transformed into a cinematic reveal with suspended décor and layered sightlines.',
    palette: ['#38BDF8', '#6366F1', '#E879F9'],
    motifs: ['ceiling ribbons', 'moving glow', 'atrium reveal'],
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
    const stakeholderWow = clamp(
      design.neonIntensity * 0.24 +
        design.immersiveLighting * 0.24 +
        design.stageEnergy * 0.18 +
        design.culturalPattern * 0.16 +
        design.foodStallDensity * 0.18,
    )

    const builderFeasibility = clamp(
      100 - Math.abs(design.budgetLevel - 65) * 0.8 -
        Math.abs(design.walkwayWidth - 62) * 0.55 -
        Math.abs(design.neonIntensity - 70) * 0.25 -
        Math.abs(design.stageEnergy - 58) * 0.25,
    )

    const familyAppeal = clamp(
      design.familyActivation * 0.42 +
        design.walkwayWidth * 0.18 +
        design.foodStallDensity * 0.16 +
        design.immersiveLighting * 0.12 +
        design.stageEnergy * 0.12,
    )

    return {
      stakeholderWow: Math.round(stakeholderWow),
      builderFeasibility: Math.round(builderFeasibility),
      familyAppeal: Math.round(familyAppeal),
    }
  }, [design])

  const livePrompt = useMemo(() => {
    const moodSentence =
      design.mood === 'neon-chinatown'
        ? 'high-energy modern Chinatown nightlife with magenta, red, and electric blue glow'
        : design.mood === 'family-carnival'
          ? 'playful family entertainment with colourful attractions, friendly signage, and flexible daytime-to-night transition'
          : 'premium festival-driven destination with polished lighting, upscale finishes, and event-ready staging'

    return [
      design.prompt,
      `Mood direction: ${moodSentence}.`,
      `Neon intensity ${design.neonIntensity}/100.`,
      `Cultural pattern density ${design.culturalPattern}/100 with lanterns, murals, and Chinatown-inspired graphics.`,
      `Family activation ${design.familyActivation}/100 with interactive zones and dwell-time features.`,
      `Food stall density ${design.foodStallDensity}/100 with vibrant kiosks and laneway seating.`,
      `Immersive lighting ${design.immersiveLighting}/100 for cinematic evening atmosphere.`,
      `Budget ambition ${design.budgetLevel}/100 balancing premium impact and buildability.`,
      `Walkway openness ${design.walkwayWidth}/100 to preserve circulation and event flexibility.`,
      `Performance energy ${design.stageEnergy}/100 with live music, projection, or festival programming.`,
      'Architectural concept render, wide-angle view, polished pitch-deck quality, realistic materials, stakeholder-ready presentation board, do not reuse source reference photos directly.',
    ].join(' ')
  }, [design])

  const conceptFrames = useMemo<ConceptFrame[]>(() => {
    const stageMode = design.stageEnergy > 72 ? 'live DJ and performance focus' : 'ambient social soundtrack focus'
    const familyMode = design.familyActivation > 60 ? 'visible family activation near the upper level' : 'soft-touch all-ages activation only'

    return [
      {
        title: 'Arrival Gateway Hero Render',
        description: 'Primary stakeholder image showing the front arrival sequence, lighting identity, and Burwood Chinatown branding.',
        angle: 'Street entry, eye-level hero perspective',
        visualFocus: 'Branded arch, glowing wayfinding, active laneway threshold',
        cameraMove: 'Slow push-in from the street toward the main gate',
        prompt: `${livePrompt} Focus on arrival gateway, branded Chinatown arch, strong first impression, visitor magnet composition.`,
        palette: ['#FF6BD6', '#FB7185', '#F59E0B'],
        tags: ['gateway arch', 'glowing signage', 'street magnet'],
      },
      {
        title: 'Dining Core Concept Render',
        description: 'Main social food zone with neon dining atmosphere and tenant-facing hospitality energy.',
        angle: 'Interior social dining floor, medium-wide view',
        visualFocus: 'Lantern glow, seating clusters, food counters, live atmosphere',
        cameraMove: 'Orbit around dining tables and central performance pocket',
        prompt: `${livePrompt} Focus on energetic dining hall with neon hospitality mood, ${stageMode}, layered signage, premium social energy.`,
        palette: ['#8B5CF6', '#EC4899', '#F97316'],
        tags: ['food kiosks', 'social dining', 'festival glow'],
      },
      {
        title: 'Escalator Walk-In Sequence',
        description: 'Vertical circulation spectacle turning the escalator zone into a signature walkthrough moment.',
        angle: 'Atrium view aimed across escalators and hanging installation',
        visualFocus: 'Ceiling decorations, circulation drama, cross-level visibility',
        cameraMove: 'Ascending walk-in shot that rises with the escalator and reveals the whole destination',
        prompt: `${livePrompt} Focus on escalator activation, suspended decor, dramatic overhead installations, cinematic wayfinding spine, ${familyMode}.`,
        palette: ['#22D3EE', '#6366F1', '#F472B6'],
        tags: ['atrium reveal', 'overhead ribbons', 'walk-in sequence'],
      },
      {
        title: 'Photo Moment + Festival Activation',
        description: 'Interactive zone for campaign launches, social sharing, and seasonal overlays.',
        angle: 'Front-facing portrait-friendly composition',
        visualFocus: 'Festival signage wall, interactive graphics, queue-friendly placement',
        cameraMove: 'Short dolly-in ending with user-generated content framing',
        prompt: `${livePrompt} Focus on branded photo moment, festival-ready installation, social-media magnet, highly shareable visitor backdrop.`,
        palette: ['#FB7185', '#FACC15', '#A855F7'],
        tags: ['UGC wall', 'campaign zone', 'night festival'],
      },
    ]
  }, [design, livePrompt])

  const walkthroughScript = useMemo(
    () => [
      'Scene 01, establish Burwood at dusk and reveal the gateway identity.',
      'Scene 02, walk through the entrance and introduce the food-stall rhythm, lighting palette, and first branded touchpoints.',
      'Scene 03, rise through the escalator zone and show suspended installations, sightlines, and the upper-level activation story.',
      'Scene 04, cut into the dining core, stage pocket, and signature neon hospitality atmosphere.',
      'Scene 05, end at the photo moment and family activation zone, then close on a stakeholder message about night-time visitation and precinct value.',
    ],
    [],
  )

  const builderNotes = useMemo(
    () => [
      `Preferred design intensity is ${design.budgetLevel >= 75 ? 'premium' : design.budgetLevel >= 55 ? 'mid-premium' : 'cost-conscious'} with strong emphasis on visible finishes and lighting impact.`,
      `${design.walkwayWidth >= 60 ? 'Maintain generous circulation zones around the main laneway and escalator edge.' : 'Review pinch points carefully, because the current concept is prioritising atmosphere over openness.'}`,
      `${design.neonIntensity >= 80 ? 'Electrical and signage coordination must be treated as a major package item.' : 'Lighting package can stay layered but more controlled in cost and maintenance.'}`,
      `${design.familyActivation >= 60 ? 'Allocate durable, safe finishes and a flexible activation corner for families and group dwell time.' : 'Keep family features lighter and rely more on dining and photo moments.'}`,
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
          <span className="eyebrow">Burwood Chinatown / Night Food City</span>
          <h1>Interactive English concept site for generated design directions, stakeholder review, and GitHub Pages publishing</h1>
          <p>
            This prototype translates your source materials into new concept outputs, a live prompt editor, walk-in video storyboards,
            and builder-facing notes. It does not directly reuse the original images as final design deliverables.
          </p>
          <div className="hero-actions">
            <button onClick={() => setView('prompt-lab')}>Open prompt lab</button>
            <button className="secondary" onClick={() => setView('walkthrough')}>
              View walk-in video outline
            </button>
          </div>
        </div>
        <div className="hero-card concept-swatch-card">
          <div className="swatch-row">
            <span style={{ background: '#FF4FD8' }} />
            <span style={{ background: '#7C3AED' }} />
            <span style={{ background: '#F97316' }} />
            <span style={{ background: '#22D3EE' }} />
          </div>
          <div className="hero-card-body">
            <strong>{moodLabels[design.mood]}</strong>
            <span>Generated concept direction only, derived from your materials without directly reusing the original images.</span>
          </div>
        </div>
      </header>

      <section className="score-strip">
        <article>
          <span>Stakeholder wow factor</span>
          <strong>{scoreCard.stakeholderWow}</strong>
        </article>
        <article>
          <span>Builder feasibility</span>
          <strong>{scoreCard.builderFeasibility}</strong>
        </article>
        <article>
          <span>Family appeal</span>
          <strong>{scoreCard.familyAppeal}</strong>
        </article>
      </section>

      <section className="toolbar">
        <div className="view-tabs">
          {[
            ['hero', 'Design board'],
            ['walkthrough', 'Walk-in video'],
            ['builder', 'Builder notes'],
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
            <h2>Live prompt controls</h2>
            <p>Drag the sliders and edit the prompt. The right side updates instantly with revised design intent.</p>
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
                <h2>Concept design board</h2>
                <p>Four generated concept directions ready to turn into renders, presentation boards, or animation scenes.</p>
              </div>
              <div className="concept-grid">
                {conceptFrames.map((frame) => (
                  <article key={frame.title} className="concept-card">
                    <div className="concept-visual" aria-hidden="true">
                      <div className="concept-gradient" style={{ background: `linear-gradient(135deg, ${frame.palette.join(', ')})` }} />
                      <div className="concept-tags">
                        {frame.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="concept-card-body">
                      <h3>{frame.title}</h3>
                      <p>{frame.description}</p>
                      <ul>
                        <li><strong>Angle:</strong> {frame.angle}</li>
                        <li><strong>Focus:</strong> {frame.visualFocus}</li>
                        <li><strong>Camera move:</strong> {frame.cameraMove}</li>
                      </ul>
                      <details>
                        <summary>Render prompt</summary>
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
                <h2>Walk-in video draft</h2>
                <p>This is the structure for a future cinematic walkthrough video or interactive scroll story.</p>
              </div>
              <div className="video-hero">
                <div className="storyboard-panel">
                  <div className="storyboard-frame frame-one"><span>Entry reveal</span></div>
                  <div className="storyboard-frame frame-two"><span>Escalator rise</span></div>
                  <div className="storyboard-frame frame-three"><span>Dining pulse</span></div>
                  <div className="storyboard-frame frame-four"><span>Photo moment</span></div>
                </div>
                <div>
                  <h3>Recommended video style</h3>
                  <p>
                    Cinematic evening walkthrough, smooth dolly movement, glowing signage, people energy, and short builder overlays
                    for circulation, structure, and activation zones.
                  </p>
                  <ol>
                    {walkthroughScript.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}

          {view === 'builder' && (
            <div className="builder-board">
              <div className="section-title">
                <h2>Builder and coordination notes</h2>
                <p>Use this panel as the translation layer from concept ambition into buildable packages.</p>
              </div>
              <div className="builder-layout">
                <div className="builder-diagram">
                  <div className="diagram-band top">Gateway + façade lighting package</div>
                  <div className="diagram-band middle">Dining core + flexible kiosk spine</div>
                  <div className="diagram-band bottom">Escalator event edge + family activation pocket</div>
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
                <h2>Real-time prompt editor</h2>
                <p>Left side changes the brief. Right side becomes the live render prompt for an image generation workflow.</p>
              </div>
              <div className="prompt-layout">
                <div className="prompt-preview">
                  <h3>Live render prompt</h3>
                  <pre>{livePrompt}</pre>
                </div>
                <div className="prompt-reference">
                  <h3>Reference mood gallery</h3>
                  <div className="mini-gallery">
                    {referenceGallery.map((item) => (
                      <article key={item.title}>
                        <div className="mini-palette" aria-hidden="true">
                          {item.palette.map((chip) => (
                            <span key={chip} style={{ background: chip }} />
                          ))}
                        </div>
                        <div>
                          <strong>{item.title}</strong>
                          <span>{item.note}</span>
                          <small>{item.motifs.join(' · ')}</small>
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
