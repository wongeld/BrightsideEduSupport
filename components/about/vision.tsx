"use client"

import { useLanguage } from "@/context/language-context"
import Image from "next/image"
import { motion } from "framer-motion"

export default function Vision() {
  const { t } = useLanguage()

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="order-2 md:order-1"
          >
            <div className="relative">
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/10 rounded-lg -z-10"></div>
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Our Vision"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-1 md:order-2"
          >
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Our Vision</h2>
              <p className="text-muted-foreground">
                Our vision is to create a world where all students, regardless of their abilities or challenges, have
                equal access to quality education and the support they need to thrive.
              </p>
              <p className="text-muted-foreground">
                We envision a future where inclusive education is the norm, where differences are celebrated, and where
                every student has the opportunity to develop their unique talents and abilities to their fullest
                potential.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

