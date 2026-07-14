// C-5: segregation of duties. A user must never approve, clear, isolate, or
// verify a permit they themselves raised — even when their account holds
// both the Requester capability and the acting capability (e.g. a
// Requester + Approver account approving their own request). This is a
// hard block, not a warning: the acting screen must refuse the action.
export function isOwnPermit(permit, currentUser) {
  return !!permit && !!currentUser && permit.requester === currentUser.name;
}
