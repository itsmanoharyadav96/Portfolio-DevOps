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