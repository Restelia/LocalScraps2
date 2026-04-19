import { useMemo } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CURRENT_USER_ID, useListings } from "@/context/listings-context"
import { useMessages } from "@/context/messages-context"

export function ListingDetailsPage() {
  const { listingId } = useParams()
  const navigate = useNavigate()
  const { listings } = useListings()
  const { ensureConversation } = useMessages()

  const listing = useMemo(
    () => listings.find((item) => item.id === listingId),
    [listingId, listings]
  )

  if (!listing) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-8">
        <p className="text-sm text-muted-foreground">Listing not found.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/">Back to Shop</Link>
        </Button>
      </main>
    )
  }

  const isOwnListing = listing.sellerId === CURRENT_USER_ID

  const handleContactSeller = () => {
    ensureConversation(listing.sellerId, listing)
    navigate(`/inbox?contact=${listing.sellerId}`)
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[1.4fr_1fr]">
      <Card className="gap-0 overflow-hidden">
        <img
          src={listing.image}
          alt={listing.title}
          className="h-72 w-full object-cover"
        />
        <CardHeader className="pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Fresh Listing</Badge>
          </div>
          <CardTitle className="text-3xl">{listing.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-base">
            <span className="font-medium">Location:</span> {listing.location}
          </p>
          <p className="text-base">
            <span className="font-medium">Expiration date:</span>{" "}
            {listing.expirationDate}
          </p>
          <p className="text-base">
            <span className="font-medium">Seller:</span> {listing.sellerName}
          </p>
          <p className="text-base">
            <span className="font-medium">Listed on:</span> {listing.listedAt}
          </p>
          <p className="pt-2 text-base text-muted-foreground">
            {listing.description}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interested in this listing?</CardTitle>
          <CardDescription>
            Message {listing.sellerName} to ask availability, pickup time, and
            portion details.
          </CardDescription>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">Seller rating 4.8</Badge>
            <Badge variant="outline">Member since Jan 2025</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full"
            onClick={handleContactSeller}
            disabled={isOwnListing}
          >
            {isOwnListing ? "This is your listing" : "Contact Seller"}
          </Button>
          <Button variant="outline" className="w-full">
            Save Listing
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link to="/">Back to Shop</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
