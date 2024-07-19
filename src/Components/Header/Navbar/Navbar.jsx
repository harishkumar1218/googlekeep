import React, { useState } from 'react';

import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    TextField,
    Icon,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';

import logo from '../../../assets/Images/google-keep-logo.png';

import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = styled(AppBar)`
    z-index: ${props => props.theme.zIndex.drawer + 1};
    background-color: #fff;
    box-shadow: inset 0 -1px 0 0 #dadce0;
`;

const Heading = styled(Typography)`
    color : #5f6368;
    font-size: 22px;
    padding: 0 0 0 15px;
`;

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const Header = ({ handleDrawer, open }) => {
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        
        
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if(query.length==0){
                navigate("/home");
            }else{
                setQuery(query.trim());
                navigate(`/search/${encodeURIComponent(query)}`);
            }
            
        }
    };

    const location = useLocation();
    const pathName = capitalize(location.pathname.substring(1));

    return (
        <Navbar open={open}>
            <Toolbar>
                <IconButton
                    onClick={handleDrawer}
                    edge="start"
                    sx={{ marginRight: 5 }}>
                    <MenuIcon />
                </IconButton>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {
                        pathName ? <img src={logo} alt="logo" style={{ width: 30 }} />: <img src={logo} alt="logo" style={{ width: 30 }} />
                    }
                    
                    <Heading>{'Keep'}</Heading>
                </Box>
                <div style={{  paddingLeft: "7px", borderRadius: "20px", backgroundColor: "white", display: "flex", alignItems: "center", marginLeft: "60px", border: "1px solid gray", borderColor: "black" }}>
                    <SearchIcon style={{ color: "black" }} />
                    <TextField style={{  marginLeft: "20px", width: "500px", }}
                        multiline
                        placeholder='Search...'
                        variant='standard'
                        InputProps={{ disableUnderline: true }}
                        onClick={() => {
                            // setShowTextField(true);
                            // containerRef.current.style.minHeight = '100px';
                        }}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        name='content'
                    // value={addNote.content}
                    />
                </div>

            </Toolbar>
        </Navbar>
    )
}

export default Header;