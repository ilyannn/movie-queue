"use client";

import { Card, Input, Separator, Stack, Text } from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { toaster } from "@/components/ui/toaster";
import { Field, Button } from "@/components/ui";
import { githubLogin, passwordLogin } from "./actions";

interface LoginFormProps {}

export async function LoginForm({}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGithubLogin = async () => {
    try {
      setIsLoading(true);
      await githubLogin();
    } catch (error) {
      toaster.create({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to sign in",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password } = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };

    try {
      setIsLoading(true);
      await passwordLogin(email.value, password.value);
    } catch (error) {
      toaster.create({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to sign in",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card.Root>
        <Card.Header>
          <Card.Title fontSize="2xl" textAlign="center">
            Welcome Back
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Stack gap={4}>
            <Button
              onClick={handleGithubLogin}
              loading={isLoading}
              colorPalette="gray"
              width="full"
            >
              <FaGithub /> Continue with GitHub
            </Button>

            <Stack direction="row" align="center">
              <Separator />
              <Text fontSize="sm" whiteSpace="nowrap" color="gray.500">
                or continue with email
              </Text>
              <Separator />
            </Stack>

            <form onSubmit={handlePasswordLogin}>
              <Stack gap="8" maxW="sm" css={{ "--field-label-width": "96px" }}>
                <Field orientation="horizontal" label="Email">
                  <Input placeholder="me@example.com" flex="1" name="email" />
                </Field>
                <Field orientation="horizontal" label="Password">
                  <Input
                    type="password"
                    placeholder="Password"
                    flex="1"
                    name="password"
                  />
                </Field>

                <Button
                  type="submit"
                  colorPalette="blue"
                  width="full"
                  loading={isLoading}
                >
                  Sign In
                </Button>
              </Stack>
            </form>
          </Stack>
        </Card.Body>
      </Card.Root>
    </>
  );
}
