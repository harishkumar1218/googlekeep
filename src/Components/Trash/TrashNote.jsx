import React, { useState, useContext } from 'react';
import axios from 'axios';
import {
    Card,
    CardActions,
    CardContent,
    IconButton,
    Typography,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
} from '@mui/material';

import { styled } from '@mui/material/styles';

import { DeleteForeverOutlined, RestoreFromTrashOutlined } from '@mui/icons-material';

import { DataContext } from '../../Context/DataProvider';

const TrashCard = styled(Card)`
    box-shadow: none;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
`;

const TrashNote = ({ trashNote }) => {


    const [showActions, setShowActions] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const { setNotes, deletedNotes, setDeletedNotes } = useContext(DataContext);
   

    const deleteNote = async (trashNote) => {
        const updatedNotes = deletedNotes.filter(data => data._id !== trashNote._id);
        try {
            await axios.delete(`https://googlekeep-fynx.onrender.com:5000/api/notes/${trashNote._id}`,{
                headers: {
                    'userId': localStorage.getItem("user")
                }
            });
        } catch (err) {
            console.error(err);
        }
        setDeletedNotes(updatedNotes);
        handleCloseModal();
    }

    const restoreNote = async (trashNote) => {
        const updatedNotes = deletedNotes.filter(data => data._id !== trashNote._id);
        try {
            await axios.put(`https://googlekeep-fynx.onrender.com:5000/api/notes/${trashNote._id}/restore`,{},{
                headers: {
                    'userId': localStorage.getItem("user")
                }
            });

        } catch (err) {
            console.error(err);
        }
        setDeletedNotes(updatedNotes);
        setNotes(prevArr => [...prevArr, trashNote]);
    }

    return (
        <React.Fragment>
            <TrashCard style={{backgroundColor:trashNote.backgroundColor}}
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
            >
                <CardContent sx={{ wordWrap: "break-word" }}>
                    <Typography>{trashNote.title}</Typography>
                    <Typography>{trashNote.content}</Typography>
                </CardContent>
                <CardActions>
                    <Tooltip title="Delete Forever">
                        <IconButton
                            sx={{ visibility: showActions ? 'visible' : 'hidden' }}
                            onClick={handleOpenModal}
                        >
                            <DeleteForeverOutlined fontSize='small' />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Restore">
                        <IconButton
                            sx={{ visibility: showActions ? 'visible' : 'hidden' }}
                            onClick={() => restoreNote(trashNote)}
                        >
                            <RestoreFromTrashOutlined fontSize='small' />
                        </IconButton>
                    </Tooltip>
                </CardActions>
            </TrashCard>

            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                sx={{ '& .MuiDialog-paper': { width: { xs: '300px', sm: '300px', md: '400px' }, maxWidth: { sm: '50%', md: '70%', lg: '90%' } } }}
            >
                <DialogTitle sx={{ fontSize: ".875rem", color: "#3c4043" }}>
                    Delete note forever?
                </DialogTitle>
                <DialogActions>
                    <Button variant='dark' onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={() => deleteNote(trashNote)} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}


export default TrashNote;