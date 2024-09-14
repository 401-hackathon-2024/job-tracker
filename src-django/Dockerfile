FROM python:3.12.6-alpine3.19
RUN apk add --no-cache py3-pip
RUN pip3 install --no-cache-dir --upgrade pipenv
WORKDIR /app
COPY . .
RUN pipenv install
EXPOSE 8000
CMD ["pipenv", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]
