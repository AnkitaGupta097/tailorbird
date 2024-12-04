export const groupedBidItemMapper = (item: any, index: number) => ({
    ...item,
    index,
    bed_count: item.categories?.at(0)?.items?.at(0)?.beds_count ?? 0,
    bath_count: item.categories?.at(0)?.items?.at(0)?.baths_count ?? 0,
    fp_area: item.categories?.at(0)?.items?.at(0)?.fp_area ?? 0,
});
