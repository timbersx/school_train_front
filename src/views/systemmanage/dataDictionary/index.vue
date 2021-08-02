<template>
    <div class="app-container">
        <el-container style="height: 650px; border: 1px solid #eee">
            <el-aside style="width:30%;border: 1px solid #eee">
                <et-tree-dialog :loading="listLoading" :title="$t('dataDictionary.treeTitle')" :treeData="treeData" :unshift="true" :filter="true" :dialogItem="treeDialogItem" showKey="name" :disableItem="disableItem" @clickNode="handleClickTypeNode" @addNode="handleAddTypeNode"
                    @editNode="handleEditTypeNode" @delNode="handleDelTypeNode" style="padding-top:10px" node-key="id"></et-tree-dialog>
            </el-aside>
    
            <el-container v-if="dialogData.type>0">
                <el-main>
                    <div>
                        <div class="filter-container">
                            <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleAddCode">{{ $t('table.add') }}</el-button>
                            <!-- <el-button
                    class="filter-item"
                    type="primary"
                    icon="el-icon-edit"
                    @click="handleEditCode"
                  >{{ $t('table.edit') }}</el-button>
                  <el-button
                    class="filter-item"
                    type="primary"
                    icon="el-icon-delete"
                    @click="handleDeleteCode"
                  >{{ $t('table.delete') }}</el-button> -->
                        </div>
                        <el-table :loading="listLoading" :data="tableList" border fit highlight-current-row @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" stripe>
                            <el-table-column v-for="(item, index) in listColumns" :key="index" :prop="item" :label="$t(`dataDictionary.${item}`)">
                                <template slot-scope="scope">
                      <span>{{scope.row[item]}}</span>
</template>
              </el-table-column>

              <el-table-column
                fixed='right'
                :label="$t('common.operations')"
                width='130'
              >
<template slot-scope='scope'>
    <el-button @click='handleEditCode(scope.row)' type='text' size='small'>
        {{ $t('route.edit') }}</el-button>
    <el-button @click='handleDeleteCode(scope.row)' type='text' size='small' style='color:red'>{{ $t('route.delete') }}</el-button>
</template>
              </el-table-column>
            </el-table>

            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="listParameters.pageSizes"
              layout="total, sizes, prev, pager, next, jumper"
              :total="listParameters.total"
              class="pagination-container"
            ></el-pagination>

            <el-dialog
              :visible.sync="dialogFormVisible"
              :title="textMap[dialogStatus]"
            >
              <el-form
                ref="dataForm"
                :model="dialogData"
                label-width="100px"
                :rules="rules"
                label-suffix=":"
              >
                <el-form-item :label="$t('dataDictionary.typeName')">{{dictionaryType.name}}</el-form-item>
                <el-form-item
                  :label="$t('dataDictionary.name')"
                  prop="name"
                >
                  <el-input v-model="dialogData.name"></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('dataDictionary.code')"
                  prop="code"
                >
                  <el-input v-model="dialogData.code"></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('dataDictionary.remark')"
                  prop="remark"
                >
                  <el-input v-model="dialogData.remark"></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('dataDictionary.sortNo')"
                  prop="sortNo"
                >
                  <el-input
                    v-model="dialogData.sortNo"
                    type="number"
                  ></el-input>
                </el-form-item>
              </el-form>
              <div
                slot="footer"
                class="dialog-footer"
              >
                <el-button @click="dialogFormVisible = false">{{ $t('button.cancel') }}</el-button>
                <el-button
                  type="primary"
                  @click="dialogStatus==='create'?handleAddDialogData():handleUpdateDialogData()"
                >{{ $t('button.confirm') }}</el-button>
              </div>
            </el-dialog>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import EtTreeDialog from "@/components/EtTreeDialog";
import {
    getDatadictTypeList,
    createDatadictType,
    updateDatadictType,
    deleteDatadictType,
    getDatadictItemList,
    createDatadictItem,
    updateDatadictItem,
    deleteDatadictItem
} from "@/api/systemmanage/dataDictionary";
import { debuglog } from "util";
export default {
    components: {
        EtTreeDialog
    },
    data() {
        return {
            tableList: null, //table数据
            listLoading: true, //是否显示loading
            listSelection: [], //选择的行数据
            listParameters: {
                total: 0, //数据总数,默认为0
                pageSizes: [10, 20, 50, 100, 200], //翻页组件中的每页显示的数量
                page: 1,
                limit: 10
            },
            listColumns: ["name", "code", "remark", "sortNo"], //表中显示的列

            treeData: [],
            dictionaryType: {},
            treeDialogItem: [{
                    name: this.$t("dataDictionary.typeName"),
                    key: "name",
                    value: "",
                    rule: [{
                        required: true,
                        message: this.$t("validate.required"),
                        trigger: "blur"
                    }]
                },
                {
                    name: this.$t("dataDictionary.typeCode"),
                    key: "code",
                    value: "",
                    rule: [{
                        required: true,
                        message: this.$t("validate.required"),
                        trigger: "blur"
                    }]
                },
                {
                    name: this.$t("dataDictionary.remark"),
                    key: "remark",
                    value: "",
                    rule: []
                }
            ],
            disableItem: {
                key: "type",
                value: 0
            },
            dialogFormVisible: false,

            dialogStatus: "",
            textMap: {
                create: this.$t("dataDictionary.addDictionaryItem"),
                update: this.$t("dataDictionary.editDictionaryItem")
            },

            rules: {
                name: [{
                    required: true,
                    message: this.$t("validate.required"),
                    trigger: "change"
                }],
                code: [{
                    required: true,
                    message: this.$t("validate.required"),
                    trigger: "change"
                }]
            },

            dialogData: {
                name: "",
                code: "",
                remark: "",
                type: 0,
                sortNo: 0
            },
            formLabelWidth: "120px"
        };
    },
    created() {
        this.setTreeData();
    },
    methods: {
        /* =======左侧字典类型事件 begin=======*/
        setTreeData() {
            this.listLoading = true;
            getDatadictTypeList().then(response => {
                this.treeData = response.data;
                this.listLoading = false;
            });
        },
        handleClickTypeNode(node) {
            this.dictionaryType = node;
            this.dialogData.type = node.id;
            this.getDatadictItemList();
        },
        filterNodeData(nodeData, key) {
            return nodeData.filter(item => {
                return item.key === key;
            })[0].value;
        },
        handleAddTypeNode(node) {
            //将新增的节点写入数据库后，再次获取数据，重新加载treeData
            createDatadictType({
                    code: this.filterNodeData(node.nodeData, "code"),
                    name: this.filterNodeData(node.nodeData, "name"),
                    parent: node.parent_id,
                    remark: this.filterNodeData(node.nodeData, "remark")
                })
                .then(response => {
                    this.$message.success(this.$t("message.saveSuccess"));
                    this.setTreeData();
                })
                .catch(error => {
                    this.setTreeData();
                });
        },
        handleEditTypeNode(node) {
            //将新增的节点写入数据库后，再次获取数据，重新加载treeData
            updateDatadictType(node.id, {
                    code: this.filterNodeData(node.nodeData, "code"),
                    name: this.filterNodeData(node.nodeData, "name"),
                    parent: node.parent_id,
                    remark: this.filterNodeData(node.nodeData, "remark")
                })
                .then(response => {
                    this.$message.success(this.$t("message.saveSuccess"));
                    this.setTreeData();
                })
                .catch(error => {
                    this.setTreeData();
                });
        },
        handleDelTypeNode(node) {
            //将新增的节点写入数据库后，再次获取数据，重新加载treeData
            deleteDatadictType(node.id).then(response => {
                this.$message.success(this.$t("message.deleteSuccess"));
                this.setTreeData();
            });
        },

        /* =======左侧字典类型事件 end=======*/

        /* =======字典明细 begin=======*/
        getDatadictItemList() {
            // 根据字典类型获取字典详情 
            getDatadictItemList({
                type_id: this.dialogData.type,
                limit: this.listParameters.limit,
                offset: this.listParameters.limit * (this.listParameters.page - 1)
            }).then(response => {
                this.tableList = response.data;
                this.listParameters.total = response.count;
            });
        },
        handleSelectionChange(val) {
            this.listSelection = val;
        },
        tableRowClassName({ row, rowIndex }) {
            //  table 行背景class,如下为 字段status == deleted时，该行的class 为 warning-row
            // if (row.status === "deleted") {
            //   return "warning-row";
            // }
            return "";
        },
        handleAddCode() {
            this.resetDialogData();
            this.dialogFormVisible = true;
            this.dialogStatus = "create";
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        handleEditCode(row) {
            this.dialogData = Object.assign({}, row);
            this.dialogStatus = "update";
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            })
        },
        handleDeleteCode(row) {
            this.$confirm(this.$t("confirm.delete"), this.$t("confirm.warning"), {
                    confirmButtonText: this.$t("button.confirm"),
                    cancelButtonText: this.$t("button.cancel"),
                    type: "warning"
                })
                .then(async () => {
                    deleteDatadictItem(row.id).then(response => {
                        this.$message.success(this.$t("message.deleteSuccess"));
                        this.getDatadictItemList();
                    });
                })
                .catch(err => {
                    console.error(err);
                })
        },
        /* =======翻页事件 begin=======*/
        handleSizeChange(val) {
            this.listParameters.limit = val;
            this.getDatadictItemList();
        },
        handleCurrentChange(val) {
            this.listParameters.page = val;
            this.getDatadictItemList();
        },
        /* =======翻页事件 end=======*/

        /* =======dialog事件 begin=======*/
        //重制dialog中的内容
        resetDialogData() {
            this.dialogData.name = "";
            this.dialogData.code = "";
            this.dialogData.remark = "";
            this.dialogData.sortNo = 0;
        },
        handleAddDialogData() {
            //新增字典明细
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    createDatadictItem(this.dialogData).then(item => {
                        this.$message.success(this.$t("message.saveSuccess"));
                        this.dialogFormVisible = false;
                        this.getDatadictItemList();
                    });
                } else {
                    return false;
                }
            });
        },
        handleUpdateDialogData() {
            //更新字典明细
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    updateDatadictItem(this.dialogData.id, {
                        name: this.dialogData.name,
                        code: this.dialogData.code,
                        type: this.dialogData.type,
                        remark: this.dialogData.remark,
                        sortNo: this.dialogData.sortNo
                    }).then(item => {
                        this.$message.success(this.$t("message.saveSuccess"));
                        this.dialogFormVisible = false;
                        this.getDatadictItemList();
                    });
                } else {
                    return false;
                }
            });
        },
        /* =======dialog事件 end=======*/

        /* =======字典明细 end=======*/
        handleSaveFrom(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    alert("submit!");
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>

</style>
