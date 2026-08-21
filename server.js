const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. SERVIR ARCHIVOS ESTÁTICOS DE LA WEB (HTML, CSS, JS, Imágenes)
// Servimos los archivos desde la raíz del proyecto
app.use(express.static(path.join(__dirname, '.')));

// Ruta principal para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. CONFIGURACIÓN DEL SERVICIO SMTP (SMTP2GO)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mail.smtp2go.com',
    port: parseInt(process.env.SMTP_PORT) || 25,
    secure: false, // true para puerto 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// 3. ENDPOINT DEL FORMULARIO DE CONTACTO
app.post('/api/contacto', async (req, res) => {
    const { nombre, email, empresa, servicio, mensaje } = req.body;

    const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER;
    const mailTo = process.env.MAIL_TO || 'info@gplog.com.ar';

    const mailOptions = {
        from: `"Contacto Web - Gironte Pharma" <${mailFrom}>`,
        to: mailTo,
        replyTo: email, // Permite responder directamente a la dirección de correo del cliente
        subject: `Nuevo mensaje de contacto: ${nombre} (${empresa || 'Sin empresa'})`,
        html: `
            <h2>Nuevo mensaje recibido desde la Web</h2>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Empresa:</strong> ${empresa || 'No especificada'}</p>
            <p><strong>Servicio de Interés:</strong> ${servicio || 'No especificado'}</p>
            <p><strong>Mensaje:</strong></p>
            <blockquote style="background: #f1f5f9; padding: 12px; border-left: 4px solid #8B1518;">
                ${mensaje}
            </blockquote>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Correo enviado correctamente' });
    } catch (error) {
        console.error('Error enviando correo:', error);
        res.status(500).json({ success: false, message: 'Error al enviar el correo' });
    }
});

// 4. PUERTO DE EJECUCIÓN EN RENDER
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
