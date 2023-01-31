import { RESTDataSource } from "@apollo/datasource-rest";

class BookstoreAPI extends RESTDataSource {
    constructor(options) {
        super(options);
        this.baseURL = 'https://johns-bookstore-server.herokuapp.com/'
        this.token = '2'
    };

    async fetch(path, incomingRequest) {
        const result = await super.fetch(path, incomingRequest);
        return result;
    }

    async getCount() {
        return this.get('count');
    }

    async addCount() {
        return this.post('count');
    };

    async getBooks(offset, limit, searchTitleTerm) {
        const books = await this.get(`books?offset=${offset}&limit=${limit}&search-title-term=${searchTitleTerm}`);
        return books;
    }

    async getBookById(bookId) {
        return this.get(`books/${bookId}`);
    }

    async getBooksByAuthorId(authorId) {
        return this.get(`authors/${authorId}/books`);
    }

    async addBook(bookTitle, authorId, pageCount, bookThumbnail) {
        pageCount = pageCount || "null";
        bookThumbnail = bookThumbnail || "null";
        return this.post(`books?book-title=${bookTitle}&author-id=${authorId}`);
    }

    async addAuthor(authorName, countryOfBirth, birthDate, isDead) {
        try {
            let createdAuthor = await this.post(`authors?author-name=${authorName}&country-of-birth=${countryOfBirth}&birth-date=${birthDate}&isDead=${isDead}`);
            return createdAuthor
        } catch (err) {
            console.log(err)
        }
        
    }

    async updateAuthorName(authorId, newAuthorName) {
        return this.patch(`authors/${authorId}?new-author-name=${newAuthorName}`);
    }

    async deleteAuthorById(authorId) {
        return this.delete(`authors/${authorId}`)
    }

    async getAuthorById(authorId) {
        return this.get(`authors/${authorId}`);
    }

    async updateBookTitle(bookId, newBookTitle) {
        return this.patch(`books/${bookId}?new-book-title=${newBookTitle}`);
    }

    async deleteBookById(bookId) {
        return this.delete(`books/${bookId}`)
    }

    async getAuthors(offset, limit, authorNameSearch, countrySearch) {
        return this.get(`authors/?offset=${offset}&limit=${limit}&author-name-term=${authorNameSearch}&country-of-birth-term=${countrySearch}`)
    }

    async getReaders(offset, limit, readerNameTerm) {
        return this.get(`readers?offset=${offset}&limit=${limit}&reader-name-term=${readerNameTerm}`)
    }

    async getReaderById(readerId) {
        return this.get(`readers/${readerId}`)
    }

    async addReader(readerName, readerAge, readerEmail) {
        return this.post(`readers?reader-name=${readerName}&reader-age=${readerAge}&reader-email=${readerEmail}`)
    }

    async deleteReader(readerId) {
        return this.delete(`readers/${readerId}`)
    }

    async updateReaderName(readerId, newReaderName) {
        return this.patch(`readers/${readerId}?new-reader-name=${newReaderName}`)
    }

    async addReaderToBook(readerId, bookId) {
        return this.put(`readers/${readerId}/${bookId}`)
    }

    async getAllBookReaders(bookId) {
        return this.get(`books/${bookId}/readers`)
    }

    async getReaderBooks(readerId) {
        return this.get(`readers/${readerId}/books`)
    }

    async getCountriesFromAuthors() {
        return this.get(`authors/countries`)
    }

    async deleteReaderFromBook(readerId, bookId) {
        return this.delete(`readers/${readerId}/${bookId}`)
    }
};

export default BookstoreAPI;