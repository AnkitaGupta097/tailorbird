
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import BaseSelect from '.';


export default {
    title: 'Select',
    component: BaseSelect,
    argTypes: {
    },
} as ComponentMeta<typeof BaseSelect>;

const Template: ComponentStory<typeof BaseSelect> = (args) => <BaseSelect {...args} />;

export const Select = Template.bind({});

export const SelectWithLabel = Template.bind({});


Select.args = {
    selectProps: {
        variant: 'outlined',
        fullWidth: true,
        onChange: (event: any) => { console.log(event) }
        , size: 'small'
    },
    options: [{
        value: 'option 1'
        , label: 'option 1'
    }, {
        value: 'option 2'
        , label: 'option 2'
    }],
    placeholder: 'Please select a value',
}

SelectWithLabel.args = {
    selectProps: {
        variant: 'standard',
        fullWidth: true,
        sx: {
            "MuiSelect-nativeInput":{
               borderColor: 'blue'
            }
        },
        onChange: (event: any) => { console.log(event) }

    },
    options: [{
        value: 'option 1'
        , label: 'option 1'
    }, {
        value: 'option 2'
        , label: 'option 2'
    }],

    placeholder: 'Please select a value',
    headerLabel: 'Select',
}






