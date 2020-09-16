<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card>
      <!--添加角色-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <el-table :data="rolesList" border>
        <!--扩展-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!--渲染一级权限-->
            <el-row
              :class="['bdbottom', 0 === i1 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRight(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级三级权限-->
              <el-col :span="19">
                <!--渲染二级权限-->
                <el-row
                  :class="[0 === i2 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="5">
                    <el-tag type="success" closable @close="removeRight(scope.row, item2.id)">
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!--渲染三级权限-->
                  <el-col :span="19">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRight(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--表格内容-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column prop="level" label="操作" width="400px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-setting"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-setting"
              size="mini"
              @click="removeRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--添加角色对话框-->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClose"
    >
      <el-form :model="addForm" :rules="ruleFormAdd" ref="ruleFormAdd" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改角色对话框-->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClose"
    >
      <el-form :model="editForm" :rules="ruleFormEdit" ref="ruleFormEdit" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配权限对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="40%"
      @close="setRightDialogClose"
    >
      <el-tree
        :data="rightsList"
        :props="treetProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      ruleFormAdd: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      editDialogVisible: false,
      editForm: {},
      ruleFormEdit: {
        roleName: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      },
      setRightDialogVisible: false,
      rightsList: [],
      treetProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      roleId: ''
    }
  },

  components: {},

  computed: {},

  methods: {
    async getRolesList() {
      const { data: res } = await this.$request.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取角色列表失败')
        return false
      }
      this.rolesList = res.data
    },
    addDialogClose() {
      this.$refs.ruleFormAdd.resetFields()
    },
    addRole() {
      this.$refs.ruleFormAdd.validate(async valid => {
        if (!valid) {
          this.$message.error('表单校验失败')
          return false
        }
        const { data: res } = await this.$request.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败')
          return false
        }
        this.$message.success('添加角色成功')
        this.addDialogVisible = false
        this.getRolesList()
      })
    },
    async showEditDialog(id) {
      const { data: res } = await this.$request.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        this.$message.error('获取角色信息失败')
        return false
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClose() {
      this.$refs.ruleFormEdit.resetFields()
    },
    editRole() {
      this.$refs.ruleFormEdit.validate(async valid => {
        if (!valid) {
          this.$message.error('表单校验失败')
          return false
        }
        const { data: res } = await this.$request.put(`roles/${this.editForm.roleId}`, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        })
        if (res.meta.status !== 200) {
          this.$message.error('修改角色失败')
          return false
        }
        this.$message.success('修改角色成功')
        this.editDialogVisible = false
        this.getRolesList()
      })
    },
    async removeRole(id) {
      const confirm = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirm !== 'confirm') {
        this.$message.info('已取消删除')
        return false
      }
      const { data: res } = await this.$request.delete(`roles/${id}`)
      if (res.meta.status !== 200) {
        this.$message.error('删除失败')
        return false
      }
      this.$message.success('删除成功')
      this.getRolesList()
    },
    async removeRight(role, rightId) {
      const confirm = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirm !== 'confirm') {
        this.$message.info('已取消删除')
        return false
      }
      const { data: res } = await this.$request.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        this.$message.error('删除失败')
        return false
      }
      this.$message.success('删除成功')
      role.children = res.data
    },
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$request.get('rights/tree')
      if (res.meta.status !== 200) {
        this.$message.error('获取权限数据失败')
        return false
      }
      this.$message.success('获取权限数据成功')
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    setRightDialogClose() {
      this.defKeys = []
    },
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$request.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        this.$message.error('分配权限失败')
        return false
      }
      this.$message.success('分配权限成功')
      this.setRightDialogVisible = false
      this.getRolesList()
    }
  },

  created() {
    this.getRolesList()
  }
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}

.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);

  .el-table {
    margin-top: 10px;

    .bdtop {
      border-top: 1px solid #eee;
    }

    .bdbottom {
      border-bottom: 1px solid #eee;
    }

    .el-tag {
      margin: 10px;
    }
  }
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
