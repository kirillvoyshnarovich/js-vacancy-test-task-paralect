import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import { NextPage } from 'next';
import {
  Button,
  Stack,
  TextInput,
  PasswordInput,
  Group,
  Title,
  Text,
  Checkbox,
  SimpleGrid,
  Tooltip,
  List,
} from '@mantine/core';

import { accountApi } from 'resources/account';

import config from 'config';
import { Link } from 'components';
import { handleError } from 'utils';
import { RoutePath } from 'routes';
import { IconCircleCheck } from '@tabler/icons-react';
import { EMAIL_REGEX, PASSWORD_REGEX } from 'app-constants';
import classes from './index.module.css';

const schema = z.object({
  email: z.string().regex(EMAIL_REGEX, 'Email format is incorrect.'),
  password: z.string().regex(PASSWORD_REGEX, 'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).'),
});

type SignUpParams = z.infer<typeof schema>;

const passwordRules = [
  {
    title: 'Be 6-50 characters',
    done: false,
  },
  {
    title: 'Have at least one letter',
    done: false,
  },
  {
    title: 'Have at least one number',
    done: false,
  },
];

const SignUp: NextPage = () => {
  const [email, setEmail] = useState('');
  const [registered, setRegistered] = useState(false);
  const [signupToken, setSignupToken] = useState();

  const [passwordRulesData, setPasswordRulesData] = useState(passwordRules);
  const [opened, setOpened] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<SignUpParams>({
    resolver: zodResolver(schema),
  });

  const passwordValue = watch('password', '');

  useEffect(() => {
    const updatedPasswordRulesData = [...passwordRules];

    updatedPasswordRulesData[0].done = passwordValue.length >= 6 && passwordValue.length <= 50;
    updatedPasswordRulesData[1].done = /[a-zA-Z]/.test(passwordValue);
    updatedPasswordRulesData[2].done = /\d/.test(passwordValue);

    setPasswordRulesData(updatedPasswordRulesData);
  }, [passwordValue]);

  const {
    mutate: signUp,
    isLoading: isSignUpLoading,
  } = accountApi.useSignUp<SignUpParams>();

  const onSubmit = (data: SignUpParams) => signUp(data, {
    onSuccess: (response: any) => {
      if (response.signupToken) setSignupToken(response.signupToken);

      setRegistered(true);
      setEmail(data.email);
    },
    onError: (e) => handleError(e, setError),
  });

  const label = (
    <SimpleGrid
      cols={1}
      spacing="xs"
      p={4}
    >
      <Text>Password must:</Text>

      {passwordRulesData.map((ruleData) => (
        <Checkbox
          styles={{ label: { color: 'white' } }}
          key={ruleData.title}
          checked={ruleData.done}
          label={ruleData.title}
        />
      ))}
    </SimpleGrid>
  );

  if (registered) {
    return (
      <>
        <Head>
          <title>Sign up</title>
        </Head>
        <Stack w={450}>
          <Title order={2}>Thanks!</Title>

          <Text size="md" c="gray.6">
            Please follow the instructions from the email to complete a sign up process.
            We sent an email with a confirmation link to
            {' '}
            <b>{email}</b>
          </Text>

          {signupToken && (
            <Stack gap={0}>
              <Text>You look like a cool developer.</Text>
              <Link size="sm" href={`${config.API_URL}/account/verify-email?token=${signupToken}`}>
                Verify email
              </Link>
            </Stack>
          )}
        </Stack>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <Stack w={408} gap={20}>
        <Stack gap={34}>
          <Title order={1}>Sign Up</Title>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={25}>
              <TextInput
                {...register('email')}
                label="Email Address"
                placeholder="Email Address"
                error={errors.email?.message}
              />

              <Tooltip
                label={label}
                withArrow
                opened={opened}
              >
                <PasswordInput
                  {...register('password')}
                  label="Password"
                  placeholder="Enter password"
                  onFocus={() => setOpened(true)}
                  onBlur={() => setOpened(false)}
                  error={errors.password?.message}
                />
              </Tooltip>
            </Stack>
            <List
              spacing="xs"
              icon={
                (
                  <IconCircleCheck style={{ color: '#2B77EB' }} />
                )
              }
              classNames={{
                root: classes.root,
                itemLabel: classes.itemLabel,
              }}
            >
              <List.Item>
                Must be at least 8 characters
              </List.Item>
              <List.Item>
                Must contain at least 1 number
              </List.Item>
              <List.Item>
                Must contain lover case and capital letters
              </List.Item>
            </List>
            <Button
              type="submit"
              loading={isSignUpLoading}
              fullWidth
              mt={34}
            >
              Create Account
            </Button>
          </form>
        </Stack>

        <Stack gap={34}>
          <Group fz={16} justify="center" gap={12}>
            Have an account?
            <Link
              type="router"
              href={RoutePath.SignIn}
              inherit
              underline={false}
            >
              Sign In
            </Link>
          </Group>
        </Stack>
      </Stack>
    </>
  );
};

export default SignUp;
