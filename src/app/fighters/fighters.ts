import AlexanderImage from "@/../public/fighters/alexander.png";
import BillyImage from "@/../public/fighters/billy.png";
import DaveImage from "@/../public/fighters/dave.png";
import FoxyImage from "@/../public/fighters/foxy.png";
import JacobImage from "@/../public/fighters/jacob.png";
import JoeImage from "@/../public/fighters/joe.png";
import MollyImage from "@/../public/fighters/molly.png";
import SamanthaImage from "@/../public/fighters/samantha.png";
import ScarletImage from "@/../public/fighters/scarlet.png";

import AlexanderTransparentImage from "@/../public/fighters/transparent/alexander.png";
import BillyTransparentImage from "@/../public/fighters/transparent/billy.png";
import DaveTransparentImage from "@/../public/fighters/transparent/dave.png";
import MollyTransparentImage from "@/../public/fighters/transparent/molly.png";
import SamanthaTransparentImage from "@/../public/fighters/transparent/samantha.png";
import ScarletTransparentImage from "@/../public/fighters/transparent/scarlet.png";

export const FightersList = [
  {
    id: 0,
    name: "Molly",
    image: MollyImage,
    transparentImage: MollyTransparentImage,
    description: "A very cool lore here about Molly :D i love",
    color: "#FFAD3B",
  },
  {
    id: 1,
    name: "Alexander",
    image: AlexanderImage,
    transparentImage: AlexanderTransparentImage,
    description: "A very cool lore here about Alexander :D i love",
    color: "#DE6A38",
  },
  {
    id: 2,
    name: "Billy",
    image: BillyImage,
    transparentImage: BillyTransparentImage,
    description: "A very cool lore here about Billy :D i love",
    color: "#264F6E",
  },
  {
    id: 3,
    name: "Dave",
    image: DaveImage,
    transparentImage: DaveTransparentImage,
    description: "A very cool lore here about Dave :D i love",
    color: "#C93038",
  },
  {
    id: 4,
    name: "Foxy",
    image: FoxyImage,
    description: "A very cool lore here about Foxy :D i love",
    color: "#4C93AD",
  },
  {
    id: 5,
    name: "Jacob",
    image: JacobImage,
    description: "A very cool lore here about Jacob :D i love",
    color: "#63C2C9",
  },
  {
    id: 6,
    name: "Joe",
    image: JoeImage,
    description: "A very cool lore here about Joe :D i love",
    color: "#FCF960",
  },
  {
    id: 7,
    name: "Samantha",
    image: SamanthaImage,
    transparentImage: SamanthaTransparentImage,
    description: "A very cool lore here about Samantha :D i love",
    color: "#46275C",
  },
  {
    id: 8,
    name: "Scarlet",
    image: ScarletImage,
    transparentImage: ScarletTransparentImage,
    description: "A very cool lore here about Scarlet :D i love",
    color: "#309C62",
  },
] as const;
