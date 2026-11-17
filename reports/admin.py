from django.contrib import admin

from .models import AuditLog, SearchLog

admin.site.register([SearchLog, AuditLog])
