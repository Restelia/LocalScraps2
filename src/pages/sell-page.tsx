import { useState, type ChangeEvent, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useListings } from "@/context/listings-context"
import { toast } from "sonner"

type FormErrors = Partial<Record<"title" | "description" | "location" | "expirationDate", string>>

export function SellPage() {
  const navigate = useNavigate()
  const { addListing } = useListings()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})

  const previewTitle = title || "Your food title"
  const previewDescription =
    description || "Write a short description so buyers know what food is available."
  const previewLocation = location || "Add location"
  const previewExpiration = expirationDate
    ? new Date(expirationDate + "T12:00:00").toLocaleDateString()
    : "Set expiration date"

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FormErrors = {}
    if (!title.trim()) nextErrors.title = "Please enter a listing title."
    if (!description.trim()) nextErrors.description = "Please add a short description."
    if (!location.trim()) nextErrors.location = "Please add a pickup location."
    if (!expirationDate) {
      nextErrors.expirationDate = "Please select an expiration date."
    } else if (new Date(expirationDate + "T12:00:00").getTime() < Date.now() - 24 * 60 * 60 * 1000) {
      nextErrors.expirationDate = "Expiration date cannot be in the past."
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    addListing({
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      expirationDateIso: expirationDate,
      image: imageUrl,
    })
    toast.success("Listing posted! It is now live in Shop.")
    navigate("/")
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[1.2fr_1fr]">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Create a Food Listing</h2>
        <p className="text-sm text-muted-foreground">
          Add clear details so buyers can quickly decide and contact you.
        </p>
        <Card className="gap-0">
          <CardContent className="space-y-4 pt-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="food-title">Food title</Label>
                <Input
                  id="food-title"
                  placeholder="Ex: Fresh banana bread"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  aria-invalid={Boolean(errors.title)}
                />
                {errors.title ? <p className="text-xs text-destructive">{errors.title}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="food-image">Food image</Label>
                <Input id="food-image" type="file" accept="image/*" onChange={handleImageChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="food-description">Description</Label>
                <Textarea
                  id="food-description"
                  placeholder="Describe quantity, ingredients, or pickup notes..."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  aria-invalid={Boolean(errors.description)}
                />
                {errors.description ? (
                  <p className="text-xs text-destructive">{errors.description}</p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="food-location">Location</Label>
                  <Input
                    id="food-location"
                    placeholder="Ex: Downtown"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    aria-invalid={Boolean(errors.location)}
                  />
                  {errors.location ? (
                    <p className="text-xs text-destructive">{errors.location}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="food-expiration">Expiration date</Label>
                  <Input
                    id="food-expiration"
                    type="date"
                    value={expirationDate}
                    onChange={(event) => setExpirationDate(event.target.value)}
                    aria-invalid={Boolean(errors.expirationDate)}
                  />
                  {errors.expirationDate ? (
                    <p className="text-xs text-destructive">{errors.expirationDate}</p>
                  ) : null}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Post Listing
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Live Preview</h2>
        <p className="text-sm text-muted-foreground">
          This is how your listing will appear in the shop.
        </p>
        <Card className="overflow-hidden p-0">
          <div className="relative">
            <img
              src={
                imageUrl ||
                "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80"
              }
              alt={previewTitle}
              className="h-56 w-full object-cover"
            />
            <div className="absolute right-2 bottom-2">
              <Badge variant="secondary">New</Badge>
            </div>
          </div>
          <div className="flex flex-col gap-0.5 p-4">
            <p className="truncate text-base font-semibold">{previewTitle}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {previewLocation}
              {expirationDate
                ? ` · ${new Date(expirationDate + "T12:00:00").toLocaleDateString()}`
                : " · Set expiration date"}
            </p>
          </div>
        </Card>
      </section>
    </main>
  )
}