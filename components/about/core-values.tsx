"use client"

import { useLanguage } from "@/context/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Lightbulb, Award } from "lucide-react"
import { motion } from "framer-motion"

export default function CoreValues() {
  const { t } = useLanguage()

  const values = [
    {
      icon: <Heart className="h-10 w-10 text-golden" />,
      title: t("coreValue1Title"),
      description: t("coreValue1Description"),
    },
    {
      icon: <Users className="h-10 w-10 text-golden" />,
      title: t("coreValue2Title"),
      description: t("coreValue2Description"),
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-golden" />,
      title: t("coreValue3Title"),
      description: t("coreValue3Description"),
    },
    {
      icon: <Award className="h-10 w-10 text-golden" />,
      title: t("coreValue4Title"),
      description: t("coreValue4Description"),
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("ourCoreValues")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("coreValuesDescription")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <div className="mb-4">{value.icon}</div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

