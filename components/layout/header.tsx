"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "am" : "en");
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  // Prevent hydration errors by not rendering until client-side
  if (!mounted) {
    return <div className="h-16"></div>; // Placeholder with same height as header
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2"
            onClick={closeMenu}
          >
            <div className="relative h-10 w-10">
              <Image
                src="/logo.png"
                alt="Bright Side Logo"
                fill
                className="object-contain rounded"
              />
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">
              {t("brightSide")}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/") ? "text-primary" : "text-foreground"
              )}
            >
              {t("home")}
            </Link>
            <Link
              href="/about"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/about") ? "text-primary" : "text-foreground"
              )}
            >
              {t("about")}
            </Link>
            <Link
              href="/services"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/services") ? "text-primary" : "text-foreground"
              )}
            >
              {t("services")}
            </Link>
            <Link
              href="/news"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/news") ? "text-primary" : "text-foreground"
              )}
            >
              {t("news")}
            </Link>
            <Link
              href="/blog"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/blog") ? "text-primary" : "text-foreground"
              )}
            >
              {t("blog")}
            </Link>
            <Link
              href="/vacancies"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/vacancies") ? "text-primary" : "text-foreground"
              )}
            >
              {t("vacancies")}
            </Link>
            <Link
              href="/contact"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/contact") ? "text-primary" : "text-foreground"
              )}
            >
              {t("contact")}
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="hidden sm:flex"
            >
              {language === "en" ? "አማርኛ" : "English"}
            </Button>
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/") ? "text-primary" : "text-foreground"
                )}
                onClick={closeMenu}
              >
                {t("home")}
              </Link>
              <Link
                href="/about"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/about") ? "text-primary" : "text-foreground"
                )}
                onClick={closeMenu}
              >
                {t("about")}
              </Link>
              <Link
                href="/services"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/services") ? "text-primary" : "text-foreground"
                )}
                onClick={closeMenu}
              >
                {t("services")}
              </Link>
              <Link
                href="/news"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/news") ? "text-primary" : "text-foreground"
                )}
                onClick={closeMenu}
              >
                {t("news")}
              </Link>
              <Link
                href="/blog"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/blog") ? "text-primary" : "text-foreground"
                )}
                onClick={closeMenu}
              >
                {t("blog")}
              </Link>
              <Link
                href="/vacancies"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/vacancies") ? "text-primary" : "text-foreground"
                )}
                onClick={closeMenu}
              >
                {t("vacancies")}
              </Link>
              <Link
                href="/contact"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/contact") ? "text-primary" : "text-foreground"
                )}
                onClick={closeMenu}
              >
                {t("contact")}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="justify-start px-0"
              >
                {language === "en" ? "አማርኛ" : "English"}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
