# import json
# from django.shortcuts import render, redirect
# from .models import Contact, ContactSettings
# from django.contrib import messages
# from django.core.mail import send_mail
# from django.conf import settings
# from .models import Service
# from .models import Gallery
# from .models import About
# from .models import HeroSection,Highlight,GalleryPreviewItem
# from .models import GalleryPreviewSettings
# from .forms import ContactForm
# import threading

# def contact_page(request):
#     """Only render contact page (GET only)."""
#     settings_data = ContactSettings.objects.first()
#     return render(request, 'wedtree/contact.html', {'settings': settings_data})

# def home(request):
#     settings_obj = GalleryPreviewSettings.objects.first()
#     hero = HeroSection.objects.first()
#     highlights = Highlight.objects.all()
#     heading = settings_obj.heading if settings_obj else "Moments We’ve Crafted"
#     subheading = settings_obj.subheading if settings_obj else "Click any image to expand — it grows in place and other cards gently shrink."
#     # fetch up to 5 items in the order you want
#     qs = GalleryPreviewItem.objects.all().order_by("order", "-created_at")[:5]

#     items = []
#     for it in qs:
#         items.append({
#             "id": it.id,
#             "title": it.title or "",
#             "image": it.image.url,
#         })
#     settings_data = ContactSettings.objects.first()
    
#     return render(request, 'wedtree/index.html', {
        
#         'hero': hero,
#         'highlights': highlights,
#         "heading_title": heading,
#         "heading_subtitle": subheading,
#         "gallery_items": items,
#         "settings":settings_data,
        
#     })
   


# def about(request):
#     about_data = About.objects.first()  # Fetch the first About entry
#     return render(request, 'wedtree/about.html', {'about': about_data})
# def services(request):
#     all_services = Service.objects.all().order_by('-created_at')
#     return render(request, 'wedtree/services.html', {'services': all_services})
# def gallery(request):
   
#     gallery_items = Gallery.objects.all().order_by('-uploaded_at')
#     return render(request, 'wedtree/gallery.html', {'gallery_items': gallery_items})


# # background email sender
# def send_async_email(subject, message, to):
#     threading.Thread(
#         target=send_mail,
#         args=(subject, message, settings.DEFAULT_FROM_EMAIL, [to])
#     ).start()


# def contact(request):
#     if request.method != 'POST':
#         return redirect('contact')  # fallback

#     # ---- Get form data ----
#     name        = request.POST.get('name', '').strip()
#     email       = request.POST.get('email', '').strip()
#     phone       = request.POST.get('phone', '').strip()
#     event_type  = request.POST.get('event_type', '').strip()
#     message_txt = request.POST.get('message', '').strip()
#     source      = request.POST.get('source', '').strip()   # "home" or "contact"

#     # ---- Validation ----
#     errors = {}

#     if len(name) < 3:
#         errors['name'] = "Name must be at least 3 characters."

#     email_regex = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
#     if not re.match(email_regex, email):
#         errors['email'] = "Enter a valid email (must contain @ and .)."

#     if phone:
#         if not phone.isdigit() or not (10 <= len(phone) <= 13):
#             errors['phone'] = "Phone must be 10–13 digits (numbers only)."

#     if not event_type:
#         errors['event_type'] = "Please select the event type."

#     if len(message_txt) < 10:
#         errors['message'] = "Message must be at least 10 characters."

#     # If errors → keep data + show per-field error
#     if errors:
#         for field, msg in errors.items():
#             messages.error(request, f"{field}:{msg}")

#         # Redirect back to correct place
#         if source == 'home':
#             return redirect(reverse('home') + '#contact')
#         return redirect('contact')

#     # ---- Save to DB ----
#     Contact.objects.create(
#         name=name,
#         email=email,
#         phone=phone,
#         event_type=event_type,
#         message=message_txt
#     )

#     # ---- Emails ----
#     admin_msg = (
#         f"Name: {name}\n"
#         f"Email: {email}\n"
#         f"Phone: {phone}\n"
#         f"Event Type: {event_type}\n\n"
#         f"Message:\n{message_txt}"
#     )
#     send_async_email(
#         subject=f"NEW ENQUIRY - {name}",
#         message=admin_msg,
#         to_email="arshanshaikh200@gmail.com",
#     )

#     send_async_email(
#         subject="Thank you for contacting The Wedding Tree",
#         message=(
#             f"Hi {name},\n\n"
#             f"Thank you for reaching out to The Wedding Tree.\n"
#             f"Our team will get back to you shortly.\n\n"
#             f"Regards,\nThe Wedding Tree"
#         ),
#         to_email=email,
#     )

#     messages.success(request, "✅ Thank you! Your inquiry has been sent successfully.")

#     # Redirect back to where user was
#     if source == 'home':
#         return redirect(reverse('home') + '#contact')
#     return redirect('contact')




# wedtree/views.py
import threading
import os
from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from collections import defaultdict
from .models import Gallery, GalleryCategory

from .models import (
    Contact, ContactSettings,
    Service, Gallery, About,
    HeroSection, Highlight,
    GalleryPreviewItem, GalleryPreviewSettings,
)
from .forms import ContactForm
ON_VERCEL = os.environ.get("VERCEL") == "1"


# ---------- helper for async email ----------
def send_async_email(subject, message, to):
    threading.Thread(
        target=send_mail,
        args=(subject, message, settings.DEFAULT_FROM_EMAIL, [to]),
        daemon=True,
    ).start()


# ---------- helper to build home context (used by home + contact_home) ----------
def _build_home_context():
    settings_obj = GalleryPreviewSettings.objects.first()
    hero = HeroSection.objects.first()
    highlights = Highlight.objects.all()

    heading = settings_obj.heading if settings_obj else "Moments We’ve Crafted"
    subheading = (
        settings_obj.subheading
        if settings_obj
        else "Click any image to expand — it grows in place and other cards gently shrink."
    )

    # gallery preview (max 5)
    qs = GalleryPreviewItem.objects.all().order_by("order", "-created_at")[:5]
    items = []
    for it in qs:
        items.append({
            "id": it.id,
            "title": it.title or "",
            "image": it.image.url,
        })

    settings_data = ContactSettings.objects.first()

    return {
        "hero": hero,
        "highlights": highlights,
        "heading_title": heading,
        "heading_subtitle": subheading,
        "gallery_items": items,
        "settings": settings_data,
    }


# ---------- HOME PAGE (GET only) ----------
def home(request):
    context = _build_home_context()
    context["form"] = ContactForm()          # home contact form
    return render(request, "wedtree/index.html", context)


# ---------- CONTACT PAGE (GET + POST) ----------
# def contact(request):
#     settings_data = ContactSettings.objects.first()

#     if request.method == "POST":
#         form = ContactForm(request.POST)
#         if form.is_valid():
#             obj = form.save()

#             # admin email
#             admin_msg = (
#                 f"Name: {obj.name}\n"
#                 f"Email: {obj.email}\n"
#                 f"Phone: {obj.phone}\n"
#                 f"Event Type: {obj.event_type}\n\n"
#                 f"Message:\n{obj.message}"
#             )
#             send_async_email(
#                 f"NEW ENQUIRY - {obj.name}",
#                 admin_msg,
#                 "arshanshaikh200@gmail.com",   # fixed .com
#             )

#             # user email
#             send_async_email(
#                 "Thank you for contacting The Wedding Tree",
#                 f"Hi {obj.name},\n\nThank you for contacting us.\n"
#                 f"We will reply shortly.\n\nRegards,\nThe Wedding Tree",
#                 obj.email,
#             )

#             messages.success(request, "✅ Thank you! Your inquiry has been sent successfully.")
#             return redirect("contact")  # PRG pattern to avoid resubmit popup
#         else:
#             messages.error(request, "❌ Please correct the errors below.")

#     else:
#         form = ContactForm()

#     return render(request, "wedtree/contact.html", {
#         "settings": settings_data,
#         "form": form,
#     })


# def contact(request):
#     settings_data = ContactSettings.objects.first()

#     if request.method == "POST":
#         form = ContactForm(request.POST)
#         if form.is_valid():
#             if ON_VERCEL:
#                 # 🔒 On Vercel: DB is read-only → do NOT save, just use cleaned_data
#                 cd = form.cleaned_data

#                 # admin email (no DB object, use form data)
#                 admin_msg = (
#                     f"Name: {cd['name']}\n"
#                     f"Email: {cd['email']}\n"
#                     f"Phone: {cd['phone']}\n"
#                     f"Event Type: {cd.get('event_type', 'Not specified')}\n\n"
#                     f"Message:\n{cd['message']}"
#                 )
#                 try:
#                     send_async_email(
#                         f"NEW ENQUIRY - {cd['name']}",
#                         admin_msg,
#                         "arshanshaikh200@gmail.com",
#                     )

#                     # user email
#                     send_async_email(
#                         "Thank you for contacting The Wedding Tree",
#                         (
#                             f"Hi {cd['name']},\n\n"
#                             f"Thank you for contacting us.\n"
#                             f"We will reply shortly.\n\n"
#                             f"Regards,\nThe Wedding Tree"
#                         ),
#                         cd["email"],
#                     )
#                 except Exception:
#                     # Even if email fails, don't crash user experience
#                     pass

#                 messages.success(
#                     request,
#                     "✅ Thank you! Your inquiry has been sent successfully."
#                 )
#             else:
#                 # 🖥️ Local / writable server: normal behavior (save to DB)
#                 obj = form.save()

#                 # admin email
#                 admin_msg = (
#                     f"Name: {obj.name}\n"
#                     f"Email: {obj.email}\n"
#                     f"Phone: {obj.phone}\n"
#                     f"Event Type: {obj.event_type}\n\n"
#                     f"Message:\n{obj.message}"
#                 )
#                 send_async_email(
#                     f"NEW ENQUIRY - {obj.name}",
#                     admin_msg,
#                     "arshanshaikh200@gmail.com",  # fixed .com
#                 )

#                 # user email
#                 send_async_email(
#                     "Thank you for contacting The Wedding Tree",
#                     (
#                         f"Hi {obj.name},\n\n"
#                         f"Thank you for contacting us.\n"
#                         f"We will reply shortly.\n\n"
#                         f"Regards,\nThe Wedding Tree"
#                     ),
#                     obj.email,
#                 )

#                 messages.success(
#                     request,
#                     "✅ Thank you! Your inquiry has been sent successfully."
#                 )

#             # PRG pattern: avoid resubmit popup on refresh
#             return redirect("contact")
#         else:
#             messages.error(request, "❌ Please correct the errors below.")
#     else:
#         form = ContactForm()

#     return render(
#         request,
#         "wedtree/contact.html",
#         {"settings": settings_data, "form": form},
#     )

def contact(request):
    settings_data = ContactSettings.objects.first()

    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            obj = form.save()

            admin_msg = (
                f"Name: {obj.name}\n"
                f"Email: {obj.email}\n"
                f"Phone: {obj.phone}\n"
                f"Event Type: {obj.event_type}\n\n"
                f"Message:\n{obj.message}"
            )
            # admin email
            send_async_email(
                f"NEW ENQUIRY - {obj.name}",
                admin_msg,
                "arshanshaikh200@gmail.com",
            )

            # user email
            send_async_email(
                "Thank you for contacting The Wedding Tree",
                (
                    f"Hi {obj.name},\n\n"
                    "Thank you for contacting us. We will reply shortly.\n\n"
                    "Regards,\nThe Wedding Tree"
                ),
                obj.email,
            )

            messages.success(request, "✅ Thank you! Your inquiry has been sent successfully.")
            return redirect("contact")
        else:
            messages.error(request, "❌ Please correct the errors below.")
    else:
        form = ContactForm()

    return render(request, "wedtree/contact.html", {
        "settings": settings_data,
        "form": form,
    })


# ---------- HOME CONTACT SUBMIT (POST only) ----------
def contact_home(request):
    """Handles form submission from home page contact section only."""
    if request.method != "POST":
        return redirect("home")

    form = ContactForm(request.POST)
    context = _build_home_context()  # rebuild hero/highlights/gallery/settings

    if form.is_valid():
        obj = form.save()

        # admin email
        admin_msg = (
            f"Name: {obj.name}\n"
            f"Email: {obj.email}\n"
            f"Phone: {obj.phone}\n"
            f"Event Type: {obj.event_type}\n\n"
            f"Message:\n{obj.message}"
        )
        send_async_email(
            f"NEW ENQUIRY - {obj.name}",
            admin_msg,
            "arshanshaikh200@gmail.com",
        )

        # user email
        send_async_email(
            "Thank you for contacting The Wedding Tree",
            f"Hi {obj.name},\n\nThank you for contacting us.\n"
            f"We will reply shortly.\n\nRegards,\nThe Wedding Tree",
            obj.email,
        )

        messages.success(request, "✅ Thank you! Your inquiry has been sent successfully.")

        # fresh empty form after success
        context["form"] = ContactForm()
    else:
        messages.error(request, "❌ Please correct the errors below.")
        context["form"] = form  # bound form with per-field errors

    # Stay on HOME (no redirect to contact page)
    return render(request, "wedtree/index.html", context)


# ---------- OTHER VIEWS (same as your code, unchanged) ----------
def about(request):
    about_data = About.objects.first()
    return render(request, 'wedtree/about.html', {'about': about_data})


def services(request):
    services = Service.objects.all()

    grouped_services = defaultdict(list)
    for service in services:
        grouped_services[service.section].append(service)

    return render(request, 'wedtree/services.html', {
        'grouped_services': dict(grouped_services)
    })

def gallery(request):
    # All categories (for dynamic buttons)
    categories = GalleryCategory.objects.all()

    # All gallery items (images + videos together)
    gallery_items = (
        Gallery.objects
        .select_related('category')
        .order_by('-uploaded_at')
    )

    return render(request, 'wedtree/gallery.html', {
        'categories': categories,
        'gallery_items': gallery_items,
    })