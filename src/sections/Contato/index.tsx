'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { media } from '@/styles/media';
import { useTranslation } from 'react-i18next';
import Reveal from '@/components/Reveal';
import { Button } from '@/components/Button';
import { TextInput, TextArea } from '@/components/FormField';
import { ContactLink } from '@/components/ContactLink';
import styled from 'styled-components';
import { FiDownload } from 'react-icons/fi';

const Section = styled.section`
  position: relative;
  z-index: 5;
  max-width: 1280px;
  margin: 0 auto;
  padding: 5rem 2rem;

  ${media.greaterThan('md')} {
    padding: 7rem 4rem;
  }
`;

const Eyebrow = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.purple};
  margin: 0 0 1.5rem;

  ${media.greaterThan('md')} {
    font-size: 1rem;
  }
`;

const Headline = styled.h2`
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
  margin: 0 0 1rem;

  ${media.greaterThan('md')} {
    font-size: clamp(2rem, 4vw, 3rem);
  }
`;

const BodyText = styled.p`
  font-size: 1.125rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.comment};
  margin: 0 0 2rem;
  max-width: 60ch;

  ${media.greaterThan('md')} {
    font-size: 1.25rem;
  }
`;

const InfoCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const AvailabilityBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.currentline};
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  max-width: 100%;
  align-self: flex-start;

  ${media.lessThan('md')} {
    white-space: normal;
    line-height: 1.5;
    border-radius: 16px;
  }
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.purple};
  flex-shrink: 0;
  animation: pulse 2.4s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
      box-shadow: 0 0 0 0 ${({ theme }) => theme.purple}66;
    }
    50% {
      opacity: 0.7;
      box-shadow: 0 0 0 6px transparent;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const ContactLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const CVDownloadButton = styled(Button)`
  ${media.lessThan('sm')} {
    width: 100%;
  }
`;

const FormCard = styled.div`
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.currentline};
  border-radius: 16px;
  padding: 2rem;

  ${media.lessThan('md')} {
    padding: 1.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;

  ${media.lessThan('sm')} {
    flex-direction: column;
  }

  ${media.lessThan('sm')} > * {
    width: 100%;
  }
`;

const StatusMessage = styled.div<{ $type: 'success' | 'error' }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-size: 0.9375rem;
  line-height: 1.5;
  background: ${({ theme, $type }) =>
    $type === 'success' ? `${theme.green}1a` : `${theme.red}1a`};
  color: ${({ theme, $type }) =>
    $type === 'success' ? theme.green : theme.red};
  border: 1px solid
    ${({ theme, $type }) =>
      $type === 'success' ? `${theme.green}33` : `${theme.red}33`};

  svg {
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
`;

const SuccessIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ErrorIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

interface FormData {
  name: string;
  email: string;
  message: string;
  website: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const initialFormData: FormData = {
  name: '',
  email: '',
  message: '',
  website: ''
};

function validateForm(data: FormData, t: (key: string) => string): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = t('contact.validation.nameRequired');
  } else if (data.name.trim().length < 2) {
    errors.name = t('contact.validation.nameMinLength');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim()) {
    errors.email = t('contact.validation.emailRequired');
  } else if (!emailRegex.test(data.email) || data.email.length > 254) {
    errors.email = t('contact.validation.emailInvalid');
  }

  if (!data.message.trim()) {
    errors.message = t('contact.validation.messageRequired');
  } else if (data.message.trim().length < 10) {
    errors.message = t('contact.validation.messageMinLength');
  }

  return errors;
}

const cvPtFile = '/Curriculo-Eduardo-Oliveira.pdf';

function getCvLabel(i18nLanguage: string, t: (key: string) => string): string {
  return i18nLanguage === 'pt'
    ? t('contact.cv.downloadPt')
    : t('contact.cv.downloadEn');
}

export default function ContatoSection() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatusMessage('');

    const validationErrors = validateForm(formData, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          website: formData.website
        })
      });

      const result = await response.json();

      if (result.ok) {
        setStatus('success');
        setStatusMessage(t('contact.success'));
        setFormData(initialFormData);
        setErrors({});
      } else if (result.code === 'validation' && result.fields) {
        setStatus('error');
        setErrors(result.fields as FormErrors);
        setStatusMessage(t('contact.error'));
      } else if (result.code === 'rate_limited') {
        setStatus('error');
        setStatusMessage(t('contact.error'));
      } else {
        setStatus('error');
        setStatusMessage(t('contact.error'));
      }
    } catch {
      setStatus('error');
      setStatusMessage(t('contact.error'));
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setStatus('idle');
    setStatusMessage('');
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 480;

  return (
    <Section id="contato" aria-labelledby="contato-eyebrow">
      <Reveal>
        <Eyebrow id="contato-eyebrow">{t('contact.title')}</Eyebrow>
      </Reveal>

      <Reveal delay={100} y={12}>
        <Headline>{t('contact.headline')}</Headline>
      </Reveal>

      <Reveal delay={200} y={12}>
        <BodyText>{t('contact.body')}</BodyText>
      </Reveal>

      <Reveal delay={300} y={12}>
        <div
          style={{ display: 'grid', gap: '3rem', gridTemplateColumns: '1fr' }}
        >
          {media.greaterThan('lg') && (
            <>
              <InfoCard>
                <AvailabilityBadge>
                  <StatusDot aria-hidden="true" />
                  {t('contact.availabilityBadge')}
                </AvailabilityBadge>

                <ContactLinks>
                  <ContactLink
                    type="email"
                    href="mailto:eos.eduardooliveira@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    eos.eduardooliveira@gmail.com
                  </ContactLink>
                  <ContactLink
                    type="github"
                    href="https://github.com/eosantos"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/eosantos
                  </ContactLink>
                  <ContactLink
                    type="linkedin"
                    href="https://www.linkedin.com/in/eduardo-oliveira-dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.linkedin.com/in/eduardo-oliveira-dev
                  </ContactLink>
                </ContactLinks>

                <CVDownloadButton
                  variant="secondary"
                  as="a"
                  href={cvPtFile}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiDownload size={18} aria-hidden="true" />
                  {getCvLabel(i18n.language, t)}
                </CVDownloadButton>
              </InfoCard>

              <FormCard>
                <Form onSubmit={handleSubmit} noValidate>
                  {statusMessage && (
                    <StatusMessage
                      $type={status === 'success' ? 'success' : 'error'}
                      role="status"
                      aria-live="polite"
                    >
                      {status === 'success' ? <SuccessIcon /> : <ErrorIcon />}
                      {statusMessage}
                    </StatusMessage>
                  )}

                  <TextInput
                    id="name"
                    name="name"
                    type="text"
                    label={t('contact.fields.name')}
                    placeholder={t('contact.placeholders.name')}
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    disabled={status === 'submitting'}
                    required
                    autoComplete="name"
                  />

                  <TextInput
                    id="email"
                    name="email"
                    type="email"
                    label={t('contact.fields.email')}
                    placeholder={t('contact.placeholders.email')}
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    disabled={status === 'submitting'}
                    required
                    autoComplete="email"
                  />

                  <TextArea
                    id="message"
                    name="message"
                    label={t('contact.fields.message')}
                    placeholder={t('contact.placeholders.message')}
                    value={formData.message}
                    onChange={handleChange}
                    error={errors.message}
                    disabled={status === 'submitting'}
                    required
                    rows={5}
                  />

                  <input
                    type="hidden"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    aria-hidden="true"
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ display: 'none' }}
                  />

                  <FormActions>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      loading={status === 'submitting'}
                      fullWidth={isMobile}
                    >
                      {status === 'submitting'
                        ? t('contact.sending')
                        : t('contact.send')}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      onClick={handleReset}
                      disabled={status === 'submitting'}
                      fullWidth={isMobile}
                    >
                      {t('contact.reset')}
                    </Button>
                  </FormActions>
                </Form>
              </FormCard>
            </>
          )}

          {!media.greaterThan('lg') && (
            <>
              <InfoCard>
                <AvailabilityBadge>
                  <StatusDot aria-hidden="true" />
                  {t('contact.availabilityBadge')}
                </AvailabilityBadge>

                <ContactLinks>
                  <ContactLink
                    type="email"
                    href="mailto:eos.eduardooliveira@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    eos.eduardooliveira@gmail.com
                  </ContactLink>
                  <ContactLink
                    type="github"
                    href="https://github.com/eosantos"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/eosantos
                  </ContactLink>
                  <ContactLink
                    type="linkedin"
                    href="https://www.linkedin.com/in/eduardo-oliveira-dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.linkedin.com/in/eduardo-oliveira-dev
                  </ContactLink>
                </ContactLinks>

                <CVDownloadButton
                  variant="secondary"
                  as="a"
                  href={cvPtFile}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiDownload size={18} aria-hidden="true" />
                  {getCvLabel(i18n.language, t)}
                </CVDownloadButton>
              </InfoCard>

              <FormCard>
                <Form onSubmit={handleSubmit} noValidate>
                  {statusMessage && (
                    <StatusMessage
                      $type={status === 'success' ? 'success' : 'error'}
                      role="status"
                      aria-live="polite"
                    >
                      {status === 'success' ? <SuccessIcon /> : <ErrorIcon />}
                      {statusMessage}
                    </StatusMessage>
                  )}

                  <TextInput
                    id="name"
                    name="name"
                    type="text"
                    label={t('contact.fields.name')}
                    placeholder={t('contact.placeholders.name')}
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    disabled={status === 'submitting'}
                    required
                    autoComplete="name"
                  />

                  <TextInput
                    id="email"
                    name="email"
                    type="email"
                    label={t('contact.fields.email')}
                    placeholder={t('contact.placeholders.email')}
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    disabled={status === 'submitting'}
                    required
                    autoComplete="email"
                  />

                  <TextArea
                    id="message"
                    name="message"
                    label={t('contact.fields.message')}
                    placeholder={t('contact.placeholders.message')}
                    value={formData.message}
                    onChange={handleChange}
                    error={errors.message}
                    disabled={status === 'submitting'}
                    required
                    rows={5}
                  />

                  <input
                    type="hidden"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    aria-hidden="true"
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ display: 'none' }}
                  />

                  <FormActions>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      loading={status === 'submitting'}
                      fullWidth={isMobile}
                    >
                      {status === 'submitting'
                        ? t('contact.sending')
                        : t('contact.send')}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      onClick={handleReset}
                      disabled={status === 'submitting'}
                      fullWidth={isMobile}
                    >
                      {t('contact.reset')}
                    </Button>
                  </FormActions>
                </Form>
              </FormCard>
            </>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
