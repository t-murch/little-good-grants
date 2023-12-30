'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import isStrongPassword from 'validator/es/lib/isStrongPassword';
import { z } from 'zod';
import TooltipIcon from '/public/TooltipIcon.svg';

const PASSWORD_VALIDATION = 'Password must be 8-12 alphanumeric-characters, with atleast one uppercase character and symbol. ';
const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, { message: PASSWORD_VALIDATION }).max(16),
    confirmPassword: z.string().min(8).max(16),
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
  const router = useRouter();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    try {
      const myResponse = await fetch('/api/users/new', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      const data = await myResponse.json();
      console.debug('RESPONSE=', JSON.stringify(data));
      if (data?.error === null) {
        console.log('Redirect should be occurring. ');
        router.push('/home/login');
        // redirect('/home/login');
      } else {
        console.log('*** ADVISE USER OF ERROR SOMEHOW. ***');
      }
    } catch (error) {
      console.error('Error on New Account Sign Up. Error=', JSON.stringify(error));
    }
  }

  return (
    <section className="flex h-auto min-w-[21rem] rounded-md border-6 bg-purple-400 p-4 shadow-2xl">
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
                    <Input type="email" placeholder="admin@goodgrants.com" className="h-7 max-w-[13rem] rounded-sm px-1" {...field} />
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
                      <Image className="flex flex-col h-[16px] w-[16px]" src={TooltipIcon} alt="More Info Icon" priority />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs md:max-w-md">{PASSWORD_VALIDATION}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex flex-col gap-1">
                  <FormControl>
                    <Input placeholder="password" type="password" className="h-7 max-w-[13rem] rounded-sm px-1 self-end" {...field} />
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
                    <Input placeholder="password" type="password" className="h-7 max-w-[13rem] rounded-sm px-1 self-end" {...field} />
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
    </section>
  );
}

export { SignUp, signUpSchema };
