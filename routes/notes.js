const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Middleware to check user authentication
const authenticateUser = (req, res, next) => {
    const userId = req.header('userId');
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    req.userId = userId;
    next();
};

// Create a new note
router.post('/notes', authenticateUser, async (req, res) => {
    const { title, content, labels, backgroundColor } = req.body;
    const userId = req.userId;
    try {
        const newNote = new Note({
            title,
            content,
            labels,
            backgroundColor,
            userId
        });
        const savedNote = await newNote.save();
        res.json(savedNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all notes for a user
router.get('/notes', authenticateUser, async (req, res) => {
    const userId = req.userId;
    try {
        const notes = await Note.find({ userId, deleted: false, archived: false });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get archived notes for a user
router.get('/notes/archived', authenticateUser, async (req, res) => {
    const userId = req.userId;
    try {
        const notes = await Note.find({ userId, archived: true, deleted: false });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get trash notes for a user
router.get('/notes/trash', authenticateUser, async (req, res) => {
    const userId = req.userId;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    try {
        const notes = await Note.find({ userId, deleted: true, date: { $gte: thirtyDaysAgo } });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search notes for a user
router.get('/notes/search', authenticateUser, async (req, res) => {
    const { query } = req.query;
    const userId = req.userId;
    try {
        const notes = await Note.find({
            userId,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
                { labels: { $regex: query, $options: 'i' } }
            ],
            deleted: false
        });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single note by id
router.get('/notes/:id', authenticateUser, async (req, res) => {
    const userId = req.userId;
    try {
        const note = await Note.findOne({ _id: req.params.id, userId });
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a note by id
router.put('/notes/:id', authenticateUser, async (req, res) => {
    const { title, content, labels, backgroundColor, archived, deleted } = req.body;
    const updateData = { title, content, labels, backgroundColor, archived, deleted };
    const userId = req.userId;

    if (deleted) {
        updateData.deletionDate = new Date();
    } else {
        updateData.deletionDate = null;
    }

    try {
        const updatedNote = await Note.findOneAndUpdate({ _id: req.params.id, userId }, updateData, { new: true });
        if (!updatedNote) return res.status(404).json({ message: 'Note not found' });
        res.json(updatedNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a note by id
router.delete('/notes/:id', authenticateUser, async (req, res) => {
    const userId = req.userId;
    try {
        const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, userId });
        if (!deletedNote) return res.status(404).json({ message: 'Note not found' });
        res.json({ message: 'Note deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a label from all notes for a user
router.delete('/notes/label/:label', authenticateUser, async (req, res) => {
    const userId = req.userId;
    const labelToDelete = req.params.label;
    try {
        const notes = await Note.find({ userId, labels: labelToDelete });
        for (const note of notes) {
            note.labels = note.labels.filter(label => label !== labelToDelete);
            await note.save();
        }
        res.json({ message: `Label '${labelToDelete}' removed from all notes` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get notes by label for a user
router.get('/notes/label/:label', authenticateUser, async (req, res) => {
    const userId = req.userId;
    try {
        const notes = await Note.find({ userId, labels: { $in: [req.params.label] }, deleted: false });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Restore a note from trash
router.put('/notes/:id/restore', authenticateUser, async (req, res) => {
    const userId = req.userId;
    try {
        const restoredNote = await Note.findOneAndUpdate(
            { _id: req.params.id, userId },
            { deleted: false, date: Date.now(), archived: false },
         
        );
        if (!restoredNote) return res.status(404).json({ message: 'Note not found' });
        res.json(restoredNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Empty trash for a note
router.put('/notes/:id/emptyTrash', authenticateUser, async (req, res) => {
    const userId = req.userId;
    try {
        const restoredNote = await Note.findOneAndUpdate(
            { _id: req.params.id, userId },
            { deleted: false, date: Date.now(), archived: false },
    
        );
        if (!restoredNote) return res.status(404).json({ message: 'Note not found' });
        res.json(restoredNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Archive a note
router.put('/notes/:id/archive', authenticateUser, async (req, res) => {
    const userId = req.userId;
    console.log(userId);
    console.log("bend");
    try {
        const updatedNote = await Note.findOneAndUpdate(
            { _id: req.params.id, userId },
            { archived: true },
           
        );
        if (!updatedNote) return res.status(404).json({ message: 'Note not found' });
        res.json(updatedNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Unarchive a note
router.put('/notes/:id/unarchive', authenticateUser, async (req, res) => {
    const userId = req.userId;
    try {
        const updatedNote = await Note.findOneAndUpdate(
            { _id: req.params.id, userId },
            { archived: false },
           
        );
        if (!updatedNote) return res.status(404).json({ message: 'Note not found' });
        res.json(updatedNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Move a note to trash
router.put('/notes/:id/trash', authenticateUser, async (req, res) => {
    const userId = req.userId;
    try {
        const updatedNote = await Note.findOneAndUpdate(
            { _id: req.params.id, userId },
            { deleted: true },
           
        );
        if (!updatedNote) return res.status(404).json({ message: 'Note not found' });
        res.json(updatedNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
