---
name: Librarytrix Terminal HUD
colors:
  surface: '#131317'
  surface-dim: '#131317'
  surface-bright: '#39393e'
  surface-container-lowest: '#0e0e12'
  surface-container-low: '#1b1b20'
  surface-container: '#1f1f24'
  surface-container-high: '#2a292e'
  surface-container-highest: '#353439'
  on-surface: '#e4e1e8'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e4e1e8'
  inverse-on-surface: '#303035'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#ffb1c4'
  on-secondary: '#65002e'
  secondary-container: '#ff4a8d'
  on-secondary-container: '#590028'
  tertiary: '#e1ffd1'
  on-tertiary: '#053900'
  tertiary-container: '#33fb0a'
  on-tertiary-container: '#106e00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#ffd9e1'
  secondary-fixed-dim: '#ffb1c4'
  on-secondary-fixed: '#3f001a'
  on-secondary-fixed-variant: '#8f0044'
  tertiary-fixed: '#79ff5b'
  tertiary-fixed-dim: '#2ae500'
  on-tertiary-fixed: '#022100'
  on-tertiary-fixed-variant: '#095300'
  background: '#131317'
  on-background: '#e4e1e8'
  surface-variant: '#353439'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: 0em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0.02em
  title-md:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: 0.05em
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.12em
  code-dense:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
spacing:
  gutter: 1rem
  gutter-tablet: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system embodies a high-density, cyberpunk terminal HUD (Heads-Up Display) engineered for deep archival, classification, and tactical tracking of literary databases. The personality is uncompromisingly technical, analytical, immersive, and calculated. It evokes the sensation of operating an encrypted databank or a decker workstation navigating forbidden codices in a hyper-digitized sprawl.

The aesthetic fuses **Cyberpunk High-Contrast** with **Functional Brutalism** and **Tactical HUD instrumentation**:
- **Pitch-black and carbon substrates** minimize ocular fatigue while yielding maximum luminic contrast.
- **Vibrant luminescent phosphor states** (electric cyan, neon magenta, acid green, electric violet, amber) communicate metadata categories, status differentials, and telemetry without visual ambiguity.
- **Precision detailing** utilizes hairline 1px tech-borders, technical brackets (`[ ]`), scanline overlays, crosshair indicators, coordinate tracking labels, and strict monospaced data alignment.
- **Tactile feedback** mimics calibrated mechanical deck hardware through acute transitions, hard borders, zero corner radii, and targeted chromatic bloom.

## Colors

The color architecture is built strictly on an emissive dark-mode chassis. High-chroma neon accents are calibrated against deep obsidian and carbon baselines to mirror optical display phosphors.

### Surface & Neutral Architecture
- **Canvas Base (`#08080C`):** Deep abyssal black; unlit terminal surface.
- **Panel Base (`#0D0E15`):** Carbon layer for modules, cards, viewports, and modal shells.
- **Surface Elevation High (`#141724`):** Elevated HUD elements, table headers, hover tiers.
- **Border / Hairline Grid (`#1F2438`):** 1px structural division lines and reticles.
- **Text Main (`#E2E8F0`):** High-readability cold white for primary readout strings.
- **Text Muted / Code (`#64748B`):** Desaturated steel blue for technical indices, memory addresses, and sub-labels.

### Chromatic HUD Classifiers
Colors serve strict functional taxonomy rather than mere ornamentation:
- **Electric Cyan (`#00F0FF`):** System Default Primary; interactive focus; telemetry; Category Token: *Ficção Científica*.
- **Acid Green (`#39FF14`):** Category Token: *Cyberpunk / Tech*; read/complete operational status; verified checksums.
- **Neon Magenta / Pink (`#FF007F`):** Category Token: *Distopia*; high-priority overrides; alerts; secondary highlights.
- **Electric Violet (`#A855F7`):** Category Token: *Filosofia*; deep analytics; abstract classification.
- **Amber Orange (`#FFB800`):** Category Token: *História*; warning flags; legacy archives; pending synchronization.

## Typography

Typography functions as visual instrumentation. **Space Grotesk** serves as the authoritative structural display face for headers, telemetry counters, and panel designations, balancing geometric sharpness with industrial legibility. **JetBrains Mono** controls all body text, book titles, metadata readouts, ranking tallies, and critique matrices.

- Text labels, indicators, and metadata keys are rendered in full capital letters (`text-transform: uppercase`) with positive tracking (`0.08em` to `0.12em`).
- Tabular figures and slashed zeroes (`font-variant-numeric: tabular-nums slashed-zero`) must be active system-wide to ensure tabular alignment across numerical tracking tables and score indices.
- Prose review sections leverage strict line height containment (`22px` on `14px` type) to ensure line-numbered gutters line up without drift.

## Layout & Spacing

The layout is structured around an ultra-dense, 12-column modular HUD grid that prioritizes situational awareness and rapid information parsing over decorative whitespace.

### Grid & Breakpoints
- **Mobile (< 768px):** 4 columns, `margin: 1rem`, `gutter: 1rem`. Information displays collapse into singular vertical streams; non-vital telemetry docks into sliding horizontal drawers.
- **Tablet (768px – 1199px):** 8 columns, `margin: 1.5rem`, `gutter: 1.25rem`. Two-pane split: catalogue stream adjacent to summary telemetry.
- **Desktop (≥ 1200px):** 12 columns, `margin: 2.5rem`, `gutter: 1.5rem`. Full command center with a 3-column tactical navigation/filter sidebar, 6-column central book feed/matrix, and 3-column global telemetry/leaderboard rail.

### Spacing Philosophy
Spacing operates on a strict base-4 rhythm (`4px`, `8px`, `16px`, `24px`, `40px`). Layout components favor dense, structural grouping where visual separation is enforced primarily through borders, dividers, and corner brackets rather than large expanses of empty margin.

## Elevation & Depth

In a tactical digital HUD, elevation does not rely on soft atmospheric drop-shadows. Depth is articulated through **optical phosphor luminescence**, **structural wireframing**, and **z-axis container nesting**.

### Surface Stratification
- **Plane 0 (Canvas):** Pure `#08080C` background, optionally textured with faint CSS scanline bars (`repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.015) 3px)`).
- **Plane 1 (Modules & Paneling):** Solid `#0D0E15` bounded by 1px solid `#1F2438` hairline strokes.
- **Plane 2 (Hover & Focus Layers):** `#141724` backing with bright 1px accent boundary.

### Luminescence & Glow Specification
Subtle, high-precision glows indicate active status and focus without washing out text:
- **Passive HUD State:** No blur; hairline borders at low opacity (`rgba(31, 36, 56, 0.9)`).
- **Active / Focused Interactive State:** 1px border colored with the target neon accent, reinforced by a localized glow: `box-shadow: 0 0 10px -2px var(--accent-color), inset 0 0 6px -3px var(--accent-color)`.
- **Text Phosphor Bloom:** For primary numbers and critical status titles only: `text-shadow: 0 0 8px rgba(0, 240, 255, 0.6)`.
- **Modal Backing:** Pitch black backdrop with heavy blackout and a microscopic noise mask: `background-color: rgba(8, 8, 12, 0.88); backdrop-filter: blur(4px)`.

## Shapes

The design system is strictly **sharp (roundedness: 0)**. Zero corner radius is enforced throughout every primitive, card, input, and modal to sustain the hardware terminal visual language.

### Geometry Details
- **Corners:** 0px radius (`border-radius: 0px`).
- **Chamfered Cuts (Tech-Notch):** High-priority components, selected badge tags, and critical action buttons employ a 45-degree corner notch (`clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)`).
- **HUD Reticle Framing:** Selected cards utilize pseudo-element corner ticks (`::before` / `::after`) that project 4px L-shaped corner brackets in accent colors.

## Components

### Buttons & Action Triggers
- **Primary Cyber Button:** Rectangular or chamfered, `#00F0FF` background, pitch black `#08080C` typography in bold `JetBrains Mono`. Hover triggers inverted neon emission with `box-shadow: 0 0 16px rgba(0, 240, 255, 0.5)`. Prefix text with terminal brackets: `[ EXECUTE ]`.
- **Ghost / Wireframe Button:** 1px border (`#1F2438`), `#0D0E15` background, cold white text. Hover transitions border to `#00F0FF` with glowing cyan typography.
- **Danger Button:** Same syntax, powered by `#FF007F` (Neon Magenta).

### Category-Coded Neon Badges & Filter Chips
- Monospaced, all-caps, `label-sm` typography encased in a 1px border with a 10% opacity tinted fill:
  - *Ficção Científica:* Border `#00F0FF`, text `#00F0FF`, bg `rgba(0, 240, 255, 0.1)`.
  - *Cyberpunk / Tech:* Border `#39FF14`, text `#39FF14`, bg `rgba(57, 255, 20, 0.1)`.
  - *Filosofia:* Border `#A855F7`, text `#A855F7`, bg `rgba(168, 85, 247, 0.1)`.
  - *Distopia:* Border `#FF007F`, text `#FF007F`, bg `rgba(255, 0, 127, 0.1)`.
  - *História:* Border `#FFB800`, text `#FFB800`, bg `rgba(255, 184, 0, 0.1)`.
- Interactive filter chips include bracket indicators (`[x] ACTIVE`) and toggle states using solid inversion when selected.

### Book Cards
- Formed by a `#0D0E15` substrate with 1px `#1F2438` framing.
- **Header Strip:** Displays archive identifier (`ARCHIVE_ID // 0842-CYB`), classification badge, and reading state (`READING`, `ARCHIVED`, `QUEUED`).
- **Body Area:** Book cover container alongside title (`Space Grotesk`, 18px), author, and read metrics (progress bars rendered as segmented digital meters).
- **Footer Strip:** 5-segment rating bar, sync date, and quick critique action.

### Futuristic Rating System (0 to 5 Bars)
- Eschews conventional consumer stars in favor of a segmented 5-block energy cell or HUD chevron matrix.
- Consists of 5 discrete horizontal or trapezoidal bars. Empty states display as `#1F2438`. Filled segments illuminate in `#00F0FF` or `#39FF14` with faint phosphor bloom. Decimal scores (e.g., `4.5`) render an animated half-hash fill pattern (`///`).

### Ranking Leaderboards
- High-density table featuring monospace alignment: rank position (`#01`, `#02`, `#03` highlighted with `#FFB800`, `#00F0FF`, `#FF007F` respective markers).
- Row structures utilize hairline horizontal dividers. Hovering a row triggers a horizontal neon scan cursor line on the left border edge (`border-left: 3px solid #00F0FF`).
- Includes velocity indicators (`▲ +2`, `▼ -1`, `■ 0`) in corresponding status neon colors.

### Input Fields & Search Bars
- Background `#0D0E15`, bottom-border only or full 1px wireframe in `#1F2438`. Focus state shifts to vibrant `#00F0FF` with a pulsing command-line block cursor (`█`).
- Text inputs prepend an active prompt string: `SYS:SEARCH >`.

### Checkboxes & Radios
- Square 14x14px sharp boxes with 1px border `#64748B`.
- Checked state fills with `#00F0FF` displaying a sharp interior black dot or diagonal slash mark.

### Futuristic Critique Review Modal (20-Line Terminal)
- **Overlay Shell:** Centered fixed-width dialog framed in heavy carbon `#0D0E15` with an exterior `#00F0FF` 1px border and corner reticles.
- **Terminal Header:** Diagnostic header displaying `DATAPACKET_CRITIQUE_V4.0 // BUFFER_LIMIT: 20_LINES`. Close trigger marked as `[ TERMINATE_X ]`.
- **Editor Frame:** Split-pane editor:
  - Left column: Static 2-digit line counter (`01` through `20`) rendered in muted `#64748B` monospaced text.
  - Right column: Fixed 20-line textarea (`line-height: 22px`, `height: 440px`), strict monospaced type (`JetBrains Mono`, 14px), transparent background, zero border, caret color `#00F0FF`.
- **Footer Matrix:** Real-time metrics: character counter, line capacity indicator (`LINE 08/20`), category classification selector, and `[ COMMIT_REVIEW ]` execute button.