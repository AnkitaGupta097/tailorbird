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

const UnitMapping = () => {
    const { propertyId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [initialMapping, setInitialMapping] = useState({});

    const { units, entrataUnits, mappingUnits, snackbarState, loadingEntrataData } = useAppSelector(
        (state) => {
            return {
                units: state.propertyDetails.data?.units ?? [],
                entrataUnits: state.propertyDetails.data?.entrataUnits ?? [],
                mappingUnits: state.propertyDetails.mappingUnits,
                loadingEntrataData: state.propertyDetails.loadingEntrataData,
                snackbarState: state.common.snackbar,
            };
        },
        shallowEqual,
    );

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(actions.propertyDetails.fetchUnitsStart({ projectId: propertyId }));
        dispatch(actions.propertyDetails.fetchEntrataUnitsStart({ projectId: propertyId }));
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!isEmpty(units)) {
            const mapping = units.reduce((acc: any, fp: any) => {
                if (fp.entrata_unit_id) {
                    acc[fp.id] = fp.entrata_unit_id;
                }
                return acc;
            }, {});
            setInitialMapping(mapping);
        }
    }, [units]);

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

    const rightList = entrataUnits?.map((fp: any) => {
        return { id: fp.id, name: fp.unit_name };
    });

    const leftList = units?.map((fp: any) => {
        return { id: fp.id, name: fp.unit_name };
    });

    const onSave = (mapping: any) => {
        dispatch(actions.propertyDetails.mapEntrataUnitsStart({ projectId: propertyId, mapping }));
    };

    return (
        <div>
            {(mappingUnits || loadingEntrataData) && <BaseLoader />}
            <center>
                <h4>Units Mapping</h4>
            </center>
            <DropdownMapping
                initialMapping={initialMapping}
                leftList={leftList}
                rightList={rightList}
                leftHeading={"Tailorbird Units"}
                rightHeading={"Entrata Units"}
                onSave={onSave}
            />
        </div>
    );
};

export default UnitMapping;
