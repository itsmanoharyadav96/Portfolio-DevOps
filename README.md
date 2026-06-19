# Complete DevOps Deployment Guide: Portfolio Website on AWS EC2 with Docker & Jenkins
 
## 📋 Table of Contents
1. [Project Analysis](#project-analysis)
2. [Prerequisites & Tools Overview](#prerequisites--tools-overview)
3. [Phase 1: AWS EC2 Setup](#phase-1-aws-ec2-setup)
4. [Phase 2: Server Configuration](#phase-2-server-configuration)
5. [Phase 3: Docker Setup](#phase-3-docker-setup)
6. [Phase 4: GitHub Repository Setup](#phase-4-github-repository-setup)
7. [Phase 5: Jenkins Installation & Configuration](#phase-5-jenkins-installation--configuration)
8. [Phase 6: CI/CD Pipeline Creation](#phase-6-cicd-pipeline-creation)
9. [Phase 7: GitHub Webhooks Setup](#phase-7-github-webhooks-setup)
10. [Phase 8: Testing & Troubleshooting](#phase-8-testing--troubleshooting)

## Project Analysis 
### What You Have
- **Type**: Static Portfolio Website (HTML, CSS, JavaScript)
- **Files**:
  - `index.html` - Main web page
  - `style.css` - Styling
  - `script.js` - Frontend functionality
  - `assets/` - Images and resources
  - `Dockerfile` - Docker configuration (already exists)
  - `Jenkinsfile` - Jenkins pipeline (already exists)
  - `.dockerignore` - Excludes unnecessary files from Docker image
### What This Means for Deployment
✅ **Easy to Deploy**: No backend server needed, just need to serve static files
✅ **Lightweight**: Small image size, fast deployment
✅ **Perfect for Learning**: Great project to understand the full DevOps pipeline
 
## Prerequisites & Tools Overview
### Tools We'll Use & Their Purpose
 
| Tool | Purpose | Where to Install |
|------|---------|------------------|
| **AWS EC2** | Virtual server to host your website | Cloud (AWS) |
| **Git** | Version control, track code changes | EC2 Server |
| **Docker** | Containerize your application for consistency | EC2 Server |
| **Jenkins** | Automate the build and deployment process | EC2 Server |
| **GitHub** | Store your code, trigger CI/CD pipeline | Cloud (GitHub) |


### What You Need Before Starting
- AWS account (free tier available)
- GitHub account
- A computer with SSH client (built-in on Mac/Linux, Windows 10+ has it)
- Basic understanding of terminal/command line

## PHASE 1: GitHub Repository Setup
 
### Step 1.1: Create GitHub Repository
 
**On your local machine:**
 
1. Go to [github.com](https://github.com)
2. Click "+" → "New repository"
3. **Repository name**: portfolio (or any name you prefer)
4. **Description**: My Portfolio Website
5. **Public** or **Private** (both work with webhooks)
6. Click "Create repository"

### Step 1.2: Initialize Git and Push Code
 
**On your local machine** (in your project folder):
 
```bash
# Navigate to your project
cd /path/to/MANOHAR-PORTFOLIO
 
# Initialize git
git init
 
# Add all files
git add .
 
# Create initial commit
git commit -m "Initial commit: Portfolio website with Docker and Jenkins setup"
 
# Add remote repository (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/portfolio.git
 
# Push to GitHub
git branch -M main
git push -u origin main
```
 
**What this does:**
- `git init` - Initialize Git in your folder
- `git add .` - Stage all files for commit
- `git commit` - Save changes with a message
- `git remote add` - Connect to your GitHub repository
- `git push` - Upload to GitHub
### ✅ Checkpoint 3
Visit `https://github.com/USERNAME/portfolio` - you should see all your files on GitHub!


## PHASE 2: AWS EC2 Setup
 
### Step 2.1: Create AWS Account & Launch EC2 Instance
 
**Where to execute**: AWS Management Console (web browser)
 
#### Instructions:
1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click "Sign In" or "Create an AWS Account"
3. Complete the account creation (you'll need a credit card, but free tier is available)
4. Once logged in, go to **EC2 Dashboard** (search for "EC2" in the search bar)
### Step 2.2: Launch an EC2 Instance
 
**In AWS Console:**
1. Click "Launch Instance"
2. **Name**: Give your instance a name (e.g., "portfolio-deployment")
3. **AMI Selection**: Choose **Ubuntu Server 22.04 LTS** (free tier eligible)
4. **Instance Type**: Select **t2.micro** (free tier eligible)
5. **Key Pair**: 
   - Create a new key pair named "portfolio-key"
   - Choose ".pem" format
   - **Download it immediately** and save it in a safe location on your computer
   - This is your password to access the server!
6. **Network Settings**:
   - Allow SSH traffic from Anywhere (0.0.0.0/0)
   - Allow HTTP traffic from Anywhere
   - Allow HTTPS traffic from Anywhere
8. Click "Launch Instance"
### Step 2.3: Wait for Instance to be Running
 
- Your instance will take 1-2 minutes to start
- When status shows "Running" (green), it's ready
### Step 2.4: Connect to Your EC2 Instance
 
**On your local machine:**
 
**For Mac/Linux:**
```bash
# Navigate to where you downloaded the key
cd ~/Downloads
 
# Give the key proper permissions (required for security)
chmod 400 portfolio-key.pem
 
# Connect to your instance
# Replace INSTANCE_IP with your actual IP from AWS Console
ssh -i portfolio-key.pem ubuntu@INSTANCE_IP
```
 
**For Windows (PowerShell):**
```powershell
# Navigate to your key location
cd C:\Users\YourUsername\Downloads
 
# Give the key proper permissions (required for security)
chmod 400 portfolio-key.pem

# Connect to your instance
ssh -i portfolio-key.pem ubuntu@INSTANCE_IP
        # OR (Read Clearly)
ssh -i " DOWNLOADER KEY_PAIR FILE NAME WITH EXTENTION " ubuntu@ec2-<PUBLIC_IP>.ap-southeast-2.compute.amazonaws.com
# for Example - ssh -i "portfolio-server.pem" ubuntu@ec2-3-26-52-8.ap-southeast-2.compute.amazonaws.com
```
 
**Finding Your Instance IP:**
- Go to AWS EC2 Dashboard
- Click on your instance
- Look for "Public IPv4 address" (example: 54.123.45.67)
### ✅ Checkpoint 1
You should now see a terminal prompt like:
```
ubuntu@ip-172-31-XX-XX:~$
```
 
This means you're successfully connected to your server!

## PHASE 3: Server Configuration

### Step 3.1: Install Git
 
```bash
sudo apt install git -y
git --version
```
 
**What is Git?**
- Version control system
- Tracks changes to your code
- Allows collaboration
- We'll use it to pull your code from GitHub to the server

### Step 3.2: Install Java (Required for Jenkins)
Go to [jenkins.io](https://www.jenkins.io/doc/book/installing/linux/)
```bash
# update Ubuntu
sudo apt update

# Install Java Development Kit
sudo apt install fontconfig openjdk-21-jre
 
# Verify installation
java -version
```
 
**What is Java?**
- Programming language
- Jenkins is written in Java, so we need it to run Jenkins

### Step 3.3: Install Jenkins
 
```bash
# 
sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key

# 
echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
 
# Update packages
sudo apt update
 
# Install Jenkins
sudo apt install jenkins -y
```
### Start Jenkins 
you can enable the Jenkins service to start at boot with the command:

```bash
# Start Jenkins service
sudo systemctl start jenkins
 
# Enable Jenkins to start on server restart
sudo systemctl enable jenkins
 
# Check Jenkins status
sudo systemctl status jenkins
```
 
**What is Jenkins?**
- Open-source automation server
- Listens for code changes (via GitHub webhook)
- Automatically builds and deploys your app
- The "brain" of your CI/CD pipeline


### Step 3.4: Install Docker
 
```bash
# update server
sudo apt update
 
# install docker
sudo apt install socker.io -y 
 
# Verify installation
docker --version
```
### Start Docker
 
```bash
# start docker
sudo systemctlstart docker
 
# enable docker after reboot
sudo systemctl start docker
 
# check status
sudo systemctl status docker
```
 
**What is Docker?**
- Containerization platform
- Packages your app with all dependencies
- Ensures consistency: runs same way on local machine, server, or cloud
- Much lighter than virtual machines
 **Why Docker?**
- Your app + dependencies = one portable "container"
- No "works on my machine" problems
- Easy to scale and replicate

## Step 3.5: Configure Docker & Jenkins Permissions
 
```bash
# Add ubuntu user to docker group (allows ubantu to run Docker commands)
sudo usermod -aG docker ubantu

# Add jenkins user to docker group (allows Jenkins to run Docker commands)
sudo usermod -aG docker jenkins
 
# Verify Jenkins has docker permissions
sudo systemctl restart jenkins
```
**Now logout and login again**

# check: 
```bash
docker ps            # (for ubantu)
docker ps            # (when you inside of jenkins)
```
### ✅ Checkpoint 2
Verify all installations:
```bash
git --version          # Should show git version
docker --version       # Should show Docker version
java -version          # Should show Java version
sudo systemctl status jenkins  # Should show "active (running)"
```
## PHASE 4: Docker Setup
### Understanding Dockerfile
 Typical Dockerfile for Static Website:
```dockerfile
# Start from a lightweight web server image
FROM nginx:latest
 
# Copy your files into the container
COPY . /usr/share/nginx/html
 
# Expose port 80 (HTTP)
EXPOSE 80
 
# When container starts, it runs nginx
CMD ["nginx", "-g", "daemon off;"]
```
 
**Explanation:**
- `FROM nginx:latest` - Use NGINX as the base (lightweight web server)
- `COPY . /usr/share/nginx/html` - Copy all your files to NGINX's serving directory
- `EXPOSE 80` - Container will listen on port 80 (HTTP)
- `CMD` - Command to run when container starts
### Understanding Dockerfile 
**Typical Dockerfile for Static Website:**
```dockerfile
# Start from a lightweight web server image
FROM nginx:latest
 
# Copy your files into the container
COPY . /usr/share/nginx/html
 
# Expose port 80 (HTTP)
EXPOSE 80
 
# When container starts, it runs nginx
CMD ["nginx", "-g", "daemon off;"]
```
 
**Explanation:**
- `FROM nginx:latest` - Use NGINX as the base (lightweight web server)
- `COPY . /usr/share/nginx/html` - Copy all your files to NGINX's serving directory
- `EXPOSE 80` - Container will listen on port 80 (HTTP)
- `CMD` - Command to run when container starts

### Step 4.1: Create/Update Your Dockerfile
 
**On your local machine** (not on EC2):
 
Create a file named `Dockerfile` in your project root with content:
```dockerfile
FROM nginx:alpine
 
# Copy all project files to NGINX directory
COPY . /usr/share/nginx/html/
 
# Copy custom NGINX config (optional)
COPY nginx.conf /etc/nginx/nginx.conf
 
EXPOSE 80
 
CMD ["nginx", "-g", "daemon off;"]
```
 
### Step 4.2: Create .dockerignore
 
**On your local machine:**
 
Create a file named `.dockerignore` to exclude unnecessary files:
```
node_modules
.git
.gitignore
.env
README.md
.DS_Store
*.log
```
### Step 4.3: Create nginx.conf (Optional but Recommended)
 
**On your local machine:**
 
Create a file named `nginx.conf` file:
```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;
 
events {
    worker_connections 1024;
}
 
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
 
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
 
    access_log /var/log/nginx/access.log main;
 
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;
 
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml application/atom+xml image/svg+xml 
               text/x-js text/x-component text/x-cross-domain-policy;
 
    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
 
        location / {
            try_files $uri $uri/ /index.html;
            expires 1d;
            add_header Cache-Control "public, immutable";
        }
 
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }
}
```
 
**What this does:**
- Configures NGINX to serve your files
- Enables compression for faster loading
- Sets up caching for assets
- Handles routing properly


## PHASE 5: Jenkins Installation & Configuration
 
### Step 5.1: Access Jenkins Web Interface
 
**On your local machine:**
 
1. Open browser and go to:
```
http://YOUR_EC2_IP:8080
```
 
2. You'll see Jenkins asking for an unlock key
3. On your EC2 server, get the unlock key:
```bash
# On EC2 terminal
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```
 
4. Copy this key and paste it into Jenkins
5. Click "Continue"
6. Click "Install suggested plugins" (wait for installation)
7. Create your first admin user:
   - Username: admin
   - Password: (choose a strong password)
   - Full name: Your Name
   - Email: your-email@example.com
8. Click "Save and Continue"
9. Keep Jenkins URL as is, click "Save and Finish"
10. Click "Start using Jenkins"
### Step 5.2: Install GitHub Plugin
 
**In Jenkins Web Interface:**
 
1. Click "Manage Jenkins" (left sidebar)
2. Click "Plugins"
3. Click "Available plugins"
4. Search for "GitHub Integration"
5. Check the box and click "Install without restart"
6. Also install:
   - "Git" plugin
   - "Docker Pipeline" plugin
7. Restart Jenkins: `sudo systemctl restart jenkins`
### Step 5.3: Add GitHub Credentials to Jenkins
 
**In Jenkins Web Interface:**
 
1. Click "Manage Jenkins"
2. Click "Credentials"
3. Click "System" → "Global credentials"
4. Click "Add Credentials"
5. **Kind**: Username with password
6. **Username**: Your GitHub username
7. **Password**: Your GitHub personal access token (see below)
8. **ID**: github-credentials
9. Click "Create"


**How to Get GitHub Personal Access Token:**
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Click "Generate new token"
3. **Name**: Jenkins Token
4. **Scopes**: Check `repo` and `admin:repo_hook`
5. Click "Generate token"
6. Copy the token (you'll only see it once!)
7. Use this as the **password** in Jenkins

## PHASE 6: CI/CD Pipeline Creation
 
### Step 6.1: Create Jenkinsfile
 
**On your local machine** (in project root):
 
Create a file named `Jenkinsfile`:
 
```groovy
pipeline {
    agent any
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '===== STAGE: Checkout ====='
                checkout scm
                echo 'Code checked out from GitHub'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '===== STAGE: Build Docker Image ====='
                script {
                    sh 'docker build -t portfolio:latest .'
                    echo 'Docker image built successfully'
                }
            }
        }
        
        stage('Stop Old Container') {
            steps {
                echo '===== STAGE: Stop Old Container ====='
                script {
                    sh '''
                        if [ "$(docker ps -q -f name=portfolio)" ]; then
                            echo "Stopping existing portfolio container"
                            docker stop portfolio || true
                            docker rm portfolio || true
                        else
                            echo "No existing container found"
                        fi
                    '''
                }
            }
        }
        
        stage('Deploy Container') {
            steps {
                echo '===== STAGE: Deploy Container ====='
                script {
                    sh '''
                        docker run -d \
                            --name portfolio \
                            -p 80:80 \
                            portfolio:latest
                        echo "Portfolio container deployed successfully"
                    '''
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                echo '===== STAGE: Verify Deployment ====='
                script {
                    sh '''
                        echo "Waiting for container to be ready..."
                        sleep 2
                        if [ "$(docker ps -q -f name=portfolio)" ]; then
                            echo "✓ Container is running"
                            docker ps | grep portfolio
                        else
                            echo "✗ Container failed to start"
                            exit 1
                        fi
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo '✓ Pipeline completed successfully!'
            echo '✓ Your portfolio is deployed at http://YOUR_EC2_IP'
        }
        failure {
            echo '✗ Pipeline failed'
            script {
                sh 'docker logs portfolio || echo "No container logs available"'
            }
        }
    }
}
```
 
**Explanation of Pipeline:**
- **Checkout**: Pulls latest code from GitHub
- **Build Docker Image**: Creates a Docker container image
- **Stop Old Container**: Removes the previous version
- **Deploy Container**: Runs the new version
- **Verify Deployment**: Checks if deployment was successful

### Step 6.2: Commit and Push Jenkinsfile
 
**On your local machine:**
 
```bash
git add Jenkinsfile
git commit -m "Add Jenkinsfile for CI/CD pipeline"
git push origin main
```
 
### Step 6.3: Create Jenkins Pipeline Job
 
**In Jenkins Web Interface:**
 
1. Click "New Item"
2. **Item name**: portfolio-pipeline
3. **Type**: Select "Pipeline"
4. Click "OK"
5. **General Tab**:
   - Check "GitHub project"
   - Project URL: `https://github.com/USERNAME/portfolio`
6. **Build Triggers Tab**:
   - Check "GitHub hook trigger for GITScm polling"
7. **Pipeline Tab**:
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: `https://github.com/USERNAME/portfolio.git`
   - **Credentials**: Select github-credentials
   - **Branch**: */main
   - **Script Path**: Jenkinsfile
8. Click "Save"

 
## PHASE 7: GitHub Webhooks Setup
 
### Step 7.1: Get Jenkins GitHub Hook URL
 
**In Jenkins Web Interface:**
 
Your Jenkins webhook URL is:
```
http://YOUR_EC2_IP:8080/github-webhook/
```
 
### Step 7.2: Add Webhook to GitHub Repository
 
**On GitHub:**
 
1. Go to your repository
2. Click "Settings" → "Webhooks"
3. Click "Add webhook"
4. **Payload URL**: `http://YOUR_EC2_IP:8080/github-webhook/`
5. **Content type**: application/json
6. **Events**: Just the push event
7. Check "Active"
8. Click "Add webhook"
**What this does:**
- Every time you push to GitHub, GitHub sends a message to Jenkins
- Jenkins receives the message and automatically starts the pipeline
- Code is automatically built, containerized, and deployed!

## PHASE 8: Testing & Troubleshooting
 
### Step 8.1: Manual Pipeline Test
 
**In Jenkins Web Interface:**
 
1. Go to "portfolio-pipeline" job
2. Click "Build Now"
3. Watch the console output
4. Should see all stages complete successfully
### Step 8.2: Test Webhook Automation
 
**On your local machine:**
 
1. Make a small change to `index.html`
2. Push to GitHub:
```bash
git add index.html
git commit -m "Test webhook automation"
git push origin main
```
3. Go to Jenkins dashboard
4. You should see a new build start automatically!
5. Visit `http://YOUR_EC2_IP` in your browser
6. You should see your updated portfolio!

## Final Deployment URL
Once everything is working, visit:
```
http://YOUR_EC2_IP
```
 
To see your portfolio website live!
 
---
 
## 🎉 Congratulations!
You've successfully set up a complete CI/CD pipeline! Now whenever you:
1. Push code to GitHub
2. GitHub automatically notifies Jenkins
3. Jenkins automatically builds Docker image
4. Jenkins automatically deploys new version
5. Your website updates in seconds!
---
 
## Next Steps (Advanced)
- Set up HTTPS with Let's Encrypt
- Configure auto-scaling
- Set up monitoring and alerts
- Use AWS RDS for databases (if needed later)
- Use AWS S3 for storing Docker images


### Common Issues & Solutions
 
| Issue | Cause | Solution |
|-------|-------|----------|
| Jenkins can't connect to GitHub | Wrong credentials | Verify GitHub personal access token |
| Docker permission denied | Jenkins can't run Docker | Run `sudo usermod -aG docker jenkins && sudo systemctl restart jenkins` |
| Container won't start | Dockerfile error | Check logs: `docker logs portfolio` |
| Webhook not triggering | Firewall/Security Group | Ensure EC2 Security Group allows port 8080 |
| Port 80 already in use | Another service using it | `sudo lsof -i :80` to find what's using it |

































































































































































