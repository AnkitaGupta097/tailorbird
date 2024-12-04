import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Toggle  from '.';

export default {
    title: 'Toggle',
    component: Toggle,
  } as ComponentMeta<typeof Toggle>;

  const Template: ComponentStory<typeof Toggle> = (args) => <Toggle {...args}/>;

  export const DefaultToggle = Template.bind({});

  DefaultToggle.args = {
    label: "Toggle label",
    value: "Value"
  }