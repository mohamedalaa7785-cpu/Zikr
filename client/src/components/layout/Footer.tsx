import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/hooks/custom/useLanguage";

const footerSections = {
  ar: {
    about: "عن ZIKR",
    aboutDesc: "منصة إسلامية روحية فاخرة تجمع بين القرآن الكريم والأحاديث الشريفة والقصص الإسلامية والمساعد الذكي والإذاعة الإسلامية.",
    quickLinks: "روابط سريعة",
    company: "الشركة",
    legal: "القانوني",
    contact: "تواصل معنا",
    rights: "جميع الحقوق محفوظة © 2026 ZIKR | ذِكرٌ",
    links: {
      home: "الرئيسية",
      quran: "القرآن",
      hadith: "الأحاديث",
      stories: "القصص",
      aiAssistant: "المساعد الذكي",
      radio: "الإذاعة",
      scholars: "العلماء",
      about: "عن ZIKR",
      contact: "اتصل بنا",
      privacy: "سياسة الخصوصية",
      terms: "شروط الاستخدام",
      faq: "الأسئلة الشائعة",
    },
  },
  en: {
    about: "About ZIKR",
    aboutDesc: "A premium Islamic spiritual platform combining the Quran, Hadith, Islamic stories, AI assistant, and Islamic radio.",
    quickLinks: "Quick Links",
    company: "Company",
    legal: "Legal",
    contact: "Contact Us",
    rights: "All rights reserved © 2026 ZIKR | ذِكرٌ",
    links: {
      home: "Home",
      quran: "Quran",
      hadith: "Hadith",
      stories: "Stories",
      aiAssistant: "AI Assistant",
      radio: "Radio",
      scholars: "Scholars",
      about: "About ZIKR",
      contact: "Contact Us",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      faq: "FAQ",
    },
  },
};

export default function Footer() {
  const { language, direction } = useLanguage();
  const content = footerSections[language as keyof typeof footerSections] || footerSections.ar;

  return (
    <footer className="bg-zikr-black border-t border-zikr-gold/20 mt-16" dir={direction}>
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold text-zikr-gold mb-4">{content.about}</h3>
            <p className="text-zikr-beige/70 text-sm leading-relaxed">
              {content.aboutDesc}
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-zikr-gold hover:text-zikr-gold-light transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="text-zikr-gold hover:text-zikr-gold-light transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
                </svg>
              </a>
              <a href="#" className="text-zikr-gold hover:text-zikr-gold-light transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.736 0-9.646h3.554v1.364c.429-.647 1.3-1.573 3.177-1.573 2.32 0 4.061 1.52 4.061 4.784l-.001 5.071zM5.337 8.855c-1.144 0-1.915-.762-1.915-1.715 0-.955.77-1.715 1.946-1.715 1.177 0 1.915.76 1.915 1.715 0 .953-.738 1.715-1.946 1.715zm1.6 11.597H3.738V9.859h3.199v10.593zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-zikr-gold mb-4">{content.quickLinks}</h3>
            <ul className="space-y-2">
              {[
                { label: content.links.home, href: "/" },
                { label: content.links.quran, href: "/quran" },
                { label: content.links.hadith, href: "/hadith" },
                { label: content.links.stories, href: "/stories" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-zikr-beige/70 hover:text-zikr-gold transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-bold text-zikr-gold mb-4">{content.company}</h3>
            <ul className="space-y-2">
              {[
                { label: content.links.about, href: "/about" },
                { label: content.links.contact, href: "/contact" },
                { label: content.links.faq, href: "/faq" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-zikr-beige/70 hover:text-zikr-gold transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold text-zikr-gold mb-4">{content.legal}</h3>
            <ul className="space-y-2">
              {[
                { label: content.links.privacy, href: "/privacy" },
                { label: content.links.terms, href: "/terms" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-zikr-beige/70 hover:text-zikr-gold transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="border-t border-zikr-gold/20 pt-8 mb-8">
          <h3 className="text-lg font-bold text-zikr-gold mb-4">{content.contact}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-zikr-gold" />
              <a href="mailto:contact@zikr.app" className="text-zikr-beige/70 hover:text-zikr-gold transition-colors text-sm">
                contact@zikr.app
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-zikr-gold" />
              <a href="tel:+1234567890" className="text-zikr-beige/70 hover:text-zikr-gold transition-colors text-sm">
                +1 (234) 567-890
              </a>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-zikr-gold" />
              <span className="text-zikr-beige/70 text-sm">
                Global
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zikr-gold/20 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-zikr-beige/50 text-sm">
            {content.rights}
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-zikr-beige/50 hover:text-zikr-gold transition-colors text-sm">
              {language === "ar" ? "سياسة الخصوصية" : "Privacy"}
            </a>
            <a href="#" className="text-zikr-beige/50 hover:text-zikr-gold transition-colors text-sm">
              {language === "ar" ? "شروط الاستخدام" : "Terms"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
