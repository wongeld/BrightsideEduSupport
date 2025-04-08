"use client";

import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Testimonials() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      content: t("testimonial1Content"),
      author: t("testimonial1Author"),
      role: t("testimonial1Role"),
      avatar: "/user1.png",
    },
    {
      content: t("testimonial2Content"),
      author: t("testimonial2Author"),
      role: t("testimonial2Role"),
      avatar: "/user2.png",
    },
    {
      content: t("testimonial3Content"),
      author: t("testimonial3Author"),
      role: t("testimonial3Role"),
      avatar: "/user3.png",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("testimonials")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("testimonialsDescription")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-none shadow-lg">
              <CardContent className="pt-10">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary text-white p-3 rounded-full">
                  <Quote className="h-6 w-6" />
                </div>
                <p className="text-lg text-center italic">
                  "{testimonials[activeIndex].content}"
                </p>
              </CardContent>
              <CardFooter className="flex flex-col items-center pb-8">
                <Avatar className="h-16 w-16 mb-2">
                  <AvatarImage
                    src={testimonials[activeIndex].avatar}
                    alt={testimonials[activeIndex].author}
                    className="object-cover w-full h-full rounded-full"
                  />
                  <AvatarFallback>
                    {testimonials[activeIndex].author.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center">
                  <h4 className="font-semibold">
                    {testimonials[activeIndex].author}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonials[activeIndex].role}
                  </p>
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-3 w-3 rounded-full transition-colors ${
                  index === activeIndex
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
