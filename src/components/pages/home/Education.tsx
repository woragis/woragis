"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePublicEducation } from "@/hooks/usePublicEducation";
import {
  Section,
  Container,
  Card,
  ValorantBackground,
  GraduationCapIcon,
  AwardIcon,
  FileTextIcon,
  GlobeIcon,
  CalendarIcon,
} from "../../ui";
import type { Education as EducationType, EducationType as EducationTypeEnum } from "@/types/education";

export const Education: React.FC = () => {
  const { t } = useLanguage();
  
  // Fetch all visible education from the API
  const { data: education, isLoading, error } = usePublicEducation();

  // Group education by type (degrees vs certificates)
  const groupEducationByType = (education: EducationType[] | undefined) => {
    if (!education) return { degrees: [], certificates: [] };

    const degrees = education.filter(edu => edu.type === "degree");
    const certificates = education.filter(edu => edu.type === "certificate");

    return { degrees, certificates };
  };

  const { degrees, certificates } = groupEducationByType(education as EducationType[]);

  // Fallback data in case API fails or returns empty data
  const fallbackEducation = {
    degrees: [
      {
        id: "fallback-degree-1",
        title: "Bachelor of Computer Science",
        institution: "University of Technology",
        fieldOfStudy: "Computer Science",
        completionDate: new Date("2020-06-15"),
        grade: "3.8 GPA",
        pdfDocument: null,
        verificationUrl: null,
        skills: ["Programming", "Algorithms", "Data Structures"],
        type: "degree" as EducationTypeEnum,
        degreeLevel: "bachelor",
        description: "Comprehensive study of computer science fundamentals",
      }
    ],
    certificates: [
      {
        id: "fallback-cert-1",
        title: "AWS Certified Solutions Architect",
        institution: "Amazon Web Services",
        completionDate: new Date("2023-03-20"),
        certificateId: "AWS-CSA-12345",
        issuer: "Amazon Web Services",
        validityPeriod: "3 years",
        pdfDocument: null,
        verificationUrl: null,
        skills: ["Cloud Architecture", "AWS Services", "DevOps"],
        type: "certificate" as EducationTypeEnum,
        description: "Professional certification in cloud architecture",
      }
    ]
  };

  // Get education for display (either from API or fallback)
  const getDisplayEducation = () => {
    if (degrees.length > 0 || certificates.length > 0) {
      return { degrees, certificates };
    }
    return fallbackEducation;
  };

  const displayEducation = getDisplayEducation();

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const getDegreeIcon = (degreeLevel: string | null | undefined) => {
    switch (degreeLevel) {
      case 'bachelor':
        return '🎓';
      case 'master':
        return '🎓';
      case 'doctorate':
        return '🎓';
      case 'associate':
        return '🎓';
      case 'diploma':
        return '📜';
      default:
        return '🎓';
    }
  };

  return (
    <ValorantBackground variant="minimal" className="py-20">
      <Section
        id="education"
        title={t("education.title")}
        subtitle={t("education.subtitle")}
      >
        <Container>
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                {t("common.loading")}
              </p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400">
                {t("common.error")}: {error.message}
              </p>
            </div>
          )}
          
          {!isLoading && !error && (
            <div className="space-y-12">
              {/* Degrees Section */}
              {displayEducation.degrees.length > 0 && (
                <div>
                  <div className="flex items-center mb-8">
                    <GraduationCapIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {t("education.sections.degrees")}
                    </h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {displayEducation.degrees.map((degree, index) => (
                      <Card
                        key={degree.id || index}
                        variant="modern"
                        className="hover-lift hover-glow"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              <span className="text-3xl mr-3">
                                {getDegreeIcon(degree.degreeLevel)}
                              </span>
                              <div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                  {degree.title}
                                </h4>
                                <p className="text-slate-600 dark:text-slate-400 font-medium">
                                  {degree.institution}
                                </p>
                              </div>
                            </div>
                            {degree.pdfDocument && (
                              <a
                                href={degree.pdfDocument}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                                title="View PDF"
                              >
                                <FileTextIcon className="w-5 h-5" />
                              </a>
                            )}
                          </div>

                          <div className="space-y-3">
                            {degree.fieldOfStudy && (
                              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <span className="font-medium mr-2">Field:</span>
                                {degree.fieldOfStudy}
                              </div>
                            )}
                            
                            {degree.completionDate && (
                              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                Completed: {formatDate(degree.completionDate)}
                              </div>
                            )}
                            
                            {degree.grade && (
                              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <AwardIcon className="w-4 h-4 mr-2" />
                                Grade: {degree.grade}
                              </div>
                            )}

                            {degree.verificationUrl && (
                              <div className="flex items-center text-sm">
                                <a
                                  href={degree.verificationUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors flex items-center"
                                >
                                  <GlobeIcon className="w-4 h-4 mr-1" />
                                  Verify Credential
                                </a>
                              </div>
                            )}

                            {degree.skills && degree.skills.length > 0 && (
                              <div className="pt-2">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                  Skills Gained:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {(Array.isArray(degree.skills) ? degree.skills : (degree.skills ? [degree.skills] : [])).map((skill, skillIndex) => (
                                    <span
                                      key={skillIndex}
                                      className="inline-block px-2 py-1 text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-md"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificates Section */}
              {displayEducation.certificates.length > 0 && (
                <div>
                  <div className="flex items-center mb-8">
                    <AwardIcon className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {t("education.sections.certificates")}
                    </h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayEducation.certificates.map((cert, index) => (
                      <Card
                        key={cert.id || index}
                        variant="modern"
                        className="hover-lift hover-glow"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              <span className="text-3xl mr-3">📜</span>
                              <div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                  {cert.title}
                                </h4>
                                <p className="text-slate-600 dark:text-slate-400 font-medium">
                                  {cert.institution}
                                </p>
                              </div>
                            </div>
                            {cert.pdfDocument && (
                              <a
                                href={cert.pdfDocument}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
                                title="View PDF"
                              >
                                <FileTextIcon className="w-5 h-5" />
                              </a>
                            )}
                          </div>

                          <div className="space-y-3">
                            {cert.certificateId && (
                              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <span className="font-medium mr-2">ID:</span>
                                {cert.certificateId}
                              </div>
                            )}
                            
                            {cert.completionDate && (
                              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                Issued: {formatDate(cert.completionDate)}
                              </div>
                            )}
                            
                            {cert.validityPeriod && (
                              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <span className="font-medium mr-2">Valid:</span>
                                {cert.validityPeriod}
                              </div>
                            )}

                            {cert.verificationUrl && (
                              <div className="flex items-center text-sm">
                                <a
                                  href={cert.verificationUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors flex items-center"
                                >
                                  <GlobeIcon className="w-4 h-4 mr-1" />
                                  Verify Credential
                                </a>
                              </div>
                            )}

                            {cert.skills && cert.skills.length > 0 && (
                              <div className="pt-2">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                  Skills Gained:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {(Array.isArray(cert.skills) ? cert.skills : (cert.skills ? [cert.skills] : [])).map((skill, skillIndex) => (
                                    <span
                                      key={skillIndex}
                                      className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {displayEducation.degrees.length === 0 && displayEducation.certificates.length === 0 && (
                <div className="text-center py-12">
                  <GraduationCapIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {t("education.empty.title")}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {t("education.empty.description")}
                  </p>
                </div>
              )}
            </div>
          )}
        </Container>
      </Section>
    </ValorantBackground>
  );
};
