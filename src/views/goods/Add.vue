<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :active="+activeIndex" finish-status="success" :align-center="true">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="ruleFormAdd"
        ref="ruleFormAdd"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyTabData" :label="item.attr_name" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(cb, i) in item.attr_vals" :label="cb" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTabData" :label="item.attr_name" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor ref="myQuillEditor" v-model="addForm.goods_introduce" />
            <el-button type="primary" class="addbtn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!--图片预览窗口-->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="25%">
      <img :src="previewPath" alt="预览图片" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      ruleFormAdd: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      cateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyTabData: [],
      onlyTabData: [],
      uploadURL: 'https://www.liulongbin.top:8888/api/private/v1/upload',
      headerObj: {
        Authorization: sessionStorage.getItem('token')
      },
      previewVisible: false,
      previewPath: ''
    }
  },

  components: {},

  computed: {
    catId() {
      return this.addForm.goods_cat[2]
    }
  },

  methods: {
    async getCateList() {
      const { data: res } = await this.$request.get('categories')
      if (res.meta.status !== 200) {
        this.$message.error('获取商品分类失败')
        return false
      }
      this.cateList = res.data
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        return false
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    async tabClick() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$request.get(`categories/${this.catId}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) {
          this.$message.error('获取动态参数列表失败')
          return false
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTabData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$request.get(`categories/${this.catId}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) {
          this.$message.error('获取静态属性列表失败')
          return false
        }
        this.onlyTabData = res.data
      }
    },
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(i => i.pic === filePath)
      this.addForm.pics.splice(index, 1)
    },
    handleSuccess(response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
    },
    async add() {
      this.$refs.ruleFormAdd.validate(async valid => {
        if (!valid) {
          this.$message.error('表单校验失败,请填写必要的表单项')
          return false
        }
        this.manyTabData.forEach(i => {
          const info = {
            attr_id: i.attr_id,
            attr_value: i.attr_vals.join(' ')
          }
          this.addForm.attrs.push(info)
        })
        this.onlyTabData.forEach(i => {
          const info = {
            attr_id: i.attr_id,
            attr_value: i.attr_vals
          }
          this.addForm.attrs.push(info)
        })
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        const { data: res } = await this.$request.post('goods', form)
        if (res.meta.status !== 201) {
          this.$message.error('添加商品失败')
          return false
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
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

.el-steps {
  margin: 15px 0;
}

.el-checkbox {
  margin: 0 5px 0 0 !important;
}

.el-upload__tip {
  margin-bottom: 5px;
}

.previewImg {
  width: 100%;
}

.addbtn {
  margin-top: 10px;
}
</style>
