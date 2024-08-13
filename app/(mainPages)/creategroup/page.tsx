"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreateGroupSchema } from "@/lib/validators";
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ButtonWithLogo from "@/components/ButtonWithLogo";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";
import { createChat } from "@/lib/actions/chat.actions";

function Page() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPrivate, setIsPrivate] = useState(false);

  const form = useForm<z.infer<typeof CreateGroupSchema>>({
    resolver: zodResolver(CreateGroupSchema),
    defaultValues: {
      name: "",
      private: false,
      type: "groups",
    },
  });

  async function onSubmit(values: z.infer<typeof CreateGroupSchema>) {
    const newValues = {
      ...values,
    
      joined: [session?.user!.id as string],
    };
    console.log(newValues);

    const response = await createChat(newValues);

    if (response) {
      toast(`Group <${newValues.name}> created successfully`)
      router.push(`/`);
    }
  }

  return (
    <div className="flex justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 items-center flex flex-col w-[300px]"
        >
          <h1 className="text-xl font-bold">Create A New Group</h1>
          <hr />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-[100%]">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    className="text-primary_colors-black_1"
                    placeholder="Enter group name..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />  
          <FormField
            control={form.control}
            name="private"
            render={({ field }) => (
              <FormItem className="w-[100%]">
                <FormControl>
                  <div className="items-top flex space-x-2">
                    <Checkbox
                      id="private"
                      className="border-primary_colors-white_1 bg-primary_colors-white_2"
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        setIsPrivate(checked as boolean);
                      }}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="private"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Private Group
                      </label>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <ButtonWithLogo
            name="Create"
            variant="primary"
            classname="self-stretch"
            type="submit"
          />
        </form>
      </Form>
    </div>
  );
}

export default Page;
