docker run -d --name $1-prod --restart=on-failure:3 -e "REDIS_PWD=rsxzmmmmzxsr" -e "REDIS_PORT_6379_TCP_ADDR=37.187.158.128" -e "REDIS_PORT_6379_TCP_PORT=6380" eqwall/$1 
