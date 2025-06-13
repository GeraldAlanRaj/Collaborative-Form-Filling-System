const mongoose = require("mongoose");

const MongoDB = async () => {
await mongoose.connect('mongodb://localhost:27017/Proactively', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));
}

module.exports = MongoDB;
