import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Table from '.';

export default {
    title: 'Table',
    component: Table,
    argTypes: {
    },
  } as ComponentMeta<typeof Table>;

  const Template: ComponentStory<typeof Table> = (args) => <Table {...args} />;

  export const TableWithSingleRow = Template.bind({});
  export const TableWithMultiRow = Template.bind({});

  TableWithSingleRow.args = {
    columns: [{id: 1, label: "Image", name: "image", showImage: true}, {id: 2, label: "Sub Category", name: "subCategory",isIcon: true, isAutoComplete: true, options: ["Appliance", "Bath", "Kitchen"]},{label: "Manufacturer", name: "manufacturer", isSort: true}],
    isCheckBox: true,
    rows: [{image: "https://rukminim1.flixcart.com/image/612/612/ku4ezrk0/dryer/3/y/o/maxi-dryer-ex-ifb-original-imag7ayzhx9zspxv.jpeg?q=70", subCategory: "Appliance", manufacturer: "Samsung"}],
  }

  TableWithMultiRow.args = {
    columns: [{id: 1, label: "Image", name: "image", showImage: true}, {id: 2, label: "Sub Category", name: "subCategory",isIcon: true, isAutoComplete: true, options: ["Appliance", "Bath", "Kitchen"]},{label: "Manufacturer", name: "manufacturer", isSort: true}],
    isCheckBox: true,
    rows: [{image: "https://rukminim1.flixcart.com/image/612/612/ku4ezrk0/dryer/3/y/o/maxi-dryer-ex-ifb-original-imag7ayzhx9zspxv.jpeg?q=70", subCategory: "Appliance", manufacturer: "Samsung"},
    {image: "https://images-cdn.ubuy.co.in/C10NKMI-wewe-single-handle-high-arc-brushed.jpg", subCategory: "Kitchen", manufacturer: "Ricks"}],
  }


