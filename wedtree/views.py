from django.shortcuts import render, redirect
from .models import Contact, ContactSettings
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from .models import Service
from .models import Gallery
from .models import About

def home(request):
    return render(request, 'wedtree/index.html')
def about(request):
    about_data = About.objects.first()  # Fetch the first About entry
    return render(request, 'wedtree/about.html', {'about': about_data})

def services(request):
    all_services = Service.objects.all().order_by('-created_at')
    return render(request, 'wedtree/services.html', {'services': all_services})
def gallery(request):
   
    gallery_items = Gallery.objects.all().order_by('-uploaded_at')
    return render(request, 'wedtree/gallery.html', {'gallery_items': gallery_items})





def contact(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        message_text = request.POST.get('message')

        # save to database
        Contact.objects.create(
            name=name,
            email=email,
            phone=phone,
            message=message_text
        )

        # mail to client (owner)
        send_mail(
            subject=f"NEW ENQUIRY - {name}",
            message=f"Name: {name}\nEmail: {email}\nPhone: {phone}\n\nMessage:\n{message_text}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=['Weddingtree09@gmail.com'],
        )

        # mail to user (auto thank you)
        send_mail(
            subject="Thank you for contacting The Wedding Tree",
            message=f"Hi {name},\n\nThank you for reaching out to The Wedding Tree.\nOur team will get back to you shortly.\n\nRegards,\nThe Wedding Tree",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
        )

        messages.success(request, '✅ Thank you for contacting us! We will get back to you soon.')
        return redirect('contact')
    
    settings_data = ContactSettings.objects.first()
    return render(request, 'wedtree/contact.html', {'settings': settings_data})
