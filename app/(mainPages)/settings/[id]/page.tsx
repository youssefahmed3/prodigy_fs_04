"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SettingsSchema, signinFormSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import GoogleLogo from "@/assets/googleLogo";
import GitHubLogo from "@/assets/githubLogo";
import AuthButton from "@/components/authButton";
import { signIn } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import ButtonWithLogo from "@/components/ButtonWithLogo";
import { UserType } from "@/lib/models/user.model";
import { getUserById, updateUserById } from "@/lib/actions/user.actions";
import { toast } from "sonner";

function Page() {
  const router = useRouter();
  const { id } = useParams();
  const [userData, setUserData] = useState<UserType | null>(null);

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      username: "",
      email: "",
      avatar: "",
      password: "",
      provider: "",
    },
  });

  useEffect(() => {
    async function getUserData() {
      const response = await getUserById(id as string);
      console.log(response);

      setUserData(response);
    }
    getUserData();
  }, [id, form]);

  /*  async function onSubmit(values: z.infer<typeof employeeFormSchema>) {
    const submittedValues = {
      
      name: {
        firstName: values.firstName,
        lastName: values.lastName,
      },
      job_title: values.job_title,
      email: values.email,
      phone: values.phone,
      salary: Number(values.salary),
    };
    console.log("starts submitting");
    console.log(submittedValues);
    const response = await updateEmployee(submittedValues);
    if(response) {
        form.reset();
        router.push("/employees");
    }


    // router.push("/admin/products");
  } */

  useEffect(() => {
    if (userData) {
      form.reset({
        username: userData.username,
        email: userData.email,
        avatar: userData.avatar,
        password: userData.password,
        provider: userData.provider,
      });
    }
  }, [userData, form]);

  async function onSubmit(values: z.infer<typeof SettingsSchema>) {
    const response = await updateUserById(id as string, values);
    if (response) {
      form.reset();
      router.push("/");
      toast.success("User updated successfully");
    }
  }

  return (
    <div className="flex w-[100%] max-h-min justify-stretch my-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 flex flex-col items-stretch w-[300px]"
        >
          <h1 className="font-mono font-bold text-2xl">User Settings</h1>
          {/* <hr /> */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-[100%]">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="text-primary_colors-black_1"
                    placeholder="Enter a valid email address..."
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-[100%]">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    className="text-primary_colors-black_1"
                    placeholder="Enter Your Very Secure Password..."
                    {...field}
                    type="password"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          {/*  <Button type="submit" className="w-[100%]">
            Login
          </Button> */}
          <ButtonWithLogo
            name="Update"
            classname="w-[100%]"
            type="submit"
            variant="primary"
          />
          
        </form>
      </Form>
    </div>
  );
}

export default Page;
