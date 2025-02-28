import EasyImage from "@/../public/difficulty/easy.png";
import HardImage from "@/../public/difficulty/hard.png";
import MediumImage from "@/../public/difficulty/medium.png";

export const DifficultyList = [
  {
    id: 0,
    name: "Easy",
    image: EasyImage,
    color: "#22c55e",
    level: 1,
    rounds: 5,
  },
  {
    id: 1,
    name: "Medium",
    image: MediumImage,
    color: "#eab308",
    level: 2,
    rounds: 15,
  },
  {
    id: 2,
    name: "Hard",
    image: HardImage,
    color: "#ef4444",
    level: 3,
    rounds: 20,
  },
];
