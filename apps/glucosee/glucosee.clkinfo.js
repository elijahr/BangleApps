(function () {
  const glucosee = require("glucosee.lib.js");
  glucosee.startListening();
  return glucosee.getClockInfo();
}) // must not have a semi-colon!

