"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const formSchema = z.object({
  email: z.email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().regex(/^\d{3} \d{2}$/, "Invalid postal code"),
  country: z.enum(["sv"]),
});

type FormValues = z.infer<typeof formSchema>;

export function CheckoutForm({ disabled = false }: { disabled?: boolean }) {
  const form = useForm<FormValues>({
    disabled,
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      postalCode: "",
      country: "sv",
    },
  });

  async function handleSubmit(data: FormValues) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        method="post"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full space-y-6 @container/form p-4 border rounded-xl"
      >
        <h2 className="font-bold text-xl">Shipping information</h2>

        <div className="gap-y-6 gap-x-4 grid grid-cols-12 items-start">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="col-span-6 @3xl/form:col-span-3">
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" autoComplete="given-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="col-span-6 @3xl/form:col-span-3">
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" autoComplete="family-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-12 @3xl/form:col-span-6">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" autoComplete="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-12 @sm/form:col-span-8 @3xl/form:col-span-4">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} type="text" autoComplete="street-address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem className="col-span-12 @sm/form:col-span-4 @3xl/form:col-span-2">
                <FormLabel>Postal code</FormLabel>
                <FormControl>
                  <Input {...field} type="text" autoComplete="postal-code" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="col-span-7 @lg/form:col-span-8 @3xl/form:col-span-3">
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} type="text" autoComplete="address-level2" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="col-span-5 @lg/form:col-span-4 @3xl/form:col-span-3">
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={field.disabled}
                  name={field.name}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sv">Sweden</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex @sm/form:justify-end">
          <Button type="submit" className="w-full @sm/form:w-auto">
            Place order
            <CheckCircle />
          </Button>
        </div>
      </form>
    </Form>
  );
}
