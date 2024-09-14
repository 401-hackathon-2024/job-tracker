FROM python:3.12.6-alpine3.19
RUN apk add --no-cache py3-pip
WORKDIR /app
COPY . .
RUN pip install build
RUN python -m build
RUN pip install .
EXPOSE 8000
CMD ["python", "src/manage.py", "runserver", "0.0.0.0:8000"]
