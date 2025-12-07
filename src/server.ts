import app from './app';
import config from './config';

const PORT = config.port;

app.get('/', (req, res) => {
  res.json({
    message: "Welcome to the Vehicle Rental API!",
    status: "success"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
