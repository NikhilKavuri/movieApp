import mongoose from "mongoose";

const movieSchema = mongoose.Schema({
    userId:{
        type:String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    release: {
        type: String,
        required: true,
    },
    rating: {
        type: String,
        required: true,
    },
    poster:{
        type:String,
        required: true
    },
    type:{
        type:String,
        required:true
    }
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
