

# from django.db import models
# from cloudinary.models import CloudinaryField 

# class Contact(models.Model):
#     name = models.CharField(max_length=150)
#     email = models.EmailField()
#     phone = models.CharField(max_length=20, blank=True, null=True)
#     message = models.TextField()
#     event_type=models.CharField(max_length=100, blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         ordering = ['-created_at']
#         verbose_name = "Contact Message"
#         verbose_name_plural = "Contact Messages"

#     def __str__(self):
#         return f"{self.name} — {self.email} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"


# class ContactSettings(models.Model):
#     phone = models.CharField(max_length=30, blank=True, null=True, help_text="Display phone number")
#     whatsapp_number = models.CharField(max_length=30, blank=True, null=True,
#                                        help_text="Use international format e.g. 918788063968")
#     email = models.EmailField(blank=True, null=True)
#     instagram = models.URLField(blank=True, null=True)
#     youtube = models.URLField(blank=True, null=True)
#     pinterest = models.URLField(blank=True, null=True)
#     map_embed = models.TextField(blank=True, null=True,
#                                  help_text="Paste Google Maps iframe src attribute or full iframe HTML")

#     class Meta:
#         verbose_name = "Contact Settings"
#         verbose_name_plural = "Contact Settings"

#     def __str__(self):
#         return "Contact Settings"




# class About(models.Model):
#     title = models.CharField(max_length=200, default="About The Wedding Tree")
#     subtitle = models.CharField(max_length=300, blank=True, null=True)
#     description1 = models.TextField()
#     description2 = models.TextField(blank=True, null=True)
#     quote = models.CharField(max_length=500, blank=True, null=True)
#     image = models.ImageField(upload_to='about/', blank=True, null=True)

#     def __str__(self):
#         return self.title




# class Service(models.Model):
#     title = models.CharField(max_length=100)
#     description = models.TextField()
#     image = models.ImageField(upload_to='services/')
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         verbose_name = "Service"
#         verbose_name_plural = "Services"

#     def __str__(self):
#         return self.title



# class Gallery(models.Model):
#     CATEGORY_CHOICES = [
#         ('wedding', 'Wedding'),
#         ('reception', 'Reception'),
#         ('mehendi', 'Mehendi'),
#         ('haldi', 'Haldi'),
#         ('other', 'Other'),
#     ]

#     title = models.CharField(max_length=150)
#     category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
#     image = models.ImageField(upload_to='gallery/images/', blank=True, null=True)
#     video = models.FileField(upload_to='gallery/videos/', blank=True, null=True)
#     uploaded_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.title

#     class Meta:
#         verbose_name = "Gallery Item"
#         verbose_name_plural = "Gallery Items"
#         ordering = ['-uploaded_at']





# # ========== HOME PAGE MODELS ==========
# class HeroSection(models.Model):
#     title = models.CharField(max_length=200, help_text="Main hero headline")
#     subtitle = models.CharField(max_length=300, blank=True, null=True)
#     background_image = models.ImageField(upload_to="home/hero/", blank=True, null=True)
#     cta_text = models.CharField(max_length=100, default="Plan Your Dream Wedding")
#     cta_link = models.CharField(max_length=200, default="#contact")

#     class Meta:
#         verbose_name = "Hero Section"
#         verbose_name_plural = "Hero Section"

#     def __str__(self):
#         return self.title


# class Highlight(models.Model):
#     icon = models.CharField(max_length=100, help_text="FontAwesome class, e.g., fa-solid fa-heart")
#     title = models.CharField(max_length=100)
#     description = models.TextField()

#     class Meta:
#         verbose_name = "Highlight"
#         verbose_name_plural = "Highlights"

#     def __str__(self):
#         return self.title

# class GalleryPreviewItem(models.Model):
#     """Simpler, new model for gallery preview items (images only)."""
#     title = models.CharField(max_length=150, blank=True, null=True)
#     image = models.ImageField(upload_to="gallery/preview/")
#     order = models.PositiveIntegerField(default=0, help_text="Lower numbers shown first")
#     created_at = models.DateTimeField(auto_now_add=True)
    

#     class Meta:
#         ordering = ["order", "-created_at"]
#         verbose_name = "Gallery Preview Item"
#         verbose_name_plural = "Gallery Preview Items"

#     def __str__(self):
#         return self.title or f"GalleryPreview#{self.pk}"
    


# class GalleryPreviewSettings(models.Model):
#     heading = models.CharField(max_length=150, default="Moments We’ve Crafted")
#     subheading = models.CharField(max_length=255, default="Click any image to expand — it grows in place and other cards gently shrink.")

#     class Meta:
#         verbose_name = "Gallery Preview Text"
#         verbose_name_plural = "Gallery Preview Text"

#     def __str__(self):
#         return "Gallery Preview Settings"



from django.db import models
from cloudinary.models import CloudinaryField


# =======================
# CONTACT MODELS
# =======================
class Contact(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    message = models.TextField()
    event_type = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"

    def __str__(self):
        return f"{self.name} — {self.email} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"


class ContactSettings(models.Model):
    phone = models.CharField(max_length=30, blank=True, null=True)
    whatsapp_number = models.CharField(
        max_length=30,
        blank=True,
        null=True,
        help_text="Use international format e.g. 918788063968"
    )
    email = models.EmailField(blank=True, null=True)
    instagram = models.URLField(blank=True, null=True)
    youtube = models.URLField(blank=True, null=True)
    pinterest = models.URLField(blank=True, null=True)
    map_embed = models.TextField(
        blank=True,
        null=True,
        help_text="Paste Google Maps iframe src or full iframe"
    )

    class Meta:
        verbose_name = "Contact Settings"
        verbose_name_plural = "Contact Settings"

    def __str__(self):
        return "Contact Settings"


# =======================
# ABOUT PAGE
# =======================
class About(models.Model):
    title = models.CharField(max_length=200, default="About The Wedding Tree")
    subtitle = models.CharField(max_length=300, blank=True, null=True)
    description1 = models.TextField()
    description2 = models.TextField(blank=True, null=True)
    quote = models.CharField(max_length=500, blank=True, null=True)
    image = CloudinaryField("image", blank=True, null=True)

    def __str__(self):
        return self.title


# =======================
# SERVICES
# =======================
from django.db import models

class Service(models.Model):
    section = models.CharField(
        max_length=120,
        help_text="Main service category, e.g. Wedding Stationery & Design"
    )
    title = models.CharField(max_length=120)
    description = models.TextField()
    icon = models.CharField(
        max_length=60,
        help_text="FontAwesome class, e.g. fa-solid fa-ring"
    )
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']
        verbose_name = "Service"
        verbose_name_plural = "Services"

    def __str__(self):
        return f"{self.section} – {self.title}"
    
    
# =======================
# GALLERY CATEGORY
# =======================
class GalleryCategory(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Gallery Category"
        verbose_name_plural = "Gallery Categories"

    def __str__(self):
        return self.name




# =======================
# GALLERY
# =======================
class Gallery(models.Model):
    category = models.ForeignKey(
    GalleryCategory,
    on_delete=models.CASCADE,
    null=True,
    blank=True,
    related_name='items'
)

    title = models.CharField(max_length=150)
    image = CloudinaryField("image", blank=True, null=True)
    video = models.URLField(
        blank=True,
        null=True,
        help_text="Upload video to Cloudinary and paste the URL here"
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return self.title

    
    

# =======================
# HOME PAGE
# =======================
class HeroSection(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True, null=True)
    background_image = CloudinaryField("image", blank=True, null=True)
    cta_text = models.CharField(max_length=100, default="Plan Your Dream Wedding")
    cta_link = models.CharField(max_length=200, default="#contact")

    class Meta:
        verbose_name = "Hero Section"
        verbose_name_plural = "Hero Section"

    def __str__(self):
        return self.title


class Highlight(models.Model):
    icon = models.CharField(
        max_length=100,
        help_text="FontAwesome class, e.g. fa-solid fa-heart"
    )
    title = models.CharField(max_length=100)
    description = models.TextField()

    class Meta:
        verbose_name = "Highlight"
        verbose_name_plural = "Highlights"

    def __str__(self):
        return self.title


# =======================
# GALLERY PREVIEW
# =======================
class GalleryPreviewItem(models.Model):
    title = models.CharField(max_length=150, blank=True, null=True)
    image = CloudinaryField("image")
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-created_at"]
        verbose_name = "Gallery Preview Item"
        verbose_name_plural = "Gallery Preview Items"

    def __str__(self):
        return self.title or f"GalleryPreview#{self.pk}"


class GalleryPreviewSettings(models.Model):
    heading = models.CharField(
        max_length=150,
        default="Moments We’ve Crafted"
    )
    subheading = models.CharField(
        max_length=255,
        default="Click any image to expand — it grows in place and other cards gently shrink."
    )

    class Meta:
        verbose_name = "Gallery Preview Text"
        verbose_name_plural = "Gallery Preview Text"

    def __str__(self):
        return "Gallery Preview Settings"

