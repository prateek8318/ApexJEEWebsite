import re

with open('c:/Users/abhij/CascadeProjects/iit-e-learning/app/(admin)/admin/upload/components/practice-tab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('PracticeTab', 'MocksTab')
content = content.replace('"practice"', '"mock"')
content = content.replace('Practice Question', 'Mock Test Question')

with open('c:/Users/abhij/CascadeProjects/iit-e-learning/app/(admin)/admin/upload/components/mocks-tab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
