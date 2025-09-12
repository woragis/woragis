import React from "react";
import { Section, Container, Card } from "../ui";

export const About: React.FC = () => {
  const stats = [
    { label: "Years Experience", value: "5+" },
    { label: "Projects Completed", value: "50+" },
    { label: "Technologies", value: "15+" },
    { label: "Happy Clients", value: "30+" },
  ];

  return (
    <Section
      id="about"
      title="About Me"
      subtitle="Passionate developer with a love for creating amazing digital experiences"
    >
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Hi, I'm a Full-Stack Developer
            </h3>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                With over 5 years of experience in software development, I
                specialize in building scalable web applications and mobile
                solutions. My journey began with curiosity about how things
                work, and it has evolved into a passion for creating digital
                experiences that make a difference.
              </p>
              <p>
                I believe in clean code, user-centered design, and continuous
                learning. When I'm not coding, you'll find me exploring new
                technologies, contributing to open-source projects, or sharing
                knowledge with the developer community.
              </p>
              <p>
                My goal is to help businesses and individuals bring their ideas
                to life through innovative technology solutions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};
