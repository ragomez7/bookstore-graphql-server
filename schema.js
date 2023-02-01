const typeDefs = `#graphql
    type Query {
        "This field is for testing and can be ignored."
        getCount: Count!
        "Get an array of books. All arguments are optional."
        getBooks(offset: Int, limit: Int, searchTitleTerm: String): GetBooksResponse!
        "Get a book by its ID."
        getBookById(bookId: ID!): Book
        "Get an author by its ID."
        getAuthorById(authorId: ID!): Author
        "Get all of the books on the platform written by an author."
        getBooksByAuthorId(authorId: ID!): [Book]!
        "Get an array of authors. All arguments are optional."
        getAuthors(offset: Int, limit: Int, authorNameSearch: String, countrySearch: String): GetAuthorsResponse!
        "Get an array of readers. All arguments are optional."
        getReaders(offset: Int, limit: Int, readerNameTerm: String): GetReadersResponse!
        "Get a reader by its ID."
        getReaderById(readerId: ID!): GetReaderResponse!
        "Get a set of countries where authors where born."
        getCountriesFromAuthors: [String]!
    }

    type Mutation {
        "This field is for testing and can be ignored."
        addCount: Count!
        "Add a book."
        addBook(bookTitle: String!, authorId: ID!, pageCount: Int, bookThumbnail: String): AddBookResponse!
        "Add an author."
        addAuthor(author: AuthorInput!): Author!
        "Update an author name given an ID and the desired new name."
        updateAuthorName(authorId: ID!, newAuthorName: String!): Author!
        "Update a book title given an ID and the desired new title."
        updateBookTitle(bookId: ID!, newBookTitle: String!): Book
        "Delete a book."
        deleteBookById(bookId: ID!): Book
        "Delete an book."
        deleteAuthorById(authorId: ID!): Author
        "Add a reader"
        addReader(readerName: String!, readerAge: Int!, readerEmail: String!): Reader!
        "Delete a reader"
        deleteReader(readerId: ID!): Reader
        "Update a reader name given an ID and the desired new name."
        updateReaderName(readerId: ID!, newReaderName: String!): Reader
        "Lends a book to a reader."
        addReaderToBook(readerId: ID!, bookId: ID!): Reader
        "Unlends a book to a reader."
        deleteReaderFromBook(readerId: ID!, bookId: ID!): Reader
    }
    "You can ignore this type"
    type Count {
        count: Int!
    }

    "The Book Type"
    type Book {
        id: ID!
        title: String!
        author: Author
        pageCount: Int
        bookThumbnail: String
        readers: [Reader]!
    }
    "The Author Type"
    type Author {
        id: ID!
        name: String!
        age: Int!
        countryOfBirth: String!
        isDead: String!
        books: [Book]!
    }
    "The Reader Type"
    type Reader {
        id: ID!
        name: String!
        age: Int!
        email: String!
        books: [Book]!
    }

    "Accepts relevant response fields + the added book"
    type AddBookResponse {
        "Similar to HTTP status code, represents the status of the mutation"
        code: Int!
        "Indicates whether the mutation was successful"
        success: Boolean
        "Human-readable message for the UI"
        message: String!
        "Newly created book"
        book: Book
    }

    "Accepts relevant response fields + the requested reader"
    type GetReaderResponse {
        code: Int!
        success: Boolean!
        message: String!
        reader: Reader
    }
    "Fields to add a new Author"
    input AuthorInput {
        authorName: String!
        countryOfBirth: String
        birthDate: String!
        isDead: Boolean!
    }

    "Accepts relevant response fields + the requested array of authors"
    type GetAuthorsResponse { 
        authors: [Author]!
        authorsCount: Int!
    }
    "Accepts relevant response fields + the requested array of books"
    type GetBooksResponse {
        books: [Book]!
        booksCount: Int!
    }
    "Accepts relevant response fields + the requested array of readers"
    type GetReadersResponse {
        readers: [Reader]!
        readersCount: Int!
    }
`;

export default typeDefs;