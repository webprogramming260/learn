#!/bin/bash

while getopts k:h:s: flag
do
    case "${flag}" in
        k) key=${OPTARG};;
        h) hostname=${OPTARG};;
    esac
done

if [[ -z "$key" || -z "$hostname" ]]; then
    printf "\nMissing required parameter.\n"
    printf "  syntax: deployFiles.sh -k <pem key file> -h <hostname>\n\n"
    exit 1
fi

printf "\n----> Deploying files to $hostname with $key\n"

# Step 1
printf "\n----> Clear out the previous distribution on the target.\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
rm -rf public_html/instruction
mkdir -p public_html/instruction
ENDSSH

# Step 2
printf "\n----> Copy the distribution package to the target.\n"
scp -r -i "$key" * ubuntu@$hostname:public_html/instruction
