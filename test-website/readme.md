# Test Website

This test website is based on the Simple CMS Starter Template of [@directus-labs](https://github.com/directus-labs/).

## Setup Instructions

- Directus (Part 1)

  1.  Open your local Directus Repo, but stay on the `main` branch
  2.  Create a new database (sqlite is recommended) and add the env config for it
  3.  Run `pnpm --filter api cli bootstrap` to set up the db
  4.  Run the dev servers as usual: `pnpm --filter api dev` and `pnpm --filter app dev`
  5.  Login to Directus Studio, create a token for your user and have it ready

- Visual Editing Package (Part 1)

  1. Clone the separate visual-editing package repo, open it in (a separate window in) VS Code and checkout the `init`
     branch.
  2. Add the env vars to `test-website/simple-cms/nuxt/.env` and make sure to provide `<your-token>` and the correct
     `DIRECTUS_URL`

     ```sh
     DIRECTUS_URL=http://localhost:8080
     DIRECTUS_FORM_TOKEN=<your-token>
     DIRECTUS_SERVER_TOKEN=<your-token>
     NUXT_PUBLIC_SITE_URL=http://localhost:3000
     ```

  3. Now, install the Directus template

     ```sh
     cd test-website/template && npm run setup-directus
     ```

- Directus (Part 2)

  1. Switch to your local Directus Repo and checkout the branch `florian/web-548-directus-studio-changes`
  2. Run the migration: `pnpm --filter api cli database migrate:latest`
  3. Run the build: `pnpm build`
  4. Make sure the CSP env var is set, like this:

     ```sh
     CONTENT_SECURITY_POLICY_DIRECTIVES__FRAME_SRC=http://localhost:3000
     ```

  5. Run the dev servers as usual: `pnpm --filter api dev` and `pnpm --filter app dev`

- Visual Editing Package (Part 2)

  1. Switch to the local visual-editing package repo
  2. Install the package: `pnpm i`
  3. Build the package: `pnpm build`
  4. Then install the test-website dependencies: `cd test-website/simple-cms/nuxt/ && pnpm i`
  5. And run it with `cd test-website/simple-cms/nuxt/ && pnpm visual-editing:ssr--refresh`

     > [!NOTE]  
     > See the description of the different “Test Modes” below

- Directus Studio

  1. Switch to Directus Studio
  2. Enable the Visual Editor module in the settings and move it to the second position
  3. Add the following URLs to the Visual Editor settings (on the settings page)

     - `http://localhost:3000`
     - `http://localhost:3000/blog`
     - `http://localhost:3000/blog/why-steampunk-rabbits-are-the-future-of-work`

       > [!NOTE]  
       > The last two URLs are for testing purposes only. You do not need to add every page URL of your website to
       > access them with the Visual Editor.

  4. Open the Visual Editor Module

## Test Modes

Use the following commands to run predefined test environments. Find the corresponding code by searching for
`useVisualEditingTest` or `testCase` in the test-website directory to see how it is set up.

> [!NOTE]  
> Be sure to stop other servers running on localhost:3000

```sh
# commands

pnpm visual-editing:monolith

pnpm visual-editing:ssr
pnpm visual-editing:ssr--refresh-all
pnpm visual-editing:ssr--refresh
pnpm visual-editing:ssr--refresh-customized # http://localhost:3000/blog
pnpm visual-editing:ssr--methods # http://localhost:3000

pnpm visual-editing:dev
pnpm visual-editing:dev--refresh-all
pnpm visual-editing:dev--refresh
pnpm visual-editing:dev--refresh-customized # http://localhost:3000/blog
pnpm visual-editing:dev--methods # http://localhost:3000

pnpm visual-editing:ssg # http://localhost:3000/blog/why-steampunk-rabbits-are-the-future-of-work
```

### Rendering modes:

- Monolith / server only rendering: use as with php
- SSG: live data only on hydration
- SSR: always with live data
- Dev mode: if you want to play around

### Test Cases

- `basic`
  - No `onSaved` callback — the web page inside the iframe will be reloaded (`window.location.reload()`)
  - Editable elements are added and removed globally on route change
  - Rendering modes: `monolith` || `dev` || `ssr`
  - Search for `testCase === 'basic'`
- `refresh-all`
  - `onSaved` will refetch all data with `refreshNuxtData()`
  - Editable elements will be added and removed globally on route changes
  - Rendering modes: `dev` || `ssr`
  - Search for `testCase === 'refresh-all'`
- `refresh` _(smooth, recommended)_
  - `onSaved` will call refetch all data where it was originally fetched.
  - Editable elements are only removed globally on route changes, they are added in nested components where data is
    fetched, so that their `refresh()` function can be passed to `onSaved`. This should provide the smoothest experience
    without layout shifts.
  - Rendering modes: `dev` || `ssr`
  - Search for `testCase === 'refresh'`
- `refresh-customized`
  - The best way to see this on the test website is to open this page in the Visual Editor: http://localhost:3000/blog
  - Exactly the same as `refresh` above, except that custom classes are attached to some editable elements to
    demonstrate customizability.
  - Rendering modes: `dev` || `ssr`
  - Search for `testCase === 'refresh-customized'`
- `refresh-methods`
  - The best way to see this on the test website is to open this page in the Visual Editor: http://localhost:3000
  - Exactly the same as `basic` above, except that there are buttons to test some useful functions/methods
  - Rendering modes: `dev` || `ssr`
  - Search for `testCase === 'refresh-methods'`
- `refresh-ssg`
  - The best way to see this on the test website is to open this page in the Visual Editor:
    http://localhost:3000/blog/why-steampunk-rabbits-are-the-future-of-work
  - Exactly the same as `refresh` above, except that it is only available for SSG and on a blog page `/blog/[slug]`
  - Rendering modes: `ssg`
  - Search for `testCase === 'refresh-ssg’`
