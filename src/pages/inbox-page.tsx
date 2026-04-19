import { useEffect, useMemo, useState, type ChangeEvent } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { XIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CURRENT_USER_ID } from "@/context/listings-context"
import { useMessages } from "@/context/messages-context"

function formatMessageTimestamp(value: string) {
  const date = new Date(value)
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  const timeLabel = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })

  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()

  if (isSameDay) return `Today ${timeLabel}`
  if (isYesterday) return `Yesterday ${timeLabel}`

  const dateLabel = date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  return `${dateLabel} ${timeLabel}`
}

function formatDayLabel(value: string) {
  const date = new Date(value)
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  if (isSameDay) return "Today"

  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  if (isYesterday) return "Yesterday"

  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
}

export function InboxPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const {
    contacts,
    conversations,
    getContactName,
    ensureConversation,
    sendMessage,
  } = useMessages()

  const initialContact = searchParams.get("contact") ?? contacts[0]?.id
  const [activeContactId, setActiveContactId] = useState(initialContact ?? "")
  const [draft, setDraft] = useState("")
  const [pendingImage, setPendingImage] = useState("")

  useEffect(() => {
    if (activeContactId) {
      ensureConversation(activeContactId)
    }
  }, [activeContactId, ensureConversation])

  const activeConversation = useMemo(
    () => conversations[activeContactId],
    [activeContactId, conversations]
  )

  const handleSelectContact = (contactId: string) => {
    setActiveContactId(contactId)
    navigate(`/inbox?contact=${contactId}`)
  }

  const handleSend = () => {
    if (!activeContactId || (!draft.trim() && !pendingImage)) return
    sendMessage(activeContactId, draft, pendingImage || undefined)
    setDraft("")
    setPendingImage("")
  }

  const handleUploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPendingImage(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const contactButtons = (
    <Card className="h-auto lg:h-[72vh]">
      <CardHeader>
        <CardTitle>Contacts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {contacts.map((contact) => {
          const conversation = conversations[contact.id]
          const lastMessage = conversation?.messages.at(-1)
          const previewText =
            lastMessage?.body ??
            (lastMessage?.imageUrl ? "Sent an image" : "No messages yet")
          const timeText = lastMessage ? formatMessageTimestamp(lastMessage.createdAt) : ""

          return (
            <Button
              key={contact.id}
              variant={activeContactId === contact.id ? "secondary" : "ghost"}
              className="h-auto w-full justify-start py-2 text-left"
              onClick={() => handleSelectContact(contact.id)}
            >
              <div className="w-full space-y-1">
                <p className="truncate text-sm font-medium">
                  {conversation?.listingTitle ?? `Listing with ${contact.name}`}
                </p>
                <p className="truncate text-xs text-muted-foreground">{contact.name}</p>
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span className="truncate">{previewText}</span>
                  <span className="shrink-0">{timeText}</span>
                </div>
              </div>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
      <section className="lg:hidden">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">Contacts</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {contacts.map((contact) => (
            <Button
              key={contact.id}
              variant={activeContactId === contact.id ? "secondary" : "outline"}
              className="shrink-0"
              onClick={() => handleSelectContact(contact.id)}
            >
              {contact.name}
            </Button>
          ))}
        </div>
      </section>

      <section className="hidden lg:block">
        {contactButtons}
      </section>

      <Card className="flex h-[72vh] flex-col">
        <CardHeader>
          <CardTitle>
            {activeContactId
              ? conversations[activeContactId]?.listingTitle
                ? `${conversations[activeContactId]?.listingTitle} · ${getContactName(activeContactId)}`
                : getContactName(activeContactId)
              : "Select a contact"}
          </CardTitle>
          {activeContactId ? (
            <p className="text-sm text-muted-foreground">
              Keep messages clear and confirm pickup details in chat.
            </p>
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <div className="flex-1 space-y-2 overflow-y-auto rounded-md border p-3">
            {activeConversation?.messages.length ? (
              activeConversation.messages.map((message, index) => {
                const isMe = message.fromId === CURRENT_USER_ID
                const previousMessage = activeConversation.messages[index - 1]
                const showDayLabel =
                  !previousMessage ||
                  formatDayLabel(previousMessage.createdAt) !==
                    formatDayLabel(message.createdAt)

                return (
                  <div key={message.id}>
                    {showDayLabel ? (
                      <div className="my-3 text-center text-xs text-muted-foreground">
                        {formatDayLabel(message.createdAt)}
                      </div>
                    ) : null}
                    <div
                      className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                        isMe
                          ? "ml-auto bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {message.body ? <p>{message.body}</p> : null}
                      {message.imageUrl ? (
                        <img
                          src={message.imageUrl}
                          alt="Message attachment"
                          className="mt-2 max-h-48 w-full rounded-md object-cover"
                        />
                      ) : null}
                      <p className="mt-1 text-[11px] opacity-80">
                        {formatMessageTimestamp(message.createdAt)}
                      </p>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                No messages yet. Start the conversation.
              </p>
            )}
          </div>

          <div className="space-y-2">
            {pendingImage ? (
              <Badge variant="outline" className="h-auto max-w-fit gap-2 px-2 py-1">
                <span className="max-w-48 truncate text-xs">Image ready to send</span>
                <button
                  type="button"
                  onClick={() => setPendingImage("")}
                  aria-label="Remove selected image"
                >
                  <XIcon className="size-3" />
                </button>
              </Badge>
            ) : null}
            <div className="flex items-center gap-2">
              <label className="inline-flex cursor-pointer items-center">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadImage}
                />
                <span className="rounded-md border px-3 py-1.5 text-sm">Upload image</span>
              </label>
              <Input
                placeholder="Type a message..."
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                    handleSend()
                  }
                }}
              />
              <Button onClick={handleSend} disabled={!activeContactId}>
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
