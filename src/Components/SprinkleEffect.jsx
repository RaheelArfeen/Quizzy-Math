import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

const SprinkleEffect = () => {
    const [width, height] = useWindowSize();
    const [confettiPieces, setConfettiPieces] = useState(200);

    useEffect(() => {
        const timer = setTimeout(() => {
            setConfettiPieces(0);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    if (width === 0 || height === 0) return null;

    return (
        <Confetti
            width={width}
            height={height}
            numberOfPieces={confettiPieces}
            recycle={false}
            gravity={0.3}
            wind={0}
        />
    );
};

export default SprinkleEffect;