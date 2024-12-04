import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import DataGridPro from '.';

import { Typography } from '@mui/material';
import BaseAutoComplete from 'components/base-auto-complete';

export default {
    title: 'Data Grid Pro',
    component: DataGridPro,
    argTypes: {
    },
  } as ComponentMeta<typeof DataGridPro>;

  const Template: ComponentStory<typeof DataGridPro> = (args) => <DataGridPro {...args} />;

  export const Default = Template.bind({});

  Default.args = {
    rows: [{
        id: 1,
        image: "https://rukminim1.flixcart.com/image/612/612/ku4ezrk0/dryer/3/y/o/maxi-dryer-ex-ifb-original-imag7ayzhx9zspxv.jpeg?q=70",
        subcategory: "Appliance",
        manufacturer: "Samsung"
    },
    {
        id: 2,
        image: "https://images-cdn.ubuy.co.in/C10NKMI-wewe-single-handle-high-arc-brushed.jpg",
        subcategory: "Kitchen",
        manufacturer: "Ricks"
    }],
    columns: [{
        field: 'image',
        headerName: 'Image',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        renderCell: (params: any) => (
            <img
            //@ts-ignore
            src={params.row.image ?? `${process.env.PUBLIC_URL}/image-placeholder.png`}
            style={{
                height: "3rem",
                width: "3rem",
                display: "block",
                border: `0.5px solid black`,
            }}
            alt="productImage"
        />
        )
    }, 
    {
        field: 'subcategory',
        headerName: 'Sub Category',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        renderCell: (params: any) => (
            <BaseAutoComplete
                    value={params.row.subcategory === "" || params.row.subcategory  === null ? "N/A" : params.row.subcategory }
                    options={["Appliance", "Bath", "Kitchen"]}
                    id={1}
                    variant="standard"
                />
        )
    },
    {
        field: 'manufacturer',
        headerName: 'Manufacturer',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        renderCell: (params:any) => (
            <Typography>{params.row.manufacturer}</Typography>
        )
    },
],
rowsPerPageOptions: [10, 20, 30]
  };