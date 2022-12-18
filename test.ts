import bcrypt from "bcrypt";

bcrypt.hash("asdasfdasdfasff", 10).then((e) => {
  console.log(e);
});
