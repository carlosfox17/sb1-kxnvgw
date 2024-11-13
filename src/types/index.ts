export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
  active: boolean;
  createdAt: string;
}

export interface EmailTemplate {
  id: string;
  subject: string;
  template: string;
  active: boolean;
  content: {
    title: string;
    body: string;
  };
}

export interface EmailLog {
  id: string;
  templateId: string;
  to: string;
  subject: string;
  content: string;
  status: 'success' | 'error';
  error?: string;
  sentAt: string;
}

export interface SmtpSettings {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
}

export interface AppSettings {
  appName: string;
  logoUrl: string;
  primaryColor: string;
  companyName: string;
  contactEmail: string;
  dateFormat: string;
  timezone: string;
  smtp: SmtpSettings;
}