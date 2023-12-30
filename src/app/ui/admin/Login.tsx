'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(16),
});

const loginItemClass = 'flex h-9 min-w-[18rem] items-baseline justify-between';

function Login() {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log('**SUBMITT-ING**');
    let data,
      error = null;
    try {
      const myResponse = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      const returnData = await myResponse.json();
      data = returnData.data;
      error = returnData.error;
      console.debug('RESPONSE=', JSON.stringify({ data, error }));
      if (error === null) {
        console.log('Redirect should be occurring. ');
        router.push('/home/admin');
        // redirect('/home/admin');
      } else {
        console.log('*** ADVISE USER OF ERROR SOMEHOW. ***');
      }
    } catch (error) {
      console.error('Error on User Login. Error=', JSON.stringify(error));
    }
  }

  return (
    <section className="flex h-auto min-w-[21rem] rounded-md border-6 bg-purple-400 p-4 shadow-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex items-baseline h-9 justify-between">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="admin@goodgrants.com" className="h-7 max-w-[13rem] rounded-sm px-1" {...field} />
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
                  <Input placeholder="password" type="password" className="h-7 max-w-[13rem] rounded-sm px-1" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex w-full mt-2 justify-between items-center">
            <a className="text-sm font-light" href="/home/signup">
              Create Account
            </a>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </section>
  );
}

export { Login, loginSchema };
