#!/bin/bash

# Client
cd client
ng build --prod

# Backend
cd ../
gulp bundle