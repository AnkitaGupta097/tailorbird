import mixpanel from "mixpanel-browser";
mixpanel.init(process.env.REACT_APP_MIXPANEL_TAILORBIRD_WEB_V2_TOKEN || "MIXPANEL_TOKEN", {
    debug: false,
    ignore_dnt: true,
});
export default mixpanel;
