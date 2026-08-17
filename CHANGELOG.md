# Changelog

## 0.0.13 — Fix useContactAuth crash when key is empty
- app/providers.tsx: always render ContactAuthProvider (handles missing keys gracefully)
- app/login/page.tsx: guard Google button with isConfigured check
- app/signup/page.tsx: guard Google button with isConfigured check
- app/components/Navbar.tsx: removed logo image and unused Image import
- app/page.tsx: removed hero logo
- app/api/auth/login/route.ts: fixed self-iam error handling — catches ContactKitError, falls back to local auth on 401/404
- app/api/auth/logout/route.ts: removed dead ck_session cookie code
- app/api/auth/signup/route.ts: fixed self-iam error handling with ContactKitError
- app/layout.tsx: removed self-iam provider from root layout (was blocking navbar render)
- app/providers.tsx: renamed to SelfIAMProvider, only used on login/signup pages
- app/login/page.tsx: wrapped with SelfIAMProvider, split into LoginForm + LoginPage
- app/signup/page.tsx: wrapped with SelfIAMProvider, split into SignupForm + SignupPage
- app/page.tsx: reduced hero logo from 640x200 to 160x50 (1/4 size)
- next.config.ts: added images.qualities [75, 95], added 192.168.1.15 to allowedDevOrigins
- Installed self-iam npm package, replaced custom lib/selfiam/ HTTP client
- app/providers.tsx: new ContactAuthProvider wrapper for client-side session management
- app/layout.tsx: wrapped app with Providers
- app/api/auth/login/: rewritten to use self-iam package's login() function
- app/api/auth/signup/: rewritten to use self-iam package's signup() function
- app/api/auth/logout/: rewritten to use self-iam/server revokeSession()
- app/api/auth/me/: simplified to local session check only
- lib/auth/current-user.ts: simplified to local session check only
- lib/auth/session.ts: simplified, removed self-IAM token cookie helpers
- Deleted lib/selfiam/ (client.ts, types.ts, cache.ts), app/api/auth/email/
- app/login/page.tsx: wired Google button to useContactAuth().signInWithGoogle()
- app/signup/page.tsx: wired Google button to useContactAuth().signInWithGoogle()
- app/components/Footer.tsx: added "use client" for lucide-react compatibility
- .env.local: updated to NEXT_PUBLIC_SELFIAM_API_URL / SELFIAM_PUBLISHABLE_KEY
- .env.example: updated with new env var names

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
