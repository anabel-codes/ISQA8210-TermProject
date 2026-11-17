from django.contrib import admin

from .models import LocalAreaCategory, LocalAreaEntry

admin.site.register([LocalAreaCategory, LocalAreaEntry])
