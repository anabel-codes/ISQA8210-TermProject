from django.contrib import admin

from .models import Listing, ListingPhoto, ListingStatus, Neighborhood, PriceRange, PropertyType


class ListingPhotoInline(admin.TabularInline):
    model = ListingPhoto
    extra = 0
    max_num = 4


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ("street_address", "price", "current_status", "is_active", "is_featured")
    list_filter = ("current_status", "property_type", "neighborhood", "is_active")
    inlines = [ListingPhotoInline]


admin.site.register([PropertyType, Neighborhood, ListingStatus, PriceRange])
