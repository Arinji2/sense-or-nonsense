import CoopImage from "../../public/modes/coop.png";
import CPUImage from "../../public/modes/cpu.png";
import HighScoreImage from "../../public/modes/highscore.png";
import OnlineImage from "../../public/modes/online.png";

const games = [
  {
    id: 0,
    title: "HIGH SCORE BATTLE",
    image: HighScoreImage,
    description:
      "Play against varying difficulties and improve your high scores.",
    showLeft: true,
    isMultiplayer: false,
    showTime: false,
  },
  {
    id: 1,
    title: "PLAYER VS CPU",
    image: CPUImage,
    description: "Test your skills against the computer in a 1v1 match.",
    isMultiplayer: false,
    showLeft: false,
    showTime: false,
  },
  {
    id: 2,
    title: "CO OP BATTLES",
    image: CoopImage,
    description: "Play with your friends on the same device in a 1v1 match.",
    showLeft: false,
    isMultiplayer: true,
    showTime: true,
  },
  {
    id: 3,
    title: "ONLINE BATTLES",
    image: OnlineImage,
    description: "Play with your friends online in a 1v1 match.",
    showLeft: false,
    isMultiplayer: true,
    showTime: true,
  },
];

export default games;
