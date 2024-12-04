import reducer from "./slice";

export type { IPackage } from "./interface";
export { saga as packageManagerSaga } from "./saga";

export { actions } from "./slice";
export default reducer;
