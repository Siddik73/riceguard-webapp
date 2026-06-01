---
name: Agricultural Resilience System
colors:
  surface: '#e8fff0'
  surface-dim: '#b8e4cc'
  surface-bright: '#e8fff0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#d1fee5'
  surface-container: '#ccf8df'
  surface-container-high: '#c6f2da'
  surface-container-highest: '#c1ecd4'
  on-surface: '#002114'
  on-surface-variant: '#404943'
  inverse-surface: '#0e3727'
  inverse-on-surface: '#cffbe2'
  outline: '#707973'
  outline-variant: '#bfc9c1'
  surface-tint: '#2c694e'
  primary: '#0f5238'
  on-primary: '#ffffff'
  primary-container: '#2d6a4f'
  on-primary-container: '#a8e7c5'
  inverse-primary: '#95d4b3'
  secondary: '#0e6c4a'
  on-secondary: '#ffffff'
  secondary-container: '#a0f4c8'
  on-secondary-container: '#19724f'
  tertiary: '#713900'
  on-tertiary: '#ffffff'
  tertiary-container: '#8f4f14'
  on-tertiary-container: '#ffd1b1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b1f0ce'
  primary-fixed-dim: '#95d4b3'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#0e5138'
  secondary-fixed: '#a0f4c8'
  secondary-fixed-dim: '#85d7ad'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdcc4'
  tertiary-fixed-dim: '#ffb780'
  on-tertiary-fixed: '#2f1400'
  on-tertiary-fixed-variant: '#6f3800'
  background: '#e8fff0'
  on-background: '#002114'
  surface-variant: '#c1ecd4'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Noto Sans Bengali
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  label-sm:
    fontFamily: Noto Sans Bengali
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-tablet: 32px
---

## Brand & Style

The design system is anchored in the concept of "Digital Agronomy"—merging the organic, grounded nature of rice farming with the precision of modern AI technology. The brand personality is **trustworthy and expert**, yet **approachable and community-oriented**. It must feel like a reliable companion in the field, not just a cold diagnostic tool.

The visual style follows a **Modern / Corporate** aesthetic with **Tactile** influences. This ensures high legibility and ease of use in high-glare outdoor environments. The interface prioritizes clarity, utilizing generous tap targets and a clean, high-contrast layout that respects the urgency of crop health monitoring.

**Key Brand Pillars:**
- **Growth:** Expressed through a lush, verdant color palette.
- **Precision:** Conveyed via sharp typography and a structured 8px grid.
- **Support:** Manifested in soft shapes and helpful, accessible feedback loops.

## Colors

The color palette is derived from the rice lifecycle. The **Primary Deep Green** provides a sense of established authority and health, while the **Sage Green Accent** is used for interactive elements and highlights to maintain a soft, friendly touch.

**Color Usage Guidelines:**
- **Primary (#2D6A4F):** Used for main actions, headers, and brand-critical components.
- **Secondary (#74C69D):** Used for progress bars, secondary buttons, and success states.
- **Warning (#F4A261):** Used for early-stage disease alerts or "Caution" status.
- **Danger (#E76F51):** Reserved for high-severity disease detection and destructive actions.
- **Dark Mode:** In dark mode, the background shifts to a deep charcoal-green to reduce eye strain, while primary colors are desaturated slightly to maintain AA accessibility standards against dark surfaces.

## Typography

The typography system is designed for **Bilingual Accessibility**. **Inter** is the workhorse for UI labels, numbers, and English text, chosen for its exceptional legibility on small screens. **Noto Sans Bengali** is integrated seamlessly for localized content, ensuring that agricultural advice is readable for all users.

**Hierarchy Rules:**
- Use **Headline-LG** for primary diagnostic results.
- Use **Body-LG** for instructional text to ensure readability for users who may have varying levels of digital literacy.
- All Bengali text should utilize the Noto Sans Bengali family to ensure proper character rendering and vertical rhythm.

## Layout & Spacing

This design system employs an **8px linear scale** to create a rhythmic and predictable layout. As a mobile-first PWA, the layout is primarily a **Fluid Grid**.

**Mobile (Under 600px):**
- 4-column fluid grid.
- 16px outside margins.
- 16px gutters between cards and elements.

**Tablet (600px - 1024px):**
- 8-column fluid grid.
- 32px outside margins.
- Content containers should have a maximum width of 720px to prevent long line lengths in diagnostic articles.

Elements should align strictly to the 8px increments to maintain a "technical" and "precise" feel, which reinforces the trustworthiness of the AI detection results.

## Elevation & Depth

To maintain a modern and clean aesthetic, depth is conveyed through **Tonal Layers** supplemented by **Ambient Shadows**. 

- **Surface Level 0:** The main background (#F8FAF5).
- **Surface Level 1:** Cards and input fields. These use a very subtle, diffused shadow (0px 4px 12px rgba(0, 0, 0, 0.05)) to appear slightly raised.
- **Surface Level 2:** Floating Action Buttons (FAB) and Modals. These use a more pronounced shadow (0px 8px 24px rgba(0, 0, 0, 0.12)) to indicate high priority and interactivity.

In Dark Mode, elevation is communicated solely through color lightening (e.g., Level 1 is slightly lighter than Level 0) rather than shadows, which can become muddy on dark backgrounds.

## Shapes

The shape language is **Rounded**, reflecting the organic nature of the product's subject matter (leaves, rice grains). 

- **Standard Elements:** Buttons, Text Inputs, and Cards use a **0.5rem (8px)** radius.
- **Large Containers:** Bottom sheets and large feature cards use **1rem (16px)** for the top corners to feel more welcoming.
- **Selection Indicators:** Small tags or status chips may use a **Pill** shape to differentiate them from actionable buttons.

## Components

**Buttons:**
- **Primary:** Filled with #2D6A4F, white text. Minimum height of 48px for easy thumb-tapping.
- **Secondary:** Outlined with 2px stroke of #74C69D.
- **Status Buttons:** Large, full-width buttons for "Start Camera Scan."

**Cards:**
- Used for disease diagnosis results. Cards must include a clear "Confidence Score" chip and a high-contrast heading.
- Padding inside cards is fixed at 16px (md spacing).

**Input Fields:**
- 8px rounded corners.
- 2px border on focus using the secondary color (#74C69D).
- Labels are always visible (no floating labels) to aid cognitive load.

**Chips & Tags:**
- Used to display crop types or disease severity (Low, Medium, High). 
- Use the Warning (#F4A261) and Danger (#E76F51) colors for severity chips to provide instant visual feedback.

**Bilingual Toggle:**
- A persistent, high-visibility toggle (English/বাংলা) in the top navigation bar or user settings to allow instant language switching.