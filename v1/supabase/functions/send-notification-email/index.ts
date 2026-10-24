import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const smtpUsername = Deno.env.get('SMTP_USERNAME')!
const smtpPassword = Deno.env.get('SMTP_PASSWORD')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  try {
    const { eventId, applicantId, message, type } = await req.json()

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
      .single()

    if (!event) {
      throw new Error('Event not found')
    }

    // Configurer le client SMTP
    const client = new SmtpClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: smtpUsername,
          password: smtpPassword,
        },
      },
    });

    // Préparer et envoyer l'email
    const emailContent = `
      <h2>Nouvelle candidature pour votre événement "${event.title}"</h2>
      <p>Bonjour ${event.creator.name},</p>
      <p>${event.applicant[0].name} souhaite participer à votre événement.</p>
      <p>Message :</p>
      <blockquote>${message}</blockquote>
      <p>Connectez-vous sur <a href="https://invitemoiasortir.com">Invite Moi</a> pour gérer cette candidature.</p>
    `

    await client.send({
      from: "Invite Moi <noreply@invitemoiasortir.com>",
      to: event.creator.email,
      subject: `Nouvelle candidature pour "${event.title}"`,
      content: "text/html",
      html: emailContent,
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})