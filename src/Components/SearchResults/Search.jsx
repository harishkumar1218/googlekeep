import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Card, CardActions, CardContent, IconButton, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

import { UnarchiveOutlined, DeleteOutlineOutlined } from '@mui/icons-material';

import { DataContext } from '../../Context/DataProvider';

const ArchiveCard = styled(Card)`
    box-shadow: none;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
`;

const Search = ({ archiveNote }) => {

    const [showActions, setShowActions] = useState(false);

    const { setNotes, archivedNotes, setArchivedNotes, setDeletedNotes } = useContext(DataContext);
    useEffect(()=>{

    },[archiveNote])

    const unarchiveNote =async (archiveNote) => {
        try {
            await axios.put(`https://googlekeep-fynx.onrender.com/api/notes/${archiveNote._id}/unarchive`,{},{
                headers: {
                    'userId': localStorage.getItem("user")
                }
            });
        } catch (err) {
            console.error(err);
        }
        const updatedNotes = archivedNotes.filter(data => data._id !== archiveNote._id);
        setArchivedNotes(updatedNotes);
        setNotes(prevArr => [...prevArr, archiveNote]);
    }

    const deleteNote =async (archiveNote) => {
        const updatedNotes = archivedNotes.filter(data => data._id !== archiveNote._id);
        try {
            await axios.put(`/api/notes/${archiveNote._id}/trash`,{},{
                headers: {
                    'userId': localStorage.getItem("user")
                }
            });
        } catch (err) {
            console.error(err);
        }
        setArchivedNotes(updatedNotes);
        setDeletedNotes(prevArr => [...prevArr, archiveNote]);
    }

    return (
        <ArchiveCard style={{backgroundColor:archiveNote.backgroundColor}}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <CardContent sx={{ wordWrap: "break-word" }}>
                <Typography>{archiveNote.title}</Typography>
                <Typography>{archiveNote.content}</Typography>
            </CardContent>
            <CardActions sx={{ display: "flex", justifyContent: "end", marginLeft: "auto" }}>
                <Tooltip title="Unarchive">
                    <IconButton
                        sx={{ visibility: showActions ? 'visible' : 'hidden' }}
                        onClick={() => unarchiveNote(archiveNote)}
                    >
                        <UnarchiveOutlined fontSize='small' />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton
                        sx={{ visibility: showActions ? 'visible' : 'hidden' }}
                        onClick={() => deleteNote(archiveNote)}
                    >
                        <DeleteOutlineOutlined fontSize='small' />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </ArchiveCard>
    )
}

export default Search;