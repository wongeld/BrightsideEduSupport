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
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate, getImageUrl, truncateText } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { NewsItem } from "@/lib/news";

export default function NewsList() {
  const { t, language } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch(`/api/news?language=${language}`);
        if (!response.ok) throw new Error("Failed to fetch news");
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [language]);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <Card key={index} className="h-full">
                <div className="h-48 bg-muted animate-pulse" />
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
        {news.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={
                        getImageUrl(item.image_path) ||
                        "/placeholder.svg?height=400&width=600"
                      }
                      alt={item.title}
                      fill
                      className="object-contain transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground">
                      {item.excerpt
                        ? truncateText(item.excerpt, 150)
                        : truncateText(
                            item.content.replace(/<[^>]*>?/gm, ""),
                            150
                          )}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      variant="ghost"
                      className="p-0 h-auto hover:bg-transparent"
                    >
                      <Link
                        href={`/news/${item.slug}`}
                        className="group flex items-center text-primary"
                      >
                        {t("readMore")}
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
            <p>{t("noNewsAvailable")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
