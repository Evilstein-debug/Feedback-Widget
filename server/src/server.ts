import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running!' });
})
