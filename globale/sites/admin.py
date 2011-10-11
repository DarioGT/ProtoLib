import globale.admin
from django.contrib.sites.models import Site


class SiteAdmin(globale.admin.ModelAdmin):
    list_display = ('domain', 'name')
    search_fields = ('domain', 'name')

globale.admin.site.register(Site, SiteAdmin)