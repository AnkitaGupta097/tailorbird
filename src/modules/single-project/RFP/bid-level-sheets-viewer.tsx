import React, { useEffect, useRef } from "react";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tab,
    TabProps,
    Tabs,
    styled,
} from "@mui/material";
import BaseButton from "components/base-button";
import { useState } from "react";
import { read, utils } from "xlsx";
import "./bid-level-sheets-viewer.css";
import { IFileDetails } from "stores/single-project/interfaces";
import moment from "moment";

const StyledTab = styled(Tab)<TabProps>(({ theme }) => ({
    color: theme.palette.text.primary,
}));

type IBidLevelSheetsViewerProps = {
    open: boolean;
    file?: IFileDetails;
    onClose: any;
    isGoogleSheet: boolean;
    fileBuffer?: object;
};

function BidLevelSheetsViewer({
    open,
    file,
    isGoogleSheet,
    onClose,
    fileBuffer,
}: IBidLevelSheetsViewerProps) {
    const tbl = useRef(null);

    const [tabValue, setTabValue] = useState<number>(0);
    const [__html, setHtml] = useState<string>("");
    const [sheets, setSheets] = useState<string[]>([]);
    const [useSSOUrl, setUseSSOUrl] = useState<boolean>(false);

    useEffect(() => {
        if (fileBuffer) {
            let workBook = read(fileBuffer);
            const ws = workBook.Sheets[workBook.SheetNames[0]];
            const data = utils.sheet_to_html(ws);
            setHtml(data);
            setSheets(workBook.SheetNames);
        }

        return () => {
            setTabValue(0);
            setHtml("");
            setSheets([]);
        };
    }, [fileBuffer]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        let workBook = read(fileBuffer);
        const ws = workBook.Sheets[workBook.SheetNames[newValue]];
        const data = utils.sheet_to_html(ws);
        setHtml(data);
        setTabValue(newValue);
    };
    const user: any = JSON.parse(localStorage.getItem("user_details") || "{}");

    const user_metadata_key: string | undefined = Object.keys(user).find(
        (x) => x.indexOf("user_metadata") !== -1,
    );

    useEffect(() => {
        // Fot TB Admin users who dont have google workspace email, SSO will not work
        // As its interim solution, we will try showing it as it is
        if (user_metadata_key) {
            const user_metadata: any = user[user_metadata_key];
            if (user_metadata?.google_workspace_email) {
                setUseSSOUrl(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth={"lg"}
            PaperProps={{
                sx: {
                    height: "80%",
                },
            }}
        >
            <DialogTitle>
                {isGoogleSheet
                    ? `Leveled Bid Sheet - ${moment(file?.created_at).format("MM/DD/YYYY")}`
                    : file?.file_name}{" "}
                {!isGoogleSheet && sheets.length > 1 && (
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        {sheets.map((sheet: string, i: number) => (
                            <StyledTab label={sheet} key={i} />
                        ))}
                    </Tabs>
                )}
            </DialogTitle>
            <DialogContent>
                {isGoogleSheet ? (
                    <iframe
                        src={useSSOUrl ? file?.gdoc_sso_url : file?.file_name}
                        title="Bidsheet"
                        width="100%"
                        height="99%"
                        style={{ border: "none" }}
                    ></iframe>
                ) : (
                    <Box>
                        <Box sx={{ overflow: "auto" }}>
                            <Box
                                className="excel-like"
                                ref={tbl}
                                dangerouslySetInnerHTML={{ __html }}
                            />
                        </Box>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <BaseButton
                    label="Close"
                    classes="Base-scope-create-button active"
                    onClick={onClose}
                    sx={{ marginLeft: "1rem" }}
                />
            </DialogActions>
        </Dialog>
    );
}

export default BidLevelSheetsViewer;
