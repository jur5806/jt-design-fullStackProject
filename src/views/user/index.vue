<template>
  <div class="user-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="user-card">
          <div class="user-avatar">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </div>
          <div class="user-info">
            <h3>{{ userInfo.nickname || userInfo.username }}</h3>
            <p class="user-role">{{ userInfo.role }}</p>
            <p class="user-meta">
              注册时间：{{ userInfo.createTime }}
            </p>
            <p class="user-meta">
              上次登录：{{ userInfo.lastLoginTime }}
            </p>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
              <el-button type="primary" @click="handleEdit">编辑</el-button>
            </div>
          </template>
          
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">
              {{ userInfo.username }}
            </el-descriptions-item>
            <el-descriptions-item label="昵称">
              {{ userInfo.nickname }}
            </el-descriptions-item>
            <el-descriptions-item label="邮箱">
              {{ userInfo.email }}
            </el-descriptions-item>
            <el-descriptions-item label="角色">
              {{ userInfo.role }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
        
        <el-card class="mt-20">
          <template #header>
            <div class="card-header">
              <span>安全设置</span>
            </div>
          </template>
          
          <div class="security-list">
            <div class="security-item">
              <div class="security-info">
                <h4>账户密码</h4>
                <p>建议您定期更改密码，设置一个安全性高的密码</p>
              </div>
              <el-button @click="handleChangePassword">修改密码</el-button>
            </div>
            
            <div class="security-item">
              <div class="security-info">
                <h4>邮箱绑定</h4>
                <p>已绑定邮箱：{{ userInfo.email || '未绑定' }}</p>
              </div>
              <el-button @click="handleBindEmail">
                {{ userInfo.email ? '修改' : '绑定' }}
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 编辑信息对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑个人信息"
      width="500px"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="80px"
      >
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="editForm.nickname" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
    
    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="passwordDialogVisible"
      title="修改密码"
      width="500px"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdatePassword">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { updateUserInfo, updatePassword, uploadAvatar } from '@/api/user'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo || {})

// 上传相关
const uploadUrl = `${import.meta.env.VITE_API_URL}/api/user/avatar`
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${userStore.token}`
}))

// 编辑表单相关
const editDialogVisible = ref(false)
const editFormRef = ref<FormInstance>()
const editForm = reactive({
  nickname: '',
  email: ''
})

const editRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

// 密码表单相关
const passwordDialogVisible = ref(false)
const passwordFormRef = ref<FormInstance>()
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 方法
const handleEdit = () => {
  editForm.nickname = userInfo.value.nickname || ''
  editForm.email = userInfo.value.email || ''
  editDialogVisible.value = true
}

const handleSave = async () => {
  if (!editFormRef.value) return
  
  try {
    await editFormRef.value.validate()
    await updateUserInfo(editForm)
    await userStore.getUserInfo()
    ElMessage.success('保存成功')
    editDialogVisible.value = false
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  }
}

const handleChangePassword = () => {
  passwordDialogVisible.value = true
}

const handleUpdatePassword = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    await updatePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })
    ElMessage.success('密码修改成功，请重新登录')
    await userStore.logout()
  } catch (error: any) {
    ElMessage.error(error.message || '修改失败')
  }
}

const handleBindEmail = () => {
  handleEdit()
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  userStore.getUserInfo()
  ElMessage.success('头像上传成功')
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
    return false
  }
  return true
}
</script>

<style scoped lang="scss">
.user-container {
  padding: 20px;
  
  .user-card {
    text-align: center;
    
    .user-avatar {
      margin: 20px 0;
      
      .avatar-uploader {
        :deep(.el-upload) {
          border: 1px dashed var(--el-border-color);
          border-radius: 50%;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: var(--el-transition-duration-fast);
          
          &:hover {
            border-color: var(--el-color-primary);
          }
        }
        
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 100px;
          height: 100px;
          text-align: center;
          line-height: 100px;
        }
        
        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: block;
        }
      }
    }
    
    .user-info {
      h3 {
        margin: 10px 0;
      }
      
      .user-role {
        color: #666;
        margin: 5px 0;
      }
      
      .user-meta {
        color: #999;
        font-size: 12px;
        margin: 5px 0;
      }
    }
  }
  
  .mt-20 {
    margin-top: 20px;
  }
  
  .security-list {
    .security-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      border-bottom: 1px solid #eee;
      
      &:last-child {
        border-bottom: none;
      }
      
      .security-info {
        h4 {
          margin: 0 0 10px;
        }
        
        p {
          color: #666;
          margin: 0;
        }
      }
    }
  }
}
</style>