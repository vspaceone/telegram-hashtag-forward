pipeline {
    agent any
    environment {
        dockerImage = ''
        DOCKER_CREDENTIALS = 'docker-hub-vspaceone'
        DOCKER_IMAGE = 'vspaceone/telegram-hashtag-forward'
    }
    stages {
        stage('Build image') {
            steps {
                script {
                    dockerImage = docker.build("$DOCKER_IMAGE")
                }
            }
        }
        stage('Push latest image') {
            when {
                expression { env.BRANCH_NAME == 'master' }
            }
            steps {
                script {
                    docker.withRegistry( '', DOCKER_CREDENTIALS ) {
                        dockerImage.push("latest")
                    }                    
                }
            }
        }
        stage('Push develop image') {
            when {
                expression { env.BRANCH_NAME == 'develop' }
            }
            steps {
                script {
                    docker.withRegistry( '', DOCKER_CREDENTIALS ) {
                        dockerImage.push("develop")
                    }
                }
            }
        }
    }
}