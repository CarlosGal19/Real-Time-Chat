import express from 'express';
import logger from 'morgan';

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send({msg: 'Hello World'});
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
