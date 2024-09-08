(function () {
  console.info("glucosee: setting up clkinfo");
  const glucosee = require("glucosee.lib.js");
  glucosee.startListening();
  console.info("glucosee: set up clkinfo");
  return glucosee.getClockInfo();
}) // must not have a semi-colon!

