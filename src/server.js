import mongoose from 'mongoose';
import app from './app.js';

const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

mongoose
  .connect(MONGODB_URL, {
    dbName: 'movieFlicks',
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on ${CLIENT_URL}${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error in connecting database', error);
    process.exit(1);
  });
