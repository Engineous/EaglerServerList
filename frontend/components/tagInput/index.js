import styles from "./TagInput.module.css";
import { FaGamepad, FaQuestion, FaSkull, FaTools } from "react-icons/fa";
import { MdGames, MdFastfood, MdLocalPolice } from "react-icons/md";
import { GiStoneBlock, GiSwordsEmblem } from "react-icons/gi";
import { RiTeamFill } from "react-icons/ri";

const badges = {
    PVP: {
        color: "#ff6565",
        icon: <GiSwordsEmblem />,
    },
    PVE: {
        color: "#ff6565",
        icon: <FaSkull />,
    },
    FACTIONS: {
        color: "#ff6565",
        icon: <RiTeamFill />,
    },
    MINIGAMES: {
        color: "#f7ff65",
        icon: <MdGames />,
    },
    SURVIVAL: {
        color: "#46e393",
        icon: <MdFastfood />,
    },
    CREATIVE: {
        color: "#46e393",
        icon: <FaTools />,
    },
    SKYBLOCK: {
        color: "#46e393",
        icon: <GiStoneBlock />,
    },
    PRISON: {
        color: "#ff6565",
        icon: <MdLocalPolice />,
    },
    RPG: {
        color: "#ff6565",
        icon: <FaGamepad />,
    },
    MISCELLANEOUS: {
        color: "#46e393",
        icon: <FaQuestion />,
    },
};

const TagInput = ({ tags, onChange }) => {
    return (
        <div className={styles.tagInput}>
            {badges.map((badge, index) => (
                <div className={styles.tag}></div>
            ))}
        </div>
    );
};

export default TagInput;
