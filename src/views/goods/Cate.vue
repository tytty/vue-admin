<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card>
      <!--添加分类-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen;"
          ></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="medium">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1" size="medium">二级</el-tag>
          <el-tag type="warning" v-else size="medium">三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showEditDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="removeCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!--添加分类对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClose"
    >
      <el-form :model="addForm" :rules="ruleFormAdd" ref="ruleFormAdd" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCatelist"
            :props="cascaderProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改分类对话框-->
    <el-dialog
      title="修改分类"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClose"
    >
      <el-form :model="editForm" :rules="ruleFormEdit" ref="ruleFormEdit" label-width="80px">
        <el-form-item label="角色名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addDialogVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      ruleFormAdd: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      parentCatelist: [],
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [],
      editDialogVisible: false,
      editForm: {},
      ruleFormEdit: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    }
  },

  components: {},

  computed: {},

  methods: {
    async getCateList() {
      const { data: res } = await this.$request.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        this.$message.error('获取商品分类失败')
        return false
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newValue) {
      this.queryInfo.pagesize = newValue
      this.getCateList()
    },
    handleCurrentChange(newValue) {
      this.queryInfo.pagenum = newValue
      this.getCateList()
    },
    showAddDialog() {
      this.getParentCateList()
      this.addDialogVisible = true
    },
    addDialogClose() {
      this.$refs.ruleFormAdd.resetFields()
      this.selectedKeys = []
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    },
    async getParentCateList() {
      const { data: res } = await this.$request.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        this.$message.error('获取父级分类列表失败')
        return false
      }
      this.parentCatelist = res.data
    },
    handleChange() {
      if (this.selectedKeys.length > 0) {
        this.addForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addForm.cat_level = this.selectedKeys.length
      } else {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
    },
    addCate() {
      this.$refs.ruleFormAdd.validate(async valid => {
        if (!valid) {
          this.$message.error('表单校验失败')
          return false
        }
        const { data: res } = await this.$request.post('categories', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加分类失败')
          return false
        }
        this.$message.success('添加分类成功')
        this.addDialogVisible = false
        this.getCateList()
      })
    },
    async showEditDialog(id) {
      const { data: res } = await this.$request.get(`categories/${id}`)
      if (res.meta.status !== 200) {
        this.$message.error('获取分类信息失败')
        return false
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClose() {
      this.$refs.ruleFormEdit.resetFields()
    },
    editCate() {
      this.$refs.ruleFormEdit.validate(async valid => {
        if (!valid) {
          this.$message.error('表单校验失败')
          return false
        }
        const { data: res } = await this.$request.put(`categories/${this.editForm.cat_id}`, {
          cat_name: this.editForm.cat_name
        })
        if (res.meta.status !== 200) {
          this.$message.error('修改分类失败')
          return false
        }
        this.$message.success('修改分类成功')
        this.editDialogVisible = false
        this.getCateList()
      })
    },
    async removeCate(id) {
      const confirm = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirm !== 'confirm') {
        this.$message.info('已取消删除')
        return false
      }
      const { data: res } = await this.$request.delete(`categories/${id}`)
      if (res.meta.status !== 200) {
        this.$message.error('删除失败')
        return false
      }
      this.$message.success('删除成功')
      this.getCateList()
    }
  },

  created() {
    this.getCateList()
  }
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}

.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);

  .el-row {
    margin-bottom: 10px;
  }

  .el-pagination {
    margin-top: 20px;
  }
}

.el-cascader {
  width: 100%;
}
</style>
