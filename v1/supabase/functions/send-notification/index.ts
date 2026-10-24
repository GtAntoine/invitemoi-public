import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationPayload {
  eventId: string;
  applicantId: string;
  message: string;
  type: 'application' | 'acceptance';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { eventId, applicantId, message, type }: NotificationPayload = await req.json()

    // Récupérer les informations de l'événement et des utilisateurs
    const { data: event, error: eventError } = await supabaseClient
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

    if (eventError) throw eventError
    if (!event) throw new Error('Event not found')

    // Configurer le client SMTP
    const client = new SmtpClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: Deno.env.get('SMTP_USERNAME') ?? '',
          password: Deno.env.get('SMTP_PASSWORD') ?? '',
        },
      },
    })

    // Préparer le contenu de l'email selon le type
    const emailContent = type === 'application' 
      ? `
        <h2>Nouvelle candidature pour votre événement "${event.title}"</h2>
        <p>Bonjour ${event.creator.name},</p>
        <p>${event.applicant[0].name} souhaite participer à votre événement.</p>
        <p>Message :</p>
        <blockquote>${message}</blockquote>
        <p>Connectez-vous sur <a href="https://invitemoiasortir.com">Invite Moi</a> pour gérer cette candidature.</p>
      `
      : `
        <h2>Votre candidature a été acceptée !</h2>
        <p>Bonjour ${event.applicant[0].name},</p>
        <p>Votre candidature pour l'événement "${event.title}" a été acceptée.</p>
        <p>Connectez-vous sur <a href="https://invitemoiasortir.com">Invite Moi</a> pour voir les détails.</p>
      `

    // Envoyer l'email
    await client.send({
      from: "Invite Moi <noreply@invitemoiasortir.com>",
      to: type === 'application' ? event.creator.email : event.applicant[0].email,
      subject: type === 'application' 
        ? `Nouvelle candidature pour "${event.title}"`
        : `Votre candidature pour "${event.title}" a été acceptée !`,
      content: "text/html",
      html: emailContent,
    })

    await client.close()

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    )

  } catch (error) {
    console.error('Error sending notification:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    )
  }
})