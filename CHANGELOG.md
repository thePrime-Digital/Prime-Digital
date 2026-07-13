# Changelog

## 0.0.8 — Logo parent auto-size to image
- app/components/Footer.tsx: removed fixed height on logo container, image uses h-auto

## 0.0.7 — Shrink footer logo parent div
- app/components/Footer.tsx: logo container fixed height 80/100/90px, reduced padding

## 0.0.6 — Reduce footer logo height by 30%
- app/components/Footer.tsx: min-h reduced from 250/220/190 to 175/154/133

## 0.0.5 — Map back in grid, shorter and wider
- app/components/Footer.tsx: map returned to grid position, reduced height for wider look

## 0.0.4 — Footer logo fill and full-width map
- app/components/Footer.tsx: logo fills container width; map moved out of grid to full-width rectangle

## 0.0.3 — Fix hydration mismatch and improve hero image quality
- app/layout.tsx: added suppressHydrationWarning to body to fix browser extension mismatch
- app/page.tsx: increased hero image quality to 95 and corrected sizes attribute

## 0.0.2 — Redesign programs page with local images and professional hero
- app/programs/page.tsx: centered hero with local bg image + "How It Works" section; program cards now use local Unsplash images; certification uses Ankit Mali
- public/pds-assets/: added 6 program images (program-ai-robotics.jpg, program-web-dev.jpg, program-ux-ui.jpg, program-entrepreneurship.jpg, program-cyber.jpg, program-content.jpg)
- VERSION: bumped to 0.0.2

## 0.0.1 — Add version tracking rules to AGENTS.md
- AGENTS.md: added version-rules section
- VERSION: created
- CHANGELOG.md: created
