import { ComponentMeta, ComponentStory } from "@storybook/react";
import PhoneField from ".";

export default {
    title: 'Phone Number Field',
    component: PhoneField,
    argTypes: {
    },
} as ComponentMeta<typeof PhoneField>;

const PhoneFieldTemplate: ComponentStory<typeof PhoneField> = (args) => <PhoneField {...args} />

export const PhoneNumber = PhoneFieldTemplate.bind({})

PhoneNumber.args = {
    onChange(value: any) { console.log(value) }
    , label: 'Phone Number'
    , containerSpacing: 2
    , variant: 'outlined',
    size: 'small'
}