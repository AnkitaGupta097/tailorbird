/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import { Typography, Box, Grid, Button } from "@mui/material";
import appTheme from "styles/theme";
import { useAppSelector } from "stores/hooks";
import { isEmpty, map } from "lodash";
import PackageCard from "./package-card";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Loader from "modules/admin-portal/common/loader";

interface IPackageDetails {
    /* eslint-disable-next-line */
    setPackageId: (val: any) => void;
}

const PackageDetails = ({ setPackageId }: IPackageDetails) => {
    const refPackage = useRef<any>({});
    const { packageList, loading } = useAppSelector((state) => {
        return {
            loading: state.singleProject.renovationWizard.packageList.loading,
            packageList: state.singleProject.renovationWizard.packageList.data,
        };
    });
    const [packageLoad, setPackageLoad] = useState(packageList);
    const [itemPerRow, setItemPerRow] = useState(0);
    const [expand, setExpand] = useState<any>(false);
    const [pkgId, setPkgId] = useState<any>(null);

    useEffect(() => {
        if (!isEmpty(packageList) && !expand) {
            const packageWidth = refPackage.current?.offsetWidth;
            //@ts-ignore
            const itemLength: number = Math.floor(packageWidth / 220);
            setItemPerRow(itemLength);
            const initialPackage = packageList.slice(0, Number(itemLength) * 3);
            setPackageLoad(initialPackage);
        } else {
            setPackageLoad(packageList);
        }
        // eslint-disable-next-line
    }, [expand]);

    if (loading) {
        return (
            <Box mt={40}>
                <Loader />
            </Box>
        );
    }

    const isPkgBlur = (index: any) => {
        if (packageList.length <= itemPerRow * 3) {
            return false;
        } else if (index >= itemPerRow * 2 && !expand) {
            return true;
        } else {
            return false;
        }
    };
    return (
        <Box>
            <Typography variant="text_34_regular">
                Please select the package you would like to include in your renovation.
            </Typography>
            <br />
            <Typography variant="text_18_regular" color={appTheme.border.medium}>
                These options include packages specific to your project, specific to your
                organization, or curated by Tailorbird
            </Typography>
            <Grid container mt={3} ref={refPackage} mb={1}>
                {map(packageLoad, (item, index: number) => {
                    return (
                        <Box
                            m={1}
                            onClick={() => {
                                if (pkgId == item.id) {
                                    setPackageId(null);
                                    setPkgId(null);
                                } else {
                                    setPackageId(item.id);
                                    setPkgId(item.id);
                                }
                            }}
                            sx={{
                                cursor: "pointer",
                                borderRadius: "5px",
                                boxShadow:
                                    pkgId == item.id ? "0px 0px 21px 0px rgba(0, 0, 0, 0.25)" : "",
                            }}
                        >
                            <PackageCard tbPackage={item} isblur={isPkgBlur(index)} />
                        </Box>
                    );
                })}
            </Grid>
            {packageList.length >= itemPerRow * 3 && (
                <Box
                    display="flex"
                    alignItems="center"
                    width="100%"
                    height={"40px"}
                    mt={expand ? 0 : -19}
                    position="relative"
                    sx={{ backgroundColor: appTheme.text.white }}
                >
                    <Button
                        variant="text"
                        component="label"
                        fullWidth
                        style={{ marginLeft: "10px", height: "40px" }}
                        endIcon={
                            <ExpandMoreIcon
                                stroke={appTheme.scopeHeader.label}
                                style={{
                                    transform: `rotate(${expand ? "180" : "0"}deg)`,
                                    width: "20px",
                                    height: "20px",
                                }}
                            />
                        }
                        onClick={() => {
                            setExpand(!expand);
                        }}
                    >
                        <Typography variant="text_18_medium" color={appTheme.scopeHeader.label}>
                            {expand ? "Hide" : "See more"} packages
                        </Typography>
                    </Button>
                </Box>
            )}
        </Box>
    );
};
export default PackageDetails;
