import React, { useState } from 'react';
import { Send, AlertCircle, Loader2 } from 'lucide-react';
import { SmtpSettings } from '../types';
import { testSmtpConnection } from '../utils/emailService';
import { toast } from 'react-hot-toast';

interface SmtpTesterProps {
  smtpSettings: SmtpSettings;
}

export function SmtpTester({ smtpSettings }: SmtpTesterProps) {
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const handleTestSmtp = async () => {
    if (!smtpSettings.host || !smtpSettings.username || !smtpSettings.password || !smtpSettings.fromEmail) {
      toast.error('Por favor, preencha todos os campos SMTP obrigatórios');
      return;
    }

    if (!testEmail) {
      toast.error('Por favor, informe um email para teste');
      return;
    }

    setTestingSmtp(true);
    setErrorDetails(null);

    try {
      const result = await testSmtpConnection(smtpSettings, testEmail);
      
      if (result.success) {
        toast.success('Email de teste enviado com sucesso!');
        setTestEmail('');
      } else {
        setErrorDetails(result.error || 'Erro desconhecido');
        toast.error('Falha ao enviar email de teste');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setErrorDetails(errorMessage);
      toast.error('Falha ao testar SMTP');
    } finally {
      setTestingSmtp(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email para Teste
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="seu@email.com"
            disabled={testingSmtp}
            className="flex-1 min-w-0 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
          />
          <button
            type="button"
            onClick={handleTestSmtp}
            disabled={testingSmtp || !testEmail}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testingSmtp ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {testingSmtp ? 'Enviando...' : 'Enviar Email de Teste'}
          </button>
        </div>
      </div>

      {errorDetails && (
        <div className="mt-4 p-4 bg-red-50 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Detalhes do erro:
              </h3>
              <div className="mt-2 text-sm text-red-700 whitespace-pre-line">
                {errorDetails}
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500">
        Digite um email válido para receber uma mensagem de teste e validar as configurações SMTP.
      </p>
    </div>
  );
}