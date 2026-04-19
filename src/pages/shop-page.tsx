import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ListingCard } from "@/components/marketplace/listing-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useListings, type FoodListing } from "@/context/listings-context"

const sortOptions = [
  { value: "newest", label: "Newest listings" },
  { value: "expiring-soon", label: "Expiration date: soonest" },
  { value: "expiring-latest", label: "Expiration date: latest" },
  { value: "title-asc", label: "Title: A to Z" },
  { value: "title-desc", label: "Title: Z to A" },
] as const

type SortValue = (typeof sortOptions)[number]["value"]

export function ShopPage() {
  const { listings } = useListings()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortValue>("newest")

  const filteredAndSortedListings = useMemo<FoodListing[]>(() => {
    const query = searchQuery.trim().toLowerCase()
    const filteredListings = listings.filter((listing) =>
      listing.title.toLowerCase().includes(query)
    )
    const next = [...filteredListings]

    if (sortBy === "expiring-soon") {
      return next.sort(
        (a, b) =>
          new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()
      )
    }

    if (sortBy === "expiring-latest") {
      return next.sort(
        (a, b) =>
          new Date(b.expirationDate).getTime() - new Date(a.expirationDate).getTime()
      )
    }

    if (sortBy === "title-asc") {
      return next.sort((a, b) => a.title.localeCompare(b.title))
    }

    if (sortBy === "title-desc") {
      return next.sort((a, b) => b.title.localeCompare(a.title))
    }

    return next.sort(
      (a, b) => new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime()
    )
  }, [listings, searchQuery, sortBy])

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Browse Food Listings</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            type="search"
            placeholder="Search food by title, location, or keyword..."
            aria-label="Search food listings"
            className="h-10 sm:flex-1"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />

          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Sort by</p>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortValue)}>
              <SelectTrigger className="h-10 min-w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section aria-label="Food listings">
        {listings.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">No listings yet.</p>
            <Button asChild className="mt-4">
              <Link to="/sell">Post your first listing</Link>
            </Button>
          </div>
        ) : filteredAndSortedListings.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No listings match your search. Try a different title keyword.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedListings.map((listing) => (
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
