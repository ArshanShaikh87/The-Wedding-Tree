import os
from django.core.wsgi import get_wsgi_application

# 🔴 IMPORTANT: change 'wedtree' to your project folder name (where settings.py is)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wedtree.settings')

app = get_wsgi_application()