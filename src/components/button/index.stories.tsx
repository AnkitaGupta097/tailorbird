import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Button  from '.';
import AddIcon from '@mui/icons-material/Add';


export default {
    title: 'Button',
    component: Button,
    argTypes: {
    },
  } as ComponentMeta<typeof Button>;

  const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

  export const PrimaryButtonDefaultWithStartIcon = Template.bind({});
  export const PrimaryButtonDisabled = Template.bind({});
  
  export const SecondaryButtonDefaultWithEndIcon = Template.bind({});
  export const SecondaryButtonDisabled = Template.bind({});

  export const SpecialButtonDefaultWithStartAndEndIcon = Template.bind({});
  export const SpecialButtonDisabled = Template.bind({});

  export const ErrorButtonDefault = Template.bind({});
  export const ErrorButtonDisabled = Template.bind({});

  export const InvisibleButtonDefault = Template.bind({});
  export const InvisibleButtonDisabled = Template.bind({});

  export const GreyButtonDefault = Template.bind({});
  export const GreyButtonActive = Template.bind({});
  

PrimaryButtonDefaultWithStartIcon.args = {
  label:"Button",
  classes: "primary default",
  startIcon: <AddIcon />,
};

PrimaryButtonDisabled.args = {
  label:"Button",
  classes: "primary disabled",
};

SecondaryButtonDefaultWithEndIcon.args = {
  label:"Button",
  classes: "secondary default",
  endIcon: <AddIcon />,
};

SecondaryButtonDisabled.args = {
  label:"Button",
  classes: "secondary disabled",
};

SpecialButtonDefaultWithStartAndEndIcon.args = {
  label:"Button",
  classes: "special default",
  startIcon: <AddIcon />,
  endIcon: <AddIcon />,
};

SpecialButtonDisabled.args = {
  label:"Button",
  classes: "special disabled",
};

ErrorButtonDefault.args = {
  label:"Button",
  classes: "error default",
};

ErrorButtonDisabled.args = {
  label:"Button",
  classes: "error disabled",
};

InvisibleButtonDefault.args = {
  label:"Button",
  classes:"invisible default",
};

InvisibleButtonDisabled.args = {
  label:"Button",
  classes: "invisible disabled",
};

GreyButtonDefault.args = {
  label:"Button",
  classes: "grey default",
};

GreyButtonActive.args = {
  label:"Button",
  classes: "grey active",
};