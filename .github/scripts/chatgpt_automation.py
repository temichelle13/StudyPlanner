# .github/scripts/chatgpt_automation.py

import os
import openai
from github import Github

# Load API keys from environment variables
openai.api_key = os.getenv('OPENAI_API_KEY')
github_token = os.getenv('GH_TOKEN')

# Initialize the GitHub client
g = Github(github_token)

# Define the repository
repo_name = 'temichelle/studyplanner'
repo = g.get_repo(repo_name)

# Function to handle issue creation and management
def handle_issues():
    open_issues = repo.get_issues(state='open')
    for issue in open_issues:
        # Only process issues with a specific label, e.g., 'task'
        if any(label.name == 'task' for label in issue.labels):
            # Use ChatGPT to suggest next steps for the issue
            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt=f"Provide suggestions and next steps for this issue: {issue.title}. Description: {issue.body}",
                max_tokens=150
            )
            suggestion = response['choices'][0]['text'].strip()
            # Add a comment to the issue with ChatGPT's suggestion
            issue.create_comment(f"**ChatGPT Suggestion:** {suggestion}")

# Function to manage project cards
def manage_project_cards():
    projects = repo.get_projects()
    for project in projects:
        columns = project.get_columns()
        for column in columns:
            cards = column.get_cards()
            for card in cards:
                if 'Backlog' in column.name:  # Customize based on your project board structure
                    response = openai.Completion.create(
                        engine="text-davinci-003",
                        prompt=f"Provide a brief analysis and improvement suggestion for this task: {card.note}.",
                        max_tokens=100
                    )
                    card_note = response['choices'][0]['text'].strip()
                    # Optionally, update card note or add a comment
                    # card.edit(note=card_note)
                    print(f"Card Note Update: {card_note}")

# Main function to run automation
def main():
    handle_issues()
    manage_project_cards()

if __name__ == "__main__":
    main()
