# Patient Satisfaction & Staff Analytics

A web app where patients anonymously rate the healthcare professional who cared for them, and clinic managers can log in to review the results.

**Live demo:** _coming soon_

<!-- Add a screenshot here once you have one:
![Survey form](screenshots/survey-form.png)
-->

## Features

- **Anonymous patient survey:** pick a healthcare professional, leave a 1-5 rating and an optional comment.
- **No personal data collected:** no names, accounts, or medical information.
- **Cloud database:** responses are stored in Supabase (PostgreSQL).
- **Dynamic provider list:** the dropdown is loaded from the database, so staff can be added without touching the code.
- **Password-protected admin page:** only a logged-in admin can read responses.
- **Database-level security:** Row Level Security rules let the public submit responses but never read them.

## Tech Stack

- HTML, CSS, and vanilla JavaScript (no framework)
- [Supabase](https://supabase.com/): PostgreSQL database, authentication, and Row Level Security
- Deployment: Vercel or Netlify _(planned)_

## How It Works

1. The survey page loads the list of providers from Supabase.
2. The patient submits a rating and comment, and the form inserts one row into the `responses` table.
3. The admin page uses Supabase Auth for login. Only logged-in users can read the `responses` table.

## Privacy and Security Design

- The survey form has no name, email, or health fields, and a note asks patients not to include personal details in comments.
- **Row Level Security (RLS)** is enabled on every table:
  - Anonymous visitors can read providers and insert responses.
  - Anonymous visitors cannot read responses.
  - Only authenticated admins can read responses.
- Public sign-ups are disabled, so only accounts created by the project owner can log in.
- Only the public (publishable) Supabase key is used in the front-end code. The secret key is never included.

This is a portfolio project. A real clinic deployment would need a proper privacy and compliance review.

## Database Schema

```sql
create table providers (
  id bigint generated always as identity primary key,
  name text not null,
  role text
);

create table responses (
  id bigint generated always as identity primary key,
  provider_id bigint not null references providers(id),
  rating int not null check (rating between 1 and 5),
  comments text,
  created_at timestamptz not null default now()
);

alter table providers enable row level security;
alter table responses enable row level security;

create policy "Anyone can read providers"
  on providers for select to anon using (true);

create policy "Anyone can submit a response"
  on responses for insert to anon with check (true);

create policy "Admins can read providers"
  on providers for select to authenticated using (true);

create policy "Admins can read responses"
  on responses for select to authenticated using (true);
```

## Project Structure

```
.
├── index.html    # Patient survey page
├── styles.css    # Shared styles
├── script.js     # Survey logic (load providers, save responses)
├── admin.html    # Admin login and dashboard page
├── admin.js      # Admin login and dashboard logic
└── README.md
```

## Running It Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
   cd YOUR-REPO
   ```
2. Create a free project at [supabase.com](https://supabase.com/) and run the SQL above in the SQL Editor.
3. Add a few providers:
   ```sql
   insert into providers (name, role) values
     ('Alex Johnson', 'Nurse'),
     ('Sam Lee', 'Doctor');
   ```
4. In Supabase, go to **Authentication → Users** and create an admin user. Then turn off public sign-ups.
5. In `script.js` and `admin.js`, set `SUPABASE_URL` to your project URL and `SUPABASE_ANON_KEY` to your publishable key.
6. Open `index.html` with a local server, such as the VS Code **Live Server** extension.

## Roadmap

- [x] Patient survey form
- [x] Cloud database and security rules
- [x] Admin login
- [ ] Admin dashboard: average rating and response count per provider
- [ ] Admin dashboard: recent comments
- [ ] Live deployment

## Possible Future Improvements

- Charts and trends over time
- Filters by date range or provider
- Multiple admin accounts with roles
- Comment moderation

## What I Learned

This was my first full-stack project, and I built it from scratch to understand how a front end, a database, and authentication fit together.

- **HTML forms:** I learned how `name`, `id`, and `for` attributes connect form fields to labels and to JavaScript, and why semantic tags matter for accessibility.
- **CSS:** I learned how selectors, the box model, and states like `:focus` work, and how to reuse one rule across several elements.
- **JavaScript:** I learned to handle events, read form values, and use `async/await` to talk to a database without reloading the page.
- **Databases and security:** I set up a PostgreSQL schema in Supabase and learned why Row Level Security matters. The public key is visible in the browser, so the database rules are what actually protect the data.
- **Debugging:** The hardest part was reading errors. A missing pair of quotes caused a syntax error, and an extra `/rest/v1/` on my API URL caused a 404. I learned to read the console, find the line number, and fix problems one at a time.
- **Git and GitHub:** I practiced committing in small steps and restarting a project cleanly without losing history.

If I kept going, I would add charts to the admin dashboard and filters by date range.
