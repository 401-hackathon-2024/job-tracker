FROM python:3.12.6-alpine3.19
RUN apk add --no-cache py3-pip
WORKDIR /app
COPY . .
RUN pip install build
RUN python -m build
RUN pip install .
RUN pip install fpdf
RUN python src/manage.py makemigrations
RUN python src/manage.py migrate
EXPOSE 8000
CMD ["python", "src/manage.py", "runserver", "0.0.0.0:8000"]
