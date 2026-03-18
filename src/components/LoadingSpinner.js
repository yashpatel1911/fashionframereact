import React from 'react';

function LoadingSpinner() {
    const colors = [
        'primary', 'secondary', 'success', 'danger',
        'warning', 'info', 'light', 'dark'
    ];

    return (
        <div className="d-flex justify-content-center align-items-center flex-wrap gap-2 my-5">
            {colors.map((color) => (
                <div className={`spinner-grow text-${color}`} role="status" key={color}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            ))}
        </div>
    );
}

export default LoadingSpinner;
