import AveryImage from "@/../public/fighters/avery.png";
import ElianaImage from "@/../public/fighters/eliana.png";
import ElliotImage from "@/../public/fighters/elliot.png";
import EthanImage from "@/../public/fighters/ethan.png";
import FrostyImage from "@/../public/fighters/frosty.png";
import JesseImage from "@/../public/fighters/jesse.png";
import LeoImage from "@/../public/fighters/leo.png";
import MollyImage from "@/../public/fighters/molly.png";
import RavenImage from "@/../public/fighters/raven.png";

import AveryTransparentImage from "@/../public/fighters/transparent/avery.png";
import ElianaTransparentImage from "@/../public/fighters/transparent/eliana.png";
import ElliotTransparentImage from "@/../public/fighters/transparent/elliot.png";
import EthanTransparentImage from "@/../public/fighters/transparent/ethan.png";
import FrostyTransparentImage from "@/../public/fighters/transparent/frosty.png";
import JesseTransparentImage from "@/../public/fighters/transparent/jesse.png";
import LeoTransparentImage from "@/../public/fighters/transparent/leo.png";
import MollyTransparentImage from "@/../public/fighters/transparent/molly.png";
import RavenTransparentImage from "@/../public/fighters/transparent/raven.png";
import { FighterDataType } from "../validations/generic/types";

export const FightersList = [
  {
    id: 0,
    name: "Molly",
    image: MollyImage,
    transparentImage: MollyTransparentImage,
    color: "#FFAD3B",
    secondaryColor: "#a16207",
    lore: {
      short:
        "Armed with the powers of the animal kingdom, Molly takes a special interest in reading. Oh, and she hates dark places.",
      long: "Armed with the powers of the animal kingdom, Molly is a human in all other aspects. She is a jolly hybrid who takes a special interest in reading new things. However, she hates dark places and is quite literally scared of them. Her favorite color is, of course, yellow, thus portraying her vibrance.",
    },
  },
  {
    id: 1,
    name: "Jesse",
    image: JesseImage,
    transparentImage: JesseTransparentImage,
    color: "#DE6A38",
    secondaryColor: "#7c2d12",
    lore: {
      short:
        "No matter what she is doing, you'll always hear her either singing or humming her favorite songs. Music is her passion and she's definitely got her priorities straight.",
      long: "When it comes to superpowers, Jesse's is surely music. She's always learning new things and sometimes even manages to fit in a little bit of sports in her schedule. Her favorite color is orange and her room definitely shows that.",
    },
  },
  {
    id: 2,
    name: "Leo",
    image: LeoImage,
    transparentImage: LeoTransparentImage,
    color: "#264F6E",
    lore: {
      short:
        "Being the quiet computer genius with a hoodie, Leo prefers keeping to himself. All he needs to survive is a mouse, a keyboard, and a screen with a problem to solve.",
      long: "Leo is the quiet hooded tech-wiz who stays away from all kinds of social interactions. He loves the teal blue color because apparently it helps him not get noticed by too many. All he needs is his computer to work his magic.",
    },
  },
  {
    id: 3,
    name: "Raven",
    image: RavenImage,
    transparentImage: RavenTransparentImage,
    color: "#C93038",
    secondaryColor: "#7f1d1d",
    lore: {
      short:
        "Raven, though our brave knight in shining armor, is quite a cinnamon roll. He takes great interest in archery but steers clear of large crowds and gatherings. Social anxiety, you know.",
      long: "Raven is the ideal knight in shining armor, tough on the outside but quite a softie on the inside. He likes all things red and has a special knack for archery. However, social anxiety catches up when he finds himself amidst large crowds and gatherings so he prefers to steer clear.",
    },
  },
  {
    id: 4,
    name: "Elliot",
    image: ElliotImage,
    transparentImage: ElliotTransparentImage,
    color: "#4C93AD",
    lore: {
      short:
        "Elliot is a cat by character and human by nature. He is very proud of his Medieval name and loves to sleep. Well, you don't need superpowers when you're a cat.",
      long: "Elliot's appearance of a cat makes him liked by many and loved by more. He is a cheerful hybrid by nature and doesn't think he needs a superpower when he's already a cat. He carries his Medieval name around very proudly. However, one time you shouldn't disturb him is when he sleeps.",
    },
  },
  {
    id: 5,
    name: "Ethan",
    image: EthanImage,
    transparentImage: EthanTransparentImage,
    color: "#63C2C9",
    secondaryColor: "#0e7490",
    lore: {
      short:
        "A golden retriever at heart, Ethan is your friendly neighborhood chef. He likes his kitchen spick 'n' span especially when he sets about preparing absolute delicacies.",
      long: "Ethan is the cheerful neighborhood chef who manages to give you a little taste from his kitchen at least once a week. However, being a particularly tidy culinary expert, he likes his kitchen to himself and rightfully so. Light blue being his favorite color, you might just catch him gazing up at the sky on a clear day!",
    },
  },
  {
    id: 6,
    name: "Frosty",
    image: FrostyImage,
    transparentImage: FrostyTransparentImage,
    color: "#FCF960",
    secondaryColor: "#a16207",
    lore: {
      short:
        "Frosty lives in freezing temperatures and loves making crystals out of snow. Warmth is his biggest nightmare but he is definitely more wholesome than any human one may come across.",
      long: "Frosty is a creature of freezing temperatures and loves crafting crystals out of snow. Warmth is his greatest nightmare, but his heart is certainly more wholesome than most humans.",
    },
  },
  {
    id: 7,
    name: "Avery",
    image: AveryImage,
    transparentImage: AveryTransparentImage,
    color: "#46275C",
    lore: {
      short:
        "Tomboyish by nature, baseball is Avery's superpower. She bowls at the speed of light and there's no way you're defeating her.",
      long: "Avery's skill set when it comes to baseball is every player's dream. She started playing when she was barely a kid and has remained undefeated ever since. She is as temperamental as her favorite color, purple. She might look grumpy but she just needs to be on the field to smile.",
    },
  },
  {
    id: 8,
    name: "Eliana",
    image: ElianaImage,
    transparentImage: ElianaTransparentImage,
    color: "#309C62",
    secondaryColor: "#065f46",
    lore: {
      short:
        "Eliana is our walkie-talkie astronomer who reads the universe like a book. She spends nights stargazing but stays miles away from insects. She says science calls this 'entomophobia.'",
      long: "All things human, Eliana's superpower is astronomy. She reads the universe like an open book and spends nights stargazing. The color green fascinates her, reminding her of nature. However, she always steers clear of the insect world. Science, according to her, calls this 'entomophobia.'",
    },
  },
] as any as FighterDataType[];
