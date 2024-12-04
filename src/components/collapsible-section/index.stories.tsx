import { ComponentStory, ComponentMeta } from "@storybook/react";
import CollapsibleSection from ".";
import BaseAccordion from "components/base-accordion";
import ImageCarousel from "components/image-carousel";
import BasicTabs from "components/basic-tabs";
import FloorplanSummary from "modules/rfp-manager/floorplan-summary";
import ScopeSummary from "modules/rfp-manager/scope-summary";
import ScrollToTop from "components/scroll-to-top";

export default {
    title: "Collapsible Section",
    component: CollapsibleSection,
    argTypes: {},
} as ComponentMeta<typeof CollapsibleSection>;

const Template: ComponentStory<typeof CollapsibleSection> = (args) => (
    <>
        <CollapsibleSection {...args} />
        <ScrollToTop />
    </>
);

export const Section = Template.bind({});

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
    {
        imgPath:
            "https://images.unsplash.com/photo-1685866866044-098ce82ebfea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        altText: "dog",
    },
];

const accordionsItems = [
    {
        title: "PROJECT SUMMARY",
        component: [
            `Cabinets: New paint grade shaker fronts. Refinish and paint boxes and fronts. Two tone
            SW Iron Ore on lower and PPG Delicate White on upper. Tall pantry(if applicable) painted
            Iron Ore Countertops: Remove existing. Install new 2CM Cascade White PQPental quartz.
            Eased Edge Backsplash: full run-up Arizona Tile 3x12 Picket Tile. Cotton/Glossy. Grout
            #165 DeLorean Gray. Schluter- Jolly/black Hardware: Cabinet Pulls: New 5” Matte Black
            Pulls Hinges: Soft-close hardware on doors & drawers`,
        ],
    },
    {
        title: "PHOTOS",
        component: [
            <ImageCarousel
                items={carouselItems}
                showThumbnails={true}
                thumbnailItems={carouselItems}
            />,
        ],
    },
    // {
    //     title: "FLOOR PLANS",
    //     component: [
    //         <BasicTabs
    //             tabs={[
    //                 {
    //                     label: "Floor Plan [00]",
    //                     content: (
    //                         <FloorplanSummary
    //                             fpImgPath={
    //                                 "https://plus.unsplash.com/premium_photo-1684175656154-ac52b3cc2c60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3MHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
    //                             }
    //                             bedCount={10}
    //                             bathCount={5}
    //                             totalSQFT={1234}
    //                             totalUnits={143}
    //                             summary={`The door of lobby leads to hall. Hall is 4 sided with dimensions 250x200 feet
    //                 and has doors on second and third walls. First door of hall leads to bedroom.
    //                 Bedroom is 4 sided with dimensions 200×100 feet and has a door on first wall.
    //                 Door of bedroom leads to bathroom. Second door of hall leads to kitchen. Kitchen
    //                 is 4 sided with dimensions 100x200 feet with a door on second wall. Door of
    //                 kitchen leads to dining area. Dining area has 4 walls with dimensions 150×100
    //                 feet. The floor plan has 5 rooms - kitchen, bathroom, hall, bedroom and dining.
    //                 Hall and kitchen are adjacent and connected. Kitchen leads to dining hall from
    //                 its right door.`}
    //                         />
    //                     ),
    //                 },
    //                 {
    //                     label: "Floor Plan [01]",
    //                     content: (
    //                         <FloorplanSummary
    //                             fpImgPath={
    //                                 "https://plus.unsplash.com/premium_photo-1684175656154-ac52b3cc2c60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3MHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
    //                             }
    //                             bedCount={20}
    //                             bathCount={8}
    //                             totalSQFT={1235}
    //                             totalUnits={133}
    //                             summary={`The door of lobby leads to hall. Hall is 4 sided with dimensions 250x200 feet
    //                 and has doors on second and third walls. First door of hall leads to bedroom.
    //                 Bedroom is 4 sided with dimensions 200×1000 feet and has a door on first wall.
    //                 Door of bedroom leads to bathroom. Second door of hall leads to kitchen. Kitchen
    //                 is 4 sided with dimensions 100x200 feet with a door on second wall. Door of
    //                 kitchen leads to dining area. Dining area has 8 walls with dimensions 150×100
    //                 feet. The floor plan has 7 rooms - kitchen, bathroom, hall, bedroom and dining.
    //                 Hall and kitchen are adjacent and connected. Kitchen leads to dining hall from
    //                 its right door.`}
    //                         />
    //                     ),
    //                 },
    //                 { label: "Floor Plan [02]", content: <p>Desc for FP02</p> },
    //                 { label: "Floor Plan [03]", content: <p>Desc for FP03</p> },
    //                 { label: "Floor Plan [04]", content: <p>Desc for FP04</p> },
    //                 { label: "Floor Plan [05]", content: <p>Desc for FP05</p> },
    //                 { label: "Floor Plan [06]", content: <p>Desc for FP06</p> },
    //                 { label: "Floor Plan [07]", content: <p>Desc for FP07</p> },
    //                 { label: "Floor Plan [08]", content: <p>Desc for FP08</p> },
    //                 { label: "Floor Plan [09]", content: <p>Desc for FP09</p> },
    //                 { label: "Floor Plan [10]", content: <p>Desc for FP10</p> },
    //                 { label: "Floor Plan [11]", content: <p>Desc for FP11</p> },
    //                 { label: "Floor Plan [12]", content: <p>Desc for FP12</p> },
    //                 { label: "Floor Plan [13]", content: <p>Desc for FP13</p> },
    //                 { label: "Floor Plan [14]", content: <p>Desc for FP14</p> },
    //             ]}
    //         />,
    //     ],
    // },
    {
        title: "SCOPE SUMMARY",
        component: [
            <ScopeSummary
                categoryName={"Appliances"}
                summary={`Cabinets: New paint grade shaker fronts. Refinish and paint boxes and fronts. Two tone SW Iron Ore on lower and PPG Delicate White on upper. Tall pantry(if applicable) painted Iron Ore
Countertops: Remove existing. Install new 2CM Cascade White PQPental quartz. Eased Edge
Backsplash: full run-up Arizona Tile 3x12 Picket Tile. Cotton/Glossy. Grout #165 DeLorean Gray. Schluter- Jolly/black
Hardware: Cabinet Pulls: New 5” Matte Black Pulls
Hinges: Soft-close hardware on doors & drawers`}
            />,
            <ScopeSummary
                categoryName={"Flooring"}
                summary={`Cabinets: New paint grade shaker fronts. Refinish and paint boxes and fronts. Two tone SW Iron Ore on lower and PPG Delicate White on upper. Tall pantry(if applicable) painted Iron Ore
Countertops: Remove existing. Install new 2CM Cascade White PQPental quartz. Eased Edge
Backsplash: full run-up Arizona Tile 3x12 Picket Tile. Cotton/Glossy. Grout #165 DeLorean Gray. Schluter- Jolly/black
Hardware: Cabinet Pulls: New 5” Matte Black Pulls
Hinges: Soft-close hardware on doors & drawers`}
            />,
        ],
    },
];

Section.args = {
    expandLabel: "Show Project Details",
    collapseLabel: "Hide Project Details",
    components: accordionsItems
        .slice(0)
        .map(({ title, component }) => <BaseAccordion title={title} components={component} />),
};
