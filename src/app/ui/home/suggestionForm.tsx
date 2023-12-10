"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import clsx from "clsx";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { supabase } from "../../utils/supabase";
import CaretUp from "/public/caret_up.svg";

const formSchema = z.object({
  url: z.string().url(),
  name: z.string().min(2).max(32).optional(),
  industryServed: z.string().min(2).max(32).optional(), // Lets define an enum/list here in the future.
  deadline: z.date(),
  organizationName: z.string().min(2).max(32).optional(),
});

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
//   return <input placeholder={placeholder} {...field} ref={ref ?? undefined} />;
// });

export default function SuggestionForm() {
  const myDB = supabase();
  if (myDB === undefined) {
    throw new Error("Failed to connect to DB. Unable to render Submission Form.");
  }
  const [formSectionOpen, setFormSectionOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const formControlRef = useRef<HTMLButtonElement>(null);
  const firstFormInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "", // 'https://www.goodgrantA.com',
      name: "",
      industryServed: "",
      deadline: new Date(),
      organizationName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!myDB) {
      console.error("Failed to connect to DB. Unable to enter Grant Submission.");
      return;
    }
    const { data, error } = await myDB
      .from("listings")
      .insert([
        {
          name: values.name,
          organizationname: values.organizationName,
          deadlineduedate: values.deadline,
          url: values.url,
          industriesserved: values.industryServed,
          submitted: true,
        },
      ])
      .select();

    if (error) {
      console.error("Failed to submit new Grant. E=", error);
    }

    console.log("SUBMITTED");
    console.log("data, ", data);
  }

  const openForm = useCallback((): void => {
    setFormSectionOpen(!formSectionOpen);
    if (!formSectionOpen) {
      console.debug("open-form");
      formControlRef.current?.scrollIntoView();
    }
  }, [formSectionOpen]);

  const addKeyboardTabbing = useCallback(
    (e: KeyboardEvent) => {
      console.log("Key Event: ", e.key);
      if (e.key === "Enter" || e.key === " ") {
        openForm();
      }
    },
    [openForm],
  );

  useEffect(() => {
    document.addEventListener("keydown", addKeyboardTabbing, false);
    return document.removeEventListener("keydown", addKeyboardTabbing, false);
  }, [addKeyboardTabbing, formControlRef]);

  return (
    <article
      className={`rounded-md justify-between mb-2 md:flex-col md:space-x-0 md:space-y-0 border-2 border-solid transition-all overflow-hidden ${
        formSectionOpen ? "duration-700 ease-linear" : "duration-300 ease-linear"
      }`}
    >
      <section className="group">
        <Button
          tabIndex={0}
          ref={formControlRef}
          className={clsx(
            "rounded-sm w-full flex flex-row justify-between p-4 bg-gray-200 drop-shadow-md select-none" +
              // "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              { "group-hover:mb-1": !formSectionOpen },
          )}
          onClick={openForm}
        >
          <h2 className="font-semibold md:text-3xl">Have a Grant we missed?</h2>
          <Image
            alt="form closed icon"
            className={clsx("transition-transform duration-300 w-[32px] h-[32px]", {
              "rotate-180": formSectionOpen,
              "group-hover:rotate-45": !formSectionOpen,
            })}
            priority
            src={CaretUp}
          />
        </Button>
        <section
          className={`transition-transform duration-700 ease-in-out overflow-hidden bottom-0 ${formSectionOpen ? `h-max p-4 ` : `h-0 group-hover:h-10 group-focus:h-10 px-4 py-0`}`}
        >
          <p className="px-1 pb-4">Please, drop us the link and any other details you have to have Grant submitted for addition to the list!</p>
          <Form {...form}>
            <form className={`transition-all flex flex-col ${formSectionOpen ? `flex` : `hidden`}`} onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col lg:flex-row gap-4 mb-3 overflow-auto">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col min-h-[3.5rem] pl-1">
                      <FormLabel className="md:h-8">Name of Grant</FormLabel>
                      <FormControl>
                        <input
                          className="h-[40px] py-2 pl-3 pr-4 border border-input bg-background hover:border-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col min-h-[3.5rem]">
                      <FormLabel className="md:h-8">Name of Organization Providing Grant</FormLabel>
                      <FormControl>
                        <input
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
                    <FormItem className="flex flex-col min-h-[3.5rem]">
                      <FormLabel className="md:h-8">URL for Grant</FormLabel>
                      <FormControl>
                        <input
                          className="h-[40px] py-2 pl-3 pr-4 border border-input bg-background hover:border-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col min-h-[3.5rem]">
                      <FormLabel className="md:h-8">Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            // disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {/* <FormDescription>Your date of birth is used to calculate your age.</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industryServed"
                  render={({ field }) => (
                    <FormItem className="flex flex-col min-h-[3.5rem] pr-1">
                      <FormLabel className="md:h-8">Industry Served</FormLabel>
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="justify-start">
                              {field.value ? field.value.slice(0, 1).toLocaleUpperCase() + field.value.slice(1) : "Choose Industry"}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            {/* <DropdownMenuLabel>Industry Served</DropdownMenuLabel>
                            <DropdownMenuSeparator /> */}
                            <DropdownMenuRadioGroup value={field.value ? field.value : "non-profit"} onValueChange={field.onChange}>
                              <DropdownMenuRadioItem value="profit">Profit</DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="non-profit">Non-Profit</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full flex justify-end">
                <Button className="flex w-[8rem]" type="submit">
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
