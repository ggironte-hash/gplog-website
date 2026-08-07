const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración del servicio SMTP (SMTP2GO)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mail.smtp2go.com',
    port: parseInt(process.env.SMTP_PORT) || 25,
    secure: false, // true para puerto 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Endpoint del formulario de contacto
app.post('/api/contacto', async (req, res) => {
    const { nombre, email, empresa, servicio, mensaje } = req.body;

    const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER;
    const mailTo = process.env.MAIL_TO;

    const mailOptions = {
        from: `"Contacto Web - Gironte Pharma" <${mailFrom}>`,
        to: mailTo,
        replyTo: email,
        subject: `Nuevo contacto web: ${nombre}`,
        html: `
            <h3>Nuevo mensaje desde la página web</h3>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Empresa:</strong> ${empresa || 'No especificada'}</p>
            <p><strong>Servicio:</strong> ${servicio || 'No especificado'}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${mensaje}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Correo enviado correctamente' });
    } catch (error) {
        console.error('Error enviando mail:', error);
        res.status(500).json({ success: false, message: 'Error al enviar el correo' });
    }
});

// Puerto de ejecución en Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
