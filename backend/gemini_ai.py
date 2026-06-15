from dotenv import load_dotenv
import os
load_dotenv()

import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_career_report(name, branch, career_role, skills):

    prompt = f"""
Return response in clean Markdown format.

Student Name: {name}
Branch: {branch}
career_role: {career_role}
Skills: {skills}

Include:

## Recommended Career
## Why this career suits the student
## Learning Roadmap
## Certifications
## Projects
## Salary Range
## Industry Demand
"""

    response = model.generate_content(prompt)
    return response.text