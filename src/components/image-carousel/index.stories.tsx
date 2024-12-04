import { ComponentStory, ComponentMeta } from "@storybook/react";
import ImageCarousel from ".";
export default {
    title: "Image Carousel",
    component: ImageCarousel,
    argTypes: {},
} as ComponentMeta<typeof ImageCarousel>;

const Template: ComponentStory<typeof ImageCarousel> = (args) => <ImageCarousel {...args} />;

export const Carousel = Template.bind({});
export const CarouselWithThumbnails = Template.bind({});

const images = [
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

CarouselWithThumbnails.args = {
    items: images,
    thumbnailItems: images,
    onImageChange: (activeIdx: number | undefined) => {
        //thumbnail scroller
        const thumbs = document.getElementById("thumbnails");

        if (thumbs && activeIdx !== undefined)
            thumbs.scroll({
                left: activeIdx * 64, // multiply with thumbnail size
                behavior: "smooth",
            });
    }
};

Carousel.args = {
    items: images,
};
