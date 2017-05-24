#!/bin/bash
JAVA_HOME=/usr/bin

if [[ -z $ES_DIR ]]; then
    ES_DIR="${HOME}/work/elasticsearch-5.4.0/"
fi

if [[ -z $ES_PORT ]]; then
    ES_PORT=9212
fi

if [[ -z $ES_HEAP_SIZE ]]; then
    ES_HEAP_SIZE="2g"
fi

echo "JAVA_HOME: $JAVA_HOME ES_DIR: $ES_DIR $ES_PORT"

ES_DATA_DIR="${HOME}/data/es_data"
ES_LOG_DIR="${HOME}/data/es_log"

[ ! -d $ES_DATA_DIR ] && mkdir -p $ES_DATA_DIR
[ ! -d $ES_LOG_DIR ] && mkdir -p $ES_LOG_DIR

if [[ -f ${ES_DATA_DIR}/es.pid ]] ; then
    echo "killing es"
    kill -9 $(<  $ES_DATA_DIR/es.pid)  
else 
    echo "ES not running..."
fi


$ES_DIR/bin/elasticsearch \
        --pidfile $ES_DATA_DIR/es.pid \
        --daemonize \
        -Ehttp.port=$ES_PORT \
        -Epath.data=$ES_DATA_DIR \
        -Epath.logs=$ES_LOG_DIR

