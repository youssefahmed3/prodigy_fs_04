"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerFormSchema, signinFormSchema } from "@/lib/validators";
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
import { createUser } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import ButtonWithLogo from "@/components/ButtonWithLogo";

function Page() {
  const router = useRouter();

  useEffect(() => {});

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    if (values.password !== values.confirmPassword) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    const valuesWithImage = {
      ...values,
      avatar: ""
    }

    const responseRegister = await createUser(valuesWithImage);
    if (responseRegister.error === null) {
      router.replace("/login");
    } else {
      // Handle registration error
      if (
        responseRegister.error.includes(
          "E11000 duplicate key error collection: test.users index: email_1 dup"
        )
      ) {
        form.setError("email", {
          type: "manual",
          message: "Email already registered",
        });
      } else {
        form.setError("username", {
          type: "manual",
          message: "Username already exists",
        });
      }
    }
    console.log(responseRegister);
  }

  return (
    <div className="flex w-[100%] max-h-min justify-center items-center my-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 items-center flex flex-col w-[300px]"
        >
          <h1 className="font-mono font-bold text-2xl">Register to Chat App</h1>

          <div className="flex flex-col gap-2 w-[100%]">
            <AuthButton
              name="Github"
              image={<GitHubLogo />}
              onClick={() => signIn('github')}
              classname="bg-primary_colors-github-dark text-primary_colors-google-white"
            />

            <AuthButton
              name="Google"
              image={<GoogleLogo />}
              onClick={() => signIn('google')}
              classname="bg-primary_colors-google-white text-primary_colors-github-dark hover:bg-primary_colors-github-dark hover:text-primary_colors-github-white"
            />
          </div>
          <hr />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-[100%]">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input className="text-primary_colors-black_1" placeholder="Username...." {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-[100%]">
                <FormLabel>Confirm Password</FormLabel>
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
          {/* <Button type="submit" className="w-[100%]">
            Register
          </Button> */}
          <ButtonWithLogo name="Register" classname="w-[100%]" type="submit" variant="primary" />


          <p>
            Already Have an Account ?{" "}
            <span
              className="font-bold cursor-pointer"
              onClick={() => router.replace("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </Form>
    </div>
  );
}

export default Page;
