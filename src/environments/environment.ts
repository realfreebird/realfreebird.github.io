// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // wordBankSource: 'local', // 'google' or 'local'
  wordBankSource: 'google', // 'google' or 'local'
  // https://docs.google.com/spreadsheets/d/e/2PACX-1vTfKqflAKmmiKZA7xyJwy4M9893yiHzlPyf8IUokU2d5PvdiNCTmPQWArOva-LFeQ/pub?output=xlsx
  // googleSheetUrl: '/wordbank/spreadsheets/d/{SHEET_ID}/export?format=xlsx' // replace {SHEET_ID} as needed
  googleSheetUrl: '/wordbank/spreadsheets/d/e/2PACX-1vTfKqflAKmmiKZA7xyJwy4M9893yiHzlPyf8IUokU2d5PvdiNCTmPQWArOva-LFeQ/pub?output=xlsx'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
