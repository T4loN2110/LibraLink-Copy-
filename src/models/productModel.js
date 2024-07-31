const mongoose = require('mongoose');
const product = mongoose.Schema({
    name:{
        type:String,
        require:true    
    },
    price:Number,
    image:String
});

module.exports = mongoose.model('product',product);