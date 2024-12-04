import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import BaseChip from '.'

export default {
    title: 'Chip',
    component: BaseChip,
    argTypes: {
    },
  } as ComponentMeta<typeof BaseChip>;

  const Template: ComponentStory<typeof BaseChip> = (args) => <BaseChip {...args} />;

  export const DefaultChip = Template.bind({});
  export const SuccessChip = Template.bind({});
  export const InProgress = Template.bind({});
  export const ErrorChip = Template.bind({});

  DefaultChip.args = {
    variant:"filled",
    label: "Default",
    bgcolor:"#004D71",
    textColor: "#FFFFFF"
  }

  SuccessChip.args = {
    variant:"filled",
    label: "Success",
    bgcolor: "#57B6B2",
    textColor: "#FFFFFF"
  }

  InProgress.args = {
    variant:"filled",
    label: "In Progress",
    bgcolor: "#FEF2E3",
    textColor: "#FB8904"
  }

  ErrorChip.args = {
    variant:"filled",
    label: "Error",
    bgcolor: "#FCEDED",
    textColor: "#D90000"
  }