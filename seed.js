require("dotenv").config();const mongoose=require("mongoose"),data=require("./poems.json");
const Poem=mongoose.model("Poem",new mongoose.Schema({lang:String,order:Number,title:String,image:String}));
(async()=>{await mongoose.connect(process.env.MONGO_URI);await Poem.deleteMany({});await Poem.insertMany(data);console.log("Seeded",data.length,"poems");process.exit(0)})();
