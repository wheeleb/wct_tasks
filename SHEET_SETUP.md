# Save volunteers in a Google Sheet

The website talks to a small Google Apps Script attached to a Google Sheet. Each task is one row. Volunteer emails and phone numbers are saved in the sheet but are never shown on the website.

## 1. Create the sheet and add the script

1. Create a blank Google Sheet (for example "WCT Volunteer Tasks") with the Google account that should own the data.
2. Open **Extensions > Apps Script**.
3. Delete the code in the editor, paste in all of `apps-script/Code.gs` from this repo, and click **Save**.
4. Click the gear icon (**Project Settings**), scroll to **Script Properties**, and add a property named `ADMIN_KEY` with a passcode of your choice. Organizers type this passcode on the website to add new tasks.
5. Back in the editor, choose `setup` in the function menu and click **Run**. Approve the permissions when asked (Advanced > Go to project > Allow). A **Tasks** tab with the starter tasks now appears in the sheet.

## 2. Publish the script

1. Click **Deploy > New deployment**, and pick the type **Web app**.
2. Set **Execute as** to **Me** and **Who has access** to **Anyone**.
3. Click **Deploy** and copy the **Web app URL**.

## 3. Connect the website

In Vercel, open the project, go to **Settings > Environment Variables**, and add:

    VITE_SHEET_API_URL = (the Web app URL you copied)

Then redeploy (Deployments > the latest one > Redeploy). Environment variables are read when the site is built, so a redeploy is required.

For local development, copy `.env.example` to `.env.local` and paste the URL there.

## Good to know

- Committee members can read the sheet and change a task's title, date, status or owner name directly. Please leave the `helpers` and `updates` columns alone, because they hold structured data.
- If you edit `Code.gs` later, use **Deploy > Manage deployments > Edit > New version** so the live address picks up the change.
- Anyone with the website link can sign up and post updates. The status and notes they post are public.
