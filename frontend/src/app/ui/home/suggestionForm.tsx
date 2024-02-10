'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import clsx from 'clsx';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import CaretUp from '/public/caret_up.svg';

const formSchema = z.object({
  url: z.string().url(),
  name: z.string().min(2).max(32),
  industries_served: z.string().min(2).max(32), // Lets define an enum/list here in the future.
  deadline_date: z.date(),
  organization_name: z.string().min(2).max(32),
});

async function submitForm(values: z.infer<typeof formSchema>) {}

/**
 * Coming back to this later.
 */
// type FormInputProps = {
//   field: ControllerRenderProps;
//   placeholder?: string;
//   // { field, placeholder }: { field?: ControllerRenderProps; placeholder: string }
// } & InputHTMLAttributes<HTMLInputElement>;
// const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput(props: FormInputProps, ref) {
//   const { field, placeholder } = props;
//   return <Input placeholder={placeholder} {...field} ref={ref ?? undefined} />;
// });

function SuggestionForm() {
  // { submissionService }: { submissionService: GrantService }
  const [formSectionOpen, setFormSectionOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const formControlRef = useRef<HTMLButtonElement>(null);
  // const firstFormInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '', // 'https://www.goodgrantA.com',
      name: '',
      industries_served: '',
      deadline_date: new Date(),
      organization_name: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const myResponse = await fetch('/api/grants', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      const data = await myResponse.json();
      console.debug('RESPONSE=', JSON.stringify(data));
    } catch (error) {
      console.error('Error on Submit. Error=', JSON.stringify(error));
    } finally {
      console.log('SUBMITTED');
      setIsSubmitting(false);
    }
  }

  const openForm = useCallback((): void => {
    setFormSectionOpen(!formSectionOpen);
    if (!formSectionOpen) {
      console.debug('open-form');
      formControlRef.current?.scrollIntoView();
    }
  }, [formSectionOpen]);

  const addKeyboardTabbing = useCallback(
    (e: KeyboardEvent) => {
      console.log('Key Event: ', e.key);
      if (e.key === 'Enter' || e.key === ' ') {
        openForm();
      }
    },
    [openForm],
  );

  useEffect(() => {
    document.addEventListener('keydown', addKeyboardTabbing, false);
    return document.removeEventListener('keydown', addKeyboardTabbing, false);
  }, [addKeyboardTabbing, formControlRef]);

  return (
    <article
      className={`rounded-md justify-between mb-2 md:flex-col md:space-x-0 md:space-y-0 border-2 border-solid transition-all overflow-hidden duration-700 ease-linear hover:shadow-2xl shadow-gray-50/50`}
    >
      <section className="">
        <div className="">
          <Button
            tabIndex={0}
            ref={formControlRef}
            className={clsx(
              'bg-stone-950 hover:bg-stone-950 rounded-sm w-full flex flex-row justify-between pl-4 text-gray-50 select-none shadow-xl shadow-purple-950/50',
            )}
            onClick={openForm}
          >
            <h2 className="font-semibold md:text-2xl">
              Have a Grant we missed?
            </h2>
            <Image
              alt="form closed icon"
              className={clsx(
                'transition-transform duration-300 w-[32px] h-[32px] fill-gray-50',
                {
                  'rotate-180': formSectionOpen,
                },
              )}
              priority
              src={CaretUp}
            />
          </Button>
        </div>
        <section
          className={`transition-transform duration-700 ease-in-out overflow-hidden bottom-0 bg-gray-50 ${formSectionOpen ? `h-max p-4 ` : `h-0`}`}
        >
          <p className="px-1 pb-4">
            Please, drop us the link and any other details you have to have
            Grant submitted for addition to the list!
          </p>
          <Form {...form}>
            <form
              className={`transition-all flex flex-col ${formSectionOpen ? `flex` : `hidden`}`}
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col lg:flex-row gap-4 mb-3 overflow-auto">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col min-h-[3.5rem] px-2">
                      <FormLabel className="md:h-8">Name of Grant</FormLabel>
                      <FormControl>
                        <Input
                          className="h-[40px] py-2 pl-3 pr-4 border border-input bg-background hover:border-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organization_name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col min-h-[3.5rem] px-2">
                      <FormLabel className="md:h-8">
                        Name of Organization Providing Grant
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-[40px] py-2 pl-3 pr-4 border border-input bg-background hover:border-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem className="flex flex-col min-h-[3.5rem]  px-2">
                      <FormLabel className="md:h-8">URL for Grant</FormLabel>
                      <FormControl>
                        <Input
                          className="h-[40px] py-2 pl-3 pr-4 border border-input bg-background hover:border-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col min-h-[3.5rem] px-2">
                      <FormLabel className="md:h-8">Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="bg-gray-50 rounded-md border border-primary w-auto p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industries_served"
                  render={({ field }) => (
                    <FormItem className="flex flex-col min-h-[3.5rem] px-2 mb-2">
                      <FormLabel className="md:h-8">Industry Served</FormLabel>
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="justify-start">
                              {field.value
                                ? field.value.slice(0, 1).toLocaleUpperCase() +
                                  field.value.slice(1)
                                : 'Choose Industry'}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuRadioGroup
                              value={field.value ? field.value : 'non-profit'}
                              onValueChange={field.onChange}
                            >
                              <DropdownMenuRadioItem value="profit">
                                Profit
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="non-profit">
                                Non-Profit
                              </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full flex justify-end">
                <Button
                  className="flex w-[8rem] bg-accent"
                  disabled={isSubmitting}
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </section>
      </section>
    </article>
  );
}

export { SuggestionForm };
