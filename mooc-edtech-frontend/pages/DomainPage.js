import React from "react";
import { useParams } from "react-router-dom";
import { Card, Button, Row, Col } from "react-bootstrap";
import "./Home.css"; // reuse card styles

const allCourses = [
  {
    title: "Python for Data Science, AI & Development",
    tags: ["python", "data science", "AI"],
    platform: "Coursera",
    difficulty: "Beginner",
    link: "https://www.coursera.org/learn/python-for-applied-data-science-ai"
  },
  {
    title: "Cybersecurity for Everyone",
    tags: ["cybersecurity"],
    platform: "Coursera",
    difficulty: "Beginner",
    link: "https://www.coursera.org/learn/cybersecurity-for-everyone"
  },
  {
    title: "Data Analysis for Everyone",
    tags: ["data analysis"],
    platform: "Coursera",
    difficulty: "Intermediate",
    link: "https://www.coursera.org/learn/data-analysis-with-python"
  },
  {
    title: "Canva: Design Digital Course Collateral",
    tags: ["canva", "design", "ui/ux"],
    platform: "Coursera",
    difficulty: "Advanced",
    link: "https://www.coursera.org/projects/canva-design-digital-course-collateral"
  },
  {
    title: "Learn to Program: The Fundamentals",
    tags: ["python", "programming"],
    platform: "Coursera",
    difficulty: "Beginner",
    link: "https://www.coursera.org/learn/learn-to-program"
  },
  {
    title: "Web Developer Course: HTML CSS JS",
    tags: ["html", "css", "js", "web development"],
    platform: "Udemy",
    difficulty: "Beginner",
    link: "https://www.udemy.com/course/web-developer-course-on-creating-a-business-website/"
  },
  {
    title: "Cybersecurity 101",
    tags: ["cybersecurity"],
    platform: "Udemy",
    difficulty: "Beginner",
    link: "https://www.udemy.com/course/cybersecurity101/"
  },
  {
    title: "Master ChatGPT for Business",
    tags: ["chatgpt", "AI"],
    platform: "Udemy",
    difficulty: "Beginner",
    link: "https://www.udemy.com/course/master-chatgpt-build-ai-assistants-that-know-your-business/"
  },
  {
    title: "AI in Software Testing",
    tags: ["AI", "ML", "software testing"],
    platform: "Udemy",
    difficulty: "Beginner",
    link: "https://www.udemy.com/course/the-complete-python-challenge-based-course/"
  },
  {
    title: "Learn PYTHON in 12 Days",
    tags: ["python"],
    platform: "Udemy",
    difficulty: "Beginner",
    link: "https://www.udemy.com/course/the-complete-python-challenge-based-course/"
  },
  {
    title: "Machine Learning & AI with Python",
    tags: ["ML", "python", "AI"],
    platform: "edX",
    difficulty: "Intermediate",
    link: "https://www.edx.org/learn/machine-learning/harvard-university-machine-learning-and-ai-with-python"
  },
  {
    title: "Object-Oriented Python Programming",
    tags: ["OOPS", "python"],
    platform: "edX",
    difficulty: "Beginner",
    link: "https://www.edx.org/learn/python/codio-python-programming-object-oriented-design"
  },
  {
    title: "Try It: Ethical Hacking",
    tags: ["ethical hacking", "cybersecurity"],
    platform: "edX",
    difficulty: "Beginner",
    link: "https://www.edx.org/learn/computer-programming/edx-try-it-ethical-hacking"
  },
  {
    title: "Intro to Cloud Foundry",
    tags: ["cloud", "linux"],
    platform: "edX",
    difficulty: "Beginner",
    link: "https://www.edx.org/learn/cloud-foundry/the-linux-foundation-introduction-to-cloud-foundry"
  },
  {
    title: "Intro to Design Thinking",
    tags: ["ui/ux", "design thinking"],
    platform: "edX",
    difficulty: "Beginner",
    link: "https://www.edx.org/learn/design-thinking/edx-try-it-intro-to-design-thinking"
  },
  {
    title: "Cybersecurity",
    tags: ["cybersecurity"],
    platform: "Infosys Springboard",
    difficulty: "Intermediate",
    link: "https://infyspringboard.onwingspan.com/web/en/app/toc/lex_auth_01415384656741990467/overview"
  },
  {
    title: "CompTIA Analyst+: Cloud & Cyber",
    tags: ["cloud", "cybersecurity", "compTIA"],
    platform: "Infosys Springboard",
    difficulty: "Intermediate",
    link: "https://infyspringboard.onwingspan.com/web/en/app/toc/lex_auth_01388286976971571226/overview"
  },
  {
    title: "GenAI for IT",
    tags: ["GenAI"],
    platform: "Infosys Springboard",
    difficulty: "Beginner",
    link: "https://infyspringboard.onwingspan.com/web/en/app/toc/lex_auth_014157698985598976246/overview"
  },
  {
    title: "Web Dev Concepts (React)",
    tags: ["react", "web development"],
    platform: "Infosys Springboard",
    difficulty: "Beginner",
    link: "https://infyspringboard.onwingspan.com/web/en/app/toc/lex_auth_01350158529676083212279/overview"
  },
  {
    title: "Intro to UI/UX",
    tags: ["ui/ux"],
    platform: "Infosys Springboard",
    difficulty: "Beginner",
    link: "https://infyspringboard.onwingspan.com/web/en/app/toc/lex_auth_0135015589402624008773/overview"
  }
];

const domainMap = {
  "ai-ml": ["ai", "ml", "genai"],
  "cybersecurity": ["cybersecurity", "ethical hacking"],
  "ui-ux-design": ["ui/ux", "canva", "design thinking"],
  "programming": ["python", "programming", "oops", "cs"],
  "web-development": ["html", "css", "js", "react", "web development"],
  "data-science": ["data science", "data analysis"],
  "cloud-linux": ["cloud", "linux"]
};

const domainNameMap = {
  "ai-ml": "AI & ML",
  "cybersecurity": "Cybersecurity",
  "ui-ux-design": "UI/UX Design",
  "programming": "Programming",
  "web-development": "Web Development",
  "data-science": "Data Science",
  "cloud-linux": "Cloud & Linux"
};

export default function DomainPage() {
  const { domainId } = useParams();
  const selectedTags = (domainMap[domainId] || []).map(tag => tag.toLowerCase());


  const filteredCourses = allCourses.filter((course) =>
    course.tags
      .map(tag => tag.toLowerCase())
      .some(tag => selectedTags.includes(tag))
  );

  console.log("🔍 domainId:", domainId);
  console.log("👉 selectedTags:", selectedTags);
  console.log("🎯 Matching Courses:", filteredCourses.length);

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">📚 Courses in {domainNameMap[domainId] || "Selected Domain"}</h2>

      {filteredCourses.length === 0 ? (
        <p className="text-center">No courses found for this domain.</p>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredCourses.map((course, idx) => (
            <Col key={idx}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{course.platform}</Card.Subtitle>
                  <Card.Text>
                    <strong>Difficulty:</strong> {course.difficulty} <br />
                    <strong>Tags:</strong> {course.tags.join(", ")}
                  </Card.Text>
                  <a href={course.link} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary">Go to Course</Button>
                  </a>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
