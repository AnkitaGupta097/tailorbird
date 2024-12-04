import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import TextField  from '.';
import AddIcon from '@mui/icons-material/Add';

export default {
    title: 'TextField',
    component: TextField,
    argTypes: {
    },
  } as ComponentMeta<typeof TextField>;

  const Template: ComponentStory<typeof TextField> = (args) => <TextField {...args} />;

  export const TextFieldEnabledWithIcon = Template.bind({});
  
  export const TextFieldError = Template.bind({});

  export const TextFieldDisabled = Template.bind({});

  export const TextFieldExtraSmallWithoutLabel = Template.bind({});

  export const TextFieldSmallWithoutLabel = Template.bind({});

  export const TextFieldMediumWithoutLabel = Template.bind({});

  TextFieldExtraSmallWithoutLabel.args = {
    name: "xyz",
    id: 1,
    value: "enter value",
    variant: "outlined",
    classes: "base",
    type: "enabled",
    inputProps: {
      style: {
        height: "18px"
      }
    }
  }

  TextFieldSmallWithoutLabel.args = {
    name: "xyz",
    id: 1,
    value: "enter value",
    variant: "outlined",
    classes: "base",
    type: "enabled",
    size: "small"
  }

  TextFieldMediumWithoutLabel.args = {
    name: "xyz",
    id: 1,
    value: "enter value",
    variant: "outlined",
    classes: "base",
    type: "enabled",
    size: "medium"
  }

  TextFieldEnabledWithIcon.args = {
    name: "xyz",
    id: 1,
    value: "enter value",
    variant: "outlined",
    classes: "base",
    type: "enabled",
    inputProps: { endAdornment: <AddIcon htmlColor="#CCCCCC" fontSize='large'/> },
    label: "Label"
  }

  TextFieldError.args = {
    label: "Label",
    name: "xyz",
    id: 1,
    value: "enter value",
    variant: "outlined",
    classes: "error",
    helper: "Helper",
  }

  TextFieldDisabled.args = {
    label: "Label",
    name: "xyz",
    id: 1,
    value: "enter value",
    variant: "outlined",
    classes: "disabled",
  }