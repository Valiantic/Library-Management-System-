-- Borrowed Books Table

CREATE TABLE borrowed_books (
  borrowedId BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  userId BIGINT UNSIGNED NOT NULL,
  bookId BIGINT UNSIGNED NOT NULL,

  amount INT UNSIGNED NOT NULL DEFAULT 1,

  dueDate DATE NOT NULL,

  dateAndTimeAdded DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  status ENUM('borrowed', 'returned') NOT NULL DEFAULT 'borrowed',

  CONSTRAINT fk_borrowed_user
    FOREIGN KEY (userId)
    REFERENCES users(userId)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_borrowed_book
    FOREIGN KEY (bookId)
    REFERENCES books(bookId)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);