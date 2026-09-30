# dhanush — personal website

A static, multi-page site. No build step, no framework.

```
index.html        Profile (home)
projects.html     Projects: filter by tag, search, and a detail view per project (projects.html#<id>)
research.html     Research interests with open questions and links to related projects
writeups.html     Blog-style writeups (writeups.html#<id>)
resume.html       HTML resume + PDF download
assets/
  content.js      ← ALL CONTENT LIVES HERE. Edit this file to update the site.
  site.js         Header, footer, theme toggle, Ctrl/⌘K command palette, page rendering
  styles.css      Design tokens (light + dark) and components
  resume.pdf      The file behind "Download PDF"
```

## Editing content

Open `assets/content.js`:

- **Projects**: add an object to `projects`. `tags` become filter chips automatically. Fill `repo` / `demo` with URLs to show Code / Live demo buttons (empty strings are hidden).
- **Writeups**: add to `writeups`. The body is a list of blocks: `{ h: "Heading" }`, `{ p: "Paragraph" }`, `{ list: ["a", "b"] }`, `{ code: "...", lang: "sql" }`. Paragraphs that start with `TODO:` are highlighted so you can find what to finish. Change `status: "draft"` to `"published"` to remove the Draft badge.
- **Research**: `evidence` lists project ids that link from each area.
- **Resume PDF**: replace `assets/resume.pdf` with the latest version (keep the file name).

## Preview locally

Double-click `index.html`, or run a tiny server:

```
python -m http.server 8000
```

then open http://localhost:8000.

## Deploy on GitHub Pages (free)

1. Create a repo named `DhanushRamachandran.github.io`.
2. Push these files to the `main` branch root.
3. Repo → Settings → Pages → Source: *Deploy from a branch*, `main` / root.
4. The site goes live at https://dhanushramachandran.github.io

Netlify or Vercel also work: drag this folder onto their dashboard.

## Keyboard

- `Ctrl K` / `⌘K` or `/` opens the command palette (jump to any page, project or writeup, copy email, toggle theme).

## Admin tool (edit and publish without touching code)

Double-click **`_admin/start-admin.bat`**. It opens http://127.0.0.1:8787 in your browser.

- Edit Profile, Highlights, Experience, Projects, Research, Writeups, Skills and Education with forms.
- **Save** (Ctrl+S) writes `assets/content.js`. The previous version is kept in `_admin/backups/`.
- **Preview site** shows your saved changes locally.
- **Resume & images** replaces `assets/resume.pdf` and uploads project cover images to `assets/img/`.
- **Publish** commits and pushes to GitHub. GitHub Pages redeploys the live site in a minute or two.

Needs Python 3 (Anaconda works) and Git for Windows (https://git-scm.com/download/win).
The first time, the Publish tab walks you through connecting the GitHub repository.
The `_admin` folder is pushed with the site but GitHub Pages doesn't serve folders starting with `_`, so the admin never appears on the live site. It only runs on your computer.
