<!--/*
 * @Name:
 * @Module:
 * @Desc:
 * @Author: Elliot.Wang
 * @Date: 2019-08-12 10:09:22
 * @Last Modified by:   Elliot.Wang
 * @Last Modified time: 2019-08-12 10:09:22
 * @param {String} [dataFrom]    - 数据类型：baseInfo 从基本信息中获取用户
                                           getProjectBatchNotAssignedStudents 获取项目批次中未分配班级的学生
                                           getExamProjectNotAssignedStudents 获取考试项目中所选培训批次中未分配考试项目的学生
 * @param {Number} [dataFromId]    - 数据来源为非baseinfo，的表的id,数据来源为非baseinfo时，必须有
 * @param {Number} [examProjectBatchId]    - 考试项目中的培训批次id
 * @param {Boolean} [showColumnList]    - table中显示的字段，默认为所有
 * @param {Boolean} [showConfirm]    - 是否显示确定按钮，默认显示,true
 * @param {Boolean} [showReset]    - 是否显示重置按钮，默认显示,true
 * @param {Boolean} [showImage]    - table中是否显示image字段，默认不显示，false
 * @param:  {Method} [change]  - 选项改变事件
 * @example:
 <et-student-table  @change='handleGetStudent'></et-student-table>
*/-->

<template>
    <div class='app-container'>
        <et-drawer :drawerVisible.sync='drawerVisible' direction='top' :confirmBtnName="$t('button.search')" :scroll="true" @close='handleExactSearchCancle' @cancle='handleExactSearchCancle' @confirm='handleExactSearchConfirm' height='55%' @reset='handleExactSearchReset'>
            <el-form ref='exactSearchForm' label-width='100px' :model='exactSearchData' label-suffix=':'>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.code')" prop='code'>
                        <el-select v-model='exactSearchData.code.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'code'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.code.type !='code__isnull' && exactSearchData.code.type !='code__notnull'" v-model='exactSearchData.code.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.name')" prop='name'>
                        <el-select v-model='exactSearchData.name.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'name'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.name.type !='name__isnull' && exactSearchData.name.type !='name__notnull'" v-model='exactSearchData.name.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.e_name')" prop='e_name'>
                        <el-select v-model='exactSearchData.e_name.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'e_name'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.e_name.type !='e_name__isnull' && exactSearchData.e_name.type !='e_name__notnull'" v-model='exactSearchData.e_name.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.image')" prop='image'>
                        <el-select v-model='exactSearchData.image.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'image'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.image.type !='image__isnull' && exactSearchData.image.type !='image__notnull'" v-model='exactSearchData.image.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.sex')" prop='sex'>
                        <el-select v-model='exactSearchData.sex__name.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'sex__name'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.sex__name.type !='sex__name__isnull' && exactSearchData.sex__name.type !='sex__name__notnull'" v-model='exactSearchData.sex__name.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.id_type')" prop='id_type'>
                        <el-select v-model='exactSearchData.id_type__name.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'id_type__name'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.id_type__name.type !='id_type__name__isnull' && exactSearchData.id_type__name.type !='id_type__name__notnull'" v-model='exactSearchData.id_type__name.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.id_no')" prop='id_no'>
                        <el-select v-model='exactSearchData.id_no.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'id_no'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.id_no.type !='id_no__isnull' && exactSearchData.id_no.type !='id_no__notnull'" v-model='exactSearchData.id_no.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.birth_date')" prop='birth_date'>
                        <el-select v-model='exactSearchData.birth_date.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in dateFilter" :key="item.value" :label="item.label" :value="'birth_date'+item.value">
                            </el-option>
                        </el-select>
                        <el-date-picker v-show="exactSearchData.birth_date.type !='birth_date__isnull' && exactSearchData.birth_date.type !='birth_date__notnull' && exactSearchData.birth_date.type !='birth_date__range'" v-model="exactSearchData.birth_date.value" type='date'
                            :placeholder="$t('common.selectDate')" value-format='yyyy-MM-dd' class='exactSearchInput' popper-class='exactSearchSelectZIndex' />
                        <el-date-picker v-show="exactSearchData.birth_date.type =='birth_date__range'" v-model="exactSearchData.birth_date.value_range" type='daterange' :placeholder="$t('common.selectDate')" value-format='yyyy-MM-dd' class='exactSearchInput' popper-class='exactSearchSelectZIndex'
                        />
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.birth_site')" prop='birth_site'>
                        <el-select v-model='exactSearchData.birth_site.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'birth_site'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.birth_site.type !='birth_site__isnull' && exactSearchData.birth_site.type !='birth_site__notnull'" v-model='exactSearchData.birth_site.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.hjdz_sheng')" prop='hjdz_sheng'>
                        <el-select v-model='exactSearchData.hjdz_sheng.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'hjdz_sheng'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.hjdz_sheng.type !='hjdz_sheng__isnull' && exactSearchData.hjdz_sheng.type !='hjdz_sheng__notnull'" v-model='exactSearchData.hjdz_sheng.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.hjdz_shi')" prop='hjdz_shi'>
                        <el-select v-model='exactSearchData.hjdz_shi.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'hjdz_shi'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.hjdz_shi.type !='hjdz_shi__isnull' && exactSearchData.hjdz_shi.type !='hjdz_shi__notnull'" v-model='exactSearchData.hjdz_shi.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.hjdz_qu')" prop='hjdz_qu'>
                        <el-select v-model='exactSearchData.hjdz_qu.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'hjdz_qu'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.hjdz_qu.type !='hjdz_qu__isnull' && exactSearchData.hjdz_qu.type !='hjdz_qu__notnull'" v-model='exactSearchData.hjdz_qu.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.jtzz_sheng')" prop='jtzz_sheng'>
                        <el-select v-model='exactSearchData.jtzz_sheng.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'jtzz_sheng'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.jtzz_sheng.type !='jtzz_sheng__isnull' && exactSearchData.jtzz_sheng.type !='jtzz_sheng__notnull'" v-model='exactSearchData.jtzz_sheng.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.jtzz_shi')" prop='jtzz_shi'>
                        <el-select v-model='exactSearchData.jtzz_shi.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'jtzz_shi'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.jtzz_shi.type !='jtzz_shi__isnull' && exactSearchData.jtzz_shi.type !='jtzz_shi__notnull'" v-model='exactSearchData.jtzz_shi.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.jtzz_qu')" prop='jtzz_qu'>
                        <el-select v-model='exactSearchData.jtzz_qu.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'jtzz_qu'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.jtzz_qu.type !='jtzz_qu__isnull' && exactSearchData.jtzz_qu.type !='jtzz_qu__notnull'" v-model='exactSearchData.jtzz_qu.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.jtzz_xx')" prop='jtzz_xx'>
                        <el-select v-model='exactSearchData.jtzz_xx.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'jtzz_xx'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.jtzz_xx.type !='jtzz_xx__isnull' && exactSearchData.jtzz_xx.type !='jtzz_xx__notnull'" v-model='exactSearchData.jtzz_xx.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.xzz_sheng')" prop='xzz_sheng'>
                        <el-select v-model='exactSearchData.xzz_sheng.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'xzz_sheng'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.xzz_sheng.type !='xzz_sheng__isnull' && exactSearchData.xzz_sheng.type !='xzz_sheng__notnull'" v-model='exactSearchData.xzz_sheng.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.xzz_shi')" prop='xzz_shi'>
                        <el-select v-model='exactSearchData.xzz_shi.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'xzz_shi'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.xzz_shi.type !='xzz_shi__isnull' && exactSearchData.xzz_shi.type !='xzz_shi__notnull'" v-model='exactSearchData.xzz_shi.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.xzz_qu')" prop='xzz_qu'>
                        <el-select v-model='exactSearchData.xzz_qu.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'xzz_qu'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.xzz_qu.type !='xzz_qu__isnull' && exactSearchData.xzz_qu.type !='xzz_qu__notnull'" v-model='exactSearchData.xzz_qu.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.xzz_xx')" prop='xzz_xx'>
                        <el-select v-model='exactSearchData.xzz_xx.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'xzz_xx'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.xzz_xx.type !='xzz_xx__isnull' && exactSearchData.xzz_xx.type !='xzz_xx__notnull'" v-model='exactSearchData.xzz_xx.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.mobile_phone')" prop='mobile_phone'>
                        <el-select v-model='exactSearchData.mobile_phone.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'mobile_phone'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.mobile_phone.type !='mobile_phone__isnull' && exactSearchData.mobile_phone.type !='mobile_phone__notnull'" v-model='exactSearchData.mobile_phone.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.email_address')" prop='email_address'>
                        <el-select v-model='exactSearchData.email_address.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'email_address'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.email_address.type !='email_address__isnull' && exactSearchData.email_address.type !='email_address__notnull'" v-model='exactSearchData.email_address.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.wx_number')" prop='wx_number'>
                        <el-select v-model='exactSearchData.wx_number.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'wx_number'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.wx_number.type !='wx_number__isnull' && exactSearchData.wx_number.type !='wx_number__notnull'" v-model='exactSearchData.wx_number.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.qq_number')" prop='qq_number'>
                        <el-select v-model='exactSearchData.qq_number.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'qq_number'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.qq_number.type !='qq_number__isnull' && exactSearchData.qq_number.type !='qq_number__notnull'" v-model='exactSearchData.qq_number.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.emergency_contact')" prop='emergency_contact'>
                        <el-select v-model='exactSearchData.emergency_contact.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'emergency_contact'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.emergency_contact.type !='emergency_contact__isnull' && exactSearchData.emergency_contact.type !='emergency_contact__notnull'" v-model='exactSearchData.emergency_contact.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.emergency_contact_phone')" prop='emergency_contact_phone'>
                        <el-select v-model='exactSearchData.emergency_contact_phone.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'emergency_contact_phone'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.emergency_contact_phone.type !='emergency_contact_phone__isnull' && exactSearchData.emergency_contact_phone.type !='emergency_contact_phone__notnull'" v-model='exactSearchData.emergency_contact_phone.value' class='exactSearchInput'
                            type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.zzmm')" prop='zzmm'>
                        <el-select v-model='exactSearchData.zzmm__name.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'zzmm__name'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.zzmm__name.type !='zzmm__name__isnull' && exactSearchData.zzmm__name.type !='zzmm__name__notnull'" v-model='exactSearchData.zzmm__name.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.hyzk')" prop='hyzk'>
                        <el-select v-model='exactSearchData.hyzk__name.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'hyzk__name'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.hyzk__name.type !='hyzk__name__isnull' && exactSearchData.hyzk__name.type !='hyzk__name__notnull'" v-model='exactSearchData.hyzk__name.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.jkzk')" prop='jkzk'>
                        <el-select v-model='exactSearchData.jkzk__name.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'jkzk__name'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.jkzk__name.type !='jkzk__name__isnull' && exactSearchData.jkzk__name.type !='jkzk__name__notnull'" v-model='exactSearchData.jkzk__name.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.source_college')" prop='source_college'>
                        <el-select v-model='exactSearchData.source_college.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'source_college'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.source_college.type !='source_college__isnull' && exactSearchData.source_college.type !='source_college__notnull'" v-model='exactSearchData.source_college.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.highest_education')" prop='highest_education'>
                        <el-select v-model='exactSearchData.highest_education.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'highest_education'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.highest_education.type !='highest_education__isnull' && exactSearchData.highest_education.type !='highest_education__notnull'" v-model='exactSearchData.highest_education.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('baseInfo.user')" prop='user'>
                        <el-select v-model='exactSearchData.user__username.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'user__username'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.user__username.type !='user__username__isnull' && exactSearchData.user__username.type !='user__username__notnull'" v-model='exactSearchData.user__username.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item :label="$t('customerInfo.remark')" prop='remark'>
                        <el-select v-model='exactSearchData.remark.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'remark'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.remark.type !='remark__isnull' && exactSearchData.remark.type !='remark__notnull'" v-model='exactSearchData.remark.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
            </el-form>
        </et-drawer>
        <div class='filter-container' style='float: left;'>
            <el-input v-model='searchKey' :placeholder="$t('common.searchKey')" style='width: 300px;' class='filter-item' @keyup.enter.native='handleFilter' v-if="dataFrom=='baseInfo'" />
            <el-select v-if="dataFrom=='getExamProjectNotAssignedStudents'" v-model='dataProjectBatchClassId' class='items' :placeholder="$t('common.select')" filterable value-key='id' @change="handleChangeProjectBatchClass">
                <el-option v-for='item in project_batch_class_Operations' :key='item.id' :label='item.name' :value='item.id'></el-option>
            </el-select>
    
            <el-button type='primary' icon='el-icon-search' class='filter-item' @click='handleFilter' v-if="dataFrom=='baseInfo'">{{ $t('button.search') }}</el-button>
            <el-button type='primary' icon='el-icon-zoom-in' class='filter-item' @click="drawerVisible = true" v-if="dataFrom=='baseInfo'">{{ $t('button.exactSearch') }}</el-button>
            <el-button type='primary' class='filter-item' v-if="showConfirm" @click="handleConfirm">{{ $t('button.confirm') }}</el-button>
            <el-button type='primary' class='filter-item' v-if="showReset" @click="handleReset">{{ $t('button.reset') }}</el-button>
        </div>
        <el-table ref="studentTable" v-loading='listLoading' :data='list' border fit highlight-current-row @selection-change='handleSelectionChange' :row-class-name='tableRowClassName' stripe :row-key="getRowKeys">
            <el-table-column type="selection" width="55" :reserve-selection="true">
            </el-table-column>
            <el-table-column v-for='(item, index) in listColumns' :key='index' :prop='item' :label="$t(`baseInfo.${item}`)">
                <template slot-scope='scope'>
                                                                            <span>{{item | getColumnContent(scope.row[item])}}</span>
</template>
           </el-table-column>
          <el-table-column
             :label="$t('baseInfo.image')" v-if="showImage"
          >
<template slot-scope='scope'>
    <img :src="scope.row.image" width='70' height='70' />
</template>
          </el-table-column> 
      </el-table>
      <el-pagination
          background
          @size-change='handleSizeChange'
          @current-change='handleCurrentChange'
          :page-sizes='listParameters.pageSizes'
          layout='total, sizes, prev, pager, next, jumper'
          :total='listParameters.total'
          class='pagination-container'
       ></el-pagination>
  </div>
</template>

<script>
import { getBaseInfoList, deleteBaseInfo, exportBaseInfo } from '@/api/studentinfo/baseInfo'
import { getOperationsRoute } from '@/utils/operations'
import fileDownload from 'js-file-download'
import EtDrawer from '@/components/EtDrawer'
import { charFilter, intFilter, dateFilter } from '@/api/filterType'
import { exactSearchFilterData } from '@/utils/exactSearchFilter'
import { getProjectBatchStudents, getProjectBatchNotAssignedStudents } from '@/api/teachingmanage/projectBatch'
import { getBatchClassList } from '@/api/teachingmanage/batchClass'
export default {
    components: {
        EtDrawer
    },
    filters: {
        //返回每列显示的内容，用于处理外键等需要处理等内容，如无特别处理的，则直接返回内容
        //item:字段名称，content:字段内容
        getColumnContent(item, content) {
            switch (item) {
                case 'sex':
                    return content == null ? content : content.name
                case 'id_type':
                    return content == null ? content : content.name
                case 'zzmm':
                    return content == null ? content : content.name
                case 'hyzk':
                    return content == null ? content : content.name
                case 'jkzk':
                    return content == null ? content : content.name
                case 'user':
                    return content == null ? content : content.username
                case 'source_college':
                    return content == null ? content : content.name
                case 'highest_education':
                    return content == null ? content : content.name
                case 'hire_source':
                    return content == null ? content : content.name
                default:
                    return content
            }
        }
    },
    props: {
        showColumnList: {
            type: Array,
            default: () => {
                return ['code', 'name', 'e_name', 'sex', 'id_type', 'id_no', 'birth_date', 'birth_site', 'hire_source', 'hjdz_sheng', 'hjdz_shi', 'hjdz_qu', 'jtzz_sheng', 'jtzz_shi', 'jtzz_qu', 'jtzz_xx', 'xzz_sheng', 'xzz_shi', 'xzz_qu', 'xzz_xx', 'mobile_phone', 'email_address', 'wx_number', 'qq_number', 'emergency_contact', 'emergency_contact_phone', 'zzmm', 'hyzk', 'jkzk', 'source_college', 'highest_education', 'user', 'remark'];
            }
        },
        // 是否显示重置按钮
        showReset: {
            type: Boolean,
            default: true
        },
        // 是否显示确定按钮
        showConfirm: {
            type: Boolean,
            default: true
        },
        showImage: {
            type: Boolean,
            default: false
        },
        //数据来源,默认为从baseinfo获取数据
        dataFrom: {
            type: String,
            default: 'baseInfo'
        },
        //数据来源为非baseinfo的表的id,数据来源为非baseinfo时，必须有，dataFrom为考试项目时，是考试项目的id
        dataFromId: {
            type: Number,
            default: 0
        },
        //考试项目的批次id
        examProjectBatchId: {
            type: Number,
            default: 0
        },
    },
    watch: {
        dataFromId: {
            deep: true,
            handler(nv, ov) {
                // debugger
                this.dataFromId = nv
                this.getListData()
            }
        }
    },
    data() {
        return {
            searchKey: '',
            list: null, //table数据
            listLoading: true, //是否显示loading
            listSelection: [], //选择的行数据
            listParameters: {
                total: 0, //数据总数,默认为0
                pageSizes: [10, 20, 50, 100, 200], //翻页组件中的每页显示的数量
                page: 1,
                limit: 10,
            },
            listColumns: this.showColumnList, //表中显示的列
            showOperations: false, //是否显示操作列
            detailRoute: {}, //操作列详情
            editRoute: {}, //操作列编辑
            deleteRoute: {}, //操作列删除
            drawerVisible: false, //是否显示精确查找
            apiQueryData: {}, //调用接口传递的参数
            exactSearchData: { //精确查找的model
                code: { value: '', type: '', value_range: '' },
                name: { value: '', type: '', value_range: '' },
                e_name: { value: '', type: '', value_range: '' },
                image: { value: '', type: '', value_range: '' },
                sex__name: { value: '', type: '', value_range: '' },
                id_type__name: { value: '', type: '', value_range: '' },
                id_no: { value: '', type: '', value_range: '' },
                birth_date: { value: '', type: '', value_range: '' },
                birth_site: { value: '', type: '', value_range: '' },
                hjdz_sheng: { value: '', type: '', value_range: '' },
                hjdz_shi: { value: '', type: '', value_range: '' },
                hjdz_qu: { value: '', type: '', value_range: '' },
                jtzz_sheng: { value: '', type: '', value_range: '' },
                jtzz_shi: { value: '', type: '', value_range: '' },
                jtzz_qu: { value: '', type: '', value_range: '' },
                jtzz_xx: { value: '', type: '', value_range: '' },
                xzz_sheng: { value: '', type: '', value_range: '' },
                xzz_shi: { value: '', type: '', value_range: '' },
                xzz_qu: { value: '', type: '', value_range: '' },
                xzz_xx: { value: '', type: '', value_range: '' },
                mobile_phone: { value: '', type: '', value_range: '' },
                email_address: { value: '', type: '', value_range: '' },
                wx_number: { value: '', type: '', value_range: '' },
                qq_number: { value: '', type: '', value_range: '' },
                emergency_contact: { value: '', type: '', value_range: '' },
                emergency_contact_phone: { value: '', type: '', value_range: '' },
                zzmm__name: { value: '', type: '', value_range: '' },
                hyzk__name: { value: '', type: '', value_range: '' },
                jkzk__name: { value: '', type: '', value_range: '' },
                source_college: { value: '', type: '', value_range: '' },
                highest_education: { value: '', type: '', value_range: '' },
                user__username: { value: '', type: '', value_range: '' },
                remark: { value: '', type: '', value_range: '' },
            },
            charFilter,
            intFilter,
            dateFilter,
            project_batch_class_Operations: [], //批次班级数组
            dataProjectBatchClassId: '', //选中的批次班级id

        }
    },
    created() {
        if (this.dataFrom == "getExamProjectNotAssignedStudents") {
            getBatchClassList({
                limit: 100000000,
                offset: 0,
                project_batch__id: this.examProjectBatchId
            }).then(response => {
                this.project_batch_class_Operations = response.data
            })
        }
        this.getListData()
    },
    methods: {

        /* =======table事件 begin=======*/
        getRowKeys(row) {
            return row.id
        },
        tableRowClassName({ row, rowIndex }) {
            //  table 行背景class,如下为 字段status == deleted时，该行的class 为 warning-row
            // if (row.status === 'deleted') {
            //   return 'warning-row'
            // }
            return ''
        },
        handleSelectionChange(val) {
            // debugger
            this.listSelection = val
            // this.$emit("selectStudent",this.listSelection)
        },
        getListData() {
            this.listLoading = true
            if (this.dataFrom == "baseInfo") {
                getBaseInfoList(this.apiQueryData).then(response => {
                    this.list = response.data
                    this.listParameters.total = response.count
                    this.listLoading = false
                })
            } else if (this.dataFrom == "getProjectBatchNotAssignedStudents") {
                getProjectBatchNotAssignedStudents(this.dataFromId, this.apiQueryData).then(response => {
                    this.list = response.data
                    this.listParameters.total = response.count
                    this.listLoading = false
                })
            } else if (this.dataFrom == "getExamProjectNotAssignedStudents") {
                //没有班级时，显示所有班级中的学生
                if (this.dataProjectBatchClassId == "") {
                    getProjectBatchNotAssignedStudents(this.dataFromId, this.apiQueryData).then(response => {
                        this.list = response.data
                        this.listParameters.total = response.count
                        this.listLoading = false
                    })
                }
                else if(this.dataProjectBatchClassId >0)
                {
                    getProjectBatchNotAssignedStudents(this.dataFromId, this.apiQueryData).then(response => {
                        this.list = response.data
                        this.listParameters.total = response.count
                        this.listLoading = false
                    })
                }
            }
        },
        /* =======table事件 end=======*/
        /* =======搜索事件 begin=======*/
        handleFilter() {
            //搜索事件，需要根据具体页面查询条件编写
            this.apiQueryData = {
                limit: this.listParameters.limit,
                offset: this.listParameters.limit * (this.listParameters.page - 1),
                search: this.searchKey
            }
            this.getListData()
        },
        /* =======搜索事件 end=======*/

        /* =======翻页事件 begin=======*/
        handleSizeChange(val) {
            this.listParameters.limit = val
            this.apiQueryData.limit = this.listParameters.limit
            this.getListData()
        },
        handleCurrentChange(val) {
            this.listParameters.page = val
            this.apiQueryData.offset = this.listParameters.limit * (this.listParameters.page - 1)
            this.getListData()
        },
        /* =======翻页事件 end=======*/
        /* =======精确查找事件 begin=======*/
        handleExactSearchCancle() {},
        handleExactSearchConfirm() {
            this.apiQueryData = exactSearchFilterData(this.listParameters.limit, this.listParameters.limit * (this.listParameters.page - 1), this.exactSearchData)
            this.getListData()
        },
        handleExactSearchReset() {
            for (let item in this.exactSearchData) {
                this.exactSearchData[item].type = ''
                this.exactSearchData[item].value = ''
                this.exactSearchData[item].value_range = ''
            }
        },
        /* =======精确查找事件 end=======*/
        /* =======确定选择和重置事件 begin=======*/
        handleConfirm() {
            this.$emit("selectStudent", this.listSelection)
        },
        handleReset() {
            this.listSelection = []
            this.$refs.studentTable.clearSelection()
        },
        /* =======确定选择和重置事件 end=======*/

        /* =======批次班级选择事件 begin=======*/
        handleChangeProjectBatchClass(val) {
            this.getListData()
        }
        /* =======批次班级选择事件 end=======*/
    }
}
</script>

<style lang='scss'>
.el-table .warning-row {
    background: #f5c0c0;
}
</style>