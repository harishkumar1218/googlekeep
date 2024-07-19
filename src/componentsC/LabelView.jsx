import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const LabelView = () => {
    const { label } = useParams();
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await axios.get(`/api/notes/label/${label}`);
                console.log(response);
                setNotes(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchNotes();
    }, [label]);

    return (
        <div>
            <h2>Notes with label: {label}</h2>
            {notes.map(note => (
                <div key={note._id}>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                    <p>Labels: {note.labels.join(', ')}</p>
                </div>
            ))}
        </div>
    );
};

export default LabelView;
