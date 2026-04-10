# Lucid Heights Film — Website

Cinematic website for Lucid Heights Film by Cody Harper.
Built as a static HTML/CSS/JS site, deployable on GitHub Pages for free.

---

## File Structure

```
lucid-heights/
├── index.html          ← Homepage
├── style.css           ← Shared styles (all pages)
├── main.js             ← Shared scripts (all pages)
├── weddings/
│   └── index.html
├── commercial/
│   └── index.html
├── realestate/
│   └── index.html
├── work/
│   └── index.html
├── contact/
│   └── index.html
└── booknow/
    └── index.html
```

---

## HOW TO DEPLOY ON GITHUB PAGES

### Step 1 — Create a GitHub account
Go to github.com and sign up for a free account if you don't have one.

### Step 2 — Create a new repository
1. Click the "+" icon in the top right → "New repository"
2. Name it exactly: `lucidheightsfilm.com` (or any name you want)
3. Set it to **Public**
4. Click "Create repository"

### Step 3 — Upload your files
1. On your new repository page, click "uploading an existing file"
2. Drag and drop ALL the files and folders from this zip onto the page
3. Make sure the folder structure is preserved (weddings/, commercial/, etc.)
4. Scroll down, click "Commit changes"

### Step 4 — Enable GitHub Pages
1. Go to your repository Settings (tab at the top)
2. Scroll down to "Pages" in the left sidebar
3. Under "Branch", select "main" and click Save
4. Wait 1-2 minutes — GitHub will give you a live URL like:
   `https://yourusername.github.io/lucidheightsfilm.com`

### Step 5 — Connect your custom domain (lucidheightsfilm.com)
1. Still in Pages settings, enter `lucidheightsfilm.com` in the "Custom domain" box
2. Log into wherever your domain is registered (GoDaddy, Namecheap, etc.)
3. Add these DNS records:
   - Type: A | Name: @ | Value: 185.199.108.153
   - Type: A | Name: @ | Value: 185.199.109.153
   - Type: A | Name: @ | Value: 185.199.110.153
   - Type: A | Name: @ | Value: 185.199.111.153
   - Type: CNAME | Name: www | Value: yourusername.github.io
4. Wait up to 24 hours for DNS to propagate
5. Check "Enforce HTTPS" in GitHub Pages settings once it verifies

That's it. Your site is live at lucidheightsfilm.com — free forever.

---

## CONTACT FORM NOTE

The contact form uses a mailto: fallback by default.
For a real working form (without a backend), sign up free at formspree.io,
create a form, and replace the form action URL in contact/index.html with
your Formspree endpoint (looks like: https://formspree.io/f/xabcdef).

---

## UPDATING THE SITE

To update content later:
1. Edit the HTML files on your computer
2. Go to your GitHub repository
3. Click the file you want to update → pencil icon to edit → commit
OR drag new files onto the repository to replace them.
Changes go live in about 60 seconds.

---

Built by Claude (Anthropic) for Lucid Heights Film © 2026
