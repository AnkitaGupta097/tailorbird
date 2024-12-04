import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import SearchField from '.';


export default {
    title: 'Search Field',
    component: SearchField,
    argTypes: {
    },
} as ComponentMeta<typeof SearchField>;

const Template: ComponentStory<typeof SearchField> = (args) => <SearchField {...args} />;

export const SearchBox = Template.bind({});

SearchBox.args = {
    open: false,
    placeholder: "SearchField",
    textFieldSx: {
        ".MuiInputBase-input::placeholder":{
            fontSize: "16px"
        }
    }
    ,focused: true,
}


