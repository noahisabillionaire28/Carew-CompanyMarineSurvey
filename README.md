# Carew & Company Marine Survey — Website

Marketing site for CCMS (ccms-survey.com). Next.js 15, TypeScript, Tailwind CSS, Framer Motion. Static pages plus one API route that emails survey requests via Resend (with an optional Google Sheet backup). No CMS, no database.

---

## a. Run locally

1. Install Node.js 20 or newer.
2. In this folder run: `npm install`
3. Copy `.env.example` to `.env.local` and fill in the values (see sections c and d).
4. Run: `npm run dev`
5. Open http://localhost:3000
6. Before pushing, run `npm run build` — it must finish with no errors.

---

## b. Where to drop files

All files go in the `/public` folder. The site works fine without them (it shows clean placeholders), so add them whenever they're ready.

| File | What it's for | Notes |
|---|---|---|
| `/public/stanley.jpg` | Stanley's headshot on the About page | Portrait orientation (4:5), at least 800×1000. |
| `/public/field/*` | "In the Field" photos/videos on the home page | JPG/PNG/WebP or MP4. |

### Editing the home page video carousel

The three hero videos are hosted online (not in `/public`). To change a video or its headline, edit the `slides` list at the top of `/components/home/Hero.tsx`:
```ts
{ video: "https://…/your-video.mp4", title: "Short Headline", subtitle: "One short line." },
```
Keep videos muted-friendly (no audio needed), 1080p, and under ~10 MB each so they load fast on phones. Each slide advances when its video ends.

### Editing the "In the Field" grid

1. Put your files in `/public/field/` (example: `/public/field/reefer.jpg`).
2. Open `/data/field.ts`.
3. Each item looks like this:
   ```ts
   { src: "/field/reefer.jpg", alt: "Reefer container survey", type: "image" },
   ```
   - `src` = the file path starting with `/field/`. Leave it as `""` to show "Photo coming soon".
   - `alt` = a short plain-English description (used for accessibility and SEO).
   - `type` = `"image"` or `"video"`.
4. Keep 3–6 items. Save, run `npm run build`, push.

---

## c. Resend setup (sends the form emails)

1. Go to https://resend.com and create a free account.
2. Click **Domains → Add Domain** and enter `ccms-survey.com`.
3. Resend shows you 3–4 DNS records (TXT and MX records for a subdomain like `send.ccms-survey.com`, plus a DKIM TXT record). Keep that tab open.
4. Log in to **Turbify** → **Domain Control Panel** → **Advanced DNS**.
5. Add each record exactly as Resend shows it (name, type, value). If Turbify asks for the full host name, use what Resend shows.
6. Back in Resend, click **Verify**. It can take up to an hour.
7. Click **API Keys → Create API Key**. Name it "CCMS Website", permission "Sending access". Copy the key — you only see it once.
8. That key is your `RESEND_API_KEY` (see section e).

**Important:** these records are added alongside the existing DNS. They do **not** touch the existing email `MX` record for `ccms-survey.com`, so Stanley's current email keeps working. Do not delete or edit anything that's already there.

---

## d. Google Sheet setup (backup copy of every request)

1. Go to https://sheets.google.com and create a new sheet. Name it "CCMS Survey Requests".
2. In row 1, type these headers in columns A through K:
   `Submitted At | Name | Company | Phone | Email | Service | Equipment Type | Location | Units | Preferred Date | Message`
3. Click **Extensions → Apps Script**.
4. Delete the sample code. Open `/scripts/google-apps-script.gs` from this repo, copy everything, paste it in. Save.
5. Click **Deploy → New deployment**.
6. Click the gear icon → choose **Web app**.
7. Set **Execute as: Me** and **Who has access: Anyone**. Click **Deploy**.
8. Click **Authorize access** and approve the permissions for your Google account.
9. Copy the **Web app URL** (it ends in `/exec`). That is your `SHEETS_WEBHOOK_URL`.
10. Share the sheet with Stanley (carew@ccms-survey.com).

If the sheet is ever unreachable, the email still sends — the sheet is only a backup.

---

## e. Vercel deployment

1. Go to https://vercel.com and sign in with GitHub.
2. Click **Add New → Project** and import the `Carew-CompanyMarineSurvey` repo.
3. Framework is detected as Next.js. Leave the defaults.
4. Open **Environment Variables** and add these three:
   | Name | Value |
   |---|---|
   | `RESEND_API_KEY` | the key from section c |
   | `NOTIFY_EMAIL` | `carew@ccms-survey.com` |
   | `SHEETS_WEBHOOK_URL` | the URL from section d (leave blank if not set up yet) |
5. Click **Deploy**. Wait for the green check.
6. Go to **Settings → Domains**. Add `ccms-survey.com` and `www.ccms-survey.com`. Vercel will show you the DNS values to use in section f.
7. Set `ccms-survey.com` as the primary domain and let `www` redirect to it.

---

## f. Turbify DNS for the website

1. Log in to **Turbify → Domain Control Panel → Advanced DNS**.
2. **Take a screenshot of the current records before changing anything.**
3. Find the **A record** for `@` (the bare domain). Change its value to the IP address Vercel shows (currently `76.76.21.21`, but use whatever Vercel displays).
4. Find the **CNAME record** for `www`. Change its value to what Vercel shows (currently `cname.vercel-dns.com`). If there is no `www` record, add one.
5. **Do not touch the MX records.** Those handle Stanley's email.
6. **Do not change the nameservers.** Stay on Turbify's nameservers.
7. Save. DNS can take up to a few hours. Vercel's Domains page will show a green check when it's live.

---

## g. After launch

1. Go to https://business.google.com and create a Google Business Profile.
2. Business name: **Carew & Company Marine Survey**. Category: **Marine Surveyor**.
3. Address: 1816 247th Pl, Lomita, CA 90717. Phone: (310) 713-2982. Hours: Mon–Fri 9:00 AM–5:00 PM. Website: https://ccms-survey.com
4. Verify the listing (Google usually mails a postcard with a code).
5. Ask Stanley to request Google reviews from recent clients. Send them the review link from the profile dashboard.

---

## h. Staff CRM (`/admin`)

Stanley and his staff log in at **https://ccms-survey.com/admin** (there is also a small "Staff login" link in the footer). Every website request lands there automatically. Staff can search and filter leads, move them through **New → Contacted → Scheduled → Completed → Lost** (list or board view), add notes, log phone-call leads by hand, export everything to CSV, and see stats. The CRM never sends email.

### One-time setup

1. **Lead storage (Vercel Blob, private).** In Vercel open the project → **Storage** → **Create Database** → **Blob**. Name it `ccms-leads`, set access to **Private**, and connect it to the project for all environments. Vercel adds `BLOB_READ_WRITE_TOKEN` automatically. Until this exists, the admin pages show a warning and leads are not saved on production.
2. **Session secret.** Make one and add it as `SESSION_SECRET` in Vercel:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. **Staff accounts.** For each person run:
   ```
   node scripts/staff-user.mjs "Stanley Carew" stanley "their-password"
   ```
   Put the printed objects into a JSON array and save it as `STAFF_USERS` in Vercel, e.g. `[{...},{...},{...}]`.
4. **Redeploy** (Deployments → ⋯ → Redeploy) so the new variables are picked up.

### Everyday admin

- **Change a password:** run the script again for that person, replace their entry in `STAFF_USERS`, redeploy.
- **Remove someone:** delete their entry from `STAFF_USERS`, redeploy. They are logged out immediately.
- **Log everyone out:** change `SESSION_SECRET`.
- **Where the data lives:** one JSON file per lead in the private Blob store (`leads/<id>.json`). It is never reachable by URL. Export a CSV from the Leads page any time.
- **Running locally:** leave `BLOB_READ_WRITE_TOKEN` empty and leads are stored in `.crm-data/` on your machine.

---

## Project layout

```
app/            public pages under (site)/, staff CRM under admin/, API routes, sitemap, robots, icons
components/     Navbar, Footer, Logo, form, sections; admin/ holds the CRM UI
data/           site.ts (contact facts), services.ts (8 services), field.ts (media grid)
lib/schema.ts   form validation (shared by browser and server)
lib/crm/        CRM: config.ts (statuses), auth, session, store/ (blob + local), stats, csv
middleware.ts   protects /admin and /api/admin
scripts/        google-apps-script.gs, staff-user.mjs
public/         media files you add
```
