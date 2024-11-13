import { SmtpSettings } from '../types';
import api from './api';

interface SmtpTestResult {
  success: boolean;
  error?: string;
}

export async function testSmtpConnection(smtpSettings: SmtpSettings, testEmail: string): Promise<SmtpTestResult> {
  try {
    if (!smtpSettings) {
      throw new Error('Configurações SMTP não fornecidas');
    }

    // Create a serializable object with only the necessary SMTP settings
    const smtpConfig = {
      host: String(smtpSettings.host || ''),
      port: Number(smtpSettings.port || 465),
      secure: Boolean(smtpSettings.port === 465),
      username: String(smtpSettings.username || ''),
      password: String(smtpSettings.password || ''),
      fromEmail: String(smtpSettings.fromEmail || ''),
      fromName: String(smtpSettings.fromName || 'Sistema de Gestão')
    };

    const response = await api.post('/smtp/test', {
      smtp: smtpConfig,
      testEmail: String(testEmail)
    });

    return {
      success: Boolean(response.data?.success),
      error: response.data?.error
    };
  } catch (error: any) {
    // Ensure we only return serializable data
    const errorMessage = error?.error || error?.message || 'Erro desconhecido ao testar conexão SMTP';
    
    return {
      success: false,
      error: String(errorMessage)
    };
  }
}