const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    name:{
        type:String
    }

},
{timestamps: true});

const User = mongoose.model('user', userSchema);

module.exports = User;
