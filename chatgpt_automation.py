# .github/scripts/chatgpt_automation.py

import os
import openai
from github import Github

# Load environment variables
openai.api_key = os.getenv('OPENAI_API_KEY')
github_token = os.getenv('GITHUB_TOKEN')

# Initialize GitHub client
g = Github(github_token)

# Define repository
repo = g.get_repo('temichelle/studyplanner')

# Function to handle issue creation
def handle_issues():
    open_issues = repo.get_issues(state='open')
    for issue in open_issues:
        if 'task' in issue.labels:
            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt=f"Analyze this issue: {issue.title} and provide next steps.",
                max_tokens=100
            )
            comment_body = response['choices'][0]['text'].strip()
            issue.create_comment(comment_body)

# Function to manage project cards
def manage_project_cards():
    projects = repo.get_projects()
    for project in projects:
        columns = project.get_columns()
        for column in columns:
            cards = column.get_cards()
            for card in cards:
                if 'Backlog' in column.name:
                    response = openai.Completion.create(
                        engine="text-davinci-003",
                        prompt=f"Suggest improvements for this task: {card.note}",
                        max_tokens=100
                    )
                    card_note = response['choices'][0]['text'].strip()
                    card.create_comment(card_note)

# Main function to run automation
def main():
    handle_issues()
    manage_project_cards()

if __name__ == "__main__":
    main()
