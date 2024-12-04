import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import TextArea  from '.';
import AddIcon from '@mui/icons-material/Add';

export default {
    title: 'TextArea',
    component: TextArea,
    argTypes: {
    },
  } as ComponentMeta<typeof TextArea>;

  const Template: ComponentStory<typeof TextArea> = (args) => <TextArea {...args} />;

  export const TextareaAutosize = Template.bind({});

  TextareaAutosize.args = {
    value: "",
  }
  
  

