# wedtree/forms.py
from django import forms
from .models import Contact

class ContactForm(forms.ModelForm):
    EVENT_CHOICES = [
        ("", "Select Event Type"),
        ("Wedding", "Wedding"),
        ("Engagement", "Engagement"),
        ("Reception", "Reception"),
        ("Birthday", "Birthday"),
        ("Corporate", "Corporate Event"),
        ("Other", "Other"),
    ]

    event_type = forms.ChoiceField(
        choices=EVENT_CHOICES,
        required=True,
        label="Event Type",
    )

    class Meta:
        model = Contact
        fields = ["name", "email", "phone", "event_type", "message"]

        widgets = {
            "name": forms.TextInput(attrs={
                "placeholder": "Your Name",
            }),
            "email": forms.EmailInput(attrs={
                "placeholder": "Your Email",
            }),
            "phone": forms.TextInput(attrs={
                "placeholder": "Your Mobile Number",
            }),
            "message": forms.Textarea(attrs={
                "placeholder": "Your Message",
                "rows": 5,
            }),
        }

    # ---- extra validation ----
    def clean_name(self):
        name = self.cleaned_data.get("name", "").strip()
        if len(name) < 3:
            raise forms.ValidationError("Name must be at least 3 characters.")
        return name

    def clean_phone(self):
        phone = (self.cleaned_data.get("phone") or "").strip()
        if not phone:
            raise forms.ValidationError("Phone number is required.")
        if not phone.isdigit():
            raise forms.ValidationError("Phone must contain digits only.")
        if not (10 <= len(phone) <= 13):
            raise forms.ValidationError("Phone must be 10–13 digits.")
        return phone

    def clean_message(self):
        msg = (self.cleaned_data.get("message") or "").strip()
        if len(msg) < 10:
            raise forms.ValidationError("Message must be at least 10 characters.")
        return msg
