import { Divider, Grid, IconButton, List, ListItem, Typography } from "@mui/material";
import React from "react";
import { AGREEMENT_TYPES } from "../constants";

type IAgreementFilters = {
    agreementList: any[];
    setFilteredList: React.Dispatch<React.SetStateAction<any[]>>;
    setFilter?: any;
};

const AgreementFilters = ({ agreementList, setFilteredList, setFilter }: IAgreementFilters) => {
    const handleAgreementTypeFilter = (type: string) => {
        let filteredList = type === "executed" ? agreementList : [];

        setFilteredList(filteredList);
        setFilter && setFilter(type);
    };

    const handleContractorFilter = (contractor_id: string) => {
        let filteredList = agreementList?.filter(
            (agreement) => agreement?.contractor_org_id === contractor_id,
        );

        setFilteredList(filteredList);
        setFilter && setFilter(contractor_id);
    };
    return (
        <Grid
            container
            flexDirection={"column"}
            gap={4}
            style={{ border: "1px solid #C9CCCF", borderRadius: "4px", padding: "32px" }}
        >
            <Grid>
                <Typography color={"#004D71"} fontWeight={"bold"} fontSize={"18px"}>
                    {"Agreement Type"}
                </Typography>
                <List>
                    {Object.keys(AGREEMENT_TYPES).map((type: string) => {
                        const count = type === "executed" ? agreementList?.length : 1;
                        let label = `${AGREEMENT_TYPES[type]}`;
                        if (count > 0) {
                            label = `${label} (${count})`;
                        }
                        return (
                            <ListItem key={type} style={{ cursor: "pointer" }} onClick={() => {}}>
                                <IconButton
                                    onClick={() => handleAgreementTypeFilter(type)}
                                    sx={{ padding: "0px 0px" }}
                                >
                                    <Typography variant="text_12_regular" color="#202223">
                                        {label}
                                    </Typography>
                                </IconButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Grid>
            {agreementList && agreementList.length > 0 && (
                <>
                    <Divider />
                    <Grid>
                        <Typography color={"#004D71"} fontWeight={"bold"} fontSize={"18px"}>
                            {"Contractor"}
                        </Typography>
                        <List>
                            {agreementList.map((agreement: any) => {
                                const count = 1;
                                let label = `${agreement?.contractor_name}`;
                                if (count > 0) {
                                    label = `${label} (${count})`;
                                }
                                return (
                                    <ListItem
                                        key={agreement?.contractor_org_id}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {}}
                                    >
                                        <IconButton
                                            onClick={() =>
                                                handleContractorFilter(agreement?.contractor_org_id)
                                            }
                                            sx={{ padding: "0px 0px" }}
                                        >
                                            <Typography variant="text_12_regular" color="#202223">
                                                {label}
                                            </Typography>
                                        </IconButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Grid>
                </>
            )}
        </Grid>
    );
};

export default AgreementFilters;
