
function getJSONError (err) {
  const { 
    errno,
    code,
    syscall,
    message } = err;
  
  return {
    errno,
    code,
    syscall,
    message, 
  };
}

module.exports = {
  getJSONError
}