import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  // Login state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register state
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerConfirm, setRegisterConfirm] = useState("")
  const [registerError, setRegisterError] = useState("")

  const handleLogin = (e: FormEvent) => {
    e.preventDefault()
    if (!loginEmail || !loginPassword) return
    // Mock login — swap for real auth later
    login({
      id: "user-1",
      name: "Andy Tran",
      email: loginEmail,
      avatarUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
      bio: "I love sharing extra homemade meals and fresh groceries before they go to waste. Usually available for same-day pickup in the afternoon.",
      memberSince: "Jan 2025",
      rating: 4.8,
    })
    toast.success("Welcome back!")
    navigate("/profile")
  }

  const handleRegister = (e: FormEvent) => {
    e.preventDefault()
    setRegisterError("")
    if (!registerName.trim()) return setRegisterError("Please enter your name.")
    if (!registerEmail.trim()) return setRegisterError("Please enter your email.")
    if (registerPassword.length < 6)
      return setRegisterError("Password must be at least 6 characters.")
    if (registerPassword !== registerConfirm)
      return setRegisterError("Passwords do not match.")

    // Mock register — swap for real auth later
    login({
      id: "user-" + Date.now(),
      name: registerName.trim(),
      email: registerEmail.trim(),
      memberSince: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      rating: 5.0,
    })
    toast.success("Account created! Welcome.")
    navigate("/profile")
  }

  const initials = registerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-16">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome to FoodShare</h1>
        <p className="text-sm text-muted-foreground">
          Sign in or create an account to start sharing food.
        </p>
      </div>

      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Sign in</TabsTrigger>
          <TabsTrigger value="register">Create account</TabsTrigger>
        </TabsList>

        {/* LOGIN */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sign in</CardTitle>
              <CardDescription>Enter your email and password to continue.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REGISTER */}
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create account</CardTitle>
              <CardDescription>Fill in your details to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleRegister}>
                {/* Avatar preview */}
                {registerName && (
                  <div className="flex justify-center pb-2">
                    <Avatar className="size-16">
                      <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                    </Avatar>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="reg-name">Full name</Label>
                  <Input
                    id="reg-name"
                    placeholder="Andy Tran"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="you@example.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-confirm">Confirm password</Label>
                  <Input
                    id="reg-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={registerConfirm}
                    onChange={(e) => setRegisterConfirm(e.target.value)}
                  />
                </div>

                {registerError && (
                  <p className="text-xs text-destructive">{registerError}</p>
                )}

                <Button type="submit" className="w-full">
                  Create account
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}