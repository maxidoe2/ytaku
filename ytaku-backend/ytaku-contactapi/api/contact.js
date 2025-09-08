// /api/contact.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // ✅ CORS dinámico
  const allowedOrigins = [
    'https://ytakucba.com',
    'https://www.ytakucba.com',
    'https://ytakucba.web.app',
    'https://ytakucontactapi.vercel.app'
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Solo se permiten solicitudes POST' });

  // Lógica del cuerpo del correo
  const { firstName, lastName, phone, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // tu correo Gmail
      pass: process.env.GMAIL_PASS  // contraseña de aplicación
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: 'ytakucba@gmail.com', // correo de destino
    subject: `Nuevo mensaje de contacto de ${firstName} ${lastName}`,
    text: `
Nombre: ${firstName}
Apellido: ${lastName}
Teléfono: ${phone}
Email: ${email}
Mensaje: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error enviando correo:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
