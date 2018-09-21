#!/bin/bash

set -o errexit

yarn && yarn build

scp build/* sbstn:/var/www/saas.sbstn.ca/client