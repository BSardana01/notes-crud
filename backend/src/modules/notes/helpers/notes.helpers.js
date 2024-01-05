const { NoteModel, SharedNotesModel } = require("../../../mongoUtils/models");
const { NOTE_ACCESS_TYPE } = require("../../../utils/constants");

const IS_DELETED_QUERY = { isDeleted: { $ne: true } };

const checkIfNoteOwnedByUser = async ({
  userId,
  noteId,
}) => {
  const findClause = {
    'metadata.createdBy': userId,
    noteId,
  };
  const noteCount = await NoteModel.countDocuments(findClause);
  const isNoteOwnedByUser = !!noteCount;
  return isNoteOwnedByUser;
};

const getUserNotes = async ({
  userId,
  type,
}) => {
  const notesPromises = [];
  if ([NOTE_ACCESS_TYPE.ALL, NOTE_ACCESS_TYPE.OWN].includes(type)) {
    const findClause = {
      'metadata.createdBy': userId,
      ...IS_DELETED_QUERY,
    };
    const projectClause = {
      title: 1,
      content: 1,
      noteCode: 1,
    };
    const ownNotesPromise = NoteModel.find(findClause, projectClause).lean();
    notesPromises.push(ownNotesPromise);
  }
  if ([NOTE_ACCESS_TYPE.ALL, NOTE_ACCESS_TYPE.SHARED_WITH_ME].includes(type)) {
    const findClause = {
      sharedWith: userId,
      ...IS_DELETED_QUERY,
    };
    const projectClause = {
      noteId: 1,
    };
    const notesSharedWithMePromise = SharedNotesModel
      .find(findClause, projectClause)
      .populate('noteId', 'title content noteCode')
      .lean();
    notesPromises.push(notesSharedWithMePromise);
  }
  const [
    notesOwnedByMe = [],
    notesSharedWithMe = [],
  ] = await Promise.all(notesPromises);
  const processedNotesSharedWithMe = notesSharedWithMe.map(note => {
    const { title, content, noteCode } = note?.noteId || {};
    return { title, content, noteCode };
  });
  const userNotes = [...notesOwnedByMe, ...processedNotesSharedWithMe];
  return {
    userNotes,
  };
};

const getNoteByIdForUser = async ({
  noteId,
}) => {
  const findClause = {
    _id: noteId,
    ...IS_DELETED_QUERY,
  };
  const projectClause = {
    title: 1,
    content: 1,
    noteCode: 1,
    _id: 0,
  };
  const noteData = await NoteModel.findOne(
    findClause,
    projectClause,
  ).lean();
  return {
    noteData,
  };
};

const createNoteForUser = async ({
  userId,
  noteData,
}) => {
  const {
    title,
    content,
  } = noteData;
  const createdNote = await NoteModel.create({
    title,
    content,
    metadata: {
      createdBy: userId,
    },
  });
  const {
    _id: noteId,
    noteCode,
  } = createdNote;
  const newNoteData = {
    noteId,
    noteCode,
  };
  return {
    newNoteData,
  };
};

const updateNotForUser = async ({
  noteId,
  noteUpdates,
}) => {
  const {
    title,
    content,
  } = noteUpdates;
  const findClause = {
    _id: noteId,
    ...IS_DELETED_QUERY,
  };
  const updateClause = {
    $set: {},
  };
  if (title) {
    updateClause.$set.title = title;
  }
  if (content) {
    updateClause.$set.content = content;
  }
  await NoteModel.findOneAndUpdate(
    findClause,
    updateClause,
  );
};

const deleteNoteForUser = async ({
  noteId,
}) => {
  const updateClause = {
    $set: {
      isDeleted: true,
    },
  };
  await NoteModel.findByIdAndUpdate(noteId, updateClause);
};

const shareNoteForUser = async ({
  userId,
  noteId,
  usersToShareNoteWith,
}) => {
  const userNotesInsertOperations = usersToShareNoteWith.map(sharedWith => ({
    sharedWith,
    sharedBy: userId,
    noteId,
  }));
  await SharedNotesModel.insertMany(userNotesInsertOperations);
};

const searchNoteByKeywordsGlobally = async ({
  searchTerm,
}) => {
  const findClause = {
    $text: { $search: searchTerm },
  };
  const projectClause = {
    title: 1,
    content: 1,
    noteCode: 1,
  };
  const notes = await NoteModel.find(
    findClause,
    projectClause,
  ).lean();
  return { notes };
};

module.exports = {
  checkIfNoteOwnedByUser,
  getUserNotes,
  getNoteByIdForUser,
  createNoteForUser,
  updateNotForUser,
  deleteNoteForUser,
  shareNoteForUser,
  searchNoteByKeywordsGlobally,
};