# Use a lightweight web server image
FROM nginx:alpine

# Copy the build files to the Nginx HTML folder
COPY build/ /usr/share/nginx/html

# Expose the Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
