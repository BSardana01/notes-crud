const mongoose = require('mongoose');
const { Schema } = mongoose;

const sharedNotesSchema = new mongoose.Schema({
  sharedBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'users',
  },
  sharedWith: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'users',
  },
  noteId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'notes',
  },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

sharedNotesSchema.index({ sharedBy: 1, noteId: 1 });
sharedNotesSchema.index({ sharedWith: 1, noteId: 1 });

module.exports = mongoose.model('sharedNotes', sharedNotesSchema, 'sharedNotes');