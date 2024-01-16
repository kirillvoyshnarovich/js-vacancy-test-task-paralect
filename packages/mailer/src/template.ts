import { ResetPassword, ResetPasswordProps } from '../emails/reset-password';
import { SignUpWelcome, SignUpWelcomeProps } from '../emails/sign-up-welcome';
import { VerifyEmail, VerifyEmailProps } from '../emails/verify-email';

export enum TemplateMailer {
  RESET_PASSWORD,
  SIGN_UP_WELCOME,
  VERIFY_EMAIL,
}

export const EmailComponent = {
  [TemplateMailer.RESET_PASSWORD]: ResetPassword,
  [TemplateMailer.SIGN_UP_WELCOME]: SignUpWelcome,
  [TemplateMailer.VERIFY_EMAIL]: VerifyEmail,
};

export type TemplateProps = {
  [TemplateMailer.RESET_PASSWORD]: ResetPasswordProps;
  [TemplateMailer.SIGN_UP_WELCOME]: SignUpWelcomeProps;
  [TemplateMailer.VERIFY_EMAIL]: VerifyEmailProps;
};
