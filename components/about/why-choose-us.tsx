"use client"

import { useLanguage } from "@/context/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function WhyChooseUs() {
  const { t } = useLanguage()

  const reasons = [
    "Experienced and certified professionals",
    "Personalized approach to each student's needs",
    "Comprehensive range of services",
    "Collaborative approach with parents and schools",
    "Evidence-based teaching methods",
    "Inclusive and supportive environment",
    "Continuous assessment and progress tracking",
    "Flexible scheduling options",
  ]

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            At Bright Side Educational Support, we are committed to providing the highest quality services for students
            with special needs.
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {reasons.map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <p>{reason}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

