---
name: RiceGuard
colors:
  surface: '#f8faf5'
  surface-dim: '#d8dbd6'
  surface-bright: '#f8faf5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4ef'
  surface-container: '#ecefea'
  surface-container-high: '#e7e9e4'
  surface-container-highest: '#e1e3de'
  on-surface: '#191c1a'
  on-surface-variant: '#404943'
  inverse-surface: '#2e312e'
  inverse-on-surface: '#eff1ec'
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
  tertiary: '#5d4300'
  on-tertiary: '#ffffff'
  tertiary-container: '#7a5a00'
  on-tertiary-container: '#ffd47b'
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
  tertiary-fixed: '#ffdfa0'
  tertiary-fixed-dim: '#fbbc00'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5c4300'
  background: '#f8faf5'
  on-background: '#191c1a'
  surface-variant: '#e1e3de'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
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
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Noto Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Noto Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 16px
  gutter: 16px
---

## Brand & Style

The design system is engineered for **RiceGuard**, a high-utility agricultural technology platform serving farmers in Bangladesh. The brand personality is **reliable, observant, and supportive**, bridging the gap between traditional farming wisdom and modern data science. 

The visual style follows a **Corporate / Modern** aesthetic with a specific focus on **High-Contrast Accessibility**. To ensure usability in bright outdoor environments (direct sunlight), the UI employs a clean, high-contrast interface with a "Natural Tech" feel—blending the deep greens of healthy crops with the clinical precision of a diagnostic tool. 

The emotional response should be one of **confidence and clarity**. The UI avoids unnecessary decorative elements, favoring a functional minimalism that respects the user's time and data constraints.

## Colors

The palette is rooted in the agricultural lifecycle. 
- **Primary:** Deep Forest Green (#2D6A4F) serves as the primary brand anchor, used for headers, key actions, and critical branding. 
- **Secondary:** Soft Mint (#74C69D) acts as a secondary accent for progress indicators, success states, and subtle backgrounds.
- **Surface:** Off-white (#F8FAF5) reduces glare compared to pure white, making it easier on the eyes during extended field use.
- **Status:** Amber is reserved for warnings (potential pests/disease), while Red indicates critical errors or severe crop threats.

**Accessibility Note:** All text-on-background combinations must meet WCAG AA standards. Interactive elements utilize high-contrast borders in dark mode to ensure visibility.

## Typography

The system utilizes a dual-font strategy. **Inter** provides a highly legible, modern grotesque feel for English content and UI controls, while **Noto Sans** is specifically integrated to provide seamless, readable Bengali support.

For field workers, font sizes are slightly oversized compared to standard web apps to account for movement and varied lighting conditions. The hierarchy is "Top-Heavy," ensuring the most critical diagnostic information is immediately scannable. Line heights are generous (1.5x for body text) to prevent text crowding in bilingual layouts where English and Bengali may be displayed simultaneously.

## Layout & Spacing

This design system uses a strict **8px linear scale**. All margins, paddings, and gaps must be multiples of 8.

- **Mobile (Default):** A single-column fluid layout with 16px side margins. Large touch targets (minimum 48px height) are required for all interactive elements.
- **Tablet/Desktop:** The layout transitions to a 12-column fixed grid with a maximum content width of 1024px. Side margins expand to auto-center the content.
- **Bottom Navigation:** Fixed to the viewport bottom on mobile; transitions to a side rail or top bar on wider screens.

Spacing between related items (like a label and its input) should use the `sm` (8px) unit, while spacing between distinct sections should use `xl` (32px).

## Elevation & Depth

The design system employs **Tonal Layers** combined with subtle **Ambient Shadows** to create a sense of hierarchy without clutter.

- **Level 0 (Background):** The Off-white surface (#F8FAF5).
- **Level 1 (Cards/Containers):** Pure white (#FFFFFF) with a 1px border in a light neutral tint or a very soft shadow (0px 2px 4px rgba(0,0,0,0.05)).
- **Level 2 (Modals/Popovers):** Elevated with a more pronounced shadow (0px 8px 16px rgba(0,0,0,0.1)) to draw focus.

In Dark Mode, elevation is communicated through lighter surface tints rather than shadows, ensuring that "closer" elements are visually brighter than the background.

## Shapes

The shape language is characterized by "Soft Precision." A consistent **8px (0.5rem)** radius is applied to all primary UI containers, including buttons, input fields, and cards. 

- **Buttons & Inputs:** 8px radius.
- **Small Badges/Chips:** 4px radius or fully pill-shaped for status indicators.
- **Large Sections/Image Containers:** 8px radius.

This roundedness softens the professional look, making the app feel more approachable and user-friendly for a diverse range of literacy levels and technical backgrounds.

## Components

### Buttons
- **Primary:** Solid #2D6A4F with white text. 8px radius. 48px minimum height.
- **Secondary:** Outlined with #2D6A4F, 2px border width.
- **States:** 300ms ease-in-out transition for hover/active states.

### Bottom Navigation
- **Height:** 64px.
- **Icons:** 24px stroke-based icons.
- **Labels:** Required for accessibility, using `label-sm`.
- **Items:** Home, Scan (Primary Floating Action), History, Library, Profile.

### Cards
- **Structure:** White background, 8px radius, 16px internal padding.
- **Use:** Diagnostic results, weather alerts, and library entries.

### Form Inputs
- **Style:** 2px solid border on focus using #74C69D.
- **Labels:** Always visible (no floating labels) to ensure clarity for users with varying digital literacy.

### Chips/Badges
- **Pest/Disease Status:** High-contrast amber/red backgrounds with dark text. 
- **Filtering:** Rounded pill shapes used for scanning through crop types or historical dates.

### Motion
All transitions (page enters, button presses, modal reveals) use a **300ms ease-in-out** curve to ensure the PWA feels responsive and "app-like" rather than a static website.