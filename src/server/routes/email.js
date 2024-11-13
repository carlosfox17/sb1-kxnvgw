import express from 'express';
import { createTransport } from 'nodemailer';
import { readDb, writeDb } from '../utils/db.js';

const router = express.Router();

// Common email provider configurations
const emailProviders = {
  softec: {
    host: 'mail.softecangola.net',
    port: 465,
    secure: true
  },
  gmail: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true
  },
  outlook: {
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false
  }
};

function getDetailedErrorMessage(error) {
  const errorCode = String(error?.code || '');
  const errorMessage = String(error?.message || '');
  const details = [];

  switch (errorCode) {
    case 'ECONNREFUSED':
      details.push('Conexão recusada pelo servidor');
      details.push('Possíveis causas:');
      details.push('- Servidor SMTP indisponível');
      details.push('- Porta bloqueada');
      details.push('- Firewall bloqueando a conexão');
      break;

    case 'ETIMEDOUT':
      details.push('Tempo de conexão esgotado');
      details.push('Possíveis causas:');
      details.push('- Servidor SMTP lento ou indisponível');
      details.push('- Problemas de rede');
      details.push('- Firewall bloqueando a conexão');
      break;

    case 'ESOCKET':
      details.push('Erro de conexão SSL/TLS');
      details.push('Possíveis causas:');
      details.push('- Configuração SSL/TLS incorreta');
      details.push('- Certificado SSL inválido');
      details.push('- Porta incorreta para conexão segura');
      break;

    case 'EAUTH':
      details.push('Falha na autenticação');
      details.push('Possíveis causas:');
      details.push('- Usuário ou senha incorretos');
      details.push('- Autenticação de dois fatores necessária');
      break;

    default:
      details.push(`Erro: ${errorMessage}`);
      details.push('Possíveis causas:');
      details.push('- Configurações SMTP incorretas');
      details.push('- Servidor indisponível');
      details.push('- Problemas de rede');
  }

  return details.join('\n');
}

router.post('/test', async (req, res) => {
  const startTime = Date.now();
  let transporter = null;

  try {
    const { smtp, testEmail } = req.body;

    if (!smtp?.host || !smtp?.username || !smtp?.password || !testEmail) {
      throw new Error('Dados incompletos para teste SMTP');
    }

    const config = {
      host: String(smtp.host),
      port: Number(smtp.port),
      secure: Boolean(smtp.port === 465),
      auth: {
        user: String(smtp.username),
        pass: String(smtp.password)
      },
      connectionTimeout: 5000,
      socketTimeout: 5000,
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      }
    };

    console.log('Iniciando teste SMTP:', {
      host: config.host,
      port: config.port,
      secure: config.secure,
      username: config.auth.user
    });

    transporter = createTransport(config);

    // Test connection
    await transporter.verify();
    console.log('Conexão SMTP verificada');

    // Send test email
    const info = await transporter.sendMail({
      from: `"${smtp.fromName}" <${smtp.fromEmail}>`,
      to: testEmail,
      subject: 'Teste de Configuração SMTP',
      html: `
        <h2>Teste de Configuração SMTP</h2>
        <p>Este é um email de teste para validar as configurações SMTP.</p>
        <p>Se você recebeu este email, a configuração está funcionando!</p>
        <br>
        <p>Configurações utilizadas:</p>
        <ul>
          <li>Servidor: ${config.host}</li>
          <li>Porta: ${config.port}</li>
          <li>SSL/TLS: ${config.secure ? 'Sim' : 'Não'}</li>
        </ul>
      `
    });

    // Log success
    const db = readDb();
    db.email_logs.push({
      id: Date.now().toString(),
      templateId: 'smtp_test',
      to: testEmail,
      subject: 'Teste de Configuração SMTP',
      status: 'success',
      messageId: info.messageId,
      duration: Date.now() - startTime,
      sentAt: new Date().toISOString()
    });
    writeDb(db);

    res.json({ success: true });
  } catch (error) {
    // Log error
    const errorDetails = getDetailedErrorMessage(error);
    const db = readDb();
    db.email_logs.push({
      id: Date.now().toString(),
      templateId: 'smtp_test',
      to: req.body?.testEmail,
      subject: 'Teste de Configuração SMTP',
      status: 'error',
      error: errorDetails,
      duration: Date.now() - startTime,
      sentAt: new Date().toISOString()
    });
    writeDb(db);

    res.status(500).json({
      success: false,
      error: errorDetails
    });
  } finally {
    if (transporter) {
      transporter.close();
    }
  }
});

router.get('/providers', (_, res) => {
  res.json(emailProviders);
});

export default router;