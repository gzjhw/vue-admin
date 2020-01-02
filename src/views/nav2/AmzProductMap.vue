<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.seller_skus" placeholder="SellerSku"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAmzProductMaps">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
				<el-form-item>
					<el-upload
                		class="upload"
                		:action="url"
                		:show-file-list="false"
                		:on-success="handleImportSuccess"
                		:before-upload="beforeImportUpload">
                		<el-button type="primary"  icon="el-icon-upload2" circle>点击上传</el-button>
            		</el-upload>
				</el-form-item>
			</el-form>
		</el-col>

		<!--导入、导出等操作按钮 -->       

		<!--列表-->
		<el-table :data="amzProductMaps" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="market" label="市场id" width="120" sortable>
			</el-table-column>
			<el-table-column prop="seller_id" label="亚马逊卖方id" width="100"  sortable>
			</el-table-column>
			<el-table-column prop="sku" label="本地Sku" width="100" sortable>
			</el-table-column>
			<el-table-column prop="model" label="款号" width="120" sortable>
			</el-table-column>
			<el-table-column prop="color" label="颜色" min-width="180"  sortable>
			</el-table-column>
			<el-table-column prop="size" label="尺寸" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="seller_skus" label="亚马逊sku" min-width="180" sortable>
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
				<el-form-item label="Sku" prop="sku">
					<el-input v-model="editForm.sku" :readonly=true ></el-input>
				</el-form-item>
				<el-form-item label="款式号" prop="model">
					<el-input v-model="editForm.model" ></el-input>
				</el-form-item>				
				<el-form-item label="颜色" prop="color">
					<el-input v-model="editForm.color" ></el-input>
				</el-form-item>
				<el-form-item label="尺寸" prop="size">
					<el-input type="text" v-model="editForm.size"></el-input>
				</el-form-item>
				<el-form-item label="亚马逊sku" prop="seller_skus">
					<el-input type="textarea" v-model="editForm.seller_skus"></el-input><span>映射多个亚马逊sku，用英文,隔开</span>
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
				<el-form-item label="Sku" prop="sku">
					<el-input v-model="addForm.sku" ></el-input>
				</el-form-item>
				<el-form-item label="款式号" prop="model">
					<el-input v-model="addForm.model" ></el-input>
				</el-form-item>				
				<el-form-item label="颜色" prop="color">
					<el-input v-model="addForm.color" ></el-input>
				</el-form-item>
				<el-form-item label="尺寸" prop="size">
					<el-input type="text" v-model="addForm.size"></el-input>
				</el-form-item>
				<el-form-item label="亚马逊sku" prop="seller_skus">
					<el-input type="textarea" v-model="addForm.seller_skus"></el-input><span>映射多个亚马逊sku，用英文,隔开</span>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<style>
   /* .paginationClass{
        margin-left:10px;
    }
    .paginationClass span .el-pagination .el-pagination__sizes{
       margin:0 10px 0 0;
    }
    .el-pagination .el-input input {
        width: 100px;
    }
    .el-form-item{
        margin-left:20px;
    }
    .el-input--small input.el-input__inner {
        width: 150px;
    }
   .el-input--small input.el-input__inner[name=trxtrc] {
        width: 100px;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: auto;
    }
    .el-input--small .el-input__inner {
        height: 32px;
        line-height: 32px;
        width: 160px;
    }*/
    .upload {
        display:inline-block;
    }
    .upload input{
         display:none;
    }
    .el-button {
        margin-left: 10px;
    }

</style>

<script>
	let base = '';

	let base1 = '/api/v1';


	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getAmzProductMapsListPage, removeAmzProductMaps, batchRemoveAmzProductMaps, editAmzProductMaps, addAmzProductMaps } from '../../api/api';

	export default {
		data() {
			return {
				url: `${base1}/amzProductMap/import`,
				filters: {
					seller_skus: ''
				},
				amzProductMaps: [],
				total: 0,
				page: 1,
				pageSize: 15,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					sku: [
						{ required: true, message: '请输入本地对应的时库', trigger: 'blur' }
					],
					model: [
						{ required: true, message: '请输入款式号', trigger: 'blur' }
					],
					color: [
						{ required: true, message: '请输入颜色', trigger: 'blur' }
					],
					size: [
						{ required: true, message: '请输入尺寸', trigger: 'blur' }
					],
					seller_skus: [
						{ required: true, message: '请输入对应的亚马逊Sku', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {					
					sku: '',
					model: '',
					color: '',
					size: 0,
					seller_skus: '',					
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					sku: [
						{ required: true, message: '请输入本地对应的时库', trigger: 'blur' }
					],
					model: [
						{ required: true, message: '请输入款式号', trigger: 'blur' }
					],
					color: [
						{ required: true, message: '请输入颜色', trigger: 'blur' }
					],
					size: [
						{ required: true, message: '请输入尺寸', trigger: 'blur' }
					],
					seller_skus: [
						{ required: true, message: '请输入对应的亚马逊Sku', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					sku: '',
					model: '',
					color: '',
					size: 0,
					seller_skus: '',	
				}

			}
		},
		methods: {			
			handleCurrentChange(val) {
				this.page = val;
				this.getAmzProductMaps();
			},
			//获取mwsconfig列表
			getAmzProductMaps() {
				let para = {
					page: this.page,
					phone: this.filters.phone,
					pageSize: this.pageSize
				};
				console.log(para);
				this.listLoading = true;
				//NProgress.start();
				getAmzProductMapsListPage(para).then((res) => {
					var data = res.data;
					if(res.status >= 400){
						this.$message({
							message: data.message,
							type: 'error'
						});
					} else {
						this.total = data.total;
						this.amzProductMaps = data.data;						
						//NProgress.done();
					}
					this.listLoading = false;
					
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
						id: row.id,						
					};
					removeAmzProductMaps(para).then((res) => {
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
								message: '删除成功',
								type: 'success'
							});
							this.getAmzProductMaps();
						}						
						
					});
					
				}).catch(() => {
					this.listLoading = false;	
				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {				
				this.editForm.sku = row.sku;
				this.editForm.model = row.model;
				this.editForm.color = row.color;
				this.editForm.size = row.size;	
				this.editForm.id = row.id;
				this.editForm.seller_sku = row.seller_sku;				
				this.editFormVisible = true;				
				
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					sku: '',
					model: '',
					color: '',
					size: '',
					seller_skus: '',	
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
							editAmzProductMaps(para).then((res) => {
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
								this.getAmzProductMaps();
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
							addAmzProductMaps(para).then((res) => {
								this.addLoading = false;
								var data = res.data;								
								var message = '';								
								if(res.status >= 400){
									message = data.message;
									if(data.errors){
										for(let i in data.errors) {
											switch(i){
												case 'sku':
													message = 'sku' + ':' + data.errors[i];
													break;
												case 'model':
													message = '款式号' + ':' + data.errors[i];
													break;
												case 'color':
													message = '颜色' + ':' + data.errors[i];
													break;
												case 'size':
													message = '尺寸' + ':' + data.errors[i];
													break;
												case 'seller_skus':
													message = '亚马逊Sku：' + ':' + data.errors[i];
													break;												
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
								this.getAmzProductMaps();
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
					batchRemoveAmzProductMaps(para).then((res) => {						
						console.log(res);
						var data = res.data;
						this.listLoading = false;
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
							this.getAmzProductMaps();
						}						
						
					});
				}).catch((e) => {
					console.log(e);
				});
			},

			//上传成功
        handleImportSuccess(res, file) {
            console.log(res);
            if(res.code == 0){
                if(res.errorData && res.errorData.length > 0){
                    var msg = '<h5>错误：</h5>';
                    console.log(res.errorData);
                    if(this.isArrayFn(res.errorData)){
                        for(var i = 0 ; i < res.errorData.length; i++){
                            msg = msg + '<p>' + res.errorData[i] + '</p>';
                        }
                    }else {
                        msg = msg+ '<p>' + res.msg + '</p>';
                    }
                    this.$message.error({
                        dangerouslyUseHTMLString: true,
                        showClose:true,
                        message: msg,
                    });
                }else {
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                }
            }else {
                var msg = '文件上传成功';
                if(this.local == 'en'){
                    msg = 'Successful file upload';
                }
                    this.$message({
                        message: msg,
                        type: 'success'
                    });
            }
        },
        beforeImportUpload(file) {
            console.log(file.type)
            const isExcel = (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel');
            const isLt2M = file.size / 1024 / 1024 < 2;
            var msg =[
                '上传文件只能是excel格式!',
                '上传文件大小不能超过 2MB!'
            ];

            if(this.local == 'en'){
                msg =[
                    'Upload files can only be in Excel format!',
                    'Upload file size should not exceed 2MB!'
                ];
            }

            if (!isExcel) {
                this.$message.error(msg[0]);
            }
            if (!isLt2M) {
                this.$message.error(msg[1]);
            }
            return isLt2M && isLt2M;
        },

        downloadFlow(){
            window.axios(
                {
                    method: 'post',
                    url:  '/admin/fabric/export',
                    responseType: 'blob', // 表明返回服务器返回的数据类型v
                    params:{
                        _token:window.axios.defaults.headers.common['X-CSRF-TOKEN']
                    }
                }
            ).then(res=>{
                const blob = new Blob([res.data])
                const downloadElement = document.createElement('a');
                const href = window.URL.createObjectURL(blob);
                downloadElement.href = href;
                var mydate = new Date();
                var name = mydate.toLocaleDateString();
                downloadElement.download = name + '面料流水.xlsx';  //文件名（自己随意设置）
                document.body.appendChild(downloadElement);
                downloadElement.click();
                document.body.removeChild(downloadElement) ;// 下载完成移除元素
                window.URL.revokeObjectURL(href); // 释放掉blob对象
            }).catch(function (error) {
                alert('Error! Could not reach the API. ' + error)
            });
        }

	},
		mounted() {
			console.log(1111);			
			this.getAmzProductMaps();
		}
	}

</script>

<style scoped>

</style>