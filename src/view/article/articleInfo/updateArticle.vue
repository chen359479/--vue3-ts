<template>
  <el-container class="updateArticle">
    <el-header>
      <el-page-header :content="state.title" @back="emit('onCloseUp')" />
    </el-header>
    <el-main>
      <el-form ref="ruleForm" size="large" :model="state.articleInfo" :rules="state.rules" label-width="140px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="state.articleInfo.title" placeholder="请输入标题" :maxlength="255" />
        </el-form-item>

        <el-form-item label="价格" prop="price">
          <el-input-number v-model="state.articleInfo.price" :precision="2" :step="0.1" :max="99999" :min="0" />
        </el-form-item>

        <el-form-item label="折扣" prop="discount">
          <el-tooltip class="item" effect="dark" content="1为不打折，0.5为打五折" placement="right">
            <el-input-number v-model="state.articleInfo.discount" :precision="2" :step="0.1" :max="1" :min="0" />
          </el-tooltip>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch v-model="state.articleInfo.status" active-text="上架" inactive-text="下架" />
        </el-form-item>

        <el-form-item label="视频封面" prop="imageUrl">
          <el-upload
            class="avatar-uploader"
            action="/unapi/uploadFile"
            accept="image/jpg,image/jpeg,image/png"
            :headers="{ authorization: store.userInfo.token }"
            :on-success="coverUpload"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
          >
            <img v-if="state.articleInfo.imageUrl" :src="state.articleInfo.imageUrl" class="avatar" alt="视频封面">
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="视频类型" prop="videoType">
          <el-switch v-model="state.articleInfo.videoType" active-text="自行上传" inactive-text="外部链接" @change=" state.articleInfo.url = '' " />
        </el-form-item>

        <el-form-item v-if="state.articleInfo.videoType" label="视频上传" prop="url">
          <el-upload
            class="avatar-uploader"
            action="/unapi/uploadFile"
            :headers="{ authorization: store.userInfo.token }"
            accept=".mp4"
            :before-upload="videoBeforeUpload"
            :on-success="videoUpload"
            :show-file-list="false"
          >
            <video v-if="state.articleInfo.url" :src="state.articleInfo.url" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item v-else label="外链地址" prop="url">
          <el-input v-model="state.articleInfo.url" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submit(ruleForm)">提交</el-button>
          <el-button type="warning" @click="emit('onCloseUp')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { reactive, onMounted, defineProps, defineEmits, ref } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { userStore } from '@/store/user'
import { getArticleInfo as getArticleInfoApi, updateArticleInfo as updateArticleInfoApi, addArticleInfo as addArticleInfoApi } from '@/api/article'

const ruleForm = ref<FormInstance>()
const required = { required: true, message: '此项必填！', trigger: ['change', 'blur'] }
const store = userStore()
const props = defineProps<{
  id?: number,
  classID:number
}>()

const state = reactive({
  title: '',
  articleInfo: {
    title: '',
    price: 1,
    discount: 1,
    status: true,
    imageUrl: '',
    videoType: true,
    url: '',
    classID: props.classID
  },
  rules: {
    title: [
      required,
      { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
    ],
    price: [required],
    discount: [required],
    status: [required],
    imageUrl: [required],
    videoType: [required],
    url: [required]
  }
})
const emit = defineEmits(['onCloseUp'])

// 获取资源内容
let getArticleInfo = () => {
  getArticleInfoApi({ id: props.id || 1 }).then(res => {
    state.articleInfo = res.data
  })
}

let submit = (formEl: FormInstance) => {
  formEl.validate((valid) => {
    if (valid) {
      if (props.id) updateArticleInfo()
      else addArticleInfo()
    }
  })
}

// 新建资源
let addArticleInfo = () => {
  addArticleInfoApi(state.articleInfo).then(res => {
    ElMessage.success(res.msg)
    emit('onCloseUp')
  })
}

// 更新资源文件
let updateArticleInfo = () => {
  updateArticleInfoApi(state.articleInfo).then(res => {
    ElMessage.success(res.msg)
    emit('onCloseUp')
  })
}

// 封面上传成功
let coverUpload = (res: any) => {
  if (res.code === 200) {
    ElMessage.success('封面上传成功！')
    state.articleInfo.imageUrl = res.src
  } else ElMessage.error(res.msg)
}

// 视频上传成功
let videoUpload = (res:any) => {
  ElMessage.success('视频上传成功！')
  state.articleInfo.url = res.src
}

// 图片上传之前
let beforeAvatarUpload = (file:any) => {
  let img = file.name.substring(file.name.lastIndexOf('.') + 1)
  const suffix = img === 'jpg'
  const suffix2 = img === 'png'
  const suffix3 = img === 'jpeg'
  if (!suffix && !suffix2 && !suffix3) {
    ElMessage.error('只能上传图片！')
    return false
  }

  const isLt3M = file.size / 1024 / 1024 < 3
  if (!isLt3M) {
    ElMessage.error('上传的封面大小不能超过 3MB!')
  }
  return isLt3M
}

// 视频上传之前的检验
let videoBeforeUpload = (file:any) => {
  const isMP4 = file.name.split('.')[1] === 'mp4'
  if (!isMP4) {
    ElMessage.error('只能上传mp4视频')
    return false
  }
}

onMounted(() => {
  if (props.id) getArticleInfo()
})
</script>

<style >
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}
.avatar {
  width: 128px;
  height: 128px;
  display: block;
}
</style>
