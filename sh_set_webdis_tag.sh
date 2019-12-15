#!/bin/bash
value=`date +%Y-%m-%d-%Hh%Mm%S`
echo Set it to $value
curl "http://127.0.0.1:7379/SET/tag/${value}"
echo

