import BaseAppContainer from "components/app-container";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { adminTabs, userTab } from "./common/utils/constants";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { isEmpty } from "lodash";
import actions from "stores/actions";

const AdminPanel = () => {
    const dispatch = useAppDispatch();
    const { ownerships } = useAppSelector((state) => ({
        ownerships: state.ims.ims.ownerships,
        users: state.ims.ims.users,
    }));

    const [currentTab, setCurrentTab] = useState<string>(adminTabs[0].value);
    const { pathname, state } = useLocation();
    const role = localStorage.getItem("role");
    const navigate = useNavigate();
    const tabChanged = (event: React.ChangeEvent<{}>, newValue: string) => {
        navigate(`/admin${newValue}`);
    };
    useEffect(() => {
        //@ts-ignore
        if (!(state && state?.ischildren)) {
            if (pathname.substring(pathname.lastIndexOf("/") - 1) !== currentTab) {
                setCurrentTab(pathname.substring(pathname.lastIndexOf("/")));
            }
            if (pathname === "/admin") {
                setCurrentTab(adminTabs[0].value);
                navigate(`${pathname}${adminTabs[0].value}`);
            }
        }
        //Change this to go to admin/users
        //eslint-disable-next-line
    }, [pathname]);

    useEffect(() => {
        //@ts-ignore
        if (!(state && state?.ischildren)) {
            document.title = `Tailorbird | Admin`;
            if (pathname === "/admin") {
                setCurrentTab(adminTabs[0].value);
                navigate(`${pathname}${adminTabs[0].value}`);
            }
        }
        if (isEmpty(ownerships)) {
            dispatch(actions.imsActions.fetchOwnershipStart({}));
        }
        dispatch(actions.imsActions.fetchAllUsersStart({}));

        dispatch(actions.imsActions.fetchContractorStart({}));

        //eslint-disable-next-line
    }, []);

    return (
        <>
            <BaseAppContainer
                title="Admin"
                tabList={role === "contractor_admin" ? userTab : adminTabs}
                currentTab={currentTab}
                tabChanged={tabChanged}
            />
            <Outlet />
        </>
    );
};

export default AdminPanel;
