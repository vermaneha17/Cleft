const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true,
        trim:true,
        lowercase:true,
        unique:true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
          }
    },
    password:{
        type:String,
        require:true,
        trim:true
    },
    role:{
        type:String,
        required: true,
        trim: true        
    },
    tokens: [{
        access: {
          type: String,
          required: true
        },
        token: {
          type: String,
          required: true
        }
      }]
});

userSchema.pre('save', function (next) {
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) =>{
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    }
    else{
        next();
    }
});

userSchema.methods.generateAuthToken = function () {
    var user = this;
    access = 'auth';
    token = jwt.sign({_id: user._id.toHexString(), access}, 'cleftUser').toString();
    user.tokens = user.tokens.concat([{access, token}]);
    return user.save().then(() => { 
            return token;
    });
};

var User = mongoose.model('User',userSchema);
module.exports = {User};