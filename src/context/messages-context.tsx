import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { CURRENT_USER_ID, type FoodListing } from "@/context/listings-context"
import { useEffect, useRef } from "react"

type Contact = {
  id: string
  name: string
}

type Message = {
  id: string
  fromId: string
  body?: string
  imageUrl?: string
  createdAt: string
}

type Conversation = {
  contactId: string
  listingId?: string
  listingTitle?: string
  sellerName?: string
  messages: Message[]
}

const CONTACTS: Contact[] = [
  { id: CURRENT_USER_ID, name: "Andy Tran" },
  { id: "seller-1", name: "Maya Chen" },
  { id: "seller-2", name: "Jordan Lee" },
  { id: "seller-3", name: "Sam Rivera" },
]

const INITIAL_CONVERSATIONS: Record<string, Conversation> = {
  "seller-1": {
    contactId: "seller-1",
    listingId: "1",
    listingTitle: "Fresh Sourdough Loaf",
    sellerName: "Maya Chen",
    messages: [
      {
        id: "msg-1",
        fromId: "seller-1",
        body: "Hey! Let me know if you want pickup details.",
        createdAt: new Date().toISOString(),
      },
    ],
  },
  "seller-2": {
    contactId: "seller-2",
    listingId: "2",
    listingTitle: "Organic Veggie Mix",
    sellerName: "Jordan Lee",
    messages: [
      {
        id: "msg-2",
        fromId: "seller-2",
        body: "Hi! I can hold this for pickup tonight if needed.",
        createdAt: new Date().toISOString(),
      },
    ],
  },
  "seller-3": {
    contactId: "seller-3",
    listingId: "3",
    listingTitle: "Homemade Pasta Meal",
    sellerName: "Sam Rivera",
    messages: [
      {
        id: "msg-3",
        fromId: "seller-3",
        body: "Still available. Let me know what time works for you.",
        createdAt: new Date().toISOString(),
      },
    ],
  },
}

type MessagesContextValue = {
  contacts: Contact[]
  conversations: Record<string, Conversation>
  getContactName: (contactId: string) => string
  ensureConversation: (contactId: string, listing?: FoodListing) => void
  sendMessage: (contactId: string, body: string, imageUrl?: string) => void
}

const MessagesContext = createContext<MessagesContextValue | null>(null)

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Record<string, Conversation>>(
    INITIAL_CONVERSATIONS
  )

  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
      const ws = new WebSocket(
          `ws://localhost:8080?roomId=listing-1&role=buyer`
      )

      ws.onopen = () => {
          console.log("Connected to server")
      }

      ws.onmessage = (event) => {
          const { contactId, body } = JSON.parse(event.data)
          setConversations((prev) => {
              const current = prev[contactId] ?? { contactId, messages: [] }
              return {
                  ...prev,
                  [contactId]: {
                      ...current,
                      messages: [
                          ...current.messages,
                          {
                              id: crypto.randomUUID(),
                              fromId: contactId,
                              body,
                              createdAt: new Date().toISOString(),
                          },
                      ],
                  },
              }
          })
      }

      ws.onclose = () => {
          console.log("Disconnected from server")
      }

      wsRef.current = ws

      return () => ws.close()
  }, [])

  const getContactName = useCallback((contactId: string) => {
    return CONTACTS.find((c) => c.id === contactId)?.name ?? "Unknown User"
  }, [])

  const ensureConversation = useCallback((contactId: string, listing?: FoodListing) => {
    setConversations((prev) => {
      const existing = prev[contactId]
      if (existing) {
        if (!listing) return prev
        return {
          ...prev,
          [contactId]: {
            ...existing,
            listingId: listing.id,
            listingTitle: listing.title,
            sellerName: listing.sellerName,
          },
        }
      }
      const intro = listing
        ? `Hi ${listing.sellerName}, I am interested in "${listing.title}". Is it still available?`
        : "Hi! I am interested in your listing."
      return {
        ...prev,
        [contactId]: {
          contactId,
          listingId: listing?.id,
          listingTitle: listing?.title,
          sellerName: listing?.sellerName,
          messages: [
            {
              id: crypto.randomUUID(),
              fromId: CURRENT_USER_ID,
              body: intro,
              createdAt: new Date().toISOString(),
            },
          ],
        },
      }
    })
  }, [])

  const sendMessage = useCallback((contactId: string, body: string, imageUrl?: string) => {
      const trimmed = body.trim()
      if (!trimmed && !imageUrl) return

      // Send over WebSocket
      wsRef.current?.send(JSON.stringify({ contactId, body: trimmed }))

      // Still update local state so sender sees their own message
      setConversations((prev) => {
          const current = prev[contactId] ?? { contactId, messages: [] }
          return {
              ...prev,
              [contactId]: {
                  ...current,
                  messages: [
                      ...current.messages,
                      {
                          id: crypto.randomUUID(),
                          fromId: CURRENT_USER_ID,
                          body: trimmed || undefined,
                          imageUrl,
                          createdAt: new Date().toISOString(),
                      },
                  ],
              },
          }
      })
  }, [])

  const value = useMemo(
    () => ({
      contacts: CONTACTS.filter((c) => c.id !== CURRENT_USER_ID),
      conversations,
      getContactName,
      ensureConversation,
      sendMessage,
    }),
    [conversations, ensureConversation, getContactName, sendMessage]
  )

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>
}

export function useMessages() {
  const ctx = useContext(MessagesContext)
  if (!ctx) {
    throw new Error("useMessages must be used within MessagesProvider")
  }
  return ctx
}
