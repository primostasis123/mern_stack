import express from 'express'
import cors from 'cors'
import config from '../config.json' assert { type: 'json' };
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { authenticateToken } from './utilities.js';
import dotenv from 'dotenv';
import User from './models/user.model.js';
import Note from './models/note.model.js';

dotenv.config();

mongoose.connect(config.connectionString);

const app = express();
app.use(express.json());

app.use(cors(
    { origin : '*'}
));

app.get('/', (req, res) => {
    res.json({data : config.connectionString});
});

//create account
app.post("/create-account", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if(!fullName || !email || !password) {
            return res.status(400).json({error: true, message : "All fields are required"});
        }
    const isUser = await User.findOne({ email: email});
    if (isUser) {
        return res.status(400).json({error: true, message : "User already exists"});
    }
    const user = new User({ fullName, email, password });
    await user.save();
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
    });   
        return res.status(201).json({ data: { error: false, user, accessToken, message: "Registration Successful" } });
    } 
    catch (error) {
        res.status(500).json({error: true, message : "Internal server error"});
    }
});

//login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: true, message: "All fields are required" });
        }

        const userInfo = await User.findOne({ email: email });

        if (!userInfo) {
            return res.status(400).json({ error: true, message: "User does not exist" });
        }

        if (userInfo.email === email && userInfo.password === password) {
            const user = { user: userInfo }
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "1d",
            });

            return res.status(200).json({ error: false, email, accessToken, message: "Login Successful" });
        } else {
            return res.status(400).json({ error: true, message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ error: true, message: "Internal server error" });
    }
    
});

// get user
app.get("/get-user", authenticateToken, async (req, res) => {
    const { user } = req.user;
    try {
        const userInfo = await User.findOne({
            _id: user._id
            
        });

        if (!userInfo) {
            return res.sendStatus(401);
        }
        return res.status(200).json(userInfo);
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal server error" });
    }
});

//add note
app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;
    
    if (!title) {
        return res.status(400).json({ error: true, message: "Title is required" });
    }

    if (!content) {
        return res.status(400).json({ error: true, message: "Content is required" });
    }

    try {
        const note = new Note({
            title,
            content,
            tags : tags || [],
            isPinned,
            userId: user._id,
        });

        await note.save();
        return res.status(201).json({ data: { error: false, note, message: "Note added successfully" } });

    } catch (error) {
        res.status(500).json({ error: true, message: "Internal server error" });
    }

});

//edit note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    if (!title) {
        return res.status(400).json({ error: true, message: "Title is required" });
    }
    if (!content) {
        return res.status(400).json({ error: true, message: "Content is required" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id});
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }
        if (note.userId !== user._id) {
            return res.status(403).json({ error: true, message: "Unauthorized" });
        }
        note.title = title;
        note.content = content;
        note.tags = tags || [];
        note.isPinned = isPinned;
        await note.save();
        return res.status(200).json({ data: { error: false, note, message: "Note edited successfully" } });

    } catch (error) {
        res.status(500).json({ error: true, message: "Internal server error" });
    }
});

//get all notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
    const { user } = req.user;
    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
        return res.status(200).json({ data: { error: false, notes } });
    } catch (error) {
        res.status(500).json({ error: true, message: "Internal server error" });
    }
});

app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        await Note.deleteOne({ _id: noteId, userId: user._id });
        return res.status(200).json({ data: { error: false, message: "Note deleted successfully" } });


    } catch (error) {
        res.status(500).json({ error: true, message: "Internal server error" });
    }
});

app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const {isPinned } = req.body;
    const { user } = req.user;
    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id});
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }
        if (note.userId !== user._id) {
            return res.status(403).json({ error: true, message: "Unauthorized" });
        }
;
        note.isPinned = isPinned || false;
        await note.save();
        return res.status(200).json({ data: { error: false, note, message: "Note edited successfully" } });

    } catch (error) {
        res.status(500).json({ error: true, message: "Internal server error" });
    }
});

app.listen(8000);


