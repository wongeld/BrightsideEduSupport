"use client";

import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function About() {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-lg -z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-lg -z-10"></div>
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src="/about.jpg"
                  alt="About Bright Side"
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
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-6">
              <div className="inline-block bg-primary/10 px-4 py-2 rounded-full text-primary font-medium">
                {t("aboutUs")}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                {t("aboutTitle")}
              </h2>
              <p className="text-muted-foreground">{t("aboutDescription")}</p>
              <p className="text-muted-foreground">{t("aboutDescription2")}</p>
              <Button asChild>
                <Link href="/about">{t("learnMore")}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
