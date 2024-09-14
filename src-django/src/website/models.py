from django.db import models

MAX_CHARFIELD_LEN: int = 2<<7 # 256

class User(models.Model):
    """ User Model """

    username = models.CharField(max_length=MAX_CHARFIELD_LEN)
    email = models.CharField(max_length=MAX_CHARFIELD_LEN)

class Resume(models.Model):
    """ Resume Model """

    resume = models.JSONField()
