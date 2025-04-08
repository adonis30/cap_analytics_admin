// LoadingSpinner.jsx
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
    const spinnerStyle = {
        width: '50px',
        height: '50px',
        border: '5px solid rgba(0, 0, 255, 0.2)',
        borderTop: '5px solid blue',
        borderRadius: '50%',
    };

    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
    };

    return (
        <div style={containerStyle}>
            <motion.div
                style={spinnerStyle}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            />
        </div>
    );
};

export default LoadingSpinner;
