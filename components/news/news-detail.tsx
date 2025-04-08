"use client";

import { useLanguage } from "@/context/language-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { formatDate, getImageUrl } from "@/lib/utils";
import type { NewsItem } from "@/lib/news";

interface NewsDetailProps {
  news: NewsItem;
}

export default function NewsDetail({ news }: NewsDetailProps) {
  const { t } = useLanguage();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/news" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToNews")}
            </Link>
          </Button>

          <Card>
            {news.image_path && (
              <div className="relative h-[400px] w-full overflow-hidden">
                <Image
                  src={getImageUrl(news.image_path) || "/placeholder.svg"}
                  alt={news.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(news.created_at)}</span>
                </div>
                {news.author_id && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>Admin</span>
                  </div>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                {news.title}
              </h1>

              {news.excerpt && (
                <p className="text-lg text-muted-foreground mb-6">
                  {news.excerpt}
                </p>
              )}

              <div
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
