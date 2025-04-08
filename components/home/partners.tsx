"use client";

import { useLanguage } from "@/context/language-context";
import Image from "next/image";

export default function Partners() {
  const { t } = useLanguage();

  const partners = [
    { name: "MALD", logo: "/partners1.png" },
    { name: "VES", logo: "/partners4.png" },
    { name: "Champions Academy", logo: "/partners3.png" },
    { name: "Blue Health Ethiopia", logo: "/partners5.png" },
    { name: "Lemlem Nutrition Counsling", logo: "/partners2l.png" },
    { name: "ኑ ጭቃ እናቡካ", logo: "/partners6.png" },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("ourPartners")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("partnersDescription")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
          {partners.map((partner, index) => (
            <div key={index} className="flex items-center justify-center">
              <div className="bg-muted p-4 rounded-lg w-full h-32 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 100px, (max-width: 1200px) 150px, 200px"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
