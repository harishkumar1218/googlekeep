import React, { useState } from 'react';
import axios from 'axios';
import ColorPicker from './ColorPicker';

const CreateNote = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [labels, setLabels] = useState([]);
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [labelInput, setLabelInput] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/notes', { title, content, labels, backgroundColor });
            console.log(response.data);
            setTitle('');
            setContent('');
            setLabels([]);
            setBackgroundColor('#ffffff');
        } catch (err) {
            console.error(err);
        }
    };

    const addLabel = (e) => {
        if (e.key === 'Enter' && labelInput && labels.length < 9) {
            setLabels([...labels, labelInput]);
            setLabelInput('');
        }
    };

    return (
        <form  style={{ backgroundColor }}>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            ></textarea>
            
            <input
                type="text"
                placeholder="Add label"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyDown={addLabel}
            />
            <div>
                {labels.map(label => (
                    <span key={label}>{label}</span>
                ))}
            </div>
            
            <ColorPicker selectedColor={backgroundColor} onChangeColor={setBackgroundColor} />
            <button onClick={handleSubmit} type="submit">Add Note</button>
        </form>
    );
};

export default CreateNote;
