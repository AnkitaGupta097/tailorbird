import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import CheckBox from '.';

export default {
    title: 'CheckBox',
    component: CheckBox,
    argTypes: {
    },
  } as ComponentMeta<typeof CheckBox>;

  const Template: ComponentStory<typeof CheckBox> = () => <CheckBox />;

  export const UnCheckedCheckBox = Template.bind({});