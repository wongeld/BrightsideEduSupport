"use client"

import { useLanguage } from "@/context/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Briefcase, ExternalLink } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Vacancy } from "@/lib/vacancies"

interface VacancyDetailProps {
  vacancy: Vacancy
}

export default function VacancyDetail({ vacancy }: VacancyDetailProps) {
  const { t } = useLanguage()

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/vacancies" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToVacancies")}
            </Link>
          </Button>

          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                <Briefcase className="h-4 w-4 mr-1" />
                {vacancy.type || t("fullTime")}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-6">{vacancy.title}</h1>

              <div className="flex flex-wrap gap-6 mb-8">
                {vacancy.location && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{vacancy.location}</span>
                  </div>
                )}
                {vacancy.deadline && (
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>
                      {t("deadline")}: {formatDate(vacancy.deadline)}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold mb-4">Job Description</h2>
                  <div
                    className="prose prose-lg max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: vacancy.description }}
                  />
                </div>

                {vacancy.requirements && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Requirements</h2>
                    <div
                      className="prose prose-lg max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: vacancy.requirements }}
                    />
                  </div>
                )}

                {vacancy.google_form_link && (
                  <div className="pt-4">
                    <Button asChild size="lg">
                      <a
                        href={vacancy.google_form_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        Apply Now
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

