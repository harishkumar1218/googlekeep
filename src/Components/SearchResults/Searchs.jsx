import React, { useContext } from 'react';



import { DataContext } from '../../Context/DataProvider';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container, Grid } from '@mui/material';

import { ArchiveOutlined } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Search from './Search';

const Searchs = () => {
    const { query } = useParams();
    console.log(query);
    const { archivedNotes } = useContext(DataContext);
    const [notes, setNotes] = useState([]);
    
    
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await axios.get('https://googlekeep-fynx.onrender.com/api/notes/search', { params: { query },
                    headers: {
                        'userId': localStorage.getItem("user")
                    }
                });
                setNotes(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchNotes();
    }, []);

    return (
        <React.Fragment>
            {
                notes.length === 0 ? (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: '8rem',
                    }}>
                        <ArchiveOutlined sx={{
                            backgroundSize: '120px 120px',
                            height: '120px',
                            margin: '20px',
                            opacity: '.1',
                            width: '120px',
                        }} />
                        <Typography sx={{ fontSize: '1.375rem' }} align='center' variant="h6" color="#5f6368">
                            Your Search notes appear here
                        </Typography>
                    </Box>
                ) :
                    (
                        <Container maxWidth="lg">
                            <Grid spacing={2} container>
                                {
                                    notes.map(notes => (
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <Search archiveNote={notes} />
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        </Container>
                    )
            }
        </React.Fragment>
    )
}

export default Searchs;