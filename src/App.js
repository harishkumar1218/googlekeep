import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import CreateNote from './componentsC/CreateNote';
import ListNotes from './componentsC/ListNotes';
import LabelView from './componentsC/LabelView';
import ArchivedNotes from './componentsC/ArchivedNotes';
import TrashNotes from './componentsC/TrashNotes';
import SearchNotes from './componentsC/SearchNotes';

import Header from './Components/Header/Sidebar/Sidebar';
import Notes from './Components/Notes/Notes';
import Archive from './Components/Archive/Archives';
import Trash from './Components/Trash/TrashNotes';
import Label from './Components/Label/label';
import Search from './Components/SearchResults/Search';
import Searchs from './Components/SearchResults/Searchs';
import LoginPage from './Components/Authentication/LoginPage'
const DrawerHeader = styled('div')(({ theme }) => ({
    ...theme.mixins.toolbar,
  }));

function App() {
    
    return (
        <Box style={{ display: 'flex', width: '100%' }}>
        <Router>
          <Header />
          <Box sx={{ display: 'flex', width: '100%' }}>
            <Box sx={{ p: 3, width: '100%' }}>
              <DrawerHeader />
              <Routes>
              <Route exact path="/" element={<LoginPage />} />
                <Route path="/home" element={<Notes />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/trash" element={<Trash />} />
                <Route path="/label" element={<Label />} />
                <Route path="/search/:query" element={<Searchs />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </Box>
    );
}

export default App;
