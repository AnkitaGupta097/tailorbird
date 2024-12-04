import React, { useEffect } from "react";
import { isEmpty } from "lodash";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import BaseLoader from "../../components/base-loading";
import { FeatureFlagConstants, PATH_BY_ROLE } from "../../utils/constants";
import { useFeature } from "@growthbook/growthbook-react";

function Init() {
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const tbOrgIds = useFeature(FeatureFlagConstants.TB_ORG_IDS)?.value ?? [];
    const isUserCM =
        isEmpty(tbOrgIds) || isEmpty(localStorage.getItem("organization_id"))
            ? false
            : localStorage.getItem("role") === "admin" &&
              !tbOrgIds.includes(localStorage.getItem("organization_id"));
    console.log("Growthbook tb_org_id", tbOrgIds);

    useEffect(() => {
        console.log("Search params--", searchParams);
        let roleVal = localStorage.getItem("role");
        let id = localStorage.getItem("id");
        if (roleVal) {
            if (pathname == "/callback" || pathname === "/") {
                // can be removed if we update redirect url to /invite from ims after resetting password
                if (
                    searchParams.get("message") ==
                    "You can now login to the application with the new password."
                ) {
                    console.log("navigating to invite url");
                    navigate("/invite");
                    return;
                }
                let OriginUrl = localStorage.getItem("originUrl");
                if (OriginUrl == "/") {
                    OriginUrl = PATH_BY_ROLE[roleVal] || `/rfp/${roleVal}/${id}/projects`;
                }

                if (isUserCM) {
                    OriginUrl = "/consumer/projects";
                }

                console.log("navigate url -> ", OriginUrl);
                OriginUrl && navigate(OriginUrl);
            }
        }

        // eslint-disable-next-line
    }, [searchParams]);

    return (
        <div>
            <BaseLoader />
        </div>
    );
}

export default Init;
