import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
import { Card, CardActions, CardContent, IconButton, Typography, Tooltip, Button } from '@mui/material';
import { ArchiveOutlined, DeleteOutlineOutlined } from '@mui/icons-material';

import {
    Box,
    Container as MuiContainer,
    ClickAwayListener,
    TextField
} from '@mui/material';

import { styled } from '@mui/material/styles';

import { v4 as uuid } from 'uuid';

import { DataContext } from '../../Context/DataProvider';
import ColorPicker from '../../componentsC/ColorPicker';

const Container = styled(Box)`
    display: flex;
    flex-direction: column;
    box-shadow: 0 1px 2px 0 rgb(60 64 67 / 30%), 0 2px 6px 2px rgb(60 64 67 / 15%);
    padding: 10px 15px;
    border-radius: 8px;
    border-color: "#e0e0e0";
    margin: auto;
    margin-bottom: 2rem;
    min-height: 30px;
`;

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
    label: "",
    userId:"",
}

const Form = () => {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [labels, setLabels] = useState([]);
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [labelInput, setLabelInput] = useState('');
    const [showTextField, setShowTextField] = useState(false);
    const [addNote, setAddNote] = useState({ ...note, id: uuid() });



    const containerRef = useRef();

    const [showActions, setShowActions] = useState(false);

    const { notes, setNotes, setArchivedNotes, setDeletedNotes } = useContext(DataContext);

    const archiveNote = (note) => {
        const updatedNotes = notes.filter(data => data.id !== note.id);
        // if (!(note.content.length==0 && note.title.length==0)){
        setNotes(updatedNotes);
        setArchivedNotes(prevArr => [...prevArr, note]);

    }

    const deleteNote = (note) => {
        const updatedNotes = notes.filter(data => data.id !== note.id);
        setNotes(updatedNotes);
        setDeletedNotes(prevArr => [...prevArr, note]);
    }

    const handleSubmit = async () => {

        try {
            const response = await axios.post('https://googlekeep-fynx.onrender.com:500/api/notes', { ...addNote },{
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
    const onClickAwayFun=async() => {
        setShowTextField(false);
        containerRef.current.style.minHeight = '30px';
        addNote.backgroundColor = backgroundColor;
        addNote.labels = addNote.label?.split(' ').filter(word => word.length > 0).slice(0, 9);
        console.log(addNote.labels);
        if (setShowTextField) { handleSubmit(); }
        setAddNote({ ...note, id: uuid() });
        setBackgroundColor("#ffffff")
        if (addNote.title || addNote.content) {
            setNotes(prevArr => [addNote, ...prevArr]);
        }

    }
const onClickAwayFunUnSave = async()=>{
    setShowTextField(false);
    containerRef.current.style.minHeight = '30px';
    setAddNote({ ...note, id: uuid() });
        setBackgroundColor("#ffffff")
        if (addNote.title || addNote.content) {
            setNotes(prevArr => [addNote, ...prevArr]);
        }
}

    return (
       
            
                <MuiContainer maxWidth='sm'>
                    <Container style={{ backgroundColor: backgroundColor }} ref={containerRef}>
                        {
                            showTextField && (
                                <>
                                    <TextField
                                        size='small'
                                        placeholder='Title'
                                        variant='standard'
                                        InputProps={{ disableUnderline: true }}
                                        style={{ marginBottom: 10 }}
                                        onChange={(e) => onTextChange(e)}
                                        name='title'
                                        value={addNote.title}
                                    />
                                    <TextField
                                        size='small'
                                        placeholder='lables (use spaces)'
                                        variant='standard'
                                        InputProps={{ disableUnderline: true }}
                                        style={{ marginBottom: 10 }}
                                        onChange={(e) => onTextChange(e)}
                                        name='label'
                                        value={addNote.label}
                                    />
                                </>
                            )
                        }

                        <TextField
                            multiline
                            placeholder='Take a note...'
                            variant='standard'
                            InputProps={{ disableUnderline: true }}
                            onClick={() => {
                                setShowTextField(true);
                                containerRef.current.style.minHeight = '100px';
                            }}
                            onChange={(e) => onTextChange(e)}
                            name='content'
                            value={addNote.content}
                        />
                        {showTextField && (
                            <>
                                <NoteCard
                                    onMouseEnter={() => setShowActions(true)}
                                    onMouseLeave={() => setShowActions(true)}
                                >
                                    <CardActions sx={{ display: "flex", justifyContent: "end", marginLeft: "auto" }}>
                                        <ColorPicker selectedColor={backgroundColor} onChangeColor={setBackgroundColor} />
                                        <Tooltip title="Archive">
                                            <IconButton
                                                
                                                onClick={() => archiveNote(note)}
                                            >
                                                <ArchiveOutlined fontSize='small' />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                
                                                onClick={() => deleteNote(note)}
                                            >
                                                <DeleteOutlineOutlined fontSize='small' />
                                            </IconButton>
                                        </Tooltip>
                                        <Button variant='dark' onClick={() => {onClickAwayFunUnSave() }}>Cancel</Button>
                                        <Button onClick={() => {onClickAwayFun() }} >
                                            Save
                                        </Button>

                                    </CardActions>
                                </NoteCard>
                            </>
                        )}

                    </Container>
                </MuiContainer>

    )
}

export default Form;