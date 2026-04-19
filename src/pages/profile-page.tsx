import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ListingCard } from "@/components/marketplace/listing-card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CURRENT_USER_ID, useListings } from "@/context/listings-context"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

export function ProfilePage() {
  const { listings } = useListings()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const myListings = useMemo(
    () => listings.filter((l) => l.sellerId === CURRENT_USER_ID),
    [listings]
  )

  const handleLogout = () => {
    logout()
    toast.success("You've been signed out.")
    navigate("/login")
  }

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?"

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <Avatar className="size-24">
              <AvatarImage src={user?.avatarUrl} alt="Profile" />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {user?.name ?? "Your Name"}
                </h1>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Sign out
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Sign out?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You'll need to sign back in to post or manage listings.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>Sign out</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">Rating {user?.rating ?? 5.0}/5</Badge>
                <Badge variant="outline">Member since {user?.memberSince ?? "—"}</Badge>
              </div>

              {user?.bio && (
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {user.bio}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Current Listings</h2>
        {myListings.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You don&apos;t have any active listings yet. Post a food item from the Sell tab
            to see it here and on the shop.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myListings.map((listing) => (
              <li key={listing.id}>
                <ListingCard listing={listing} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}