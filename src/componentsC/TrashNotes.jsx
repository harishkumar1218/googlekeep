import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TrashNotes = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await axios.get('/api/notes/trash');
                setNotes(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchNotes();
    }, []);

    const restoreNote = async (id) => {
        try {
            await axios.put(`/api/notes/${id}/restore`);
            setNotes(notes.filter(note => note._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const deletePermanently = async (id) => {
        try {
            await axios.delete(`/api/notes/${id}`);
            setNotes(notes.filter(note => note._id !== id));
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div>
            <h2>Trash Notes</h2>
            {notes.map(note => (
                <div key={note._id} style={{ backgroundColor: note.backgroundColor }}>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                    <p>Labels: {note.labels.join(', ')}</p>
                    <button onClick={() => restoreNote(note._id)}>Restore</button>
                    <button onClick={()=> deletePermanently(note._id)}>delete Permanently</button>
                </div>
            ))}
        </div>
    );
};

export default TrashNotes;
