import { ComponentStory, ComponentMeta } from "@storybook/react";
import BaseAccordion from ".";
import ImageCarousel from "components/image-carousel";
import { Typography } from "@mui/material";
export default {
    title: "Base Accordion",
    component: BaseAccordion,
    argTypes: {},
} as ComponentMeta<typeof BaseAccordion>;

const Template: ComponentStory<typeof BaseAccordion> = (args) => <BaseAccordion {...args} />;

export const ProjectSummary = Template.bind({});
export const Photos = Template.bind({});
export const Disabled = Template.bind({});

const carouselItems = [
    {
        imgPath:
            "https://plus.unsplash.com/premium_photo-1677607235809-7c5f0b240117?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=800&q=60",
        altText: "dog",
    },
    {
        imgPath:
            "https://images.unsplash.com/photo-1685472065771-f57d15b4c585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        altText: "dog",
    },
    {
        imgPath:
            "https://plus.unsplash.com/premium_photo-1685082778205-8665f65e8c2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        altText: "dog",
    },
];

ProjectSummary.args = {
    title: "Project Summary".toUpperCase(),
    components: [
        `Cabinets: New paint grade shaker fronts. Refinish and paint boxes and fronts. Two tone
            SW Iron Ore on lower and PPG Delicate White on upper. Tall pantry(if applicable) painted
            Iron Ore Countertops: Remove existing. Install new 2CM Cascade White PQPental quartz.
            Eased Edge Backsplash: full run-up Arizona Tile 3x12 Picket Tile. Cotton/Glossy. Grout
            #165 DeLorean Gray. Schluter- Jolly/black Hardware: Cabinet Pulls: New 5” Matte Black
            Pulls Hinges: Soft-close hardware on doors & drawers`,
    ],
};

Photos.args = {
    title: "Photos".toUpperCase(),
    components: [<ImageCarousel items={carouselItems} />],
};

Disabled.args = {
    title: "Project Summary | Any".toUpperCase(),
    components: [],
};
