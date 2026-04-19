import { Routes, Route } from "react-router-dom"
import { HeaderNav } from "@/components/header-nav"
import { Toaster } from "@/components/ui/sonner"
import { ListingsProvider } from "@/context/listings-context"
import { MessagesProvider } from "@/context/messages-context"
import { InboxPage } from "@/pages/inbox-page"
import { ListingDetailsPage } from "@/pages/listing-details-page"
import { ProfilePage } from "@/pages/profile-page"
import { SellPage } from "@/pages/sell-page"
import { ShopPage } from "@/pages/shop-page"
import { AuthProvider } from "@/context/auth-context"
import { LoginPage } from "@/pages/login-page"

export function App() {
  return (
    <AuthProvider>
      <ListingsProvider>
        <MessagesProvider>
          <div className="min-h-svh bg-background text-foreground">
            <HeaderNav />
            <Routes>
              <Route path="/" element={<ShopPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/sell" element={<SellPage />} />
              <Route path="/listing/:listingId" element={<ListingDetailsPage />} />
              <Route path="/inbox" element={<InboxPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
            <Toaster position="top-right" richColors />
          </div>
        </MessagesProvider>
      </ListingsProvider>
    </AuthProvider>
  )
}

export default App
