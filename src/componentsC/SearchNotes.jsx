import React, { useState } from 'react';
import axios from 'axios';

const SearchNotes = () => {
    const [query, setQuery] = useState('');
    
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('/api/notes/search', { params: { query } });
            setResults(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search notes"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
            <div>
                {results.map(note => (
                    <div key={note._id} style={{ backgroundColor: note.backgroundColor }}>
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>
                        <p>Labels: {note.labels.join(', ')}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchNotes;
