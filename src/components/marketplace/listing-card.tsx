import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import type { FoodListing } from "@/context/listings-context"

function getListingStatus(expirationDate: string, listedAt: string) {
  const now = new Date()
  const listed = new Date(listedAt)
  const oneDayMs = 24 * 60 * 60 * 1000

  const isNew = now.getTime() - listed.getTime() <= oneDayMs

  return { isNew }
}

type ListingCardProps = {
  listing: FoodListing
}

export function ListingCard({ listing }: ListingCardProps) {
  const { isNew } = getListingStatus(listing.expirationDate, listing.listedAt)

  return (
    <Link
      to={`/listing/${listing.id}`}
      className="block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
        <div className="relative">
          <img
            src={listing.image}
            alt={listing.title}
            className="h-36 w-full object-cover"
          />
          {isNew ? (
            <div className="absolute right-2 bottom-2">
              <Badge variant="secondary">New</Badge>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-0.5 p-3">
          <p className="truncate text-sm font-semibold">{listing.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {listing.location} · {listing.expirationDate}
          </p>
        </div>
      </div>
    </Link>
  )
}
