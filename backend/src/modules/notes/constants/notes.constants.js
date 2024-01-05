const ERROR_MESSAGES = {
  INVALID_TYPE: 'Invalid type',
  INVALID_NOTE_ID: 'Invalid note id',
  INVALID_NOTE_DATA: 'Invalid note data',
  INVALID_NOTE_CONTENT: 'Invalid note content',
  INVALID_NOTE_TITLE: 'Invalid note title',
  INVALID_NOTE_UPDATES: 'Invalid note updates',
  NOTE_NOT_OWNED_BY_USER: 'Note not owned by user',
  EMPTY_SHARE_LIST: 'Empty share list',
  INVALID_SHARED_WITH_USER_ID: 'Invalid shared with user id',
  INVALID_SEARCH_TERM: 'Invalid search term',
};

const SUCCESS_MESSAGES = {
  GET_NOTES: 'Successfully fetched notes',
  GET_NOTE: 'Successfully fetched note',
  CREATE_NOTE: 'Successfully created note',
  UPDATED_NOTE: 'Successfully updated note',
  DELETED_NOTE: 'Successfully deleted note',
  SHARED_NOTE: 'Successfully shared note',
};

module.exports = {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};