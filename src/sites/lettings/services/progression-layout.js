'use strict';

const layoutType = 'progression-layout';
const groups = [
  {key: 'pre-tenancy', label: 'Pre-Tenancy', icon: 'fa-calendar-days', columns: [
    {key: 'hold', label: 'Hold', title: 'Holding Deposit'},
    {key: 'checks', label: 'Checks', title: 'Credit Check & SME'},
    {key: 'inventory-booked', label: 'Inv', title: 'Inventory Booked'},
    {key: 'pre-admin', label: 'Admin', title: 'Board & Window Updated', occurrence: 0}
  ]},
  {key: 'agreement', label: 'Agreement', icon: 'fa-file-signature', columns: [
    {key: 'agreement-issued', label: 'APT Sent', title: 'ASTA Issued'},
    {key: 'agreement-signed', label: 'APT Sign', title: 'ASTA Signed'}
  ]},
  {key: 'funds', label: 'Funds', icon: 'fa-coins', columns: [
    {key: 'deposit', label: 'Deposit', title: 'Security Deposit Received'},
    {key: 'rent', label: 'Rent', title: 'Rent Received'}
  ]},
  {key: 'move-in', label: 'Move-In', icon: 'fa-key', columns: [
    {key: 'inventory-issued', label: 'Inv Sent', title: 'Inventory Issued'},
    {key: 'move-booked', label: 'Move Time', title: 'Move In Booked'},
    {key: 'move-complete', label: 'Move Comp', title: 'Move In Complete'}
  ]},
  {key: 'finalisation', label: 'Finalisation', icon: 'fa-circle-check', columns: [
    {key: 'final-admin', label: 'Admin', title: 'Board & Window Updated', occurrence: 1},
    {key: 'accounts', label: 'L/L Paid', title: 'File To Accounts'},
    {key: 'meters', label: 'Meters', title: 'Readings On SME'},
    {key: 'complete', label: 'Comp', title: 'Rental Complete'}
  ]}
];
const columns = groups.reduce((all, group) => all.concat(group.columns.map((column, index) =>
  Object.assign({group: group.key, groupLabel: group.label, groupStart: index === 0, groupEnd: index === group.columns.length - 1}, column)
)), []);

function flatten(progression) {
  return (progression.milestones || []).reduce((all, branch) => all.concat(branch), []);
}

function referenceKey(progressionId, milestoneId) {
  return JSON.stringify([progressionId, milestoneId]);
}

function milestoneOptions(progressions) {
  return (progressions || []).reduce((all, progression) => {
    const milestones = flatten(progression);
    return all.concat(milestones.filter(milestone => milestone._id && milestone.title !== 'Start').map(milestone => ({
      key: referenceKey(progression._id, milestone._id),
      progressionId: progression._id,
      milestoneId: milestone._id,
      progressionName: progression.name,
      title: milestone.title,
      label: `${milestone.title} (step ${milestones.indexOf(milestone) + 1})`
    })));
  }, []);
}

function suggestMappings(progressions) {
  // Only suggest a complete, unambiguous template; never guess across progressions.
  const candidates = (progressions || []).map(progression => {
    const milestones = flatten(progression);
    const mapping = {};
    for (const column of columns) {
      const matches = milestones.filter(milestone => milestone.title === column.title);
      const expected = column.occurrence === undefined ? 1 : 2;
      if (matches.length !== expected || !matches[column.occurrence || 0]._id) return null;
      mapping[column.key] = referenceKey(progression._id, matches[column.occurrence || 0]._id);
    }
    return mapping;
  }).filter(Boolean);
  return candidates.length === 1 ? candidates[0] : {};
}

function selections(layout) {
  const result = {};
  for (const column of columns) {
    const reference = layout && layout.columns && layout.columns[column.key];
    if (reference) result[column.key] = referenceKey(reference.progressionId, reference.milestoneId);
  }
  return result;
}

function createLayout(selected, options, existing) {
  const references = {};
  const used = new Set();
  for (const column of columns) {
    const option = options.find(item => item.key === selected[column.key]);
    if (!option) throw new Error(`Select a milestone for ${column.groupLabel}: ${column.label}.`);
    if (used.has(option.key)) throw new Error('Each dashboard column must reference a different milestone.');
    used.add(option.key);
    references[column.key] = {progressionId: option.progressionId, milestoneId: option.milestoneId};
  }
  return Object.assign({}, existing, {type: layoutType, name: 'Progression layout', columns: references});
}

function timestamp(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const time = new Date(value).valueOf();
  return Number.isFinite(time) ? time : undefined;
}

function buildRow(property, layout) {
  const cells = columns.map(column => {
    const reference = layout && layout.columns && layout.columns[column.key];
    const progression = reference && (property.progressions || []).find(item => item._id === reference.progressionId);
    const matches = progression ? flatten(progression).filter(item => item._id === reference.milestoneId) : [];
    const milestone = matches.length === 1 ? matches[0] : null;
    const status = !milestone ? 'unavailable' : milestone.completed ? 'completed' :
      milestone.progressing ? 'progressing' : 'pending';
    const statusLabel = {unavailable: 'Milestone unavailable', completed: 'Completed', progressing: 'In progress', pending: 'Not started'}[status];
    return {
      key: column.key,
      groupStart: column.groupStart,
      groupEnd: column.groupEnd,
      status,
      description: `${column.groupLabel} / ${column.label}: ${milestone ? milestone.title : column.title} - ${statusLabel}`
    };
  });
  const completed = cells.filter(cell => cell.status === 'completed').length;
  const missing = cells.filter(cell => cell.status === 'unavailable').length;
  const address = property.Address || {};
  return {
    property,
    cells,
    completed,
    missing,
    percent: missing ? null : Math.round(completed / columns.length * 100),
    doa: timestamp(property.milestone && property.milestone.startTime),
    moveIn: timestamp(property.proposedMoving),
    address: [address.Number, address.Street].filter(Boolean).join(' '),
    search: [
      address.Number, address.Street, address.Locality, address.Town, address.Postcode,
      property.purchaser, property.vendor, property.TenantName, property.LandlordName,
      property.RoleId, property.reference, property.search
    ].filter(Boolean).join(' ').toLowerCase()
  };
}

module.exports = {layoutType, groups, columns, milestoneOptions, suggestMappings, selections, createLayout, buildRow};
