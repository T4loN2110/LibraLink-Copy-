
class User {
    constructor(uid,username,password,role,uname,email,phone) {
        this.uid = uid;
        this.username = username;
        this.password = password;
        this.role = role;
        this.name = uname;
        this.email = email;
        this.phone = phone;
    }

}

class Login_form {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

class Sign_up_form {
    constructor (username, password, name, email, phone) {
        this.username = username
        this.password = password
        this.name = name
        this.email = email
        this.phone = phone
    }
}

class Member {}
class Librarian {}
class Admin {}

class Book {
    constructor(isbn, name, publish_date, author, genre, summary, price, quantity) {
        this.isbn = isbn
        this.name = name
        this.publish_date = publish_date
        this.author = author
        this.genre = genre
        this.summary = summary
        this.price = price
        this.quantity = quantity
    }
}

class Department {
    constructor (department_number, address, phone) {
        this.department_number = department_number
        this.address = address
        this.phone = phone
    }
}

class Invoice {
    constructor (user, invoice_type, quantity, unit_price, payment_date, reason, status) {
        this.user = user
        this.invoice_type = invoice_type
        this.quantity = quantity
        this.unit_price = unit_price
        this.payment_date = payment_date
        this.reason = reason
        this.status = status
    }
}

class Borrow_form {
    constructor (form_code, borrower, borrowed_book, borrow_date, return_deadline, confirmation, confirmer) {
        this.form_code = form_code
        this.borrower = borrower
        this.borrowed_book = borrowed_book
        this.borrow_date = borrow_date
        this.return_deadline = return_deadline
        this.confirmation = confirmation
        this.confirmer = confirmer
    }
}

class Borrow_history {
    constructor (borrow_form, note) {
        this.borrow_form = borrow_form
        this.note = note
    }
}

class Comment {
    constructor (user, commented_book, comment_date, content) {
        this.user = user
        this.commented_book = commented_book
        this.comment_date = comment_date
        this.content = content
    }
}

class Favorite {
    constructor(user, book) {
        this.user = user
        this.book = book
    }
}

class Genre {
    constructor(code, name) {
        this.code = code
        this.name = name
    }
}

//controller
class Book_controller {}
class Authentication_controller {}
class Department_controller {}
class Account_controller {}
class Borrow_controller {}
class Search_controller {}
class Rating_controller {}
class Activity_controller {}
class Finance_controller {}
class Notification_controller {}