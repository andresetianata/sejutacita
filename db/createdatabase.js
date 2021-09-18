//this is for in case you want to create mongodb database and user, manually

db.createUser(
  {
    user: "sejutacita",
    pwd: passwordPrompt(),
    roles: [ { role: "readWrite", db: "users_db" } ]
  }
);
//password: andre2021

//masuk ke db `users_db`, lalu create collection 'users'
db.createCollection("users");