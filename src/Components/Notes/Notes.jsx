import React, { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Form from './Form';
import Note from './Note';
import { styled } from '@mui/material/styles';
import { DataContext } from '../../Context/DataProvider';

import { Box, Typography, Container, Grid, ClickAwayListener } from '@mui/material';

import { ArchiveOutlined, DeleteOutlineOutlined, LightbulbOutlined } from '@mui/icons-material';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Card, CardActions, CardContent, IconButton, Tooltip } from '@mui/material';
import ColorPicker from '../../componentsC/ColorPicker';
import { v4 as uuid } from 'uuid';


const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const NoteCard = styled(Card)`
    box-shadow: none;
    border: 1px solid #e0e0e0;
    border-radius: 8px;

     {
        box-shadow: 0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149);
    }
`;



const note = {
    id: '',
    title: '',
    content: '',
    labels: [],
    backgroundColor: "#ffffff",
    label: ""
}

const Notes = () => {
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [showActions, setShowActions] = useState(false);
    const [addNote, setAddNote] = useState({ ...note, id: uuid() });
    const { notes, setNotes, setArchivedNotes, setDeletedNotes } = useContext(DataContext);
    const [selectedNote, setSelectedNote] = useState(null);
    const [open, setOpen] = useState(true);
    const containerRef = useRef();
    const [showTextField, setShowTextField] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        const fetchNotes = async () => {
            const response = await axios.get('https://googlekeep-fynx.onrender.com/api/notes',{
                headers: {
                    'userId': "110482245243071342315"
                }
            });
            console.log(response.data);
            setNotes(response.data);
        };

        fetchNotes();
    }, []);

    const archiveNote =async (note) => {
        const updatedNotes = notes.filter(data => data._id !== note._id);
        try {
            
            await axios.put(`https://googlekeep-fynx.onrender.com/api/notes/${note._id}/archive`,{},{
                headers: {
                    'userId': localStorage.getItem("user")
                }
            });
        } catch (err) {
            
            console.error(err);
        }
        setNotes(updatedNotes);
        setArchivedNotes(prevArr => [...prevArr, note]);

    }

    const deleteNote = async(note) => {
        const updatedNotes = notes.filter(data => data._id !== note._id);
        try {
            await axios.put(`https://googlekeep-fynx.onrender.com/api/notes/${note._id}/trash`,{},{
                headers: {
                    'userId': localStorage.getItem("user")
                }
            });
        } catch (err) {
            console.error(err);
        }
        setNotes(updatedNotes);
        setDeletedNotes(prevArr => [...prevArr, note]);
    }

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`https://googlekeep-fynx.onrender.com/api/notes/${addNote._id}`, { ...addNote },{
                headers: {
                    'userId': localStorage.getItem("user")
                }
            });
            console.log(response.data);
            addNote = note;
        } catch (err) {
            console.error(err);
        }
    };



    const onTextChange = (e) => {
        let changedNote = { ...addNote, [e.target.name]: e.target.value }
        setAddNote(changedNote);
    }


    const onDragEnd = (result) => {
        if (!result.destination)
            return;

        const items = reorder(notes, result.source.index, result.destination.index);
        setNotes(items);
    }


    const handleNoteClick = (note) => {
        console.log(note);
        setSelectedNote(note);
        setOpen(true);
    };
    const handleSave = () => {
        setNotes(notes.map(note => (note._id === selectedNote._id ? selectedNote : note)));
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleNoteChange = (field, value) => {
        setSelectedNote({
            ...selectedNote,
            [field]: value
        });
    };

    const onClickAwayFun = async () => {
        setShowTextField(false);
        
        addNote.backgroundColor = backgroundColor;
        addNote.labels = addNote.label?.split(' ').filter(word => word.length > 0).slice(0, 9);
        if (setShowTextField) { handleSubmit(); }
        setAddNote({ ...note, id: uuid() });
        setBackgroundColor("#ffffff")
        if (addNote.title || addNote.content) {
            setNotes(prevArr => [addNote, ...prevArr]);
        }
        handleCloseModal();

    }
    const onClickAwayFunUnSave = async () => {
        setShowTextField(false);
        
        setAddNote({ ...note, id: uuid() });
        setBackgroundColor("#ffffff")
        if (addNote.title || addNote.content) {
            setNotes(prevArr => [addNote, ...prevArr]);
        }
        handleCloseModal();
    }
    
    

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <React.Fragment>
            <Form />

            {
                notes.length === 0 ? (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: '5rem',
                    }}>
                        <LightbulbOutlined sx={{
                            backgroundSize: '120px 120px',
                            height: '120px',
                            margin: '20px',
                            opacity: '.1',
                            width: '120px',
                        }} />
                        <Typography sx={{ fontSize: '1.375rem' }} align='center' variant="h6" color="#5f6368">
                            Notes you add appear here
                        </Typography>
                    </Box>
                ) :
                    (<>
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
                                                    
                                                    <Draggable   key={note.id}  draggableId={note._id} index={index}>
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

                            
                            <Dialog
                             open={openModal}
                             onClose={handleCloseModal}  style={{ borderRadius: "50px" }} >
                                <DialogContent>
                                    <TextField style={{ border: "0" }}
                                        label="Title"
                                        value={selectedNote ? selectedNote.title : ''}
                                        onChange={(e) => onTextChange(e)}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Content"
                                        value={selectedNote ? selectedNote.content : ''}
                                        onChange={(e) => onTextChange(e)}
                                        fullWidth
                                        margin="normal"
                                        multiline
                                        rows={4}
                                    />
                                </DialogContent>
                                <DialogActions
                                 >
                                    <NoteCard
                                        onMouseEnter={() => setShowActions(true)}
                                        onMouseLeave={() => setShowActions(true)}
                                    >
                                        <CardActions sx={{ display: "flex", justifyContent: "end", marginLeft: "auto" }}>
                                            <ColorPicker selectedColor={backgroundColor} onChangeColor={setBackgroundColor} />
                                            <Tooltip title="Archive">
                                                <IconButton
                                                    sx={{ visibility: showActions ? 'visible' : 'hidden' }}
                                                    onClick={() => archiveNote(note)}
                                                >
                                                    <ArchiveOutlined fontSize='small' />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    sx={{ visibility: showActions ? 'visible' : 'hidden' }}
                                                    onClick={() => deleteNote(note)}
                                                >
                                                    <DeleteOutlineOutlined fontSize='small' />
                                                </IconButton>
                                            </Tooltip>

                                        </CardActions>
                                    </NoteCard>

                                </DialogActions>
                                <DialogActions>
                                    <Button variant='dark' onClick={() => { onClickAwayFunUnSave()}}>Cancel</Button>
                                    <Button onClick={() => {onClickAwayFun() }} >
                                        Save
                                    </Button>
                                </DialogActions>
                            </Dialog>

                         </>
                    )
            }
        </React.Fragment>
    )
}

export default Notes;