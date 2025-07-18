# Using Google Sheets as the Word Bank Source

This project supports loading word banks from a Google Sheet instead of the static `words.json` file. This allows you to update word lists and categories online, without redeploying the app.

## How It Works
- The app can load word banks from either a local JSON file or a Google Sheet, based on configuration in `environment.ts`.
- When set to use Google Sheets, the app fetches the sheet (as XLSX or CSV) at runtime and parses it into the same structure as `words.json`.
- A proxy is used during development to bypass CORS restrictions when accessing Google Sheets.

## Setup Steps

### 1. Prepare Your Google Sheet
- Each sheet/tab is a word bank (category). Name the tab as you wish (e.g., `Animals|חיות`).
- Each tab must have:
  - Row 1: Header with `eng` in column A and `heb` in column B.
  - Rows 2+: English/Hebrew word pairs in columns A/B.
  - (Optional) After an empty row, a table with `property` and `value` columns for bank-level settings (e.g., wildcards, images).
- **Publish the sheet to the web:**
  - In Google Sheets: File → Share → Publish to web → Entire Document → Publish.
  - The sheet must be public for the app to access it.

### 2. Update the App Configuration
- In `src/environments/environment.ts` and `environment.prod.ts`, set:
  ```typescript
  export const environment = {
    production: false,
    wordBankSource: 'google', // 'google' or 'local'
    googleSheetUrl: '/wordbank/spreadsheets/d/{SHEET_ID}/export?format=xlsx' // or CSV if preferred
  };
  ```
- Replace `{SHEET_ID}` with your actual Google Sheet ID.

### 3. Proxy Setup for Local Development
- The app uses a proxy to avoid CORS issues:
  - `proxy.conf.json`:
    ```json
    {
      "/wordbank": {
        "target": "https://docs.google.com",
        "secure": true,
        "changeOrigin": true,
        "pathRewrite": { "^/wordbank": "" },
        "logLevel": "debug"
      }
    }
    ```
  - `angular.json` is configured to use this proxy for `ng serve`.

### 4. How the App Loads the Word Bank
- On startup, the app checks `wordBankSource`:
  - If `'google'`, it fetches and parses the Google Sheet.
  - If `'local'`, it loads `words.json` as before.
- If the online fetch fails (e.g., sheet is not public), the app falls back to the local JSON.

### 5. Troubleshooting
- **CORS errors:** Make sure the sheet is published to the web and the proxy is configured.
- **Login redirect:** If you see a Google login page, the sheet is not public.
- **CSV support:** You can use the CSV export link for a specific tab:
  `/wordbank/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet={SHEET_NAME}`
- **Structure:** The Google Sheet must match the expected structure (see above).

## Example Sheet Structure
| eng     | heb     |
|---------|---------|
| apple   | תפוח    |
| orange  | תפוז    |
| ...     | ...     |

After an empty row:
| property | value   |
|----------|---------|
| wildcard | 🍎      |

## Summary
- Make your Google Sheet public and structured as described.
- Update the app config to point to your sheet.
- Use the proxy for local development.
- The app will now use your online word bank!
