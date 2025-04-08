"use client"

import { useLanguage } from "@/context/language-context"
import Image from "next/image"
import { motion } from "framer-motion"

export default function Mission() {
  const { t } = useLanguage()

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground">
                At Bright Side Educational Support, our mission is to provide comprehensive and specialized services for
                students with special needs, creating inclusive learning environments and empowering students to succeed
                academically, socially, and emotionally.
              </p>
              <p className="text-muted-foreground">
                We are dedicated to breaking down barriers to education and ensuring that every student, regardless of
                their abilities or challenges, has access to the support and resources they need to reach their full
                potential.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-lg -z-10"></div>
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Our Mission"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

