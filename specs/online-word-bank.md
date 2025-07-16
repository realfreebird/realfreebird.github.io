# Feature Plan: Online Word Bank via Google Sheets

## Overview
This feature enables loading the word bank from an online Google Sheets Excel file instead of the built-in `words.json`. The source is controlled by a property in `environment.ts`.

## Excel File Structure
- Each tab is a word bank, named `[eng|heb]` (e.g., `Hmmm|המממ`).
- Each tab contains:
  - A header row: `eng` (A) and `heb` (B).
  - A list of English/Hebrew word pairs in columns A/B, starting from row 2.
  - The list ends with an optional empty row.
  - After the optional empty row, an optional table with columns: `property` and `value` (for bank-level settings like wildcards, images, etc.).

## Requirements

1. **Configuration**
   - Add to `environment.ts`:
     - `wordBankSource: 'google' | 'local'` (default: `'google'`)
     - `googleSheetUrl: string` (published Excel/CSV/JSON endpoint)
   - **Validate:** Ensure the new properties are present and correct in `environment.ts` before proceeding.

2. **Fetching & Parsing**
   - If `wordBankSource` is `'google'`, fetch and parse the online file.
   - If `'local'`, use the existing `words.json`.
   - For each tab:
     - Read word pairs from columns A/B, skipping the header, until the first empty row.
     - After the empty row, read the `property`/`value` table for bank settings.
   - **Validate:** Confirm that both sources can be loaded and parsed as expected before moving on.

3. **Integration**
   - Update `words-bank.service.ts` to support both sources.
   - Ensure the rest of the app works transparently with either source.
   - **Validate:** Test the app with both sources and verify seamless switching.

4. **Fallback**
   - If the online file is unavailable or parsing fails, fall back to `words.json`.
   - **Validate:** Simulate failure scenarios and confirm fallback works correctly.

## Technical Details: Reading the Online XLSX File
- Use a library such as [`xlsx`](https://www.npmjs.com/package/xlsx) (SheetJS) to parse Excel files in the browser or via HTTP.
- Fetch the XLSX file as an ArrayBuffer using `HttpClient` (Angular) or `fetch` API.
- Use `XLSX.read(arrayBuffer, { type: 'array' })` to parse the workbook.
- For each sheet (tab):
  - Use `XLSX.utils.sheet_to_json(sheet, { header: 1 })` to get a 2D array of rows.
  - Skip the header row, then read word pairs from columns A/B until the first empty row.
  - After the empty row, parse the `property`/`value` table into a key-value object for bank settings.
- Convert the parsed data into the same structure as the local `words.json` for compatibility.
- Consider supporting Google Sheets' CSV/TSV export if direct XLSX is not available.
- Handle CORS and public access permissions for the online file.

## Example: `environment.ts`
```typescript
export const environment = {
  production: false,
  wordBankSource: 'google', // 'google' or 'local'
  googleSheetUrl: 'https://docs.google.com/...' // published link to the sheet
};
```

## Implementation Steps
1. Update `environment.ts` with new properties.
   - **Validate:** Check that the app compiles and the environment variables are accessible.
2. In `words-bank.service.ts`:
   - Add logic to fetch and parse the Google Sheets file.
   - Parse each tab as a bank, extract word pairs and properties.
   - Fallback to local JSON if needed.
   - **Validate:** Ensure both sources work and fallback triggers as expected.
3. Refactor code to use the new data structure if necessary.
   - **Validate:** Confirm the app functions as before with the new structure.
4. Document the new feature and configuration in `README.md`.
   - **Validate:** Ensure documentation is clear and up to date.

## Future Work
- Add unit tests for the new loading/parsing logic.

---

## Checklist
- [ ] `environment.ts` updated with `wordBankSource` and `googleSheetUrl`.
- [ ] Fetching/parsing logic for both sources implemented.
- [ ] Fallback to local JSON works if online fetch fails.
- [ ] App works transparently with either source.
- [ ] Documentation updated.
- [ ] (Future) Unit tests for loading/parsing logic.

---

## Food for Thought
- For CORS: Ensure the Google Sheet is published and accessible to all, or consider a proxy if needed.
- Add error logging or user feedback if the online fetch fails and fallback is triggered.
- Consider caching the online word bank in local storage for offline resilience.
- If supporting CSV/TSV, clarify how to map those to the same structure as XLSX.
- For unit tests, mock HTTP requests and simulate both success and failure cases.
- Consider versioning or cache-busting for the online sheet to avoid stale data.
- Review security implications of loading external data into the app.

---

**Note:** The English/Hebrew columns in each tab have a header row.
