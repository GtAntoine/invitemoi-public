import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const smtpUsername = process.env.SMTP_USERNAME!;
const smtpPassword = process.env.SMTP_PASSWORD!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: smtpUsername,
    pass: smtpPassword,
  },
});

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { eventId, applicantId, message, type } = JSON.parse(event.body || '{}');

    // Récupérer les informations de l'événement et des utilisateurs
    const { data: event } = await supabase
      .from('events')
      .select(`
        *,
        creator:users!events_created_by_fkey(
          email,
          name
        ),
        applicant:users!applications(
          name
        )
      `)
      .eq('id', eventId)
      .single();

    if (!event) {
      throw new Error('Event not found');
    }

    // Préparer et envoyer l'email
    const emailContent = `
      <h2>Nouvelle candidature pour votre événement "${event.title}"</h2>
      <p>Bonjour ${event.creator.name},</p>
      <p>${event.applicant[0].name} souhaite participer à votre événement.</p>
      <p>Message :</p>
      <blockquote>${message}</blockquote>
      <p>Connectez-vous sur <a href="https://invitemoiasortir.com">Invite Moi</a> pour gérer cette candidature.</p>
    `;

    await transporter.sendMail({
      from: '"Invite Moi" <noreply@invitemoiasortir.com>',
      to: event.creator.email,
      subject: `Nouvelle candidature pour "${event.title}"`,
      html: emailContent,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};