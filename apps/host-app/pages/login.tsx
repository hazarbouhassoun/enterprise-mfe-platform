import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/compat/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  Input,
} from '@repo/ui';
import { useAuthStore } from '@/features/auth/auth-store';
import { getPostLoginPath, routerReplace } from '@/features/auth/client-navigation';
import { trackClientEvent } from '@/lib/telemetry';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Use at least 6 characters (demo only).'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'you@company.com', password: 'password' },
  });

  return (
    <>
      <Head>
        <title>Login · host-app</title>
      </Head>
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              Mock sign-in for demos. Admin features are limited to authorized accounts; example
              demo accounts may include extended permissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form
              onSubmit={form.handleSubmit(async (values) => {
                await login(values.email, values.password);
                trackClientEvent('login_success', {
                  opsEmbed: values.email.includes('+ops'),
                });
                const next = getPostLoginPath(router);
                await routerReplace(router, next);
              })}
            >
              <FormField>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input id="email" autoComplete="email" {...form.register('email')} />
                </FormControl>
                <FormMessage error={Boolean(form.formState.errors.email)}>
                  {form.formState.errors.email?.message}
                </FormMessage>
              </FormField>

              <FormField>
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    {...form.register('password')}
                  />
                </FormControl>
                <FormMessage error={Boolean(form.formState.errors.password)}>
                  {form.formState.errors.password?.message}
                </FormMessage>
              </FormField>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Button asChild variant="ghost">
                  <Link href="/">Back</Link>
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Signing in…' : 'Sign in'}
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
