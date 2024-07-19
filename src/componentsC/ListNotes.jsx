import React, { useEffect, useState } from 'react';
import axios from 'axios';


const ListNotes = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const fetchNotes = async () => {
            const response = await axios.get('/api/notes');
            setNotes(response.data);
        };

        fetchNotes();
    }, []);

    const moveToArchive = async (id) => {
        try {
            await axios.put(`/api/notes/${id}/archive`);
            setNotes(notes.filter(note => note._id !== id));
        } catch (err) {
            console.error(err);
        }
    };
    const moveToTrash = async (id) => {
        try {
            await axios.put(`/api/notes/${id}/trash`);
            setNotes(notes.filter(note => note._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>All Notes</h2>
            {notes.map(note => (
                <div key={note._id} style={{backgroundColor:note.backgroundColor}}>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                    <button onClick={() => moveToArchive(note._id)}>move To Archive</button>
                    <button onClick={() => moveToTrash(note._id)}>move To Trash</button>
                    
                </div>
            ))}
            
        </div>
    );
};

export default ListNotes;
