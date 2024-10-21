#!/bin/bash

# Update package lists and install Node.js and Nginx
sudo apt-get update
sudo apt-get install -y nodejs npm nginx

# Navigate to your React app directory
cd /var/www/html

# Install the project dependencies
npm install
