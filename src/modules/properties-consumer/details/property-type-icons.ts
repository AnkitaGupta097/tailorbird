import Units from "../../../assets/icons/units.svg";
import Floorplan from "../../../assets/icons/floorplan.svg";
import Window from "../../../assets/icons/window.svg";
import Roofing from "../../../assets/icons/roofing.svg";
import Balcony from "../../../assets/icons/balcony.svg";
import Buildings from "../../../assets/icons/buildings.svg";
import DriveEta from "../../../assets/icons/drive_eta.svg";
import Forest from "../../../assets/icons/forest.svg";
import ElectricBolt from "../../../assets/icons/electric_bolt.svg";
import CommonArea from "../../../assets/icons/common-area.svg";

const iconsMapper: any = {
    Units: Units,
    "ADA Units": Units,
    Floorplans: Floorplan,
    "ADA Floorplans": Floorplan,
    Windows: Window,
    Roofs: Roofing,
    Balconies: Balcony,
    Buildings: Buildings,
    "Parking Spots": DriveEta,
    "ADA Parking Spots": DriveEta,
    "Plants with Soil": Forest,
    "Exterior Light Stand": ElectricBolt,
    "Common Areas": CommonArea,
};

export const getPropertyTypeIcon = (propertyType: string) => {
    return iconsMapper[propertyType];
};
