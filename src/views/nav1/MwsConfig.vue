<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.phone" placeholder="注册手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getMwsConfigs">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="mwsconfigs" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="phone" label="手机号" width="120" sortable>
			</el-table-column>
			<el-table-column prop="seller_id" label="亚马逊卖方id" width="100"  sortable>
			</el-table-column>
			<el-table-column prop="auth_token" label="亚马逊授权令牌" width="100" sortable>
			</el-table-column>
			<el-table-column prop="marketplace" label="市场" width="120" sortable>
			</el-table-column>
			<el-table-column prop="isUse" label="可用别" min-width="180" :formatter="formatIsUse" sortable>
			</el-table-column>
			<el-table-column prop="schema" label="数据库模式" min-width="180" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">				
				<el-form-item label="亚马逊卖家id">
					<el-input v-model="editForm.seller_id" ></el-input>
				</el-form-item>
				<el-form-item label="亚马逊授权令牌">
					<el-input v-model="editForm.auth_token" ></el-input>
				</el-form-item>
				<el-form-item label="市场">
					<el-input v-model="editForm.marketplace"></el-input>
				</el-form-item>
				<el-form-item label="可用别">
					<el-radio-group v-model="editForm.isUse">
						<el-radio class="radio" label="1">开启</el-radio>
						<el-radio class="radio" label="0" >关闭</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="数据库模式">
					<el-input type="textarea" v-model="editForm.schema"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">				
				<el-form-item label="会员手机号" prop="phone">
					<el-input v-model="addForm.phone" ></el-input>
				</el-form-item>
				<el-form-item label="亚马逊卖家id" prop="seller_id">
					<el-input v-model="addForm.seller_id" ></el-input>
				</el-form-item>
				<el-form-item label="亚马逊授权令牌" prop="auth_token">
					<el-input v-model="addForm.auth_token" ></el-input>
				</el-form-item>
				<el-form-item label="市场" prop="marketplace">
					<el-input v-model="addForm.marketplace" prop="marketplace"></el-input>
				</el-form-item>				
				<el-form-item label="可用别" > 
					<el-radio-group v-model="addForm.isUse" prop="isUse">
						<el-radio class="radio" label="1" >开启</el-radio>
						<el-radio class="radio" label="0">关闭</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="数据库模式" prop="schema">
					<el-input v-model="addForm.schema"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getMwsConfigListPage, removeMwsConfig, batchRemoveMwsConfig, editMwsConfig, addMwsConfig } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					phone: ''
				},
				mwsconfigs: [],
				total: 0,
				page: 1,
				pageSize: 15,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					seller_id: [
						{ required: true, message: '请输入亚马逊卖方id', trigger: 'blur' }
					],
					auth_token: [
						{ required: true, message: '请输入亚马逊授权令牌', trigger: 'blur' }
					],
					auth_token: [
						{ required: true, message: '请输入亚马逊授权令牌', trigger: 'blur' }
					],
					marketplace: [
						{ required: true, message: '请输入市场编号', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {					
					id: 0,
					seller_id: '',
					auth_token: '',
					marketplace: 0,
					isUse: 0,
					schema: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					phone: [
						{ required: true, message: '请输入手机号', trigger: 'blur' }
					],
					seller_id: [
						{ required: true, message: '请输入亚马逊卖方id', trigger: 'blur' }
					],
					auth_token: [
						{ required: true, message: '请输入亚马逊授权令牌', trigger: 'blur' }
					],
					auth_token: [
						{ required: true, message: '请输入亚马逊授权令牌', trigger: 'blur' }
					],
					marketplace:[
						{ required: true, message: '请输入市场编号', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					phone: '',
					seller_id: '',
					auth_token: '',
					marketplace: '',
					isUse: "1",
					schema: '',
				}

			}
		},
		methods: {
			//可使用别
			formatIsUse: function (row, column) {
				return row.isUse == '1' ? '开启' : row.isUse == '0' ? '关闭' : '关闭';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getMwsConfigs();
			},
			//获取mwsconfig列表
			getMwsConfigs() {
				let para = {
					page: this.page,
					phone: this.filters.phone,
					pageSize: this.pageSize
				};
				console.log(para);
				this.listLoading = true;
				//NProgress.start();
				getMwsConfigListPage(para).then((res) => {
					var data = res.data;
					if(res.status >= 400){
						this.$message({
							message: data.message,
							type: 'error'
						});
					} else {
						this.total = data.total;
						this.mwsconfigs = data.data;
						this.mwsconfigs.forEach(function(e){
							e.phone = e.user.phone;
							if(e.isUse) {
								e.isUse = "1";
							}else {
								e.isUse = "0";
							}
							return e;
						});

						this.listLoading = false;
						//NProgress.done();
					}
					
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { 
						id:        row.id,						
					};
					removeMwsConfig(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						if(res.status >= 400){
							this.$message({
								message: data.message,
								type: 'error'
							});
						} else {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getMwsConfigs();
						}
					});
					
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {				
				this.editForm.auth_token = row.auth_token;
				this.editForm.isUse = row.isUse;
				this.editForm.seller_id = row.seller_id;
				this.editForm.marketplace = row.marketplace;	
				this.editForm.id = row.id;
				this.editForm.schema = row.schema;
				this.editForm.user_id = row.user_id;				
				this.editFormVisible = true;
				console.log(row)
				
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					phone: '15920126203',
					seller_id: 'hnkljhlkh',
					auth_token: '',
					marketplace: '',
					isUse: "1",
					schema: 'public'
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);							
							editMwsConfig(para).then((res) => {
								this.editLoading = false;
								var data = res.data;
								//NProgress.done();
								if(res.status >= 400){
									this.$message({
										message: data.message,
										type: 'error'
									});
								} else {
									this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getMwsConfigs();
								}
								
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);	
							console.log(111123);
							console.log(para);						
							addMwsConfig(para).then((res) => {
								this.addLoading = false;
								var data = res.data;								
								var message = '';								
								if(res.status >= 400){
									message = data.message;
									if(data.errors){
										for(let i in data.errors) {
											switch(i){
												case 'phone':
													message = '会员手机' + ':' + data.errors[i];
													break;
												case 'seller_id':
													message = '卖家id' + ':' + data.errors[i];
													break;
												case 'auth_token':
													message = '亚马逊授权令牌' + ':' + data.errors[i];
													break;
												case 'marketplace':
													message = '市场：' + ':' + data.errors[i];
													break;
												case 'isUse':
													message = '可用别：' + ':' + data.errors[i];
													break;
												case 'schema':
													message = '模式：' + ':'+ data.errors[i];
													break;				
												default:
													break;
											}
											
											break;
										}
									} 


									return this.$message({
										message: message,
										type: 'error'
									});
								}
								

								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getMwsConfigs();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				console.log(11155555);
				var ids = this.sels.map(item => item.id).toString();
				console.log(ids);
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids};
					batchRemoveMwsConfig(para).then((res) => {						
						console.log(res);
						this.listLoading = false;
						var data = res.data;
						//NProgress.done();
						if(res.status >= 400){
							this.$message({
								message: data.message,
								type: 'error'
							});
						} else {
							this.$message({
								message: '提交成功',
								type: 'success'
							});							
							this.getMwsConfigs();
						}						
						
					});
				}).catch((e) => {
					console.log(e);
				});
			}
		},
		mounted() {
			console.log(1111);
			this.getMwsConfigs();
		}
	}

</script>

<style scoped>

</style>