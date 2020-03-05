<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色列表区 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 二级权限 ，三级权限-->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="500px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="medium" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="medium" @click="removeRoleById(scope.row.id)">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="medium"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色的对话框 -->
      <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
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

    <!-- 编辑角色的对话框 -->
      <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="40%" @close="editDialogClosed">
        <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRole()">确 定</el-button>
        </span>
      </el-dialog>

    <!-- 分配权限 对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
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
      roleList: [], // 所有角色列表数据
      addDialogVisible: false, // 控制 添加角色对话框的显示与隐藏
      addForm: {
        // 添加角色的表单数据
        roleName: "",
        roleDesc: "",
      },
      //   添加角色表单验证
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      editForm: '',         // 查询到的角色信息对象
      editDialogVisible: false,
      setRightDialogVisible: false, // 控制 分配权限对话框 的显示与隐藏
      rightsList: [], // 所有权限列表
      //  树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children"
      },
      defKeys: [],    // 默认选中的节点 Id值数组
      roleId: ''    // 当前即将 分配权限的角色 id
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败！");
      }
      this.roleList = res.data;
    },

    // 点击确定按钮，对整个表单进行验证， 验证Role成功后添加新角色
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        // 发送 添加用户的请求
        const { data: res } = await this.$http.post("roles", this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加角色失败");
        }
        this.$message.success("添加角色成功");
        this.addDialogVisible = false; // 隐藏添加用户的对话框
        this.getRoleList(); // 重新获取用户列表数据
      });
    },

    // 监听 添加角色对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },

    // 展示编辑角色的 对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) {
        this.$message.error("查询角色信息失败");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },

    // 点击确定按钮，对整个表单进行验证， 验证Role成功后 发起 角色信息修改请求
    editRole() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        // 发送 添加用户的请求
        const { data: res } = await this.$http.put("roles/" + this.editForm.roleId, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        });
        if (res.meta.status !== 200) {
          this.$message.error("修改角色失败");
        }
        this.$message.success("修改角色成功");
        this.editDialogVisible = false; // 隐藏添加用户的对话框
        this.getRoleList(); // 重新获取用户列表数据
      });
    },

    // 监听 编辑角色对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },

    //根据 Id 删除角色信息
    async removeRoleById(id) {
      // 弹框 询问角色是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // 如果角色确认删除， 则返回值为字符串 confirm, 取消删除，返回值为  cancel
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除角色失败");
      }
      this.$message.success("删除角色成功！");
      this.getRoleList();
    },

    // 根据 Id 删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除!");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );

      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败！");
      }
      this.$message.success("删除用户成功！");
      // this.getRolesList()
      role.children = res.data; // 将该角色下的所有权限重新赋值即可， 不要重新刷新页面
    },

    // 展示分配权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败！");
      }
      this.rightsList = res.data; // 获取权限树
      console.log(this.rightsList);

      // 递归获取三级节点的Id
      this.getLeafkeys(role, this.defKeys);
      this.setRightDialogVisible = true; // 打开对话框
    },

    // 通过递归 获取角色下三级权限的 id, 并保存到defKeys数组
    getLeafkeys(node, arr) {
      // 没有children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => this.getLeafkeys(item, arr));
    },

    // 监听 分配权限对话框的 关闭事件, 清空默认选中的节点 Id值数组
    setRightDialogClosed() {
      this.defKeys = []
    },

    // 点击确定按钮 为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})

      if(res.meta.status !== 200) {
        return this.$message.error('分配权限失败!')
      }
      this.$message.success('分配权限成功!')
      this.getRoleList()                  // 刷新权限列表
      this.setRightDialogVisible = false      // 关闭对话框
    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

/* 垂直居中 */
.vcenter {
  display: flex;
  align-items: center;
}
</style>
