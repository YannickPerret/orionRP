import { useNuiRequest } from "fivem-nui-react-lib";
import React, { useEffect, useState } from 'react';
import {
    FaHandshake,
    FaMedkit,
    FaCar,
    FaLock,
    FaWrench,
    FaSearch,
    FaHandPointer,
    FaBox,
    FaHardHat,
    FaTshirt,
    FaGlasses,
    FaShieldAlt,
    FaShoppingBag,
    FaShoePrints,
    FaHandPaper,
    FaUser,
    FaLifeRing,
    FaTheaterMasks,
} from 'react-icons/fa';
import { GiCrystalEarrings } from "react-icons/gi";
import { PiPants, PiWatch } from "react-icons/pi";

const iconMap = {
    FaHandshake: <FaHandshake />,
    FaMedkit: <FaMedkit />,
    FaCar: <FaCar />,
    FaLock: <FaLock />,
    FaWrench: <FaWrench />,
    FaSearch: <FaSearch />,
    FaHandPointer: <FaHandPointer />,
    FaBox: <FaBox />,
    FaHatCowboy: <FaHardHat />,
    FaTshirt: <FaTshirt />,
    FaEar: <GiCrystalEarrings />,
    FaGlasses: <FaGlasses />,
    FaShieldAlt: <FaShieldAlt />,
    FaShoppingBag: <FaShoppingBag />,
    FaPants: <PiPants />,
    FaShoePrints: <FaShoePrints />,
    FaHandPaper: <FaHandPaper />,
    FaUser: <FaUser />,
    FaLifeRing: <FaLifeRing />,
    FaStopwatch: <PiWatch />,
    FaTheaterMasks: <FaTheaterMasks />,
};

const TargetMenu = ({ target }) => {
    const [menuItems, setMenuItems] = useState([]);
    const { send } = useNuiRequest({ resource: 'targetMenu' });

    useEffect(() => {
        if (target) {
            setMenuItems(target.actions || []);
        }
    }, [target]);

    const handleAction = (item) => {
        send('handleAction', item);
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-80 h-80">
                {menuItems.length > 0 && (
                    menuItems.map((item, index) => {
                        const angle = (360 / menuItems.length) * index - 90; // Commence en haut
                        const radians = angle * (Math.PI / 180);
                        const radius = 160; // Ajustez le rayon selon vos besoins
                        const centerX = 160; // Centre du conteneur (largeur / 2)
                        const centerY = 160; // Centre du conteneur (hauteur / 2)
                        const x = centerX + radius * Math.cos(radians);
                        const y = centerY + radius * Math.sin(radians);
                        return (
                            <button
                                key={index}
                                onClick={() => handleAction(item)}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 text-white bg-blue-500 rounded-full hover:bg-blue-700 flex items-center justify-center w-16 h-16"
                                style={{ left: `${x}px`, top: `${y}px` }}>
                                {iconMap[item.icon] || <FaBox size={30} />}
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default TargetMenu;
