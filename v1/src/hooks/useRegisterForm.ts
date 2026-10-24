// src/hooks/auth/useRegisterForm.ts
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function useRegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (formData: { 
    email: string; 
    password: string; 
    confirmPassword: string 
  }) => {
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const { needsEmailConfirmation, error: signUpError } = await signUp(
        formData.email, 
        formData.password
      );
      
      if (signUpError) {
        setError(signUpError);
        return;
      }
      
      setSuccess(true);
    } catch (err) {
      setError('Une erreur est survenue lors de l\'inscription');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubmit,
    success,
    loading,
    error
  };
}
