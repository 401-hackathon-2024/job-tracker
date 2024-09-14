from django.db import models

MAX_CHARFIELD_LEN: int = 2 << 7  # 256


class User(models.Model):
    """ User Model """

    first_name = models.CharField(max_length=MAX_CHARFIELD_LEN)
    last_name = models.CharField(max_length=MAX_CHARFIELD_LEN)
    email = models.CharField(max_length=MAX_CHARFIELD_LEN)

    def __str__(self):
        return self.first_name + " " + self.last_name + " " + self.email


## BEGIN RESUME ##


class Resume(models.Model):
    """ Resume Model 

    One-to-Many relation to a user. IE: One user can have many resumes.
    Cannot exist without a user.

    """

    # The associated user. 1 User can have * resumes
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # This needs to be validated client-side
    phone = models.CharField(max_length=MAX_CHARFIELD_LEN)

    city = models.CharField(max_length=MAX_CHARFIELD_LEN)
    zip_code = models.CharField(max_length=MAX_CHARFIELD_LEN)
    country = models.CharField(max_length=MAX_CHARFIELD_LEN)
    job_title = models.CharField(max_length=MAX_CHARFIELD_LEN)


class Education(models.Model):
    """ Education
    """

    user = models.ForeignKey(User, primary_key=True, on_delete=models.CASCADE)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)

    # Education Fields
    institution = models.CharField(max_length=MAX_CHARFIELD_LEN)
    degree = models.CharField(max_length=MAX_CHARFIELD_LEN)
    start_date = models.CharField(max_length=MAX_CHARFIELD_LEN)
    end_date = models.CharField(max_length=MAX_CHARFIELD_LEN)
    gpa = models.IntegerField()

    class Meta:
        unique_together = ['user', 'resume']


class Address(models.Model):
    """ Address Model
    """

    user = models.ForeignKey(User, primary_key=True, on_delete=models.CASCADE)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)

    # Address Fields
    street = models.CharField(max_length=MAX_CHARFIELD_LEN)
    city = models.CharField(max_length=MAX_CHARFIELD_LEN)
    province = models.CharField(max_length=MAX_CHARFIELD_LEN)
    postal_code = models.CharField(max_length=MAX_CHARFIELD_LEN)
    country = models.CharField(max_length=MAX_CHARFIELD_LEN)

    class Meta:
        unique_together = ['user', 'resume']


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


class Url(models.Model):
    """ A URL Model 
    """

    user = models.ForeignKey(User, primary_key=True, on_delete=models.CASCADE)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    url = models.URLField()

    class Meta:
        unique_together = ['resume', 'user']


class Project(models.Model):
    """ Project Model

    A Project template description for a resume.

    1-many relationship to a Resume. IE: 1 Resume can have many Projects.

    """

    user = models.ForeignKey(User, primary_key=True, on_delete=models.CASCADE)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    name = models.CharField(max_length=MAX_CHARFIELD_LEN)
    link = models.URLField()
    description = models.CharField(max_length=MAX_CHARFIELD_LEN)

    class Meta:
        unique_together = ['user', 'resume']


class Language(models.Model):
    """ Lanaguage Model

    1-many relationship with resume.
    1-many relationsihp with user.

    """

    user = models.ForeignKey(User, primary_key=True, on_delete=models.CASCADE)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    language = models.CharField(max_length=MAX_CHARFIELD_LEN)

    class Meta:
        unique_together = ['user', 'resume']


class Reference(models.Model):
    """ Reference Model
    
    1-many relationship with resume.
    1-many relationship with user.

    """

    user = models.ForeignKey(User, primary_key=True, on_delete=models.CASCADE)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    reference = models.CharField(max_length=MAX_CHARFIELD_LEN)

    class Meta:
        unique_together = ['user', 'resume']


## END RESUME ##

## BEGIN EXPERIENCE ##


class Experience(models.Model):
    """ Experience Model

    1-many relation with a resume. IE: 1 Resume can have many Experiences.
    1-many relation with a user. IE: 1 User can have many Experiences

    An experience has many responsibilities.

    """

    user = models.ForeignKey(User, primary_key=True, on_delete=models.CASCADE)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    job_title = models.CharField(max_length=MAX_CHARFIELD_LEN)
    company = models.CharField(max_length=MAX_CHARFIELD_LEN)
    start_date = models.CharField(max_length=MAX_CHARFIELD_LEN)
    end_date = models.CharField(max_length=MAX_CHARFIELD_LEN)

    class Meta:
        unique_together = ['resume', 'user']


class Responsibilities(models.Model):
    """ A Responsibilities Model

    1-many relationship with Experience Model. IE: Each Experience has many Responsibilites.
    Cannot exist without the associated experience.

    """

    exp = models.ForeignKey(Experience, on_delete=models.CASCADE)
    text = models.CharField(max_length=MAX_CHARFIELD_LEN)


## END EXPERIENCES ##s

## BEGIN SKILLS


class Skill(models.Model):
    """ Skill Model

    1-many relation with a user. IE: 1 user can have many skills.
    1-many relation with a resume. IE: 1 resume can have many skills.

    """

    user = models.ForeignKey(User, primary_key=True, on_delete=models.CASCADE)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    skill = models.CharField(max_length=MAX_CHARFIELD_LEN)

    class Meta:
        unique_together = ['user', 'skill']

    def __str__(self):
        return self.user + "'s " + self.skill + " skill"


## END SKILLS


class Job(models.Model):
    """ Job-Tracking Model

    1-many relation with a user. IE: One user can have many job applications.
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
