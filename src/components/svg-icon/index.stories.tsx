import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import SvgIcon from '.';
import { ReactComponent as TakeOffIcon } from '../../assets/icons/take-off-adjustment.svg'

export default {
    title: 'SvgIcon',
    component: SvgIcon,
    argTypes: {
    },
  } as ComponentMeta<typeof SvgIcon>;

  const Template: ComponentStory<typeof SvgIcon> = (args) => <SvgIcon {...args} />;

  export const TakeOff_Adjustment = Template.bind({});

  TakeOff_Adjustment.args = {
    svgPath: <TakeOffIcon/>
  }