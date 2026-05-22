import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/custom/useLanguage";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Mic, Users, Zap, Heart, Radio } from "lucide-react";

const homeContent = {
  ar: {
    heroTitle: "ذِكرٌ - تجربة روحية سينمائية",
    heroSubtitle: "منصة إسلامية فاخرة تجمع بين القرآن والأحاديث والقصص والمساعد الذكي والإذاعة الإسلامية",
    heroCtaMain: "ابدأ الآن",
    heroCtaSecondary: "اكتشف المزيد",
    sections: {
      quran: {
        title: "القرآن الكريم",
        description: "اقرأ واستمع إلى آيات القرآن الكريم مع التفسيرات العميقة والترجمات",
        icon: BookOpen,
      },
      hadith: {
        title: "الأحاديث الشريفة",
        description: "اكتشف الأحاديث النبوية الشريفة من أصح المصادر الإسلامية",
        icon: Mic,
      },
      stories: {
        title: "القصص الإسلامية",
        description: "استمع إلى قصص الأنبياء والصحابة والعلماء بطريقة سينمائية",
        icon: Heart,
      },
      aiAssistant: {
        title: "المساعد الذكي",
        description: "احصل على إجابات دينية موثوقة من مساعد ذكي مدرب على العلوم الإسلامية",
        icon: Zap,
      },
      radio: {
        title: "الإذاعة الإسلامية",
        description: "استمع إلى محاضرات وندوات إسلامية من علماء مشهورين",
        icon: Radio,
      },
      community: {
        title: "المجتمع",
        description: "تواصل مع مجتمع من المسلمين الملتزمين والمهتمين بالعلوم الإسلامية",
        icon: Users,
      },
    },
    features: {
      title: "المميزات الرئيسية",
      items: [
        { title: "تجربة روحية", description: "واجهة مصممة لتعميق التجربة الروحية" },
        { title: "محتوى موثوق", description: "محتوى من مصادر إسلامية موثوقة" },
        { title: "متعدد اللغات", description: "دعم العربية والإنجليزية ولغات أخرى" },
        { title: "تطبيق محمول", description: "تطبيق PWA قابل للتثبيت على الهاتف" },
      ],
    },
    cta: {
      title: "ابدأ رحلتك الروحية اليوم",
      description: "انضم إلى آلاف المستخدمين الذين يستخدمون ZIKR لتعميق علاقتهم بالإسلام",
      button: "ابدأ الآن",
    },
  },
  en: {
    heroTitle: "ZIKR - A Spiritual Cinematic Experience",
    heroSubtitle: "A premium Islamic platform combining the Quran, Hadith, Stories, AI Assistant, and Islamic Radio",
    heroCtaMain: "Get Started",
    heroCtaSecondary: "Learn More",
    sections: {
      quran: {
        title: "The Quran",
        description: "Read and listen to Quranic verses with deep explanations and translations",
        icon: BookOpen,
      },
      hadith: {
        title: "Hadith",
        description: "Discover authentic Hadith from the most reliable Islamic sources",
        icon: Mic,
      },
      stories: {
        title: "Islamic Stories",
        description: "Listen to stories of Prophets, Companions, and Scholars in a cinematic way",
        icon: Heart,
      },
      aiAssistant: {
        title: "AI Assistant",
        description: "Get reliable religious answers from an AI trained on Islamic sciences",
        icon: Zap,
      },
      radio: {
        title: "Islamic Radio",
        description: "Listen to lectures and seminars from renowned Islamic scholars",
        icon: Radio,
      },
      community: {
        title: "Community",
        description: "Connect with a community of committed Muslims interested in Islamic sciences",
        icon: Users,
      },
    },
    features: {
      title: "Key Features",
      items: [
        { title: "Spiritual Experience", description: "Interface designed to deepen spiritual experience" },
        { title: "Trusted Content", description: "Content from reliable Islamic sources" },
        { title: "Multilingual", description: "Support for Arabic, English, and other languages" },
        { title: "Mobile App", description: "PWA app installable on your phone" },
      ],
    },
    cta: {
      title: "Start Your Spiritual Journey Today",
      description: "Join thousands of users using ZIKR to deepen their relationship with Islam",
      button: "Get Started",
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function ZikrHome() {
  const { language, direction } = useLanguage();
  const content = homeContent[language as keyof typeof homeContent] || homeContent.ar;

  return (
    <div dir={direction} className="min-h-screen bg-zikr-black text-zikr-beige">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-b from-zikr-navy to-zikr-black">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-zikr-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-zikr-islamic-green/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient-gold">
              {content.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-zikr-beige/80 mb-8 leading-relaxed">
              {content.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-gold text-lg px-8 py-6 h-auto">
                {content.heroCtaMain}
              </Button>
              <Button className="btn-gold-outline text-lg px-8 py-6 h-auto">
                {content.heroCtaSecondary}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-32 bg-zikr-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-zikr-gold mb-4">
              {language === "ar" ? "المميزات الرئيسية" : "Key Features"}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-zikr-gold to-zikr-green-light mx-auto" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {Object.entries(content.sections).map(([key, section]) => {
              const Icon = section.icon;
              return (
                <motion.div key={key} variants={itemVariants}>
                  <Card className="card-cinematic hover:shadow-2xl transition-all duration-300 h-full">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-zikr-gold/20 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-zikr-gold" />
                      </div>
                      <CardTitle className="text-zikr-gold">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-zikr-beige/70">
                        {section.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-zikr-black to-zikr-navy">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-zikr-gold mb-4">
              {content.features.title}
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {content.features.items.map((item, index) => (
              <motion.div key={index} variants={itemVariants} className="glass p-8 rounded-lg">
                <h3 className="text-xl font-bold text-zikr-gold mb-2">{item.title}</h3>
                <p className="text-zikr-beige/70">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-zikr-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-zikr-gold mb-6">
              {content.cta.title}
            </h2>
            <p className="text-lg text-zikr-beige/80 mb-8">
              {content.cta.description}
            </p>
            <Button className="btn-gold text-lg px-8 py-6 h-auto">
              {content.cta.button}
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
