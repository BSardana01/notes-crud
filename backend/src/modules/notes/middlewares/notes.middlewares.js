const { isValidObjectId } = require('mongoose');

const { NOTE_ACCESS_TYPE } = require("../../../utils/constants");
const { errorResponse, statusCodes } = require("../../../utils/response.utils");
const { checkIfNoteOwnedByUser } = require('../helpers/notes.helpers');
const { ERROR_MESSAGES } = require('../constants/notes.constants');

const validateGetNotesParams = (req, res, next) => {
  try {
    const { type } = req.query;
    if (type && !Object.values(NOTE_ACCESS_TYPE).includes(type)) {
      throw {
        code: statusCodes.VALIDATION_FAILED,
        message: ERROR_MESSAGES.INVALID_TYPE,
      };
    }
    return next();
  } catch (error) {
    return errorResponse({
      res,
      error,
    });
  }
};

const validateGetNoteParams = (req, res, next) => {
  try {
    const { id: noteId } = req.params;
    if (!noteId || !isValidObjectId(noteId)) {
      throw {
        code: statusCodes.VALIDATION_FAILED,
        message: ERROR_MESSAGES.INVALID_NOTE_ID,
      };
    }
    return next();
  } catch (error) {
    return errorResponse({
      res,
      error,
    });
  }
};

const validateCreateNoteParams = (req, res, next) => {
  try {
    const { noteData } = req.body;
    if (!noteData) {
      throw {
        code: statusCodes.VALIDATION_FAILED,
        message: ERROR_MESSAGES.INVALID_NOTE_DATA,
      };
    }
    const {
      title,
      content,
    } = noteData;
    if (!title) {
      throw {
        code: statusCodes.VALIDATION_FAILED,
        message: ERROR_MESSAGES.INVALID_NOTE_TITLE,
      };
    }
    if (!content) {
      throw {
        code: statusCodes.VALIDATION_FAILED,
        message: ERROR_MESSAGES.INVALID_NOTE_CONTENT,
      };
    }
    return next();
  } catch (error) {
    return errorResponse({
      res,
      error,
    });
  }
};

const validateUpdateNoteParams = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id: noteId } = req.params;
    const { noteUpdates } = req.body;
    if (!noteId || !isValidObjectId(noteId)) {
      throw {
        code: statusCodes.VALIDATION_FAILED,
        message: ERROR_MESSAGES.INVALID_NOTE_ID,
      };
    }
    if (!noteUpdates) {
      throw {
        code: statusCodes.VALIDATION_FAILED,
        message: ERROR_MESSAGES.INVALID_NOTE_UPDATES,
      };
    }
    const isNoteOwnedByUser = await checkIfNoteOwnedByUser({
      userId,
      noteId,
    });
    if (!isNoteOwnedByUser) {
      throw {
        code: statusCodes.VALIDATION_FAILED,
        message: ERROR_MESSAGES.NOTE_NOT_OWNED_BY_USER,
      };
    }
    return next();
  } catch (error) {
    return errorResponse({
      res,
      error,
    });
  }
};

const validateDeleteNoteParams = async (req, res, next) => {
  try {
    const { id: noteId } = req.params;
    if (!noteId || !isValidObjectId(noteId)) {
      throw {
        code: statusCodes.VALIDATION_FAILED,
        message: ERROR_MESSAGES.INVALID_NOTE_ID,
      };
    }
    const isNoteOwnedByUser = await checkIfNoteOwnedByUser({
      userId,
      noteId,
    });
    if (!isNoteOwnedByUser) {
      throw {
        code: statusCodes.VALIDATION_FAILED,
        message: ERROR_MESSAGES.NOTE_NOT_OWNED_BY_USER,
      };
    }
    return next();
  } catch (error) {
    return errorResponse({
      res,
      error,
    });
  }
};

const validateShareNoteParams = async (req, res, next) => {
  try {
    const { id: noteId } = req.params;
    const { usersToShareNoteWith } = req.body;
    if (!noteId || !isValidObjectId(noteId)) {
      throw {
        code: statusCodes.VALIDATION_FAILED,
        message: ERROR_MESSAGES.INVALID_NOTE_ID,
      };
    }
    const isNoteOwnedByUser = await checkIfNoteOwnedByUser({
      userId,
      noteId,
    });
    if (!isNoteOwnedByUser) {
      throw {
        code: statusCodes.VALIDATION_FAILED,
        message: ERROR_MESSAGES.NOTE_NOT_OWNED_BY_USER,
      };
    }
    if (!usersToShareNoteWith && !usersToShareNoteWith.length) {
      throw {
        code: statusCodes.VALIDATION_FAILED,
        message: ERROR_MESSAGES.EMPTY_SHARE_LIST,
      };
    }
    const isInvalidUserId = usersToShareNoteWith.some(userId => !isValidObjectId(userId));
    if (isInvalidUserId) {
      throw {
        code: statusCodes.VALIDATION_FAILED,
        message: ERROR_MESSAGES.INVALID_SHARED_WITH_USER_ID,
      };
    }
    return next();
  } catch (error) {
    return errorResponse({
      res,
      error,
    });
  }
};

const validateSearchNotesByKeywordsParams = (req, res, next) => {
  try {
    const { q: searchTerm } = req.query;
    if (!searchTerm) {
      throw {
        code: statusCodes.VALIDATION_FAILED,
        message: ERROR_MESSAGES.INVALID_SEARCH_TERM,
      };
    }
    return next();
  } catch (error) {
    return errorResponse({
      res,
      error,
    });
  }
};

module.exports = {
  validateGetNotesParams,
  validateGetNoteParams,
  validateCreateNoteParams,
  validateUpdateNoteParams,
  validateDeleteNoteParams,
  validateShareNoteParams,
  validateSearchNotesByKeywordsParams,
};
