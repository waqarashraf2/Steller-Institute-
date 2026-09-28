# Stellar Institute Project Handoff

## Project Context
The Stellar Institute project is a React/Vite site. The shared cPanel host serves the built static frontend and PHP contact/admission handlers; it does not run Node.js. Vercel runs the Node.js API functions, which connect to Neon Postgres. The frontend's database-backed requests must continue to target the Vercel API. The GitHub `main` workflow also builds with Node 22 and deploys to cPanel.

The primary goal of our recent sessions has been to perform a comprehensive UI/UX revamp of the site to make it look like a highly professional educational platform. 

## Codebase & Frontend Details
The current repository working copy is `/home/moh/Projects/stellar website`.
During the revamp, we extensively modified the following frontend elements:
- **Global Styles (`src/index.css`)**: Updated CSS variables to implement a new color palette featuring Navy Blue (`#0a2540`), Deep Indigo (`#1e3a8a`), and crisp white. Updated typography to use the `Inter` font.
- **Components (`src/components/`)**:
  - `FloatingShapes.jsx` & `TestimonialShapes.jsx`: Refactored to use offset-shadow shapes instead of generic SVGs.
  - `Navbar.css` & `Footer.css`: Updated with the new dark/light professional aesthetic.
  - `AnnouncementTicker`: Updated the top banner to handle notices and made the entire banner clickable if a CMS link is present.
  - *Deleted Components*: `AnnouncementPopup` and `AnnouncementModal` were completely removed to eliminate intrusive box popups.
- **Pages (`src/pages/` and related CSS like `Pages.css`, `Home.css`)**:
  - `Home.jsx`, `SkilledInstitute.jsx`, `Academy.jsx`, `About.jsx`, and `Contact.jsx` have all been updated to utilize the new design system.
  - All cards (`.program-card`, `.school-card`, `.contact-form`, `.sidebar-widget`, etc.) now feature a unique offset-shadow effect (a solid Navy Blue outline shifted slightly behind the main element).

## Current Status

### What is Functioning
- **Build Process**: The React application builds successfully without errors (`npm run build`).
- **New Design System**: The Navy Blue/Deep Indigo color scheme is fully applied across the application.
- **Offset Shapes**: The requested layered shadow effect is implemented globally on cards, forms, and floating shapes.
- **Notice System**: The intrusive popup boxes are gone. The site now exclusively uses the top banner (`AnnouncementTicker`) for notices, which correctly supports clickable links.
- **Deployment**: Changes to `main` can trigger both the cPanel GitHub workflow and a Vercel deployment. The cPanel workflow copies the `api/` source folder, but cPanel does not execute those Node handlers; the PHP form handlers are separate.

### Current Review Notes
- The production build passed during the latest repository review. The project lint command reports existing repository-wide errors, and the full dependency audit still flags development-tooling packages.
- The PHP form endpoints need server-side abuse controls; the Node in-memory rate limiter does not cover those PHP routes.
- See [`documents/security_audit.md`](documents/security_audit.md) for the current static review and the open deployment/merge findings.

## Original Design Brief
The following quote records the original visual requirements; it is historical context, not a current deployment instruction:

> "i want this website similar to https://kips.edu.pk/ but DO NOT AND I REPEAT DOI NOT COPY THE WEBSITE AT ALL keep things similar to kips but add more things by yourself i want it profesional educational website the color pallete should be navy blue Deep indigo and white mixture with some shapes having navy blue as main colour and a outline or another shave of same shape behind it as liek a shadow to be a little lighter just analyze https://kips.edu.pk/ and also the notice system should be like it shouldnt show a notice box like in a box but only the banner should appear also change the funcatinaly of the banner from cms as like the banner should be clickable if htere is a link attached to it from the cms"
