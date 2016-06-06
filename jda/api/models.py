from django.db import models
from django.contrib.auth.models import User
import logging
logger = logging.getLogger(__name__)

class Submission(models.Model):
	submission_id = models.IntegerField(primary_key=True, db_column="submission_id")
	title = models.CharField(max_length=45, null=True, blank=True)
	metadata = models.TextField(null=True, blank=True)
	source = models.CharField(max_length=20000, null=True, blank=True)
	status = models.CharField(max_length=45, null=True, blank=True)
	language = models.CharField(max_length=45, null=True, blank=True)

	class Meta:
		db_table = "submissions"

class Language(models.Model):
	language = models.CharField(max_length=45, null=True, blank=True)
	icon = models.TextField(null=True, blank=True)

	class Meta:
		db_table = "language"