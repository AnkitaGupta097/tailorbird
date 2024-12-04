import reducer from "./scraper-slice";

export type { Iscraper } from "./scraper-interface";
export { saga as scraperServiceSaga } from "./scraper-saga";

export { actions } from "./scraper-slice";
export default reducer;
