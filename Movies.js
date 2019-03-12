var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MovieSchema = new Schema ({
    Title: {type: string, required: true, unique: true},
    ReleaseDate: {type: Number, required: true, unique: true},
    Genre: {type: string, enum: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western', 'Science Fiction'],
        required: true, unique: true},
    ActorsAndCharacters:
        {
            ActorName0: {type: string, required: true, unique:true},
            Character0: {type:string, required: true, unique: true},
            ActorName1: {type: string, required: true, unique:true},
            Character1: {type:string, required: true, unique: true},
            ActorName2: {type: string, required: true, unique:true},
            Character2: {type:string, required: true, unique: true}
        },
});

var Movie = mongoose.model("Movie", MovieSchema);
module.exports = Movie;