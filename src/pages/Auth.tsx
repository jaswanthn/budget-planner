import { useState } from "react";
import { signIn, signUp } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");

  async function handleSubmit() {
    try {
      setError("");
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      window.location.reload();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <Card className="max-w-sm mx-auto mt-20">
      <CardHeader>
        <CardTitle>
          {mode === "login" ? "Login" : "Create account"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        <Button className="w-full" onClick={handleSubmit}>
          {mode === "login" ? "Login" : "Sign up"}
        </Button>
        <p
          className="text-xs text-center text-muted-foreground cursor-pointer"
          onClick={() =>
            setMode(mode === "login" ? "signup" : "login")
          }
        >
          {mode === "login"
            ? "Create an account"
            : "Already have an account?"}
        </p>
      </CardContent>
    </Card>
  );
}
