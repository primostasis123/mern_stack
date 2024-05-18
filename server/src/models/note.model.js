import mongoose from 'mongoose';

const { Schema } = mongoose;

const noteSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    isPinned: { type: Boolean, default: false },
    userId: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
});

const Note = mongoose.model('Note', noteSchema);

export default Note;