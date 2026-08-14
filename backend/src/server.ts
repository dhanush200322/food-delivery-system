import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const port = Number(process.env.PORT) || 5000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
