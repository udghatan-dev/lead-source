export default (userRNP, permission) => {
  try {
    if (userRNP.role !== 'team_member') {
      return true;
    } else if (userRNP.permissions !== null && userRNP.permissions.indexOf(permission) !== -1) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
