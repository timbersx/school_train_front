export default {
  route: {
    documentation: 'Documentation',
    guide: 'Guide',
    permission: 'Permission',
    pagePermission: 'Page Permission',
    rolePermission: 'Role Permission',
    directivePermission: 'Directive Permission',
    icons: 'Icons',
    components: 'Components',
    tinymce: 'Tinymce',
    markdown: 'Markdown',
    jsonEditor: 'JSON Editor',
    dndList: 'Dnd List',
    splitPane: 'SplitPane',
    avatarUpload: 'Avatar Upload',
    dropzone: 'Dropzone',
    sticky: 'Sticky',
    countTo: 'Count To',
    componentMixin: 'Mixin',
    backToTop: 'Back To Top',
    dragDialog: 'Drag Dialog',
    dragSelect: 'Drag Select',
    dragKanban: 'Drag Kanban',
    charts: 'Charts',
    keyboardChart: 'Keyboard Chart',
    lineChart: 'Line Chart',
    mixChart: 'Mix Chart',
    example: 'Example',
    nested: 'Nested Routes',
    menu1: 'Menu 1',
    'menu1-1': 'Menu 1-1',
    'menu1-2': 'Menu 1-2',
    'menu1-2-1': 'Menu 1-2-1',
    'menu1-2-2': 'Menu 1-2-2',
    'menu1-3': 'Menu 1-3',
    menu2: 'Menu 2',
    Table: 'Table',
    tableadd: 'Add',
    Tree: 'Tree',
    dynamicTable: 'Dynamic Table',
    dragTable: 'Drag Table',
    inlineEditTable: 'Inline Edit',
    complexTable: 'Complex Table',
    tab: 'Tab',
    form: 'Form',
    createArticle: 'Create Article',
    editArticle: 'Edit Article',
    articleList: 'Article List',
    errorPages: 'Error Pages',
    page401: '401',
    page404: '404',
    errorLog: 'Error Log',
    excel: 'Excel',
    exportExcel: 'Export Excel',
    selectExcel: 'Export Selected',
    mergeHeader: 'Merge Header',
    uploadExcel: 'Upload Excel',
    zip: 'Zip',
    pdf: 'PDF',
    exportZip: 'Export Zip',
    theme: 'Theme',
    clipboardDemo: 'Clipboard',
    i18n: 'I18n',
    externalLink: 'External Link',
    profile: 'Profile',

    dashboard: 'Dashboard',
    list: 'List',
    add: 'Add',
    detail: 'Detail',
    edit: 'Edit',
    delete: 'Delete',
    export: 'Export',
    import: 'Import',
    resetPasswords: 'Reset Passwords',
    system: 'System',
    dataDictionary: 'Data Dictionary',
    authGroup: 'Auth Group',
    authGroupPermissions: 'Auth Group Permissions',
    authPermissions: 'Auth Permissions',
    auth: 'Auth'
  },
  navbar: {
    dashboard: 'Dashboard',
    github: 'Github',
    logOut: 'Log Out',
    profile: 'Profile',
    theme: 'Theme',
    size: 'Global Size'
  },
  login: {
    title: 'Login Form',
    logIn: 'Login',
    username: 'Username',
    password: 'Password',
    any: 'any',
    thirdparty: 'Or connect with',
    thirdpartyTips: 'Can not be simulated on local, so please combine you own business simulation! ! !'
  },
  documentation: {
    documentation: 'Documentation',
    github: 'Github Repository'
  },
  permission: {
    addRole: 'New Role',
    editPermission: 'Edit',
    roles: 'Your roles',
    switchRoles: 'Switch roles',
    tips: 'In some cases, using v-permission will have no effect. For example: Element-UI  el-tab or el-table-column and other scenes that dynamically render dom. You can only do this with v-if.',
    delete: 'Delete',
    confirm: 'Confirm',
    cancel: 'Cancel'
  },
  guide: {
    description: 'The guide page is useful for some people who entered the project for the first time. You can briefly introduce the features of the project. Demo is based on ',
    button: 'Show Guide'
  },
  components: {
    documentation: 'Documentation',
    tinymceTips: 'Rich text is a core feature of the management backend, but at the same time it is a place with lots of pits. In the process of selecting rich texts, I also took a lot of detours. The common rich texts on the market have been basically used, and I finally chose Tinymce. See the more detailed rich text comparison and introduction.',
    dropzoneTips: 'Because my business has special needs, and has to upload images to qiniu, so instead of a third party, I chose encapsulate it by myself. It is very simple, you can see the detail code in @/components/Dropzone.',
    stickyTips: 'when the page is scrolled to the preset position will be sticky on the top.',
    backToTopTips1: 'When the page is scrolled to the specified position, the Back to Top button appears in the lower right corner',
    backToTopTips2: 'You can customize the style of the button, show / hide, height of appearance, height of the return. If you need a text prompt, you can use element-ui el-tooltip elements externally',
    imageUploadTips: 'Since I was using only the vue@1 version, and it is not compatible with mockjs at the moment, I modified it myself, and if you are going to use it, it is better to use official version.'
  },
  table: {
    dynamicTips1: 'Fixed header, sorted by header order',
    dynamicTips2: 'Not fixed header, sorted by click order',
    dragTips1: 'The default order',
    dragTips2: 'The after dragging order',
    title: 'Title',
    importance: 'Imp',
    type: 'Type',
    remark: 'Remark',
    search: 'Search',
    add: 'Add',
    export: 'Export',
    reviewer: 'reviewer',
    id: 'ID',
    date: 'Date',
    author: 'Author',
    readings: 'Readings',
    status: 'Status',
    actions: 'Actions',
    edit: 'Edit',
    publish: 'Publish',
    draft: 'Draft',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm'
  },
  example: {
    warning: 'Creating and editing pages cannot be cached by keep-alive because keep-alive include does not currently support caching based on routes, so it is currently cached based on component name. If you want to achieve a similar caching effect, you can use a browser caching scheme such as localStorage. Or do not use keep-alive include to cache all pages directly. See details'
  },
  errorLog: {
    tips: 'Please click the bug icon in the upper right corner',
    description: 'Now the management system are basically the form of the spa, it enhances the user experience, but it also increases the possibility of page problems, a small negligence may lead to the entire page deadlock. Fortunately Vue provides a way to catch handling exceptions, where you can handle errors or report exceptions.',
    documentation: 'Document introduction'
  },
  excel: {
    export: 'Export',
    selectedExport: 'Export Selected Items',
    placeholder: 'Please enter the file name (default excel-list)'
  },
  zip: {
    export: 'Export',
    placeholder: 'Please enter the file name (default file)'
  },
  pdf: {
    tips: 'Here we use window.print() to implement the feature of downloading PDF.'
  },
  theme: {
    change: 'Change Theme',
    documentation: 'Theme documentation',
    tips: 'Tips: It is different from the theme-pick on the navbar is two different skinning methods, each with different application scenarios. Refer to the documentation for details.'
  },
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  },
  settings: {
    title: 'Page style setting',
    theme: 'Theme Color',
    tagsView: 'Open Tags-View',
    fixedHeader: 'Fixed Header',
    sidebarLogo: 'Sidebar Logo'
  },
  dataDictionary: {
    treeTitle: 'Add Dictionary Type',
    codeName: 'CodeName',
    codeValue: 'CodeValue',
    order: 'Order',
    status: 'Status',
    addDictionaryItem: 'Add Dictionary Item',
    editDictionaryItem: 'Edd Dictionary Item',
    typeName: 'TypeName',
    typeCode: 'TypeCode',
    remark: 'Remark'
  },
  authGroup: {
    name: 'Auth Group Name',
    status: 'Status',
    code: 'Code',
    remark: 'Remark'
  },
  tree: {
    placeholder: 'input key to filter',
    parentNode: 'Parent Node',
    disableDeleteWaring: 'The node is system node,can not delete',
    hasChildrenDeleteWaring: 'The node have chidren,can not delete'
  },
  button: {
    add: 'Add',
    edit: 'Edit',
    save: 'Save',
    delete: 'Delete',
    confirm: 'Confirm',
    cancel: 'Cancel',
    search: 'Search',
    exactSearch: 'Exact Search',
    reset: 'Reset',
    downloadTemplateFile: 'Download template file',
    import: "Import",
    addChoice: 'Add one choice',
    addBlank: 'Add on blanks'
  },
  validate: {
    required: 'It is required',
    max: 'Maxlength is ',
    mix: 'Minlength is ',
    loginUserNameRequired: 'Please enter user name',
    loginPasswordRequired: 'Please enter password'
  },
  confirm: {
    delete: 'Confirm delete the selection',
    warning: 'Warning',
    deleteSucced: 'Delete Succed'
  },
  message: {
    eidt_warning: 'Select one item',
    delete_warning: 'Select one or more item',
    authGroupCheck: 'Select one auth group',
    autCheck: 'select one auth',
    menusCheck: 'Select one or more menu',
    saveSuccess: 'Save success',
    deleteSuccess: 'Delete success',
    notSelectProjectBatch: 'Select Project Batch',
    setSourceCollegeSuccess: 'Set Source College Success',
    setHighestEducationSuccess: 'Set Highest Education Success'
  },
  auth: {
    username: 'User Name',
    nick_name: 'Nick Name',
    password: 'Password',
    mobile: 'Mobile',
    user_type: 'User Type',
    sortNo: 'SortNo',
    user_role: 'User Role',
    email: 'Email'
  },
  common: {
    remark: 'Remark',
    searchKey: 'input key to filter',
    operations: 'Operations',
    sequence: 'sequence',
    selectDate: 'select date',
    selectDateTime: 'select date and time',
    permissionDenied: 'Permission denied',
    select: 'select item'
  },
  annualTrainPlanInfo:{
    target:'Target',
    school:'School',
    year:'Year',
    remark:'Remark'
  },
  trainEventInfo:{
    teachers:'Teachers',
    plan:'Plan',
    start_date:'Start Date',
    end_date:'End Date',
    school:'School',
    budget:'Budget',
    enrollment_method:'Enrollment Method',
    project_nature:'Project Nature',
    train_type:'Train Type',
    train_form:'Train Form',
    train_amount:'Train Amount',
    train_hour:'Train Hour',
    section_subject:'Section Subject',
    status:'Status',
    remark:'Remark'
  },
  trainEventImplementationRecordInfo:{
    train_event:'Train Event',
    attachment:'Attachment',
    rich_text:'Rich Text',
    remark:'Remark'
  },
  trainEventSignInRecordInfo:{
    train_event:'Train Event',
    teacher:'Teacher',
    sign_in_time:'Sign In Time',
    remark:'Remark'
  },
  trainPlanCheckInfo:{
    plan:'Plan',
    status:'Status',
    check_time:'Check Time',
    current_check_status:'Current Check Status',
    user:'User',
    approve_comment:'Approve Comment',
    remark:'Remark'
  },
  trainEventFundsRecordInfo:{
    train_event:'Train Event',
    funds:'Funds',
    funds_time:'Funds Time',
    funds_explain:'Funds Explain',
    attachments:'Attachments',
    remark:'Remark'
  },
  trainEventClassHourInfo:{
    train_event:'Train Event',
    hours:'Hours',
    teacher:'Teacher',
    remark:'Remark'
  },
  trainEventClassHourDetailInfo:{
    class_hour:'Class Hour',
    attachment:'Attachment',
    attachment_explain:'Attachment Explain',
    remark:'Remark'
  },
  trainEventCheckInfo:{
    train_project:'Train Project',
    result:'Result',
    check_user:'Check User',
    check_time:'Check Time',
    remark:'Remark'
  },
  
}

