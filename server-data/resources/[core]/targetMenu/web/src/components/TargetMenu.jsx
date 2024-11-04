import React, { useEffect, useState } from 'react';
import { FaHandshake, FaMedkit, FaCar, FaLock, FaWrench, FaSearch, FaHandPointer, FaBox } from 'react-icons/fa';

const iconMap = {
    FaHandshake: <FaHandshake />,
    FaMedkit: <FaMedkit />,
    FaCar: <FaCar />,
    FaLock: <FaLock />,
    FaWrench: <FaWrench />,
    FaSearch: <FaSearch />,
    FaHandPointer: <FaHandPointer />,
    FaBox: <FaBox />,
};

const TargetMenu = ({ target }) => {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        if (target) {
            setMenuItems(target.actions || []);
        }
    }, [target]);

    if (!target || !menuItems.length) return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-6 rounded-full flex flex-wrap justify-center gap-4">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => console.log(`Action selected: ${item.function}`)}
                        className="text-white p-2 bg-blue-500 rounded-full hover:bg-blue-700 flex items-center gap-2"
                    >
                        {iconMap[item.icon] || <FaBox />}å
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    )
};

export default TargetMenu;
