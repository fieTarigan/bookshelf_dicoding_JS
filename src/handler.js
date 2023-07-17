/* eslint-disable eqeqeq */
/* eslint-disable object-property-newline */
const { nanoid } = require('nanoid');
const bookshelf = require('./bookshelf');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage,
    finished, reading, insertedAt, updatedAt,
  };
  bookshelf.push(newBook);
  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: { bookId: id },
  }).code(201);
};

const showAllBooksHandler = (request, h) => {
  const { reading, finished, name } = request.query;

  if (reading !== undefined) {
    const books = bookshelf.filter((b) => b.reading == reading)
      .map((value) => ({ id: value.id, name: value.name, publisher: value.publisher }));

    return h.response({
      status: 'success',
      data: {
        books,
      },
    }).code(200);
  }
  if (finished !== undefined) {
    const books = bookshelf.filter((b) => b.finished == finished)
      .map((value) => ({ id: value.id, name: value.name, publisher: value.publisher }));

    return h.response({
      status: 'success',
      data: {
        books,
      },
    }).code(200);
  }
  if (name === 'Dicoding') {
    const books = bookshelf.filter((b) => b.name.toLowerCase()
      .includes('dicoding'))
      .map((value) => ({ id: value.id, name: value.name, publisher: value.publisher }));

    return h.response({
      status: 'success',
      data: {
        books,
      },
    }).code(200);
  }

  const books = bookshelf.map((value) => ({
    id: value.id, name: value.name, publisher: value.publisher,
  }));
  return h.response({
    status: 'success',
    data: {
      books,
    },
  }).code(200);
};

const showBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = bookshelf.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    return h.response({
      status: 'success',
      data: { book },
    }).code(200);
  }
  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount,
    readPage, reading,
  } = request.payload;
  const index = bookshelf.findIndex((b) => b.id === bookId);

  if (name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }
  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }

  const updatedAt = new Date().toISOString();
  const finished = (readPage === pageCount);

  bookshelf[index] = {
    ...bookshelf[index], name, year, author, summary,
    publisher, pageCount, readPage, reading, updatedAt, finished,
  };

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  }).code(200);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = bookshelf.findIndex((b) => b.id === bookId);

  if (index !== -1) {
    bookshelf.splice(index, 1);
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

module.exports = {
  addBookHandler, showAllBooksHandler,
  showBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler,
};
