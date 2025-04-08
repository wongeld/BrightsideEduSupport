"use client"

import { useLanguage } from "@/context/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactInfo() {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t("getInTouch")}</h2>
      <p className="text-muted-foreground">{t("contactDescription")}</p>

      <div className="space-y-4">
        <Card>
          <CardContent className="flex items-start space-x-4 p-6">
            <MapPin className="h-6 w-6 text-golden shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium">Address</h3>
              <p className="text-muted-foreground">Bole bora kids mall 2nd floor 211</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start space-x-4 p-6">
            <Phone className="h-6 w-6 text-golden shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium">Phone</h3>
              <p className="text-muted-foreground">+251 97 417 5344</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start space-x-4 p-6">
            <Mail className="h-6 w-6 text-golden shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-muted-foreground">info@brightside.edu.et</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start space-x-4 p-6">
            <Clock className="h-6 w-6 text-golden shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium">Working Hours</h3>
              <p className="text-muted-foreground">Monday - Friday: 8:30 AM - 5:30 PM</p>
              <p className="text-muted-foreground">Saturday: 9:00 AM - 1:00 PM</p>
              <p className="text-muted-foreground">Sunday: Closed</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

