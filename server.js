const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());

// Servir los archivos estáticos desde la raíz del proyecto
app.use(express.static(__dirname));

// Asegurar que al ingresar a la raíz "/" se entregue index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint POST para procesar las solicitudes del formulario
app.post('/api/contacto', async (req, res) => {
    const { nombre, email, empresa, servicio, mensaje } = req.body;

    // Configuración del servidor SMTP Nodemailer
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 465,
        secure: (process.env.SMTP_PORT == '465' || !process.env.SMTP_PORT), 
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: `"Web GPLOG" <${process.env.SMTP_USER}>`,
        to: process.env.MAIL_TO,
        replyTo: email,
        subject: `Nueva Consulta Web: ${servicio}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #8B1518; border-bottom: 2px solid #8B1518; padding-bottom: 8px;">Nueva solicitud desde la página web</h2>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Email de contacto:</strong> ${email}</p>
                <p><strong>Empresa / Laboratorio:</strong> ${empresa || 'No especificada'}</p>
                <p><strong>Servicio de interés:</strong> ${servicio}</p>
                <p><strong>Mensaje:</strong></p>
                <blockquote style="background: #f9f9f9; padding: 12px; border-left: 4px solid #8B1518; margin: 0;">
                    ${mensaje || 'Sin mensaje adicional.'}
                </blockquote>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Correo enviado correctamente.' });
    } catch (error) {
        console.error('Error enviando e-mail por SMTP:', error);
        res.status(500).json({ success: false, message: 'Error interno al procesar el envío.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor GPLOG activo en el puerto ${PORT}`);
});
