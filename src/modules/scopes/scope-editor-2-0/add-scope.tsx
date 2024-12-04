import * as React from "react";
import {
    Grid,
    Dialog,
    DialogActions,
    Typography,
    DialogContent,
    DialogTitle,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import BaseTextField from "components/text-field";
import BaseButton from "components/button";
import BaseCheckbox from "components/checkbox";

interface IAddScope {
    open: boolean;
    setOpen: any;
    addScopeItemFor?: any;
    scopeOptions?: any;
}

const AddScopeItemToCategory = ({ open, setOpen, addScopeItemFor, scopeOptions }: IAddScope) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [checkedIds, setCheckedIds] = React.useState([]);
    const handleChange = (e: any) => {
        const { checked, id } = e.target;
        if (!checked) {
            setCheckedIds((prevCheckedIds: any) => prevCheckedIds.filter((c: any) => c !== id));
        } else {
            setCheckedIds((state: any) => {
                state.push(id);
                return state;
            });
        }
        console.log("checkedIds", checkedIds);
    };

    React.useEffect(() => {
        return () => {
            setCheckedIds([]);
        };
    }, []);

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="responsive-dialog-title"
            fullWidth={true}
        >
            <DialogTitle id="responsive-dialog-title">
                <Typography variant="text_16_semibold">{"Add Scope"}</Typography>
            </DialogTitle>
            <DialogContent>
                <Grid>
                    <div style={{ marginBottom: "13px", lineHeight: "18.2px" }}>
                        <Typography variant="text_14_regular">{"Category"}</Typography>
                    </div>
                    <BaseTextField
                        fullWidth
                        label={""}
                        variant={"outlined"}
                        value={addScopeItemFor.catName || ""}
                        disabled
                        size="small"
                    />
                    <div style={{ marginBottom: "13px", lineHeight: "18.2px", marginTop: "20px" }}>
                        <Typography variant="text_14_regular">{"Item Name"}</Typography>
                    </div>

                    <BaseTextField
                        fullWidth
                        label={""}
                        variant={"outlined"}
                        value={addScopeItemFor.name || ""}
                        disabled
                        size="small"
                    />
                    <div style={{ marginBottom: "13px", lineHeight: "18.2px", marginTop: "20px" }}>
                        <Typography variant="text_14_regular">{"Scope Item"}</Typography>
                    </div>
                    <Grid
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                            gridGap: "1rem",
                        }}
                    >
                        {scopeOptions.map((option: any) => (
                            <div
                                key={`${option.name}-${option.id}`}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "max-content",
                                    columnGap: "11px",
                                }}
                            >
                                <BaseCheckbox
                                    onChange={(e: any) => handleChange(e)}
                                    id={option?.id}
                                    value={option?.name}
                                    name={option?.name}
                                    // checked={checkedIds?.includes(option.id)}
                                />
                                <Typography variant="text_14_regular"> {option?.name}</Typography>
                            </div>
                        ))}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ marginBottom: "12px" }}>
                <BaseButton
                    onClick={() => {
                        setOpen(false), setCheckedIds([]);
                    }}
                    label={"Cancel"}
                    classes="grey default spaced"
                    variant={"text_14_regular"}
                    sx={{ width: "146px" }}
                />
                <BaseButton
                    onClick={() => {
                        setOpen(false);
                    }}
                    label={"Save"}
                    classes="primary default spaced"
                    variant={"text_16_semibold"}
                    sx={{ width: "146px" }}
                />
            </DialogActions>
        </Dialog>
    );
};
export default AddScopeItemToCategory;
