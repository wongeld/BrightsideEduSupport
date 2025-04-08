"use client"

import { useLanguage } from "@/context/language-context"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Sparkles, BookOpen, Users, Briefcase, School, Building } from "lucide-react"
import { motion } from "framer-motion"

export default function Services() {
  const { t } = useLanguage()

  const services = [
    {
      icon: <Sparkles className="h-8 w-8 text-golden" />,
      title: t("service1Title"),
      description: t("service1Description"),
      link: "/services#therapeutic-support",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-golden" />,
      title: t("service2Title"),
      description: t("service2Description"),
      link: "/services#tutoring",
    },
    {
      icon: <Users className="h-8 w-8 text-golden" />,
      title: t("service3Title"),
      description: t("service3Description"),
      link: "/services#caregiver-training",
    },
    {
      icon: <Briefcase className="h-8 w-8 text-golden" />,
      title: t("service4Title"),
      description: t("service4Description"),
      link: "/services#transition-planning",
    },
    {
      icon: <School className="h-8 w-8 text-golden" />,
      title: t("service5Title"),
      description: t("service5Description"),
      link: "/services#iep",
    },
    {
      icon: <Building className="h-8 w-8 text-golden" />,
      title: t("service6Title"),
      description: t("service6Description"),
      link: "/services#inclusive-school",
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("ourServices")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("servicesDescription")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="mb-4">{service.icon}</div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto pt-4">
                  <Button asChild variant="ghost" className="p-0 h-auto hover:bg-transparent">
                    <Link href={service.link} className="group flex items-center text-primary">
                      {t("learnMore")}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild className="h-11 px-8 py-2 text-base">
            <Link href="/services">{t("viewAllServices")}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

