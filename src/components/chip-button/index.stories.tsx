import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import ChipButton  from '.';
import AddIcon from '@mui/icons-material/Add';


export default {
    title: 'ChipButton',
    component: ChipButton,
    argTypes: {
    },
  } as ComponentMeta<typeof ChipButton>;

  const Template: ComponentStory<typeof ChipButton> = (args) => <ChipButton {...args} />;

  export const PrimaryChipButtonDefaultWithStartIcon = Template.bind({});
  export const PrimaryChipButtonDisabled = Template.bind({});
  
  export const SelectedChipButtonDefaultWithEndIcon = Template.bind({});
  export const SelectedChipButtonDisabled = Template.bind({});

  

  PrimaryChipButtonDefaultWithStartIcon.args = {
  label:"Chip Button",
  classes: "primary default",
  startIcon: <AddIcon />,
};

PrimaryChipButtonDisabled.args = {
  label:"Button",
  classes: "primary disabled",
};

SelectedChipButtonDefaultWithEndIcon.args = {
  label:"Chip Button",
  classes: "selected default",
  endIcon: <AddIcon />,
};

SelectedChipButtonDisabled.args = {
  label:"Button",
  classes: "selected disabled",
};
