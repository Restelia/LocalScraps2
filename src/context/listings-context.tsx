import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

/** Logged-in user id for demo; listings from Sell use this. */
export const CURRENT_USER_ID = "me"

export type FoodListing = {
  id: string
  title: string
  image: string
  description: string
  location: string
  expirationDate: string
  listedAt: string
  sellerId: string
  sellerName: string
}

const SEED_LISTINGS: FoodListing[] = [
  {
    id: "1",
    title: "Fresh Sourdough Loaf",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
    description: "Baked this morning. Soft inside, crusty outside.",
    location: "Downtown",
    expirationDate: "Apr 17, 2026",
    listedAt: "Apr 14, 2026",
    sellerId: "seller-1",
    sellerName: "Maya Chen",
  },
  {
    id: "2",
    title: "Organic Veggie Mix",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    description: "Carrots, kale, and peppers from local farm pickup.",
    location: "West End",
    expirationDate: "Apr 16, 2026",
    listedAt: "Apr 12, 2026",
    sellerId: "seller-2",
    sellerName: "Jordan Lee",
  },
  {
    id: "3",
    title: "Homemade Pasta Meal",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80",
    description: "Ready-to-heat tomato basil pasta, serves two.",
    location: "East Side",
    expirationDate: "Apr 15, 2026",
    listedAt: "Apr 15, 2026",
    sellerId: "seller-3",
    sellerName: "Sam Rivera",
  },
  {
    id: "4",
    title: "Chicken Burrito Bowl",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    description: "Balanced bowl with rice, beans, chicken, and salsa.",
    location: "North Market",
    expirationDate: "Apr 16, 2026",
    listedAt: "Apr 13, 2026",
    sellerId: "seller-1",
    sellerName: "Maya Chen",
  },
  {
    id: "5",
    title: "Berry Yogurt Parfait",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
    description: "Greek yogurt with berries and granola topping.",
    location: "University District",
    expirationDate: "Apr 15, 2026",
    listedAt: "Apr 11, 2026",
    sellerId: "seller-2",
    sellerName: "Jordan Lee",
  },
  {
    id: "6",
    title: "Vegetable Fried Rice",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
    description: "Quick meal prep tray with mixed vegetables and rice.",
    location: "South Loop",
    expirationDate: "Apr 17, 2026",
    listedAt: "Apr 10, 2026",
    sellerId: "seller-3",
    sellerName: "Sam Rivera",
  },
]

export type AddListingInput = {
  title: string
  description: string
  location: string
  /** HTML date input value `YYYY-MM-DD` */
  expirationDateIso: string
  image: string
}

function formatShortDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

type ListingsContextValue = {
  listings: FoodListing[]
  addListing: (input: AddListingInput) => void
}

const ListingsContext = createContext<ListingsContextValue | null>(null)

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<FoodListing[]>(() => [...SEED_LISTINGS])

  const addListing = useCallback((input: AddListingInput) => {
    const now = new Date()
    const exp = input.expirationDateIso
      ? new Date(input.expirationDateIso + "T12:00:00")
      : now

    const newItem: FoodListing = {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      description: input.description.trim(),
      location: input.location.trim(),
      image:
        input.image ||
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
      expirationDate: formatShortDate(exp),
      listedAt: formatShortDate(now),
      sellerId: CURRENT_USER_ID,
      sellerName: "Andy Tran",
    }

    setListings((prev) => [newItem, ...prev])
  }, [])

  const value = useMemo(
    () => ({
      listings,
      addListing,
    }),
    [listings, addListing]
  )

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>
}

export function useListings() {
  const ctx = useContext(ListingsContext)
  if (!ctx) {
    throw new Error("useListings must be used within ListingsProvider")
  }
  return ctx
}
