'use client';

import { useAppContext } from '@/app/lib/contextLib';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(16),
});

const loginItemClass = 'flex h-9 min-w-[18rem] items-baseline justify-between';

function Login() {
  const { isAuthenticated, userHasAuthenticated } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      console.log('isAuthenticated=', isAuthenticated);
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsSubmitting(true);

    try {
      await signIn({ username: values.email, password: values.password });
      userHasAuthenticated(true);

      console.log('Logged in');
      router.push('/admin');
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
      console.error('Error on User Login. Error=', JSON.stringify(error));
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="flex h-auto min-w-[21rem] rounded-md border-6 bg-gray-50 p-4 shadow-2xl shadow-gray-50/50">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className={loginItemClass}>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    type="email"
                    placeholder="admin@goodgrants.com"
                    className="h-7 max-w-[13rem] rounded-sm px-1"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className={loginItemClass}>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="password"
                    type="password"
                    className="h-7 max-w-[13rem] rounded-sm px-1"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex w-full mt-2 justify-between items-center">
            <a className="text-sm font-semibold" href="/signup">
              Create Account
            </a>
            <Button disabled={isSubmitting} type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}

export { Login, loginSchema };
