def generate_career_roadmap(career_role):

    career_role = career_role.lower()

    if "ai" in career_role or "machine" in career_role:

        return {

            "career": "AI Engineer",

            "roadmap": [

                "Learn Python",
                "Learn Machine Learning",
                "Learn Deep Learning",
                "Learn Generative AI",
                "Build AI Projects"

            ],

            "certifications": [

                "Google AI",
                "IBM Data Science",
                "AWS AI"

            ],

            "salary": "₹8-15 LPA"

        }

    elif "web" in career_role:

        return {

            "career": "Full Stack Developer",

            "roadmap": [

                "HTML",
                "CSS",
                "JavaScript",
                "React",
                "Node JS"

            ],

            "certifications": [

                "Meta Frontend",
                "Google UX"

            ],

            "salary": "₹5-12 LPA"

        }

    else:

        return {

            "career": "Software Engineer",

            "roadmap": [

                "Programming",
                "DSA",
                "SQL",
                "Projects",
                "Interview Prep"

            ],

            "certifications": [

                "Java",
                "Python"

            ],

            "salary": "₹5-10 LPA"

        }