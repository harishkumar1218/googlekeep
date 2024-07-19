import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Box, Typography, Container, Grid, ClickAwayListener } from '@mui/material';
import Notes from "../Notes/Notes";
import Note from '../Notes/Note'
import { DataContext } from '../../Context/DataProvider';
const Label = () => {
    const [labels, setLabels] = useState([]);
    const [showActions, setShowActions] = useState(false);
    const [openModal, setOpenModal] = useState(true);
    const [addNote, setAddNote] = useState({});
    const { notes, setNotes, setArchivedNotes, setDeletedNotes } = useContext(DataContext);
    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };
    const fun = () => {

        handleCloseModal();
        console.log(addNote)
        fetchNotes();

    }
    const onDragEnd = (result) => {
        if (!result.destination)
            return;

        const items = reorder(notes, result.source.index, result.destination.index);
        setNotes(items);
    }


    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const onTextChange = (e) => {
        let changedNote = { [e.target.name]: e.target.value }
        setAddNote(changedNote);
    }


    const fetchNotes = async () => {
        const response = await axios.get(`https://googlekeep-fynx.onrender.com/api/notes/label/${addNote.label}`, {
            headers: {
                'userId': localStorage.getItem("user")
            }
        });
        setNotes(response.data);
    };





    return (
        <div>
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                sx={{ '& .MuiDialog-paper': { width: { xs: '300px', sm: '300px', md: '400px' }, maxWidth: { sm: '50%', md: '70%', lg: '90%' } } }}
            >
                <DialogTitle sx={{ fontSize: ".875rem", color: "#3c4043" }}>
                    Enter a Label
                </DialogTitle>
                <DialogActions>
                    <TextField style={{ border: "0" }}
                        label="label"
                        onChange={(e) => onTextChange(e)}
                        fullWidth
                        margin="normal"
                        name="label"
                    />
                    <Button variant='dark' onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={() => { fun() }} >
                        Enter
                    </Button>
                </DialogActions>
            </Dialog>
            <Container maxWidth="lg">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided) => (
                            <Grid spacing={2} container
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {
                                    notes.map((note, index) => (

                                        <Draggable key={note.id} draggableId={note._id} index={index}>
                                            {(provided) => (
                                                <Grid item xs={12} sm={6} md={4} lg={3}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}

                                                >

                                                    <Note note={note} />
                                                </Grid>
                                            )}
                                        </Draggable>
                                    ))
                                }
                            </Grid>
                        )}
                    </Droppable>
                </DragDropContext>
            </Container>



        </div>
    );
};

export default Label;
