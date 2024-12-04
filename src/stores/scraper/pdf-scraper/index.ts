import reducer from "./pdf-scraper-slice";

export type { Iscraper } from "./pdf-scraper-interface";
export { saga as pdfscraperSaga } from "./pdf-scraper-saga";

export { actions } from "./pdf-scraper-slice";
export default reducer;
