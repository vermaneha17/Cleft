const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Cleft',{useNewUrlParser: true}, function (error){
if(error){
    console.log('Error in connecting '+error)
} else{
    console.log('DB Connected')
}  

});

module.exports = {mongoose};