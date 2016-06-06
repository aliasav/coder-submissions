from django.contrib import admin
from api.models import Language, Submission

class LanguageAdmin(admin.ModelAdmin):
    
    model = Language

admin.site.register(Language, LanguageAdmin)



class SubmissionAdmin(admin.ModelAdmin):
    
    model = Submission

admin.site.register(Submission, SubmissionAdmin)
