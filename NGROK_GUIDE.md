# ngrok Setup Guide
# --------------------
# To expose your local Docker container to the internet:
#
# 1. Ensure your Docker container is running on port 80:
#    docker build -t portfolio-3d .
#    docker run -d -p 80:80 portfolio-3d
#
# 2. Install ngrok if you haven't already.
#
# 3. Authenticate your ngrok agent:
#    ngrok config add-authtoken <your-token>
#
# 4. Start the tunnel:
#    ngrok http 80
#
# 5. Copy the forwarding URL (e.g., https://random-id.ngrok-free.app) and share it!
