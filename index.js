const express = require('express');
const userApi = require('./api/userApi');

const app = express();
app.use(express.json()); // for parsing application/json

app.use('/api/users', userApi);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
