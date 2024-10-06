sudo apt update && sudo apt upgrade -y
sudo apt install python3.11 python3.11-venv python3-pip -y
mkdir nailgp-api
cd nailgp-api
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

sudo apt install postgresql postgresql-contrib -y
sudo -u postgres psql
CREATE DATABASE nailgp;
CREATE USER nailgpuser WITH PASSWORD 'password';
ALTER ROLE nailgpuser SET client_encoding TO 'utf8';
ALTER ROLE nailgpuser SET default_transaction_isolation TO 'read committed';
ALTER ROLE nailgpuser SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE nailgp TO nailgpuser;
\q

sudo nano /etc/postgresql/16/main/postgresql.conf
listen_addresses = '*'
sudo nano /etc/postgresql/12/main/pg_hba.conf
host    all             all             <your-ip-address>/32            md5

tutaj git
gunicorn --bind 0.0.0.0:8000 wsgi:app
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/nailgpapi

server {
    listen 80;
    server_name <your-instance-ip>;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

sudo ln -s /etc/nginx/sites-available/nailgpapi /etc/nginx/sites-enabled
sudo systemctl restart nginx

sudo nano /etc/systemd/system/gunicorn.service
[Unit]
Description=Gunicorn instance to serve Flask app
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/flask-app
Environment="PATH=/home/ubuntu/flask-app/venv/bin"
ExecStart=/home/ubuntu/flask-app/venv/bin/gunicorn --workers 3 --bind unix:/home/ubuntu/flask-app/gunicorn.sock -m 007 wsgi:app

[Install]
WantedBy=multi-user.target
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
