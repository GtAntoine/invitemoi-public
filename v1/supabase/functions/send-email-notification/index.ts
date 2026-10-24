import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { notificationId } = await req.json()

    // Récupérer les informations de la notification
    const { data: notification, error: notificationError } = await supabaseClient
      .from('notifications')
      .select(`
        *,
        event:events(
          *,
          creator:users!events_created_by_fkey(
            email,
            name
          )
        )
      `)
      .eq('id', notificationId)
      .single()

    if (notificationError) throw notificationError
    if (!notification) throw new Error('Notification not found')

    // Vérifier si l'utilisateur a activé les notifications par email
    const { data: preferences, error: preferencesError } = await supabaseClient
      .from('user_preferences')
      .select('email_enabled')
      .eq('user_id', notification.user_id)
      .single()

    if (preferencesError) throw preferencesError
    if (!preferences?.email_enabled) {
      return new Response(
        JSON.stringify({ message: 'Email notifications disabled' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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
    const emailContent = notification.type === 'new_application'
      ? `
        <h2>Nouvelle candidature pour votre événement "${notification.event.title}"</h2>
        <p>Bonjour ${notification.event.creator.name},</p>
        <p>Vous avez reçu une nouvelle candidature pour votre événement.</p>
        <p>Message :</p>
        <blockquote>${notification.message}</blockquote>
        <p>Connectez-vous sur <a href="https://invitemoiasortir.com">Invite Moi</a> pour gérer cette candidature.</p>
      `
      : `
        <h2>Votre candidature a été acceptée !</h2>
        <p>Bonjour,</p>
        <p>Votre candidature pour l'événement "${notification.event.title}" a été acceptée.</p>
        <p>Connectez-vous sur <a href="https://invitemoiasortir.com">Invite Moi</a> pour voir les détails.</p>
      `

    // Envoyer l'email
    await client.send({
      from: "Invite Moi <noreply@invitemoiasortir.com>",
      to: notification.event.creator.email,
      subject: notification.type === 'new_application'
        ? `Nouvelle candidature pour "${notification.event.title}"`
        : `Votre candidature pour "${notification.event.title}" a été acceptée !`,
      content: "text/html",
      html: emailContent,
    })

    await client.close()

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})