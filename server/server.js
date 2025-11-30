import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { connectToDatabase } from './config/sequelize.js'
import userRouter from './routes/userAuthRoute.js'
import bookRouter from './routes/bookRoute.js' 

// APP CONFIG
const app = express();
const port = process.env.PORT || 8001;


// MIDDLEWARE
app.use(express.json());
app.use(cors());


// USER ROUTES
app.use('/api/user', userRouter);

// BOOK ROUTES
app.use('/api/book', bookRouter);


// TEST
app.get('/', (req, res) => {
    res.send("API Working")
}) 


// START SERVER
const startServer = async () => {
    try {
        await connectToDatabase();
        app.listen(port, () => {
            console.log("Server running on PORT: " + port);
        });
    } catch (error) {
        console.log("Error connecting to the database: " + error)
    }
}
startServer();