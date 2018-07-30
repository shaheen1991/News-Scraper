var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
var NoteSchema = new Schema({
  body: String
});

// This creates our model from the above schema using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;