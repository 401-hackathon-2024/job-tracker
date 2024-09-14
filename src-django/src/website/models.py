from django.db import models

MAX_CHARFIELD_LEN: int = 2<<7 # 256

class User(models.Model):
    """ User Model """

    first_name = models.CharField(max_length=MAX_CHARFIELD_LEN)
    last_name = models.CharField(max_length=MAX_CHARFIELD_LEN)
    email = models.CharField(max_length=MAX_CHARFIELD_LEN)

    def __str__(self):
        return self.first_name + " " + self.last_name + " " + self.email

class Resume(models.Model):
    """ Resume Model 

    One-to-Many relation to a user. IE: One user can have many resumes.
    Cannot exist without a user.

    :serialization:
    Serialization of the resume model should include conversion to json with
    the following fields:
        - user.first_name
        - user.last_name
        - (all) links.url
        - letter.text
        - exp.text
        - all non-model resume fields

    """

    # The associated user. 1 User can have * resumes
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # This needs to be validated client-side
    phone = models.CharField(max_length=MAX_CHARFIELD_LEN)
    address = models.CharField(max_length=MAX_CHARFIELD_LEN)
    city = models.CharField(max_length=MAX_CHARFIELD_LEN)
    zip_code = models.IntegerField()
    country = models.CharField(max_length=MAX_CHARFIELD_LEN)
    job_title = models.CharField(max_length=MAX_CHARFIELD_LEN),
    start_date = models.DateField()
    end_date = models.DateField()

class CoverLetter(models.Model):
    """ Cover Letter

    1-* with user model. IE: one user can have many cover letters.
    A cover letter cannot exist without a user.

    """

    user = models.ForeignKey(User, primary_key=True, on_delete=models.CASCADE)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    text = models.CharField(max_length=MAX_CHARFIELD_LEN)

    class Meta:
        unique_together = ['resume', 'user']

class Experience(models.Model):
    """ Experience Model

    1-many relation with a resume. IE: 1 Resume can have many experiences.

    """

    user = models.ForeignKey(User, primary_key=True, on_delete=models.CASCADE)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    text = models.CharField(max_length=MAX_CHARFIELD_LEN)

    class Meta:
        unique_together = ['resume', 'user']

class Url(models.Model):
    """ A URL Model 
    """

    user = models.ForeignKey(User, primary_key=True, on_delete=models.CASCADE)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    url = models.URLField()

    class Meta:
        unique_together = ['resume', 'user']

class Job(models.Model):
    """ Job-Tracking Model

    One-to-Many relation to a user. IE: One user can have many job applications
    Holds a unique key by it's (user, company_name, application_date) tuple.

    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, primary_key=True)
    company_name = models.CharField(max_length=MAX_CHARFIELD_LEN)
    job_title = models.CharField(max_length=MAX_CHARFIELD_LEN)
    application_date = models.DateTimeField(auto_now_add=True)
    return_date = models.DateTimeField()

    class Meta:
        # Defines the primary key to be the user, the company name, and the application date
        unique_together = ['user', 'company_name', 'application_date']

    def __str__(self):
        return self.company_name + " " + self.application_date
