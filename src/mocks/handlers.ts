import { http, HttpResponse } from 'msw';

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const handlers = [
  // Test SMTP Connection
  http.post('/api/smtp/test', async ({ request }) => {
    await delay(1000); // Simulate network latency
    
    try {
      const body = await request.json();
      const { smtp } = body;
      
      if (!smtp) {
        return HttpResponse.json(
          { success: false, error: 'Configurações SMTP não fornecidas' },
          { status: 400 }
        );
      }
      
      // Basic validation
      if (!smtp.host || !smtp.auth?.user || !smtp.auth?.pass) {
        return HttpResponse.json(
          { success: false, error: 'Configurações SMTP incompletas' },
          { status: 400 }
        );
      }

      // Simulate connection test
      const isValidHost = !smtp.host.includes('error') && !smtp.host.includes('fail');
      
      if (!isValidHost) {
        return HttpResponse.json(
          { success: false, error: 'Não foi possível conectar ao servidor SMTP' },
          { status: 400 }
        );
      }

      return HttpResponse.json(
        { success: true, message: 'Conexão SMTP testada com sucesso' },
        { status: 200 }
      );
    } catch (error) {
      return HttpResponse.json(
        { success: false, error: 'Erro ao processar requisição' },
        { status: 500 }
      );
    }
  }),

  // Send Email
  http.post('/api/smtp/send', async ({ request }) => {
    await delay(1500); // Simulate network latency
    
    try {
      const body = await request.json();
      const { smtp, email } = body;
      
      if (!smtp || !email) {
        return HttpResponse.json(
          { success: false, error: 'Dados incompletos' },
          { status: 400 }
        );
      }

      // Basic validation
      if (!smtp.host || !smtp.auth?.user || !smtp.auth?.pass) {
        return HttpResponse.json(
          { success: false, error: 'Configurações SMTP incompletas' },
          { status: 400 }
        );
      }

      if (!email.to || !email.subject || !email.html) {
        return HttpResponse.json(
          { success: false, error: 'Dados do email incompletos' },
          { status: 400 }
        );
      }

      // Simulate email sending
      const isValidHost = !smtp.host.includes('error') && !smtp.host.includes('fail');
      
      if (!isValidHost) {
        return HttpResponse.json(
          { success: false, error: 'Falha ao enviar email' },
          { status: 400 }
        );
      }

      return HttpResponse.json(
        { success: true, message: 'Email enviado com sucesso' },
        { status: 200 }
      );
    } catch (error) {
      return HttpResponse.json(
        { success: false, error: 'Erro ao processar requisição' },
        { status: 500 }
      );
    }
  })
];