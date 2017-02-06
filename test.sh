#!/bin/sh
host="http://localhost:3000"

echo "#delete all records"
curl -X DELETE "${host}/api/contacts/delete"
echo " "
echo " "
echo "#add contacts:"
curl -X POST --data "name=Ivan&fam=Petrov&number=123456789" "${host}/api/contacts"
echo " "
curl -X POST --data "name=Alex&fam=Prosto&number=999" "${host}/api/contacts"
echo " "
curl -X POST --data "name=Petr&fam=First&number=1700" "${host}/api/contacts"
echo " "
curl -X POST --data "name=Petr&fam=Second&number=555" "${host}/api/contacts"
echo " "
curl -X POST --data "name=Ivan&fam=Sidorov&number=(495)2223334" "${host}/api/contacts"
echo " "
echo " "
echo " "

echo "#get list contacts:"
curl -X GET "${host}/api/contacts"
echo " "
echo " "

echo "#get contact by number:999"
curl -X GET "${host}/api/contacts/tel/999"
echo " "
echo " "

echo "#get contacts by name=Ivan"
curl -X GET "${host}/api/contacts/name/Ivan"
echo " "
echo " "

echo "#get contact by fam=Second"
curl -X GET "${host}/api/contacts/fam/Second"
echo " "
echo " "

# _id not yet known
#echo "#update contact by id=5898edade37d571312783a8d"
#curl -X PUT -d name=NEW "${host}/api/contacts/id/5898edade37d571312783a8d"
#echo " "
#echo " "

echo "#delete contact by tel=999"
curl -X DELETE "${host}/api/contacts/tel/999"
echo " "
echo " "

echo "#get list contacts:"
curl -X GET "${host}/api/contacts"
echo " "
echo " "

