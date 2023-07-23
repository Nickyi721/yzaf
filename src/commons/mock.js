export default {
  '/params/getSjzdListData': {
    'data': {
      '030301': [{
        "c_sjibm": "030301",
        "c_sjnr": "金融机构和网点的营业场所评分",
        "c_sjubm": "03030101",
        "n_sfmj": 1
      }, {
        "c_sjibm": "030301",
        "c_sjnr": "安全保卫基础工作评分",
        "c_sjubm": "03030102",
        "n_sfmj": 1
      }, {
        "c_sjibm": "030301",
        "c_sjnr": "案件防范评分",
        "c_sjubm": "03030103",
        "n_sfmj": 1
      }, {
        "c_sjibm": "030301",
        "c_sjnr": "枪支弹药安全评分",
        "c_sjubm": "03030104",
        "n_sfmj": 1
      }, {
        "c_sjibm": "030301",
        "c_sjnr": "数据中心及联网监控中心安全评分",
        "c_sjubm": "03030105",
        "n_sfmj": 1
      }, {
        "c_sjibm": "030301",
        "c_sjnr": "消防安全评分",
        "c_sjubm": "03030106",
        "n_sfmj": 1
      }, {
        "c_sjibm": "030301",
        "c_sjnr": "运钞安全评分",
        "c_sjubm": "03030107",
        "n_sfmj": 1
      }, {
        "c_sjibm": "030301",
        "c_sjnr": "自助设备、自助银行安全评分",
        "c_sjubm": "03030108",
        "n_sfmj": 1
      }, {
        "c_sjibm": "030301",
        "c_sjnr": "业务库、保险箱库安全评分",
        "c_sjubm": "03030109",
        "n_sfmj": 1
      }],
    }
  },
  // 查询安全保卫机构树
  '/secOrg/getSecOrgTree': {
    'responseData': [
      {
        id: 0,
        label: '中国邮政集团公司',
        children: [
          {
            id: 1,
            label: '中国邮政储蓄银行保卫部',
            children: []
          },
          {
            id: 2,
            label: '中国邮政集团公司保卫部',
            children: []
          },
          {
            id: 3,
            label: '北京市',
            children: [
              {
                label: '北京市邮政公司保卫部'
              },
              {
                label: '北京分行保卫部'
              },
              {
                label: '东区'
              },
            ]
          },
          {
            id: 4,
            label: '天津市',
            children: []
          },
        ]
      }
    ]
  },
  // 查询安全保卫机构列表
  '/secOrg/getSecurityOrgList': {
    'responseData|1-5': [
      {
        'secOrgName': '中国邮政储蓄银行保卫部',
        'secOrgType': '专设',
        'secOrgAddr': '北京市',
        'proSecStaffCount': '10',
        'partTimeSecStaffCount': '23',
        'postCode': '100000',
        'secOrgPhone': '010-80000000'
      }
    ]
  },
  //
  '/secOrg/getSecurityManageStaffList': {
    'responseData|1-5': [
      {
        'secOrgName': '中国邮政集团公司邮政银行',
        'name': '上官某',
        'sex': '男',
        'post': '科级管理人员',
        'birthday': '1958-09-18',
        'timeToStartWork': '1980-06-30',
        'politicsStatus': '党员',
        'educationDegree': '高中',
        'workType': '专职',
        'workStatus': '现职',
      }
    ]
  },
  //
  '/secOrg/getSecurityWorkStaffList': {
    'responseData|1-5': [
      {
        'secOrgName': '中国邮政集团公司邮政银行',
        'name': '牛某',
        'sex': '男',
        'post': '保安员',
        'timeToStartSafWork': '1980-06-30',
        'educationDegree': '高中',
        'emplType': '合同工',
        'safGuaCertificate': '有',
        'gunCertificate': '有',
        'fireProQuaCertificate': '有',
      }
    ]
  },
  // 安保机构统计
  '/secOrg/setSecStatistics': {
    'responseData|1-5': [
      {
        'secOrgName': '北京市邮政公司保卫部',
        'secManageStaffCount': '7',
        'secWorkStaffCount': '5',
      }
    ]
  },


  // 基础数据-数据字典
  '/params/getDicList': {
    'responseData|1-5': [
      {
        'queryType': '本级',
        'code': '001001',
        'parentCode': '001',
        'content': 'xxxx',
        'isLastLevel': '是',
        'order': '1'
      }
    ]
  },
  // 查询单位基础数据列表
  '/org/getOrgList': {
    'responseData|1-5': [
      {
        'orgCode': '100102',
        'orgName': '湖南省邮政储蓄银行',
        'orgType': '银行',
        'branchType': '中国邮政储蓄银行',
        'province': '湖南省',
        'city': '长沙市',
        'county': '芙蓉区',
        'POSTCode': '410000',
        'leader': '某某某',
        'practicalAddress': '湖南省长沙市开福区北辰三角洲奥城E3(黄兴北路西)',
        'actualAddres': '湖南省长沙市开福区北辰三角洲奥城E3(黄兴北路西)',
        'branchPhone': '0731-22222222',
        'leaderPhone': '13400000000',
        'financeCertificate': '',
        'branchStatus': '',
        'onlineLogo': '',
        'longitude': '',
        'latitude': ''
      }
    ]
  },
  // 查询安防设施信息列表
  '/safety/getItemList': {
    'responseData|1-6': [
      {
        'itemType': '金融营业场所',
        'itemName': '邮储银行',
        'itemInputType': '手工录入',
        'isRequired': '必填',
        'dataLength': '50',
        'linkId': 'xxx',
        'linkType': 'xxx',
        'dataType': '数字',
        'order': '6',
        'asQueryCondition': '',
        'itemContent': '对应基础数据表类型管理功能中的信息'
      }
    ]
  },
  // 查询安全评估时间列表
  '/system/getTimeSchedualList': {
    'responseData': [
      {
        'startTime': '2018-11-01',
        'endTime': '2018-11-20',
        'operateTime': '2018-11-19',
        'operator': '张三',
        'status': '结束'
      },
      {
        'startTime': '2018-11-01',
        'endTime': '2018-11-20',
        'operateTime': '2018-11-19',
        'operator': '李四',
        'status': '结束'
      }
    ]
  },
  // 新增安全评估时间
  '/system/addTimeSchedual': {
    'responseData': [
      {
        'startTime': '2018-11-01',
        'endTime': '2018-11-20',
        'operateTime': '2018-11-19',
        'operator': 'XXXX',
        'status': '结束'
      }
    ]
  },
  // 查询安全评估信息列表
  '/paramConfig/getFinSecEvaBasicInfoList': {
    'responseData|1-8': [
      {
        'itemType': '消防安全评分',
        'itemName': '23132104242',
        'itemInputType': '手工录入',
        'isRequired': '必填',
        'dataLength': '50',
        'dataType': '数字',
        'order': '10'
      }
    ]
  },
  // 查询隐患词条列表
  '/riskItem/getRiskItemList': {
    'responseData|1-6': [
      {
        'busiLine': '消防安全',
        'node': 'GPS系统',
        'type': '管理类',
        'checkWay': '现场检查',
        'status': '启用',
        'content': 'XX'
      }
    ]
  },
  // 查询安全检查列表
  '/safeCheck/getSafCheTabList': {
    'responseData|1-7': [
      {
        'name': '消防安全',
        'creator': '李四',
        'createTime': '2018-11-11'
      }
    ]
  },
  // 查询风险管控列表
  '/safetyPostal/getRiskControlList': {
    'responseData|1-6': [
      {
        'num': '',
        'year': '2018',
        'riskControlOption': '发生金融资金案件，涉案金额10万元',
        'deduction': '10',
        'file': ''
      }
    ]
  },
  // 查询用户列表
  '/system/getUserList': {
    'responseData|1-5': [
      {
        'userName': 'test1',
        'userNickName': '测试1',
        'userRole': '超级管理员',
        'creator': '王五',
        'createTime': '2018-11-15',
        'orgName': '湖南邮政'
      }
    ]
  },
  // 查询角色列表
  '/system/getRoleList': {
    'responseData|1-5': [
      {
        'roleName': '超级管理员',
        'creator': '张三',
        'createTime': '2018-11-12',
        'remarks': 'super'
      }
    ]
  },
  // 查询工作组列表
  '/workGroup/getWorkGroupList': {
    'responseData|1-5': [
      {
        'groupName': '第一组',
        'groupLeaderName': '土豆',
        'fromTime': '2018-11-12',
        'toTime': '2018-11-30',
        'scorekeeper': '老王',
        'members': '赵、钱、孙、李',
        'createTime': '2018-11-12'
      }
    ]
  },
  // 查询群组列表
  '/groups/getGroupList': {
    'responseData|1-5': [
      {
        'groupName': '第一组',
        'groupDiscription': 'XXXXXX'
      }
    ]
  },
  // 信息发布-信息查询列表
  '/messages/getAcceptMsgList': {
    'responseData|1-6': [
      {
        'acceptDept': '湖南邮政长沙分公司',
        'msgTitle': '关于做好冬季消防检查的通知',
        'msgType': '安全工作通知',
        'msgStatus': '待办',
        'startTime': '2018-11-01',
        'endTime': '2019-03-01'
      }
    ]
  },
  // 发布信息/审批信息 查询列表
  '/messages/getReleaseMsgList': {
    'responseData|1-6': [
      {
        'msgTitle': '中华人民共和国消防救援衔标志式样和佩带办法 ',
        'msgType': '安全工作通知',
        'releaseDept': '中国邮政集团',
        'releaseTime': '2018-11-01',
        'creator': '周XX',
        'approver': '李XX',
        'approveStatus': '待办',
        'isSMS': '否'
      }
    ]
  },
  // 信息上报-上报信息查询/上报信息管理 列表
  '/report/getReportMsgList': {
    'responseData|1-6': [
      {
        'msgTitle': '派送车辆',
        'msgType': '交通事故',
        'occurrentPlace': '派送车辆',
        'occurrentTime': '2018-11-05',
        'occurrentDept': '福建邮政厦门分公司',
        'reportTime': '2018-11-07',
        'reportDept': '福建邮政厦门分公司',
        'isSMS': '是',
        'level': '市级',
        'reportStatus': '初报'
      }
    ]
  },
  // 信息上报-统计分析 列表
  '/census/getReportCensus1': {
    'responseData|1-5': [
      {
        'msgTitle': '测试',
        'msgType': '报表模板的名称',
        'occurrentPlace': '2018-11-07',
        'occurrentTime': '福建邮政厦门分公司',
        'occurrentDept': '进行中',
        'reportTime': '未上报',
        'reportDept': '进行中',
        'level': '进行中',
        'reportStatus': '进行中'
      }
    ]
  },
  // 报表上报-任务查询 列表
  '/tasks/getTaskFromList': {
    'responseData|1-6': [
      {
        'taskName': '测试',
        'formTemplateName': '报表模板的名称',
        'taskTime': '2018-11-07',
        'organizatioin': '福建邮政厦门分公司',
        'taskStatus': '进行中',
        'reportStatus': '未上报'
      }
    ]
  },
  // 报表上报-任务发布 列表
  '/tasks/getTaskToList': {
    'responseData|1-6': [
      {
        'taskName': '测试',
        'formTemplateName': '报表模板的名称',
        'taskTime': '2018-11-07',
        'organizatioin': '福建邮政厦门分公司',
        'taskStatus': '进行中',
        'reportStatus': '未上报'
      }
    ]
  },
  // 报表上报-上报报表查询 列表
  '/tasks/getTaskReportList': {
    'responseData|1-5': [
      {
        'taskName': '测试111',
        'formTemplateName': '报表模板的名称',
        'organizatioin': '福建邮政厦门分公司',
        'taskTime': '2018-11-07',
        'taskStatus': '进行中'
      }
    ]
  },
  // 报表上报-自定义报表 列表
  '/template/getFormTemplateList': {
    'responseData|1-6': [
      {
        'templateName': '测试111',
        'description': '报表说明'
      }
    ]
  },
  // 报表上报-统计报表 列表
  '/tasks/getStatisticsResult': {
    'responseData|1-6': [
      {
        'formTemplateName': '测试111',
        'organizatioin': '邮储银行',
        'resultData': '报表说明'
      }
    ]
  },
  // 金融安防设施管理-营业场所信息 列表
  '/safety/getBusiPlaceList': {
    'responseData|1-6': [
      {
        'condition1': '条件1',
        'condition2': '条件2',
        'condition3': '条件3',
        'condition4': '条件4',
        'condition5': '条件5',
        'organization': '邮储银行',
        'creator': '王某某',
        'createTime': '2018-11-17'
      }
    ]
  },
  // 金融安防设施管理-网点四类业务库 列表
  '/safety/getFourTypesVaultList': {
    'responseData|1-6': [
      {
        'condition1': '条件1',
        'condition2': '条件2',
        'condition3': '条件3',
        'condition4': '条件4',
        'condition5': '条件5',
        'organization': '邮储银行',
        'creator': '王某某',
        'createTime': '2018-11-17'
      }
    ]
  },
  // 金融安防设施管理-自助设备 列表
  '/safety/getAutoDeviceList': {
    'responseData|1-6': [
      {
        'condition1': '条件1',
        'condition2': '条件2',
        'condition3': '条件3',
        'condition4': '条件4',
        'condition5': '条件5'
      }
    ]
  },
  // 金融安防设施管理-中心业务库 列表
  '/safety/getCBVaultList': {
    'responseData|1-6': [
      {
        'condition1': '条件1',
        'condition2': '条件2',
        'condition3': '条件3',
        'condition4': '条件4',
        'condition5': '条件5',
        'organization': '邮储银行',
        'creator': '王某某',
        'createTime': '2018-11-17'
      }
    ]
  },
  // 金融安防设施管理-自助银行 列表
  '/safety/getATMList': {
    'responseData|1-6': [
      {
        'condition1': '条件1',
        'condition2': '条件2',
        'condition3': '条件3',
        'condition4': '条件4',
        'condition5': '条件5',
        'organization': '邮储银行',
        'creator': '王某某',
        'createTime': '2018-11-17'
      }
    ]
  },
  // 金融安防设施管理-运钞信息 列表
  '/safety/getCashCarrierInfoList': {
    'responseData|1-6': [
      {
        'condition1': '条件1',
        'condition2': '条件2',
        'condition3': '条件3',
        'condition4': '条件4',
        'condition5': '条件5',
        'organization': '邮储银行',
        'creator': '王某某',
        'createTime': '2018-11-17'
      }
    ]
  },
  // 金融安防设施管理-枪弹信息 列表
  '/safety/getGunAndAmmunitionInfoList': {
    'responseData|1-6': [
      {
        'condition1': '条件1',
        'condition2': '条件2',
        'condition3': '条件3',
        'condition4': '条件4',
        'condition5': '条件5',
        'organization': '邮储银行',
        'creator': '王某某',
        'createTime': '2018-11-17'
      }
    ]
  },
  // 金融安防设施管理-安防设施信息统计 列表
  '/score/get...XXX...ScoreList': {
    'responseData|1-6': [
      {
        'orgName': '湖南邮政长沙分公司',
        a: 19,
        b: 8,
        c: 11,
        d: 30,
        e: 17,
        f: 13,
        g: 20,
      }
    ]
  },
  // 金融安全评估-安全评估/安全评估查询 列表
  '/finSecEva/getFinSecEvaList': {
    'responseData|1-6': [
      {
        'orgName': '长沙市分公司',
        'order': '12',
        'score': '87',
        'level': '良好',
        'time': '2017-12-16',
        'status': '正在评估',
        'evaluaterOrg': '湖南省分公司',
        'evaluater': '赵XX',
        'evaGroup': 'XXX',
        'approver': '王XX',
        'appAdvice': '良好'
      }
    ]
  },
  // 金融安全评估-安全评估审核 列表
  '/finSecEva/getFSEvaNotAuditList': {
    'responseData|1-6': [
      {
        'orgName': '长沙市分公司',
        'evaScore': '87',
        'evaLevel': '良好',
        'evaTime': '2017-12-16',
        'evaStatus': '',
        'evaluaterOrg': '湖南省分公司',
        'evaluater': '赵XX',
        'evaGroup': 'XXX',
        'approver': '王XX',
        'appAdvice': '良好'
      }
    ]
  },
  // 金融安全评估-组合统计查询 列表
  '/finSecEva/getComEvaluatedList': {
    'responseData|1-6': [
      {
        'orgName': '湖南省分公司',
        'total': '87',
        'Condition1': 'xx',
        'Condition2': 'xx',
        'Condition3': 'xxx',
        'Condition4': 'xx',
        'Condition5': 'xxx'
      }
    ]
  },
  // 安全检查与隐患整改-安全检查计划发布 列表
  '/checkPlan/getPublishedCheckPlanList': {
    'responseData|1-6': [
      {
        'name': '中国邮政',
        'fromTime': '2018-01-01',
        'toTime': '2018-12-30',
        'status': '进行中',
        'orgId': ''
      }
    ]
  },
  // 安全检查与隐患整改-安全检查表录入 列表
  '/checkPlan/getReceivedCheckPlanList': {
    'responseData|1-6': [
      {
        'name': '中国邮政',
        'deadline': '2018-12-30',
        'status': '进行中',
        'reportStatus': ''
      }
    ]
  },
  // 安全检查与隐患整改-安全检查表查询 列表
  '/checkPlan/getReportedCheckPlanList': {
    'responseData|1-6': [
      {
        'name': '中国邮政',
        'deadline': '2018-12-30',
        'status': '进行中',
        'receivedOrg': '',
        'infoStatus': ''
      }
    ]
  },
  // 安全检查与隐患整改-非现场检查 列表
  '/safeCheck/getOffSiteCheList': {
    'responseData|1-6': [
      {
        'time': '2018-12-30',
        'org': '湖南邮政'
      }
    ]
  },
  // 安全检查与隐患整改-安全检查报告 列表
  '/safeCheck/getSafCheRepList': {
    'responseData|1-6': [
      {
        'name': '',
        'checkedOrg': '湖南邮政',
        'deadline': '2018-12-30',
        'planStatus': '',
        'status': '进行中'
      }
    ]
  },
  // 安全检查与隐患整改-隐患统计 列表
  '/safeCheck/getRiskList': {
    'responseData|1-6': [
      {
        'orgName': '湖南邮政',
        'riskCount': '5',
        'rectificationCount': '3'
      }
    ]
  },
  // 平安邮政-安全管理工作查询 列表
  '/safetyPostal/getSaveBaseWorkList': {
    'responseData|1-6': [
      {
        'workName': 'XXX',
        'workEndTime': '2018-12-15',
        'workStatus': '进行中',
        'orgName': '湖南邮政',
        'msgStatus': '****',
        'feedbackTime': '2018-11-20',
        'feedbackUser': '薛某某'
      }
    ]
  },
  // 平安邮政-安全管理工作发布 列表
  '/safetyPostal/getPublishedWorkPlanList': {
    'responseData|1-6': [
      {
        'workName': 'XXX',
        'workEndTime': '2018-12-15',
        'workStatus': '进行中'
      }
    ]
  },
  // 平安邮政-安全管理工作汇报 列表
  '/safetyPostal/getReportSaveBaseWorkList': {
    'responseData|1-6': [
      {
        'workName': 'XXX',
        'workEndTime': '2018-12-15',
        'workStatus': '进行中'
      }
    ]
  },
  // 平安邮政-年度重点工作查询/重点工作登记 列表
  '/safetyPostal/getYearBaseWork': {
    'responseData|1-6': [
      {
        'orgName': '湖南邮政',
        'year': '2018',
        'checkStatus': '未审核'
      }
    ]
  },
  // 平安邮政-风险管控考核 列表
  '/safetyPostal/getRiskControlCheckList': {
    'responseData|1-6': [
      {
        'orgName': '湖南邮政',
        'year': '2018',
        'riskControlScore': '',
        'score': '89'
      }
    ]
  },
  // 平安邮政-年终自评打分 列表
  '/safetyPostal/getAssesEndOfYearList': {
    'responseData|1-6': [
      {
        'year': '2018',
        'assessProject': 'xx',
        'assessMoment': 'xx',
        'scoassessContentre': 'xx',
        'assessBasis': 'xx',
        'normalScore': '100',
        'assessSelfScore': '90',
        'assessScore': '89',
        'assessOrg': '中国邮政'
      }
    ]
  },
  // 平安邮政-年终自评审核 列表
  '/safetyPostal/getAssesEndOfYearCheckList': {
    'responseData|1-6': [
      {
        'year': '2018',
        'assessProject': 'xx',
        'assessMoment': 'xx',
        'scoassessContentre': 'xx',
        'assessBasis': 'xx',
        'normalScore': '100',
        'assessSelfScore': '90',
        'assessScore': '89',
        'assessOrg': '中国邮政'
      }
    ]
  },
  // 平安邮政-集团公司考评 列表
  '/safetyPostal/getAssesByCompanyList': {
    'responseData|1-5': [
      {
        'year': '2018',
        'orgName': '中国邮政',
        'assessSelfScore': '90',
        'assessScore': '89',
        'complexScore': '89',
        'assessStatus': '已考评',
        'assessLevel': '合格'
      }
    ]
  },
  // 平安邮政-年终考评统计 列表
  '/safetyPostal/getAssesCount': {
    'responseData|1-5': [
      {
        'year': '2018',
        'orgName': '中国邮政',
        'assessSelfScore': '90',
        'assessScore': '89',
        'complexScore': '89',
        'assessLevel': '合格',
        'tb': '增长1%'
      }
    ]
  },
  // 资料库-资料下载 列表
  '/database/getdatabaseDownloadList': {
    'responseData|1-5': [
      {
        'fileType': '集团公司安全管理文件',
        'fileName': '中国邮政XXX',
        'user': '丁某某',
        'time': '2018-02-20',
        'status': '未审核',
        'checkMsg': ''
      }
    ]
  },
  // 资料库-资料上传 列表
  '/database/getDatabaseList': {
    'responseData|1-5': [
      {
        'fileType': '集团公司安全管理文件',
        'fileName': '中国邮政XXX',
        'user': '丁某某',
        'time': '2018-02-20',
        'status': '未审核',
        'checkMsg': ''
      }
    ]
  },
  // 资料库-资料审批 列表
  '/database/getDatabaseCheckList': {
    'responseData|1-5': [
      {
        'fileType': '集团公司安全管理文件',
        'fileName': '中国邮政XXX',
        'user': '丁某某',
        'time': '2018-02-20',
        'status': '未审核',
        'checkMsg': ''
      }
    ]
  }
}
