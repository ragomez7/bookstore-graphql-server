function calculateAge(birthDate) {
    var ageDifMs = Date.now() - birthDate.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function parseAuthor(author) {
    author.age = calculateAge(new Date(author['birth_date']));
    author.countryOfBirth = author.country_of_birth;
    author.isDead = author.is_dead;
    return author;
}
function parseBook(book) {
    book.pageCount = book.page_count
    book.bookThumbnail = book.book_thumbnail
    return book
}

const resolvers = {
    Query: {
        getCount: (_, __, { dataSources }) => {
            return dataSources.bookstoreAPI.getCount();
        },
        getBooks: async (_, { offset, limit, searchTitleTerm }, { dataSources }) => {
            let { allBooksArray, booksCount } = await dataSources.bookstoreAPI.getBooks(offset, limit, searchTitleTerm);
            for (const book of allBooksArray) {
                parseBook(book)
            }
            const responseBody = {
                books: allBooksArray,
                booksCount: booksCount
            }
            return responseBody;
        },
        getBookById: async (_, { bookId }, { dataSources }) => {
            const responseBody = await dataSources.bookstoreAPI.getBookById(bookId);
            const { book } = responseBody
            return parseBook(book);
        },
        getAuthorById: async (_, { authorId }, { dataSources }) => {
            const responseBody = await dataSources.bookstoreAPI.getAuthorById(authorId)
            const { author } = responseBody;
            return parseAuthor(author)
        },
        getBooksByAuthorId: (_, { authorId }, { dataSources }) => {
            return dataSources.bookstoreAPI.getBooksByAuthorId(authorId);
        },
        getAuthors: async (_, { offset, limit, authorNameSearch, countrySearch }, { dataSources }) => {
            let { authors, authorsCount } = await dataSources.bookstoreAPI.getAuthors(offset, limit, authorNameSearch, countrySearch);
            for (const author of authors) {
                parseAuthor(author)
            }      
            const responseBody = {
                authors,
                authorsCount: parseInt(authorsCount)
            }
            return responseBody;
        },
        getReaders: async (_, { offset, limit, readerNameTerm }, { dataSources }) => {
            let { readers, readersCount} = await dataSources.bookstoreAPI.getReaders(offset, limit, readerNameTerm);
            const responseBody = {
                readers,
                readersCount: parseInt(readersCount)
            };
            return responseBody
        },
        getReaderById: async (_, { readerId }, { dataSources }) => {
            try {
                const responseBody = await dataSources.bookstoreAPI.getReaderById(readerId);
                const { reader } = responseBody;
                return {
                    code: 200,
                    success: true,
                    message: "Reader found.",
                    reader
                }
            } catch (err) {
                return {
                    code: err.extensions.response.status,
                    success: false,
                    message: err.extensions.response.statusText,
                    reader: null
                }
            }
        },
        getCountriesFromAuthors: async (_, __, { dataSources }) => {
            try {
                const countries = await dataSources.bookstoreAPI.getCountriesFromAuthors();
                let responseBody = countries.map((countryObject) => countryObject.country_of_birth);
                return responseBody
            } catch (err) {
                console.log(err)
            }
        }
        
    },

    Mutation: {
        addCount: (_, __, { dataSources }) => {
            return dataSources.bookstoreAPI.addCount();
        },
        addBook: async (_, { bookTitle, authorId, pageCount, bookThumbnail }, { dataSources }) => {
            try {
                const bookResult = await dataSources.bookstoreAPI.addBook(bookTitle, authorId, pageCount, bookThumbnail);
                parseBook(bookResult.book);
                return {
                    ...bookResult,
                    code: 200,
                    success: true,
                    message: "Succesfully created book."
                }
            } catch (err) {
                return {
                    book: null,
                    code: err.extensions.response.status,
                    sucess: false,
                    message: err.extensions.response.body
                }
            } 
        },
        addAuthor: async (_, { author }, { dataSources }) => {
            const { authorName, countryOfBirth, birthDate, isDead } = author;
            try {
                const responseBody = await dataSources.bookstoreAPI.addAuthor(authorName, countryOfBirth, birthDate, isDead);
                const { author } = responseBody;
                return parseAuthor(author);
            } catch (err) {
                console.log(err)
            }
        },
        updateAuthorName: async (_, { authorId, newAuthorName }, { dataSources }) => {
            try {
                const responseBody = await dataSources.bookstoreAPI.updateAuthorName(authorId, newAuthorName);
                const { author } = responseBody;
                return parseAuthor(author);
            } catch (err) {
                console.log(err)
            }
        },
        deleteAuthorById: async (_, { authorId }, { dataSources }) => {
            try {
                let deletedAuthor = await dataSources.bookstoreAPI.deleteAuthorById(authorId);
                return parseAuthor(deletedAuthor)
            } catch (err) {
                console.log(err)
            }
        },
        updateBookTitle: async (_, { bookId, newBookTitle }, { dataSources }) => {
            const updatedBookResponse = await dataSources.bookstoreAPI.updateBookTitle(bookId, newBookTitle);
            const updatedBook = updatedBookResponse.book;
            return parseBook(updatedBook)
        },
        deleteBookById: async (_, { bookId }, { dataSources }) => {
            return await dataSources.bookstoreAPI.deleteBookById(bookId);
        },
        addReader: async (_, { readerName, readerAge, readerEmail }, { dataSources}) => {
            const responseBody = await dataSources.bookstoreAPI.addReader(readerName, readerAge, readerEmail);
            return responseBody.reader;
        },
        deleteReader: async (_, { readerId }, { dataSources }) => {
            return await dataSources.bookstoreAPI.deleteReader(readerId)
        },
        updateReaderName: async (_, { readerId, newReaderName }, { dataSources }) => {
            const responseBody = await dataSources.bookstoreAPI.updateReaderName(readerId, newReaderName)
            return responseBody.reader;
        },
        addReaderToBook: async (_, { readerId, bookId }, { dataSources }) => {
            return await dataSources.bookstoreAPI.addReaderToBook(readerId, bookId);
        },
        deleteReaderFromBook: async (_, { readerId, bookId }, { dataSources }) => {
            return await dataSources.bookstoreAPI.deleteReaderFromBook(readerId, bookId);
        }
    },
    Book: {
        author: async ({ author_id }, _, { dataSources }) => {
            try {
                const author = await dataSources.bookstoreAPI.getAuthorById(author_id);
                return parseAuthor(author)
            } catch (err) {
                console.log(err);
            }
            
        },
        readers: async ({ id }, __, { dataSources }) => {
            return await dataSources.bookstoreAPI.getAllBookReaders(id);
        }
    },
    Author: {
        books: ({ id }, _, { dataSources }) => {
            return dataSources.bookstoreAPI.getBooksByAuthorId(id);
        }
    },
    Reader: {
        books: ({ id }, _, { dataSources, authScope }) => {
            return dataSources.bookstoreAPI.getReaderBooks(id)
        }
    }
};

export default resolvers;