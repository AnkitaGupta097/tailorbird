import { Stack } from "@mui/material";
import ContentPlaceholder from "components/content-placeholder";
import BaseDataGrid from "components/data-grid";
import { KebabMenuIcon } from "modules/package-manager/landing-page/packages-table";
import React from "react";

interface IContractorList {
    columns: any;
    contractors: any[];
    setOpenModal: any;
}

const ContractorList = (props: IContractorList) => {
    return (
        <BaseDataGrid
            columns={props?.columns}
            rows={props?.contractors ?? []}
            rowsPerPageOptions={[10, 20, 30]}
            getRowHeight={() => "auto"}
            hideFooter={props?.contractors?.length > 10 ? false : true}
            components={{
                MoreActionsIcon: KebabMenuIcon,
                NoRowsOverlay: () => (
                    <Stack margin={"10px"}>
                        <ContentPlaceholder
                            onLinkClick={() => props?.setOpenModal(true)}
                            text="No contractors added."
                            aText="Add contractors"
                            height="250px"
                        />
                    </Stack>
                ),
            }}
            getRowId={(row: any) => row?.name}
        />
    );
};

export default ContractorList;
