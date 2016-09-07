# PostGraphQL - Docker File

Work provided by Simon Kuldin (kuldins@gmail.com) and Dammian Miller (dammian.miller@gmail.com)

## Usage
1. Make sure you have Docker-compose installed (https://docs.docker.com/compose/install/)
2. Go to the Docker folder in this Postgraphql reporting
3. Run "docker-compose build" from the terminal/command prompt.
4. Once finished, run "docker-compose up"
5. To open the PostGraphQL instance, find the IP address of the Docker Machine it's running in and use that in the browser at port 3000.  (eg. http://192.168.99.102:3000/)

## Thanks
Thanks heaps to everyone who has already contributed to PostGraphQL, especially @calebmer for his help!
##
Please note, if you have problems running this in a Windows environment, you might be having a problem where all the script files (eg. *.sh) are converted to Windows line-ending when checked out from GITHub but
need to be converted to Unix line-ending to work.  You can overcome this issue downloading and utilising a tool such as dos2unix which can convert line endings for specified files.