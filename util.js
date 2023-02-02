export function calculateAge(birthDate) {
    var ageDifMs = Date.now() - birthDate.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export function parseAuthor(author) {
    author.age = calculateAge(new Date(author['birth_date']));
    author.countryOfBirth = author.country_of_birth;
    author.isDead = author.is_dead;
    return author;
}
export function parseBook(book) {
    book.pageCount = book.page_count
    book.bookThumbnail = book.book_thumbnail
    return book
}
