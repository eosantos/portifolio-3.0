'use client';

import { useState } from 'react';
import { media } from '@/styles/media';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FiMail, FiGithub, FiLinkedin, FiSend } from 'react-icons/fi';

const Section = styled.section`
  padding: 2rem;
  max-width: 1280px;
  margin: 0 auto;

  ${media.greaterThan('md')} {
    padding: 4rem;
  }
`;

const Title = styled.h2`
  font-size: 2.25rem;
  font-weight: 300;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;

  ${media.greaterThan('md')} {
    font-size: 3rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.comment};
  margin-bottom: 3rem;
  max-width: 600px;

  ${media.greaterThan('md')} {
    font-size: 1.25rem;
  }
`;

const ContactGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;

  ${media.greaterThan('lg')} {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
`;

const InfoCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoItem = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.125rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.purple};
  }

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.purple};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.currentline};
  border-radius: 12px;
  padding: 2rem;

  ${media.lessThan('md')} {
    padding: 1.5rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.currentline};
  border-radius: 8px;
  padding: 0.875rem 1rem;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  font-family: inherit;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.purple};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.purple}33;
  }

  &::placeholder {
    color: ${({ theme }) => theme.comment};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.currentline};
  border-radius: 8px;
  padding: 0.875rem 1rem;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  font-family: inherit;
  min-height: 150px;
  resize: vertical;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.purple};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.purple}33;
  }

  &::placeholder {
    color: ${({ theme }) => theme.comment};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button<{ $loading?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.purple};
  color: ${({ theme }) => theme.background};
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div<{ $type: 'success' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${({ theme, $type }) =>
    $type === 'success' ? `${theme.green}22` : `${theme.red}22`};
  color: ${({ theme, $type }) =>
    $type === 'success' ? theme.green : theme.red};
  border: 1px solid
    ${({ theme, $type }) =>
      $type === 'success' ? `${theme.green}44` : `${theme.red}44`};
`;

interface FormData {
  name: string;
  email: string;
  message: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  message: ''
};

const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateForm = (
  data: FormData
): Partial<Record<keyof FormData, string>> => {
  const errors: Partial<Record<keyof FormData, string>> = {};

  if (!data.name.trim()) {
    errors.name = 'Nome é obrigatório';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Nome deve ter pelo menos 2 caracteres';
  }

  if (!data.email.trim()) {
    errors.email = 'E-mail é obrigatório';
  } else if (!validateEmail(data.email)) {
    errors.email = 'E-mail inválido';
  }

  if (!data.message.trim()) {
    errors.message = 'Mensagem é obrigatória';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Mensagem deve ter pelo menos 10 caracteres';
  }

  return errors;
};

export default function ContatoSection() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on change
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, this would be an actual API call
      // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) });

      setSubmitStatus({
        type: 'success',
        message: t('contact.success')
      });
      setFormData(initialFormData);
    } catch {
      setSubmitStatus({
        type: 'error',
        message: t('contact.error')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setSubmitStatus(null);
  };

  return (
    <Section id="contato" aria-labelledby="contato-title">
      <Title id="contato-title">{t('contact.title')}</Title>
      <Subtitle>{t('contact.subtitle')}</Subtitle>

      <ContactGrid>
        <InfoCard>
          <InfoItem
            href="mailto:eos.eduardooliveira@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiMail size={20} />
            <span>eos.eduardooliveira@gmail.com</span>
          </InfoItem>

          <InfoItem
            href="https://github.com/eosantos"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiGithub size={20} />
            <span>github.com/eosantos</span>
          </InfoItem>

          <InfoItem
            href="https://www.linkedin.com/in/eduardo-oliveira-dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiLinkedin size={20} />
            <span>www.linkedin.com/in/eduardo-oliveira-dev</span>
          </InfoItem>
        </InfoCard>

        <Form onSubmit={handleSubmit} noValidate>
          {submitStatus && (
            <StatusMessage
              $type={submitStatus.type}
              role="status"
              aria-live="polite"
            >
              {submitStatus.message}
            </StatusMessage>
          )}

          <FormGroup>
            <Label htmlFor="name">{t('contact.fields.name')}</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('contact.placeholders.name')}
              disabled={isSubmitting}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <span
                id="name-error"
                role="alert"
                style={{ color: 'var(--red)', fontSize: '0.875rem' }}
              >
                {errors.name}
              </span>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">{t('contact.fields.email')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('contact.placeholders.email')}
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <span
                id="email-error"
                role="alert"
                style={{ color: 'var(--red)', fontSize: '0.875rem' }}
              >
                {errors.email}
              </span>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="message">{t('contact.fields.message')}</Label>
            <TextArea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t('contact.placeholders.message')}
              disabled={isSubmitting}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && (
              <span
                id="message-error"
                role="alert"
                style={{ color: 'var(--red)', fontSize: '0.875rem' }}
              >
                {errors.message}
              </span>
            )}
          </FormGroup>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <SubmitButton type="submit" $loading={isSubmitting}>
              <FiSend size={18} />
              {isSubmitting ? t('contact.sending') : t('contact.send')}
            </SubmitButton>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              style={{
                padding: '1rem 2rem',
                fontSize: '1rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                border: '1px solid',
                borderColor: 'var(--currentline)',
                background: 'transparent',
                color: 'var(--text)',
                borderRadius: '8px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.6 : 1,
                transition: 'opacity 0.2s ease'
              }}
            >
              {t('contact.reset')}
            </button>
          </div>
        </Form>
      </ContactGrid>
    </Section>
  );
}
