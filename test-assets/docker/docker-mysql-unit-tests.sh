#!/bin/bash

container="container-mysql"

if [ "${1}" = "stop" ]
then
    echo "$(date) - stopping mysql container"
    docker stop ${container}
    docker rm ${container}
else
    if [ "${1}" = "start" ]
    then
        # always stop the container first to be sure any changes to the mysql script are loaded into the DB
        echo "$(date) - cleaning out and starting mysql docker container"
        docker stop ${container} > /dev/null 2>&1
        docker rm ${container} > /dev/null 2>&1

        docker run --name container-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=database -e MYSQL_USER=user -e MYSQL_PASSWORD=password -p 33068:3306 -d mysql
        echo "$(date) - connecting to mysql container"

        i=300 #timeout for container connection
        curl http://127.0.0.1:33068/ > /dev/null 2>&1

        while [ ${i} -gt 0 -a $? -ne 0 ]
        do
            echo "$(date) - still trying"
            sleep 1
            i=`expr ${i} - 1`
            curl http://127.0.0.1:33068/ > /dev/null 2>&1
        done

        if [ ${i} -eq 0 ]
        then
            echo "$(date) - connection failed"
            exit 1 #timeout
        else
            echo "$(date) - connected successfully"
        fi

        cat test-assets/docker/cloud_db_unit_tests.sql | mysql -h 127.0.0.1 -P 33068 -u root -ppassword database
    else
        echo "Usage: ${0} start | stop"
    fi
fi
