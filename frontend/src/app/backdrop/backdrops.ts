import BridgeImage from "@/../public/levels/bridge.png";
import CafeImage from "@/../public/levels/cafe.png";
import CastleImage from "@/../public/levels/castle.png";
import EgyptImage from "@/../public/levels/egypt.png";
import LosAngelosImage from "@/../public/levels/la.png";
import ParisImage from "@/../public/levels/paris.png";
import RainbowImage from "@/../public/levels/rainbow.png";
import SavannahImage from "@/../public/levels/savannah.png";
import WorldImage from "@/../public/levels/world.png";
import { BackdropDataType } from "../../../validations/generic/types";

export const BackdropsList = [
  {
    id: 1,
    name: "CAFE",
    image: CafeImage,
  },
  {
    id: 2,
    name: "CASTLE",
    image: CastleImage,
  },
  {
    id: 3,
    name: "EGYPT",
    image: EgyptImage,
  },
  {
    id: 4,
    name: "PARIS",
    image: ParisImage,
  },
  {
    id: 5,
    name: "RAINBOW",
    image: RainbowImage,
  },
  {
    id: 6,
    name: "SAVANNAH",
    image: SavannahImage,
  },
  {
    id: 7,
    name: "WORLD",
    image: WorldImage,
  },
  {
    id: 8,
    name: "LOS ANGELOS",
    image: LosAngelosImage,
  },
  {
    id: 9,
    name: "BRIDGE",
    image: BridgeImage,
  },
] as BackdropDataType[];
