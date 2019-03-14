var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//got these three lines from the User.js
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB, { useNewUrlParser: true } );
mongoose.set('useCreateIndex', true);

var MovieSchema = new Schema ({
    Title: {type: String, required: true, unique: true},
    ReleaseDate: {type: Number, required: true, unique: true},
    Genre: {type: String, enum: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western', 'Science Fiction'],
        required: true, unique: true},
    ActorsAndCharacters:
        {
            Actor0: {type: String, required: true, unique:true},
            Character0: {type: String, required: true, unique: true},
            Actor1: {type: String, required: true, unique:true},
            Character1: {type: String, required: true, unique: true},
            Actor2: {type: String, required: true, unique:true},
            Character2: {type: String, required: true, unique: true},
        },
});

var Movie = mongoose.model("Movie", MovieSchema);
module.exports = Movie;