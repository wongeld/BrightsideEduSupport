"use client";

import { useLanguage } from "@/context/language-context";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Briefcase, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate, truncateText } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { Vacancy } from "@/lib/vacancies";

export default function VacanciesList() {
  const { t, language } = useLanguage();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVacancies() {
      try {
        const response = await fetch(`/api/vacancies?language=${language}`);
        if (!response.ok) throw new Error("Failed to fetch vacancies");
        const data = await response.json();
        setVacancies(data);
      } catch (error) {
        console.error("Error fetching vacancies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVacancies();
  }, [language]);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="h-6 bg-muted animate-pulse rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted animate-pulse rounded w-full mb-2" />
                  <div className="h-4 bg-muted animate-pulse rounded w-full mb-2" />
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                </CardContent>
                <CardFooter>
                  <div className="h-10 bg-muted animate-pulse rounded w-1/3" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {vacancies.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vacancies.map((vacancy, index) => (
              <motion.div
                key={vacancy.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-3">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {vacancy.type || t("fullTime")}
                    </div>
                    <h3 className="text-xl font-bold">{vacancy.title}</h3>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-3">
                    {vacancy.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{vacancy.location}</span>
                      </div>
                    )}
                    {vacancy.deadline && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {t("deadline")}: {formatDate(vacancy.deadline)}
                        </span>
                      </div>
                    )}
                    {vacancy.description && (
                      <p className="text-muted-foreground">
                        {truncateText(
                          vacancy.description.replace(/<[^>]*>?/gm, ""),
                          150
                        )}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      variant="ghost"
                      className="p-0 h-auto hover:bg-transparent"
                    >
                      <Link
                        href={`/vacancies/${vacancy.slug}`}
                        className="group flex items-center text-primary"
                      >
                        {t("viewDetails")}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p>{t("noVacanciesAvailable")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
