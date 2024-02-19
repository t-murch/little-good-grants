'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import isStrongPassword from 'validator/es/lib/isStrongPassword';
import { z } from 'zod';
import TooltipIcon from '/public/TooltipIcon.svg';
import { confirmSignUp, signIn, signUp } from 'aws-amplify/auth';
import { useState } from 'react';
import { useAppContext } from '@/app/lib/contextLib';

const PASSWORD_VALIDATION =
  'Password must be 8-12 alphanumeric-characters, with atleast one uppercase character and symbol. ';
const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, { message: PASSWORD_VALIDATION }).max(16),
    confirmPassword: z.string().min(8).max(16),
    confirmationCode: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords do not match',
        path: ['confirmPassword'],
      });
    }
    if (!isStrongPassword(password)) {
      ctx.addIssue({
        code: 'custom',
        message: 'The password is not strong enough',
        path: ['password'],
      });
    }
  });

const loginItemClass = 'flex h-9 min-w-[19rem] items-baseline justify-between';

function SignUp() {
  const { userHasAuthenticated } = useAppContext();
  const router = useRouter();
  const [newUser, setNewUser] = useState<null | string>(null);
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      confirmationCode: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    try {
      const newUser = await signUp({
        username: values.email,
        password: values.password,
      });
      if (!newUser.userId) {
        throw new Error('No new user was created.');
      }
      setNewUser(newUser.userId);
    } catch (error: any) {
      let message = String(error);

      if (!(error instanceof Error) && error.message) {
        message = String(error.message);
        console.error('Error Message=', message);
      }
    }
  }

  async function onConfirmation(values: z.infer<typeof signUpSchema>) {
    try {
      await confirmSignUp({
        username: values.email,
        confirmationCode: values.confirmationCode,
      });
      await signIn({ username: values.email, password: values.password });
      userHasAuthenticated(true);

      console.log('Redirect should be occurring. ');
      router.push('/login');
    } catch (error: any) {
      let message = String(error);

      if (!(error instanceof Error) && error.message) {
        message = String(error.message);
        console.error('Error Message=', message);
      }
    }
  }

  function renderConfirmationForm() {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onConfirmation)}>
          <FormField
            control={form.control}
            name="confirmationCode"
            render={({ field }) => (
              <FormItem className={loginItemClass}>
                <FormLabel>Confirmation Code</FormLabel>
                <div className="flex flex-col gap-1">
                  <FormControl>
                    <Input
                      placeholder="123456"
                      className="h-7 max-w-[13rem] rounded-sm px-1 self-end"
                      {...field}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  }

  function renderSignUpForm() {
    return (
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          // action={signUpNewUser}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex items-baseline h-9 justify-between">
                <FormLabel>Email</FormLabel>
                <div className="flex flex-col gap-1">
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@goodgrants.com"
                      className="h-7 max-w-[13rem] rounded-sm px-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs self-end" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className={loginItemClass}>
                <FormLabel>Password</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Image
                        className="flex flex-col h-[16px] w-[16px]"
                        src={TooltipIcon}
                        alt="More Info Icon"
                        priority
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs md:max-w-md">
                        {PASSWORD_VALIDATION}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex flex-col gap-1">
                  <FormControl>
                    <Input
                      placeholder="password"
                      type="password"
                      className="h-7 max-w-[13rem] rounded-sm px-1 self-end"
                      {...field}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className={loginItemClass}>
                <FormLabel>Confirm</FormLabel>
                <div className="flex flex-col gap-1">
                  <FormControl>
                    <Input
                      placeholder="password"
                      type="password"
                      className="h-7 max-w-[13rem] rounded-sm px-1 self-end"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs self-end" />
                </div>
              </FormItem>
            )}
          />
          <div className="flex w-full mt-2 justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    );
  }

  return (
    <section className="flex h-auto min-w-[21rem] rounded-md border-6 bg-gray-50 p-4 shadow-2xl shadow-gray-50/50">
      {newUser === null ? renderSignUpForm() : renderConfirmationForm()}
    </section>
  );
}

export { SignUp, signUpSchema };
