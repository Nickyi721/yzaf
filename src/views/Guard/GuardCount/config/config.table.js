export default {
  type: 'report',
  columns: [
    { field: 'secOrgName', name: '安保机构名称' },
    { field: 'secManageStaffCount', name: '管理人员数量', editable: true, type: 'link', },
    { field: 'secWorkStaffCount', name: '工作人员数量', editable: true, type: 'link' },
  ],
}
