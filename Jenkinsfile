pipeline {
    agent any
    environment {
        dockerImage = ''
        DOCKER_CREDENTIALS = 'docker-hub-vspaceone'
        DOCKER_IMAGE = 'vspaceone/telegram-hashtag-forward'

        MASTER_STAGE_WEBHOOK = credentials('vspaceone-webhook-thf-bot')
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
        stage('Send master webhooks') {
            when {
                expression { env.BRANCH_NAME == 'master' }
            }
            steps {
                sh "curl $MASTER_STAGE_WEBHOOK"
            }
        }
    }
}