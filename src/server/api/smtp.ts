import { createTransport } from 'nodemailer';

export async function testSmtpConnection(smtpConfig: any) {
  try {
    const transporter = createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.auth.user,
        pass: smtpConfig.auth.pass,
      },
    });

    // Verify SMTP connection
    await transporter.verify();

    // Send test email
    await transporter.sendMail({
      from: smtpConfig.from,
      to: smtpConfig.auth.user,
      subject: 'Teste de Conexão SMTP',
      html: `
        <h2>Teste de Conexão SMTP</h2>
        <p>Esta é uma mensagem de teste para validar as configurações SMTP.</p>
        <p>Se você recebeu este email, a configuração está funcionando corretamente!</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('SMTP test error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}