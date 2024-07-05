import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import router from './apiforurl/apis.js';
import mongoose from "mongoose";


/** import connection file */
import connect from './mongodb_a/mongo_uri.js';

const app = express()


/** app middlewares */
app.use(morgan('tiny'));


app.use(cors());
app.use(express.json());
config();


/** appliation port */
const port = process.env.PORT || 8080;


/** routes */
app.use('/api', router) /** apis */


app.get('/', (req, res) => {
    try {
        res.json("Get Request")
    } catch (error) {
        res.json(error)
    }
})

const resultsSchema = new mongoose.Schema({
    username: String,
    attempts: Number,
    points: Number,
    achived: String
  });
  
  const Results = mongoose.model('results', resultsSchema);
  


app.delete('/api/deleteAllRecords', async (req, res) => {
    try {
      // Perform the deletion operation in MongoDB
      const deleteResult = await Results.deleteMany({});
  
      // Respond with a success message or any relevant information
      res.json({ message: `${deleteResult.deletedCount} records deleted successfully.` });
    } catch (error) {
      console.error('Error deleting records:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


/** start server only when we have valid connection */
connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`)
        })
    } catch (error) {
        console.log("Cannot connect to the server");
    }
}).catch(error => {
    console.log("Invalid Database Connection");
})