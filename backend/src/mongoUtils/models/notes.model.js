const mongoose = require('mongoose');
const { Schema } = mongoose;

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  noteCode: { type: String },
  metadata: {
    createdBy: { type: Schema.Types.ObjectId, required: true },
  },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

noteSchema.index({ title: 'text', content: 'text' });
noteSchema.index({ 'metadata.createdBy': 1 });
noteSchema.index({ noteCode: 1 });

noteSchema.pre('save', async function preSave(next) {
  try {
    const noteCount = await this.constructor.countDocuments();
    const noteCode = `N-${noteCount+1}`;
    this.noteCode = noteCode;
  } catch(error) {
    console.log('Failed while running preSave hook', error);
  } finally {
    next();
  }
});

module.exports = mongoose.model('notes', noteSchema, 'notes');