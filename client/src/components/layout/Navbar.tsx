import { useState } from "react";
import { useLocation } from "wouter";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage } from "@/hooks/custom/useLanguage";
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES } from "@/lib/i18n/config";

const navLinks = [
  { label: "الرئيسية", labelEn: "Home", path: "/" },
  { label: "القرآن", labelEn: "Quran", path: "/quran" },
  { label: "الأحاديث", labelEn: "Hadith", path: "/hadith" },
  { label: "القصص", labelEn: "Stories", path: "/stories" },
  { label: "المساعد الذكي", labelEn: "AI Assistant", path: "/ai-assistant" },
  { label: "الإذاعة", labelEn: "Radio", path: "/radio" },
  { label: "العلماء", labelEn: "Scholars", path: "/scholars" },
];

export default function Navbar() {
  const [location] = useLocation();
  const { language, setLanguage, direction } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-zikr-black/95 backdrop-blur-md border-b border-zikr-gold/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-zikr-gold">
              ذِكرٌ
            </div>
            <div className="hidden sm:block text-sm text-zikr-gold/70">
              ZIKR
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-zikr-gold"
                    : "text-zikr-beige hover:text-zikr-gold"
                }`}
              >
                {language === "ar" ? link.label : link.labelEn}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLanguage("ar")}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  language === "ar"
                    ? "bg-zikr-gold text-zikr-black"
                    : "text-zikr-beige hover:bg-zikr-gold/10"
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  language === "en"
                    ? "bg-zikr-gold text-zikr-black"
                    : "text-zikr-beige hover:bg-zikr-gold/10"
                }`}
              >
                English
              </button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-zikr-gold hover:bg-zikr-gold/10"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={direction === "rtl" ? "left" : "right"}
                className="bg-zikr-navy border-zikr-gold/20"
              >
                <SheetHeader>
                  <SheetTitle className="text-zikr-gold">القائمة</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.path}>
                      <a
                        href={link.path}
                        className={`text-sm font-medium transition-colors ${
                          isActive(link.path)
                            ? "text-zikr-gold"
                            : "text-zikr-beige hover:text-zikr-gold"
                        }`}
                      >
                        {language === "ar" ? link.label : link.labelEn}
                      </a>
                    </SheetClose>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
