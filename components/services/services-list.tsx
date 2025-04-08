"use client"

import { useLanguage } from "@/context/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, BookOpen, Users, Briefcase, School, Building } from "lucide-react"
import { motion } from "framer-motion"

export default function ServicesList() {
  const { t } = useLanguage()

  const services = [
    {
      id: "therapeutic-support",
      icon: <Sparkles className="h-12 w-12 text-golden" />,
      title: t("service1Title"),
      description: t("service1Description"),
      details:
        "Our therapeutic support services include comprehensive assessments, speech and language therapy, Applied Behavior Analysis (ABA) therapy, occupational therapy, and physiotherapy. Our team of licensed therapists works closely with students, parents, and educators to develop personalized intervention plans that address each student's unique needs and goals.",
    },
    {
      id: "tutoring",
      icon: <BookOpen className="h-12 w-12 text-golden" />,
      title: t("service2Title"),
      description: t("service2Description"),
      details:
        "Our tutoring services are tailored to meet the specific learning needs and styles of each student. We offer one-on-one tutoring in all academic subjects, from kindergarten to university level. Our tutors are experienced in working with students with various learning differences, including ADHD, dyslexia, and autism spectrum disorders.",
    },
    {
      id: "caregiver-training",
      icon: <Users className="h-12 w-12 text-golden" />,
      title: t("service3Title"),
      description: t("service3Description"),
      details:
        "We provide comprehensive training programs for parents, teachers, and other professionals involved in the education and care of students with special needs. Our workshops cover a wide range of topics, including behavior management strategies, communication techniques, and inclusive teaching practices.",
    },
    {
      id: "transition-planning",
      icon: <Briefcase className="h-12 w-12 text-golden" />,
      title: t("service4Title"),
      description: t("service4Description"),
      details:
        "Our transition planning services help students with special needs prepare for life after school. We assist with college applications, vocational training programs, job searches, and independent living skills. Our goal is to ensure a smooth transition and set students up for success in their chosen path.",
    },
    {
      id: "iep",
      icon: <School className="h-12 w-12 text-golden" />,
      title: t("service5Title"),
      description: t("service5Description"),
      details:
        "We develop comprehensive Individualized Education Programs (IEPs) that outline specific learning goals, accommodations, and support services for students with special needs. Our team works collaboratively with parents, educators, and therapists to create effective IEPs that address each student's unique strengths and challenges.",
    },
    {
      id: "inclusive-school",
      icon: <Building className="h-12 w-12 text-golden" />,
      title: t("service6Title"),
      description: t("service6Description"),
      details:
        "We partner with schools to enhance their special needs departments and create more inclusive learning environments. Our services include teacher training, curriculum adaptation, classroom modifications, and the implementation of evidence-based teaching strategies that benefit all students.",
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="space-y-16">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              id={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="scroll-mt-20"
            >
              <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="bg-muted p-4 rounded-lg md:mt-2">{service.icon}</div>
                  <div>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                    <CardDescription className="text-lg mt-2">{service.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.details}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

