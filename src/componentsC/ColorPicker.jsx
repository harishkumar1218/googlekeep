import React from 'react';

const colors = ['#ffffff', '#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb'];

const ColorPicker = ({ selectedColor, onChangeColor }) => {
    return (
        <div style={{ display: 'flex' }}>
            {colors.map(color => (
                <div
                    key={color}
                    onClick={() => onChangeColor(color)}
                    style={{
                        backgroundColor: color,
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: selectedColor === color ? '2px solid black' : '1px solid gray',
                        cursor: 'pointer',
                        margin: '2px'
                    }}
                />
            ))}
        </div>
    );
};

export default ColorPicker;
