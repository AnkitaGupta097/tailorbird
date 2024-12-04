import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { useParams } from "react-router-dom";
import DropdownMapping from "./common/dropdown-mapping";
import BaseLoader from "components/base-loading";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "../../../../stores/actions";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import { shallowEqual } from "react-redux";

const FloorPlanMapping = () => {
    const { propertyId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [initialMapping, setInitialMapping] = useState({});

    const { floorplans, entrataFloorplans, mappingFloorplan, snackbarState, loadingEntrataData } =
        useAppSelector((state) => {
            return {
                floorplans: state.propertyDetails.data?.floorplans ?? [],
                entrataFloorplans: state.propertyDetails.data?.entrataFloorplans ?? [],
                mappingFloorplan: state.propertyDetails.mappingFloorplan,
                loadingEntrataData: state.propertyDetails.loadingEntrataData,
                snackbarState: state.common.snackbar,
            };
        }, shallowEqual);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(actions.propertyDetails.fetchFloorPlansStart({ projectId: propertyId }));
        dispatch(actions.propertyDetails.fetchEntrataFloorPlansStart({ projectId: propertyId }));
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!isEmpty(floorplans)) {
            const mapping = floorplans.reduce((acc: any, fp: any) => {
                if (fp.entrata_ref_id) {
                    acc[fp.id] = fp.entrata_ref_id;
                }
                return acc;
            }, {});
            setInitialMapping(mapping);
        }
    }, [floorplans]);

    useEffect(() => {
        const { open, variant, message } = snackbarState;
        open &&
            enqueueSnackbar("", {
                variant: variant,
                action: <BaseSnackbar variant={variant} title={message?.toString() ?? ""} />,
                onClose: () => {
                    dispatch(actions.common.closeSnack());
                },
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snackbarState.open]);

    const rightList = entrataFloorplans?.map((fp: any) => {
        return { id: fp.id, name: fp.name };
    });

    const onSave = (mapping: any) => {
        dispatch(
            actions.propertyDetails.mapEntrataFloorPlanStart({ projectId: propertyId, mapping }),
        );
    };

    return (
        <div>
            {(mappingFloorplan || loadingEntrataData) && <BaseLoader />}
            <center>
                <h4>Floorplans Mapping</h4>
            </center>
            <DropdownMapping
                initialMapping={initialMapping}
                leftList={floorplans}
                rightList={rightList}
                leftHeading={"Tailorbird Floorplans"}
                rightHeading={"Entrata Floorplans"}
                onSave={onSave}
            />
        </div>
    );
};

export default FloorPlanMapping;
