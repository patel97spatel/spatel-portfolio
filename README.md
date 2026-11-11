# Sanjay Patel — Software Engineer Portfolio

A responsive React + Vite portfolio with restrained motion, a coding-themed cursor accent and skills explorer, project detail dialogs, and a WhatsApp contact flow. The cursor accent is only shown for a mouse on hover-capable devices and is disabled for reduced-motion preferences.

## Run locally

```sh
npm install
npm run dev
```

Before deploying, run:

```sh
node --test tests/ticTacToe.test.js
npm run lint
npm run build
```

## Tools and workflow

- **React + Vite** provide the portfolio UI and development/build workflow.
- **Motion** handles section reveals and project-dialog transitions; reduced-motion preferences are respected.
- **Lucide React** provides interface icons; custom CSS supplies the responsive layout and visual theme.
- **VS Code + GitHub Copilot** can be used to edit the site and its structured content. Claude or another AI assistant can help plan copy and review changes; verify generated content against your actual résumé and project notes.
- **GitHub** stores the repository. Pushing to `main` triggers **GitHub Actions** to lint, build and deploy the static site to **GitHub Pages**.

The site has no database or application backend. The contact form opens a prefilled WhatsApp message; it does not collect or store submissions.

## Personalize the content

Edit [`src/data/portfolio.js`](./src/data/portfolio.js) to update the profile, skills, employment history, résumé-listed projects, education, certifications, languages, writing topics, and contact links. The skills section shows a short overview and opens a filterable, code-themed explorer for the complete skills list.

The projects section features four projects initially. Project cards use illustrated, domain-themed banners rather than screenshots; their artwork is configured by project ID in [`src/ProjectArtwork.jsx`](./src/ProjectArtwork.jsx). **Browse all projects** starts a tic-tac-toe challenge against the computer; winning unlocks a searchable directory with All, Company, Personal, and Other categories for the current page session. Draws and losses can be retried, and the featured projects remain accessible without playing. This is a playful client-side interaction, not access control. Project cards open a detail view with the résumé-backed employer, role, period, domain, and location. The uploaded résumé lists 15 company projects; personal and other categories remain ready for projects you share later.

The profile, work history, project names, education, skills and certifications are transcribed from the uploaded résumé. Language levels use the levels confirmed by the portfolio owner. Project-specific technical stacks, responsibilities and outcomes have not been invented.

The contact section and the quick-connect panel below the hero use `profile.email`, `profile.phone`, `profile.phoneDisplay`, and `profile.links` in [`src/data/portfolio.js`](./src/data/portfolio.js). Set `profile.links.naukri` to a public profile URL when available; until then the Naukri option opens an email request. Add a GitHub URL to `profile.links.github` when ready. The contact form opens a prefilled WhatsApp message and does not store submissions. A home address and alternate phone number from the résumé are intentionally not published.

To enable the résumé download, copy the approved PDF to `public/Sanjay-Patel-Resume.pdf` and set `profile.resumePath` to `/Sanjay-Patel-Resume.pdf`.

## GitHub Pages deployment

The Vite base path and workflow target the repository `sanjay-patel-portfolio`.

1. Create a GitHub repository with that name and push this project to its `main` branch.
2. In repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` runs lint and build, then deploys the `dist` folder on every push to `main`.

If you choose a different repository name, update `base` in `vite.config.js` to `/<repository-name>/`.
