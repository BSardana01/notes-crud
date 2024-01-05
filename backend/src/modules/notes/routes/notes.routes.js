const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  searchNoteByKeywords,
} = require('../controllers/notes.controller');

const {
  validateGetNotesParams,
  validateGetNoteParams,
  validateCreateNoteParams,
  validateUpdateNoteParams,
  validateDeleteNoteParams,
  validateShareNoteParams,
  validateSearchNotesByKeywordsParams,
} = require('../middlewares/notes.middlewares');

const baseRoute = '/auth/notes';

module.exports = (router) => {
  router.get(`${baseRoute}`, validateGetNotesParams, getNotes);
  router.get(`${baseRoute}/:id`, validateGetNoteParams, getNoteById);
  router.post(`${baseRoute}`, validateCreateNoteParams, createNote);
  router.put(`${baseRoute}/:id`, validateUpdateNoteParams, updateNote);
  router.delete(`${baseRoute}/:id`, validateDeleteNoteParams, deleteNote);
  router.post(`${baseRoute}/:id/share`, validateShareNoteParams, shareNote);
  router.get(`${baseRoute}/search`, validateSearchNotesByKeywordsParams, searchNoteByKeywords);
};