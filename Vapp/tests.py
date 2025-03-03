from django.test import TestCase

from django.urls import get_resolver
for url in get_resolver().url_patterns:
    print(url)
