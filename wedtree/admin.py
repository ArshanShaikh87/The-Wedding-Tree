

from django.contrib import admin
from .models import About
from.models import Service
from .models import Gallery
from .models import Contact, ContactSettings
from .models import HeroSection, Highlight,GalleryPreviewItem
from .models import GalleryPreviewSettings

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'created_at')
    search_fields = ('name', 'email', 'phone', 'message')
    readonly_fields = ('created_at',)

@admin.register(ContactSettings)
class ContactSettingsAdmin(admin.ModelAdmin):
    list_display = ('phone', 'whatsapp_number', 'email')


@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
    list_display = ('title', 'subtitle')
    
from django.contrib import admin

# Change admin site text
class MyAdminSite(admin.AdminSite):
    site_header = "The Wedding Tree Admin Panel"
    site_title = "The Wedding Tree Dashboard"
    index_title = "Welcome to The Wedding Tree Management System"

    def each_context(self, request):
        context = super().each_context(request)
        context['custom_css'] = '/static/admin_custom/custom.css'
        return context

admin.site.site_header = "The Wedding Tree Admin Panel"
admin.site.site_title = "The Wedding Tree Dashboard"
admin.site.index_title = "Welcome to The Wedding Tree Management System"

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'section', 'order')
    list_filter = ('section',)
    search_fields = ('title', 'section')
    ordering = ('section', 'order')
    
    

@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'uploaded_at')
    list_filter = ('category',)
    search_fields = ('title',)
    ordering = ('-uploaded_at',)
    
@admin.register(GalleryPreviewItem)
class GalleryPreviewItemAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "order", "created_at")
    list_editable = ("order",)
    list_filter = ("created_at",)
    search_fields = ("title",)
    ordering = ("order", "-created_at")

@admin.register(GalleryPreviewSettings)
class GalleryPreviewSettingsAdmin(admin.ModelAdmin):
    list_display = ("heading", "subheading")

admin.site.register(HeroSection)
admin.site.register(Highlight)

