require("dotenv").config();
const path=require("path"),express=require("express"),helmet=require("helmet"),cookie=require("cookie-parser"),
jwt=require("jsonwebtoken"),rate=require("express-rate-limit"),mongoose=require("mongoose");
const {PORT=3000,MONGO_URI,SITE_PASSCODE,JWT_SECRET="dev-secret"}=process.env;
const Poem=mongoose.model("Poem",new mongoose.Schema({lang:{type:String,enum:["axomiya","hindi","bangla"],index:true},order:Number,title:String,image:String}));
const app=express();
app.use(helmet({contentSecurityPolicy:{directives:{defaultSrc:["'self'"],imgSrc:["'self'","data:"],styleSrc:["'self'","https://fonts.googleapis.com"],styleSrcAttr:["'unsafe-inline'"],fontSrc:["https://fonts.gstatic.com"],scriptSrc:["'self'"]}}}));
app.use(express.json({limit:"1kb"}));app.use(cookie());
const locked=!!SITE_PASSCODE;
const guard=(req,res,next)=>{if(!locked)return next();try{jwt.verify(req.cookies.t,JWT_SECRET);next()}catch{res.status(401).json({error:"locked"})}};
app.post("/api/login",rate({windowMs:15*60e3,max:10}),(req,res)=>{
 if(!locked||req.body.passcode===SITE_PASSCODE){res.cookie("t",jwt.sign({ok:1},JWT_SECRET,{expiresIn:"7d"}),{httpOnly:true,sameSite:"strict",secure:process.env.NODE_ENV==="production"});return res.json({ok:true})}
 res.status(403).json({error:"wrong passcode"})});
app.get("/api/status",(req,res)=>res.json({locked}));
app.get("/api/poems",guard,async(req,res)=>{
 const f=["axomiya","hindi","bangla"].includes(req.query.lang)?{lang:req.query.lang}:{};
 res.json(await Poem.find(f).sort({lang:1,order:1}).lean())});
app.use("/poems",guard,express.static(path.join(__dirname,"public/poems"),{maxAge:"7d"}));
app.use(express.static(path.join(__dirname,"public"),{index:"index.html"}));
mongoose.connect(MONGO_URI).then(()=>app.listen(PORT,()=>console.log("http://localhost:"+PORT))).catch(e=>{console.error("MongoDB connection failed:",e.message);process.exit(1)});
