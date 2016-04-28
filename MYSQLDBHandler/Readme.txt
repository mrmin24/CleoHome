


du -shc /var/lib/mysql/*   //get size of files

find ~ -size +20M   //find big files

service mysql stop

mysqldump --databases CleoHomeDB --single-transaction --add-drop-database --triggers --routines --events --user=CleoUser --password > CleoHomeDB_database_backup.sql    //dump


rm /var/lib/mysql/ibdata1   /remove files
rm /var/lib/mysql/ib_logfile*   /remove files

service mysql start

mysql -uroot -p < /var/lib/cloud9/Projects/CleoHome/CleoHomeDB_database_backup.sql   //restore DB



