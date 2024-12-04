import { Grid, Typography } from "@mui/material";
import BaseAutoComplete from "components/auto-complete";
import BaseButton from "components/button";
import { isEmpty } from "lodash";
import ContractorDialog from "modules/admin-portal/contractors/contractor-dialog";
import React, { useCallback, useState } from "react";
import actions from "stores/actions";
import { useAppDispatch } from "stores/hooks";
import AddIcon from "@mui/icons-material/Add";

type IAddContractor = {
    activeStep: number;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    contractors: any[];
    selectedContractor: any;
    setSelectedContractor: React.Dispatch<React.SetStateAction<any>>;
};

const AddContractor = ({
    activeStep,
    setActiveStep,
    contractors,
    selectedContractor,
    setSelectedContractor,
}: IAddContractor) => {
    const dispatch = useAppDispatch();
    const [isNewContractor, setIsNewContractor] = useState<boolean>(false);
    const updateSelectedName = useCallback(
        (newValue: { id: string; name: string }) => {
            setSelectedContractor({
                id: newValue?.id,
                name: newValue?.name,
            });
        },
        //eslint-disable-next-line
        [selectedContractor?.name],
    );

    const handleAddContractor = () => {
        setActiveStep(activeStep + 1);
    };
    return (
        <>
            <ContractorDialog
                onClose={() => {
                    setIsNewContractor(false);
                    dispatch(actions.imsActions.resetState({}));
                }}
                open={isNewContractor}
                isEdit={false}
                isDelete={false}
                data={null}
            />
            <Grid
                container
                direction={"column"}
                justifyContent="center"
                alignItems={"center"}
                gap={10}
                alignSelf="stretch"
            >
                <Grid item>
                    {
                        <Typography variant="text_16_medium" sx={{ color: "#757575" }}>
                            {"You can search for a contractor below or add a new contractor"}
                        </Typography>
                    }
                </Grid>
                <Grid item>
                    <Grid
                        container
                        sx={{ display: "inline-flex", alignItems: "center", gap: "16px" }}
                    >
                        <Grid item>
                            <BaseAutoComplete
                                sx={{ width: "400px" }}
                                //disableClearable
                                labelComponent={
                                    <div style={{ marginBottom: "4px" }}>
                                        <Typography variant="text_14_medium" color="#202223">
                                            {"Contractor"}
                                        </Typography>
                                    </div>
                                }
                                value={selectedContractor}
                                options={contractors ?? []}
                                renderOption={(props: any, option: any) => {
                                    return (
                                        <li {...props} key={option.id}>
                                            {option.name}
                                        </li>
                                    );
                                }}
                                freeSolo
                                onChange={(event: any, newValue: any) => {
                                    updateSelectedName(newValue);
                                }}
                                getOptionLabel={(option: any) => option?.name || ""}
                            />
                        </Grid>
                        <Grid item alignSelf={"self-end"}>
                            <BaseButton
                                classes={"primary default"}
                                label="New Contractor"
                                startIcon={<AddIcon />}
                                onClick={() => {
                                    setIsNewContractor(true);
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <BaseButton
                        classes={
                            isEmpty(selectedContractor?.name)
                                ? "primary disabled"
                                : "primary default"
                        }
                        label="Next"
                        onClick={handleAddContractor}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default AddContractor;
