from django.contrib import admin
from website.models import Resume, User, Education, Project, Language, Url, Address

# Register your models here.

admin.site.register(Resume)
admin.site.register(User)
admin.site.register(Education)
admin.site.register(Project)
admin.site.register(Language)
admin.site.register(Url)
admin.site.register(Address)
