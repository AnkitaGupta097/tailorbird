import { ComponentMeta , ComponentStory } from "@storybook/react";
import BaseRadio from ".";

export default {
    title: 'Radio Button',
    component: BaseRadio,
    argTypes: {
    },
  } as ComponentMeta<typeof BaseRadio>;

  const RadioTemplate : ComponentStory<typeof BaseRadio> = (args) => <BaseRadio {...args} />

  export const RadioButton = RadioTemplate.bind({})

  RadioButton.args = {
    checked:true,
  }