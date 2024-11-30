<template>
  <div class="files-container">
    <el-container>
      <!-- 左侧文件夹树 -->
      <el-aside width="250px" class="folder-tree">
        <div class="tree-header">
          <h3>文件夹</h3>
          <el-button type="primary" link @click="handleCreateRootFolder">
            <el-icon><Plus /></el-icon>新建根目录
          </el-button>
        </div>
        <el-tree
          ref="treeRef"
          :data="folderTree"
          :props="{ label: 'name', children: 'children' }"
          @node-click="handleNodeClick"
          default-expand-all
          highlight-current
        >
          <template #default="{ node, data }">
            <div class="custom-tree-node">
              <span>
                <el-icon><Folder /></el-icon>
                {{ node.label }}
              </span>
              <div class="node-actions" v-show="node.isCurrent">
                <el-button type="primary" link @click.stop="handleCreateSubFolder(data)">
                  <el-icon><Plus /></el-icon>
                </el-button>
                <el-button type="primary" link @click.stop="handleRenameFolder(data)">
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button type="danger" link @click.stop="handleDeleteFolder(data)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </template>
        </el-tree>
      </el-aside>

      <!-- 右侧文件列表 -->
      <el-main class="file-content">
        <div class="content-header">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/tools/files' }">文件库</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.id">
              {{ item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <div class="header-actions">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索文件"
              class="search-input"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="handleUpload" :disabled="!currentFolder">
              <el-icon><Upload /></el-icon>上传文件
            </el-button>
          </div>
        </div>

        <div class="file-list">
          <el-table
            :data="filteredFiles"
            style="width: 100%"
          >
            <el-table-column label="名称" min-width="300">
              <template #default="{ row }">
                <div class="file-name">
                  <el-icon :size="20" class="file-icon">
                    <component :is="getFileIcon(row)" />
                  </el-icon>
                  <span>{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column prop="size" label="大小" width="120">
              <template #default="{ row }">
                {{ formatFileSize(row.size) }}
              </template>
            </el-table-column>
            
            <el-table-column prop="createTime" label="创建时间" width="180" />
            
            <el-table-column prop="downloadCount" label="下载次数" width="120" />
            
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button-group>
                  <el-button 
                    v-if="row.type === 'file'"
                    type="primary" 
                    link
                    @click="handleDownload(row)"
                  >
                    <el-icon><Download /></el-icon>
                  </el-button>
                  <el-button 
                    type="primary" 
                    link
                    @click="handleRename(row)"
                  >
                    <el-icon><Edit /></el-icon>
                  </el-button>
                  <el-button 
                    type="danger" 
                    link
                    @click="handleDelete(row)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>

    <!-- 新建/重命名文件夹对话框 -->
    <el-dialog
      v-model="folderDialogVisible"
      :title="isEdit ? '重命名文件夹' : '新建文件夹'"
      width="400px"
    >
      <el-form
        ref="folderFormRef"
        :model="folderForm"
        :rules="folderRules"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="folderForm.name" placeholder="请输入文件夹名称" />
        </el-form-item>
        <el-form-item label="公开">
          <el-switch v-model="folderForm.isPublic" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="folderDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCreateFolder">确定</el-button>
      </template>
    </el-dialog>

    <!-- 上传文件对话框 -->
    <el-dialog
      v-model="uploadDialogVisible"
      title="上传文件"
      width="500px"
    >
      <el-upload
        class="file-uploader"
        drag
        multiple
        :action="`/api/tools/files/upload?parentId=${currentFolder?.id}`"
        :headers="uploadHeaders"
        :before-upload="beforeFileUpload"
        :on-success="handleFileSuccess"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持任意类型文件，单个文件不超过50MB
          </div>
        </template>
      </el-upload>
    </el-dialog>

    <!-- 重命名对话框 -->
    <el-dialog
      v-model="renameDialogVisible"
      title="重命名"
      width="400px"
    >
      <el-form
        ref="renameFormRef"
        :model="renameForm"
        :rules="renameRules"
        label-width="80px"
      >
        <el-form-item label="新名称" prop="name">
          <el-input v-model="renameForm.name" placeholder="请输入新名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="renameDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRename">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { 
  Search, 
  Folder, 
  Upload, 
  Download, 
  Edit, 
  Delete,
  Document,
  Picture,
  VideoCamera,
  Headset,
  Files,
  UploadFilled,
  Plus
} from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getFiles, createFolder, uploadFile, deleteFile, downloadFile, updateFile } from '@/api/tools'
import type { FileItem } from '@/api/types/tools'

// 状态
const currentPath = ref<number | null>(null)
const searchKeyword = ref('')
const files = ref<FileItem[]>([])
const breadcrumbs = ref<{ id: number; name: string }[]>([])

// 对话框状态
const folderDialogVisible = ref(false)
const uploadDialogVisible = ref(false)
const renameDialogVisible = ref(false)

// 表单相关
const folderFormRef = ref<FormInstance>()
const renameFormRef = ref<FormInstance>()

const folderForm = reactive({
  name: '',
  isPublic: false
})

const renameForm = reactive({
  id: 0,
  name: ''
})

const folderRules = {
  name: [
    { required: true, message: '请输入文件夹名称', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
  ]
}

const renameRules = {
  name: [
    { required: true, message: '请输入新名称', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
  ]
}

// 计算属性
const filteredFiles = computed(() => {
  let result = files.value
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(file => 
      file.name.toLowerCase().includes(keyword)
    )
  }
  
  return result
})

// 文件夹树相关
const treeRef = ref()
const folderTree = ref([])
const currentFolder = ref<FileItem | null>(null)
const isEdit = ref(false)

// 获取文件夹树
const fetchFolderTree = async () => {
  try {
    const { data } = await getFiles({ type: 'folder' })
    // 构建树形结构
    folderTree.value = buildTree(data)
  } catch (error: any) {
    ElMessage.error(error.message || '获取文件夹列表失败')
  }
}

// 构建树形结构
const buildTree = (folders: FileItem[]) => {
  const map = new Map()
  const result: any[] = []

  // 先创建所有节点的映射
  folders.forEach(folder => {
    map.set(folder.id, { ...folder, children: [] })
  })

  // 构建树形结构
  folders.forEach(folder => {
    const node = map.get(folder.id)
    if (folder.parentId === null) {
      result.push(node)
    } else {
      const parent = map.get(folder.parentId)
      if (parent) {
        parent.children.push(node)
      }
    }
  })

  return result
}

// 方法
const fetchFiles = async () => {
  try {
    const { data } = await getFiles({ parentId: currentPath.value })
    files.value = data
  } catch (error: any) {
    ElMessage.error(error.message || '获取文件列表失败')
  }
}

const handleCreateFolder = () => {
  folderForm.name = ''
  folderForm.isPublic = false
  folderDialogVisible.value = true
}

const submitCreateFolder = async () => {
  if (!folderFormRef.value) return
  
  try {
    await folderFormRef.value.validate()
    if (isEdit.value) {
      await updateFile(currentFolder.value!.id, folderForm)
      ElMessage.success('修改成功')
    } else {
      await createFolder(folderForm)
      ElMessage.success('创建成功')
    }
    folderDialogVisible.value = false
    fetchFolderTree()
    if (currentFolder.value) {
      fetchFiles()
    }
  } catch (error: any) {
    ElMessage.error(error.message || (isEdit.value ? '修改失败' : '创建失败'))
  }
}

const handleUpload = () => {
  uploadDialogVisible.value = true
}

const beforeFileUpload = (file: File) => {
  const isLt50M = file.size / 1024 / 1024 < 50

  if (!isLt50M) {
    ElMessage.error('文件大小不能超过 50MB!')
    return false
  }
  return true
}

const handleFileSuccess = () => {
  ElMessage.success('上传成功')
  fetchFiles()
}

const handleDownload = async (file: FileItem) => {
  try {
    const { data } = await downloadFile(file.id)
    // 创建下载链接
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([data]))
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    ElMessage.success('下载成功')
  } catch (error: any) {
    ElMessage.error(error.message || '下载失败')
  }
}

const handleRename = (file: FileItem) => {
  renameForm.id = file.id
  renameForm.name = file.name
  renameDialogVisible.value = true
}

const submitRename = async () => {
  if (!renameFormRef.value) return
  
  try {
    await renameFormRef.value.validate()
    await updateFile(renameForm.id, { name: renameForm.name })
    ElMessage.success('重命名成功')
    renameDialogVisible.value = false
    fetchFiles()
  } catch (error: any) {
    ElMessage.error(error.message || '重命名失败')
  }
}

const handleDelete = (file: FileItem) => {
  ElMessageBox.confirm(
    `确定要删除${file.type === 'folder' ? '文件夹' : '文件'} "${file.name}" 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteFile(file.id)
      ElMessage.success('删除成功')
      fetchFiles()
    } catch (error: any) {
      ElMessage.error(error.message || '删除失败')
    }
  }).catch(() => {})
}

const handleRowDblClick = (row: FileItem) => {
  if (row.type === 'folder') {
    currentPath.value = row.id
    breadcrumbs.value.push({ id: row.id, name: row.name })
    fetchFiles()
  }
}

const getFileIcon = (file: FileItem) => {
  if (file.type === 'folder') return Folder
  
  const imageExts = ['jpg', 'jpeg', 'png', 'gif']
  const videoExts = ['mp4', 'avi', 'mov']
  const audioExts = ['mp3', 'wav', 'ogg']
  
  const ext = file.extension?.toLowerCase()
  
  if (ext && imageExts.includes(ext)) return Picture
  if (ext && videoExts.includes(ext)) return VideoCamera
  if (ext && audioExts.includes(ext)) return Headset
  return Document
}

const formatFileSize = (size?: number) => {
  if (!size) return '-'
  
  const units = ['B', 'KB', 'MB', 'GB']
  let index = 0
  let value = size
  
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024
    index++
  }
  
  return `${value.toFixed(2)} ${units[index]}`
}

// 处理节点点击
const handleNodeClick = (data: FileItem) => {
  currentFolder.value = data
  fetchFiles()
}

// 处理创建根目录
const handleCreateRootFolder = () => {
  isEdit.value = false
  folderForm.name = ''
  folderForm.isPublic = false
  folderForm.parentId = null
  folderDialogVisible.value = true
}

// 处理创建子文件夹
const handleCreateSubFolder = (parentFolder: FileItem) => {
  isEdit.value = false
  folderForm.name = ''
  folderForm.isPublic = false
  folderForm.parentId = parentFolder.id
  folderDialogVisible.value = true
}

// 处理重命名文件夹
const handleRenameFolder = (folder: FileItem) => {
  isEdit.value = true
  folderForm.name = folder.name
  folderForm.isPublic = folder.isPublic
  folderForm.parentId = folder.parentId
  folderDialogVisible.value = true
}

// 处理删除文件夹
const handleDeleteFolder = (folder: FileItem) => {
  ElMessageBox.confirm(
    `确定要删除文件夹 "${folder.name}" 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteFile(folder.id)
      ElMessage.success('删除成功')
      fetchFolderTree()
    } catch (error: any) {
      ElMessage.error(error.message || '删除失败')
    }
  }).catch(() => {})
}

// 上传相关
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
}))

// 初始化
onMounted(() => {
  fetchFolderTree()
})
</script>

<style scoped lang="scss">
.files-container {
  height: 100%;
  
  .folder-tree {
    border-right: 1px solid var(--el-border-color-light);
    background-color: var(--el-bg-color);
    
    .tree-header {
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--el-border-color-light);
      
      h3 {
        margin: 0;
      }
    }
    
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 8px;
      
      .el-icon {
        margin-right: 8px;
        color: var(--el-text-color-secondary);
      }
      
      .node-actions {
        opacity: 0;
        transition: opacity 0.3s;
      }
      
      &:hover .node-actions {
        opacity: 1;
      }
    }
  }
  
  .file-content {
    .content-header {
      margin-bottom: 20px;
      
      .header-actions {
        margin-top: 15px;
        display: flex;
        gap: 15px;
        
        .search-input {
          width: 300px;
        }
      }
    }
  }
  
  // ... 其他样式保持不变 ...
}
</style> 