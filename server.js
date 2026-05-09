require('dotenv').config(); // Yeh line .env file se data read karegi
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'All fields are required!' });
    }

    try {
       const transporter = nodemailer.createTransport({
            service: 'gmail',
          
auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
}
        });

        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `New Portfolio Contact Message from ${name}`,
            text: `You have a new message from your portfolio website.\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`
        };

        await transporter.sendMail(mailOptions);
        console.log(`Message received from ${name} (${email})`);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Email sending failed:', error);
        res.status(500).json({ success: false, error: 'Failed to send message.' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});