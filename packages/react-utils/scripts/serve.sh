#!/bin/sh
set -e

node node_modules/@athenajs/react-utils/dist/config-node.js

serve -s dist -l "tcp://0.0.0.0:$PORT"
