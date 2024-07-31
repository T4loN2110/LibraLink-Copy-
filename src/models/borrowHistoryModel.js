const mongoose = require('mongoose');
const borrow_history = mongoose.Schema({
    borrow_form:{
        type: String,
        require: true
    },
    note: String,
});

module.exports = mongoose.model('borrow_history',borrow_history,'LSMuon');