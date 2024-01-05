const { NOTE_ACCESS_TYPE } = require("../../../utils/constants");
const { errorResponse, successResponse } = require("../../../utils/response.utils");
const { SUCCESS_MESSAGES } = require("../constants/notes.constants");
const {
  getUserNotes,
  getNoteByIdForUser,
  createNoteForUser,
  updateNotForUser,
  deleteNoteForUser,
  shareNoteForUser,
  searchNoteByKeywordsGlobally,
} = require("../helpers/notes.helpers");

const getNotes = async (req, res) => {
  try {
    const { userId } =  req.user;
    const { type = NOTE_ACCESS_TYPE.OWN } = req.query;
    const { userNotes } = await getUserNotes({
      userId,
      type,
    });
    return successResponse({
      res,
      message: SUCCESS_MESSAGES.GET_NOTES,
      data: { userNotes },
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
    });
  }
};

const getNoteById = async (req, res) => {
  try {
    const { id: noteId } = req.params;
    const { noteData } = await getNoteByIdForUser({
      noteId,
    });
    return successResponse({
      res,
      message: SUCCESS_MESSAGES.GET_NOTE,
      data: { noteData },
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
    });
  }
};

const createNote = async (req, res) => {
  try {
    const { userId } =  req.user;
    const { noteData } = req.body;
    const { newNoteData } = await createNoteForUser({
      userId,
      noteData,
    });
    return successResponse({
      res,
      message: SUCCESS_MESSAGES.CREATE_NOTE,
      data: { newNoteData },
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id: noteId } = req.params;
    const { noteUpdates } = req.body;
    await updateNotForUser({
      noteId,
      noteUpdates,
    });
    return successResponse({
      res,
      message: SUCCESS_MESSAGES.UPDATED_NOTE,
      data: {},
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id: noteId } = req.params;
    await deleteNoteForUser({
      noteId,
    });
    return successResponse({
      res,
      message: SUCCESS_MESSAGES.DELETED_NOTE,
      data: {},
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
    });
  }
};

const shareNote = async (req, res) => {
  try {
    const { userId } =  req.user;
    const { id: noteId } = req.params;
    const { usersToShareNoteWith = [] } = req.body;
    await shareNoteForUser({
      userId,
      noteId,
      usersToShareNoteWith,
    });
    return successResponse({
      res,
      message: SUCCESS_MESSAGES.SHARED_NOTE,
      data: {},
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
    });
  }
};

const searchNoteByKeywords = async (req, res) => {
  try {
    const { q: searchTerm } = req.query;
    const { notes } = await searchNoteByKeywordsGlobally({
      searchTerm,
    });
    return successResponse({
      res,
      message: SUCCESS_MESSAGES.GET_NOTES,
      data: { notes },
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
    });
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  searchNoteByKeywords,
};