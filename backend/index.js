const express=require('express')
const app=express()
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const cors=require('cors')
const multer=require('multer')
const path=require("path")
const cookieParser=require('cookie-parser')
const authRoute=require('./routes/auth')
const userRoute=require('./routes/users')
const postRoute=require('./routes/posts')
const commentRoute=require('./routes/comments')
const newsletterRoute = require("./routes/newsletter");
const morgan = require('morgan')
//database
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("database is connected successfully!")

    }
    catch(err){
        console.log(err)
    }
}

//middlewares
dotenv.config()
app.use(express.json())
app.use("/images",express.static(path.join(__dirname,"/images")))
app.use(cors({origin:"*",credentials:true}))
app.use(cookieParser())
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/posts",postRoute)
app.use("/api/comments",commentRoute)
app.use("/api/newsletter", newsletterRoute);
app.use(morgan("dev"))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/')
    },
    filename: (req, file, cb) => {
        cb(null, req.body.img)
    }
});

const upload = multer({ storage: storage });
const cloudinary = require('./routes/cloudinary');
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const filePath = path.resolve(req.file.path);
        cloudinary.uploader.upload(filePath, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to upload image', details: err });
            }
            fs.unlinkSync(filePath);
            res.status(200).json({ message: 'Image has been uploaded successfully!', url: result.secure_url });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/home",(req,res)=>{
    res.send("hello pat");
})

app.listen(process.env.PORT,()=>{
    connectDB()
    console.log("app is running on port "+process.env.PORT)
})