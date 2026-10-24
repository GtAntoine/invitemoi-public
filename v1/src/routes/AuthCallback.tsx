import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LoadingScreen } from '../components/ui/LoadingScreen';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/events');
      } else {
        navigate('/auth/login');
      }
    });
  }, [navigate]);

  return <LoadingScreen message="Redirection en cours..." />;
}