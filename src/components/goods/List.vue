<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="100px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="90px"></el-table-column>
        <el-table-column label="商品数量" prop="goods_number" width="90px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="160px">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="medium"
              @click="showEditDialog(scope.row.goods_id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="medium"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>

    <!-- 编辑参数对话框 -->
    <el-dialog title="修改商品" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        // 查询参数对象
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      goodslist: [], // 商品列表
      total: 0, // 总数据条数
      editFormRules: {         //   添加表单的验证规则
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
      },
      editDialogVisible: false,     // 控制编辑对话框的 显示与隐藏
      editForm: {},      // 修改表单数据对象
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败！");
      }
      this.$message.success("获取商品列表成功！");
      this.goodslist = res.data.goods;
      this.total = res.data.total;
    },

    // 监听 页码大小改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },

    // 监听页码值改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },

    // 点击添加跳转到 添加商品页面
    goAddpage() {
      this.$router.push("/goods/add");
    },

    // 点击编辑按钮，显示编辑对话框，发送请求, 获取修改前的数据
    async showEditDialog (id) {
      const { data: res } = await this.$http.get(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品信息失败！')
      }
      this.editForm = res.data
      console.log(this.editForm)
      this.editDialogVisible = true
    },
    // 监听关闭对话框，重置修改表单
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },

    // 点击 编辑确定按钮， 发送请求修改商品信息
    editGoods() {
       this.$refs.editFormRef.validate(async valid => {          // 表单预校验
        if (!valid) return
        const { data: res } = await this.$http.put('goods/' + this.editForm.goods_id,
          {
            goods_name: this.editForm.goods_name,
            goods_price: this.editForm.goods_price,
            goods_number: this.editForm.goods_number,
            goods_weight: this.editForm.goods_weight,
            goods_introduce: this.editForm.goods_introduce,
            pics: this.editForm.pics,
            attrs: this.editForm.attrs,
            goods_cat: this.editForm.goods_cat,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改商品信息失败！')
        }
        this.$message.success('修改商品信息成功！')
        this.getGoodsList()
        this.editDialogVisible = false
      })
    },

    // 监听删除按钮点击 ，删除数据
    async removeById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除！");
      }
      const { data: res } = await this.$http.delete("goods/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除商品失败！");
      }
      this.$message.success("删除商品成功！");
      this.getGoodsList();
    }
  }
};
</script>

<style lang="less" scoped>
</style>