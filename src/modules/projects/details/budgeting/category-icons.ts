import AppliancesSVG from "../../../../assets/icons/Appliances.svg";
import BathAccessoriesSVG from "../../../../assets/icons/BathAccessories.svg";
import LightingSVG from "../../../../assets/icons/Lighting.svg";
import PlumbingSVG from "../../../../assets/icons/Plumbing.svg";
import HVACSVG from "../../../../assets/icons/HVAC.svg";
import Kitchen_BathSVG from "../../../../assets/icons/Kitchen_Bath.svg";
import HardwareSVG from "../../../../assets/icons/Hardware.svg";
import ElectricSVG from "../../../../assets/icons/Electric.svg";
import FlooringSVG from "../../../../assets/icons/Flooring.svg";
import CeilingsSVG from "../../../../assets/icons/Ceilings.svg";
import RepairMakeReadySVG from "../../../../assets/icons/RepairMakeReady.svg";
import FloorplanModificationSVG from "../../../../assets/icons/FloorplanModification.svg";
import GeneralConditionSVG from "../../../../assets/icons/GeneralCondition.svg";
import ProfitOverheadSVG from "../../../../assets/icons/ProfitOverhead.svg";
import PaintingSVG from "../../../../assets/icons/Painting.svg";
import BlindsSVG from "../../../../assets/icons/Blinds.svg";
import LandscapingSVG from "../../../../assets/icons/Landscaping_icon.svg";
import FfeSVG from "../../../../assets/icons/FF&E_icon.svg";
import WindowsDoorsSVG from "../../../../assets/icons/WindowsDoors.svg";
import WallSVG from "../../../../assets/icons/Wall_icon.svg";
import TaxSVG from "../../../../assets/icons/Tax.svg";
import WindowsSVG from "../../../../assets/icons/Windows.svg";
import RoofingSVG from "../../../../assets/icons/roofing.svg";
import ExteriorFinishesSVG from "../../../../assets/icons/ExteriorFinishes.svg";
import NewItemsSVG from "../../../../assets/icons/new-items-icon.svg";
import ExteriorStairsSVG from "../../../../assets/icons/ExteriorStairs.svg";
import AlternatesSVG from "../../../../assets/icons/alternates.svg";
import ProgramSVG from "assets/icons/program.svg";
import PackageSVG from "assets/icons/package.svg";
import RoomSVG from "assets/icons/room-icon.svg";

const iconsMapper: any = {
    "new items": NewItemsSVG,
    "new program": ProgramSVG,
    rooms: RoomSVG,
    package: PackageSVG,
    appliances: AppliancesSVG,
    "doors and millwork": WindowsDoorsSVG,
    flooring: FlooringSVG,
    ceilings: CeilingsSVG,
    paint: PaintingSVG,
    plumbing: PlumbingSVG,
    hvac: HVACSVG,
    "kitchen & bath finishes": Kitchen_BathSVG,
    blinds: BlindsSVG,
    electric: ElectricSVG,
    lighting: LightingSVG,
    "bath hardware": BathAccessoriesSVG,
    hardware: HardwareSVG,
    landscaping: LandscapingSVG,
    "repair and make ready": RepairMakeReadySVG,
    "repairs & make ready": RepairMakeReadySVG,
    "wall finishes": WallSVG,
    roofing: RoofingSVG,
    "ff&e": FfeSVG,
    windows: WindowsSVG,
    "exterior stairs": ExteriorStairsSVG,
    "general conditions": GeneralConditionSVG,
    "profit & overhead": ProfitOverheadSVG,
    "exterior finishes": ExteriorFinishesSVG,
    "bath accessories": BathAccessoriesSVG,
    "hvac & waterheater": HVACSVG,
    tax: TaxSVG,
    "floorplan modifications": FloorplanModificationSVG,
    alternates: AlternatesSVG,
};

export const getCategoryIcon = (category: string) => {
    return category?.includes("flooring")
        ? iconsMapper[category?.split(" ")[0].toLowerCase()]
        : iconsMapper[category?.toLowerCase()];
};
