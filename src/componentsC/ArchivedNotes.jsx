import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ArchivedNotes = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await axios.get('/api/notes/archived');
                setNotes(response.data);
            } catch (err) {
                console.log("hari");
                console.error(err);
            }
        };

        fetchNotes();
    }, []);

    return (
        <div>
            <h2>Archived Notes</h2>
            {notes.map(note => (
                <div key={note._id} style={{backgroundColor:note.backgroundColor}}>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                    <p>Labels: {note.labels.join(', ')}</p>
                </div>
            ))}
        </div>
    );
};

export default ArchivedNotes;
