const express = require('express');
const cors = require('cors');

const UserRouter = require('./routes/user');
const TagRouter = require('./routes/tag');
const CardRouter = require('./routes/card');
const ResponseRouter = require('./routes/response');

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());

app.use('/users', UserRouter);
app.use('/tags', TagRouter);
app.use('/cards', CardRouter);
app.use('/responses', ResponseRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
