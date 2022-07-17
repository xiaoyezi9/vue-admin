<template>
  <Breadcrumb :breadList="breadList"></Breadcrumb>
  <el-card>
    <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon :closable="false" />
    <el-row class="cat_opt">
      <el-col>
        <span style="font-size:14px">请选择商品分类：</span>
        <el-cascader v-model="state.selectValue" clearable :options="state.cateList" :props="state.configProps" @change="handleChange" />
      </el-col>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisabled" @click="add">添加参数</el-button>
          <el-table :data="state.manyData" border stripe v-if="activeName=='many'" row-key='id'>
            <el-table-column type="expand" width="width">
              <template #default="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals"
                 :key="index" closable 
                 @close="handleClose(index, scope.row)">{{ item }}</el-tag>
                <el-input class="input-new-tag" 
                v-if="scope.row.inputVisible" 
                v-model="scope.row.inputValue"
                 ref="TagInput" size="small" 
                 @keyup.enter="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"></el-input>
                <el-button 
                v-else 
                class="button-new-tag"
                 size="small" 
                 @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" width="width"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="width"></el-table-column>
            <el-table-column label="操作" width="width">
              <template #default="scope">
                <el-button type="primary" @click="edit(scope.row.attr_id)">编辑</el-button>
                <el-button type="warning" @click="del(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisabled" @click="add">添加参数</el-button>
          <el-table :data="state.onlyData" border stripe v-if="activeName=='only'">
            <el-table-column type="expand" width="width"></el-table-column>
            <el-table-column type="index" width="width"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称" width="width"></el-table-column>
            <el-table-column label="操作" width="width">
              <template #default="scope">
                <el-button type="primary" @click="edit(scope.row.attr_id)">编辑</el-button>
                <el-button type="warning" @click="del(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </el-card>
  <!-- 添加对话框 -->
  <el-dialog v-model="dialogVisible" :title="'添加'+title" width="30%" @close="close">
    <el-form ref="addForm" :model="state.addForm" label-width="80px">
      <el-form-item :label="title" prop="attr_name">
        <el-input v-model="state.addForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addParams">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 修改对话框 -->
  <el-dialog v-model="edialogVisible" :title="'修改'+title" width="30%" @close="eclose">
    <el-form ref="eForm" :model="state.editForm" label-width="80px">
      <el-form-item label="参数名称" prop="attr_name">
        <el-input v-model="state.editForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="edialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editParams">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup >
import {
  ref,
  reactive,
  onMounted,
  getCurrentInstance,
  computed,
  nextTick,
  isRef,
  toRef
} from "vue";
const breadList = reactive([
  { text: "首页", path: "/" },
  { text: "商品管理", path: undefined },
  { text: "参数列表", path: undefined },
]);

const state = reactive({
  cateList: [],
  selectValue: [],
  configProps: {
    expandTrigger: "hover",
    value: "cat_id",
    label: "cat_name",
    children: "children",
  },
  //动态参数数据
  manyData: [],
  //静态参数数据
  onlyData: [],
  addForm: {
    attr_name: "",
  },
  editForm: {},
inputVisible:false,
inputValue:''
});
let activeName = ref("many");
let title = computed(() => {
  return activeName.value == "many" ? "动态参数" : "静态参数";
});
const dialogVisible = ref(false);
const addForm = ref(null);
const add = () => {
  dialogVisible.value = true;
};
const close = () => {
  addForm.value.resetFields();
};
const addParams = async () => {
  const res = await that.$API.reqAddAttr(cateId.value, {
    attr_name: state.addForm.attr_name,
    attr_sel: activeName.value,
  });
  if (res.meta.status == 201) {
    ElMessage.success("添加成功");
    dialogVisible.value = false;
    getParamsData();
  } else {
    ElMessage.error("添加失败");
  }
};
//修改属性相关操作
const edialogVisible = ref(false);
const eForm = ref(null);
const edit = async (attrId) => {
  edialogVisible.value = true;
  const res = await that.$API.reqAttrById(cateId.value, attrId, {
    attr_sel: activeName.value,
  });
  if (res.meta.status == 200) {
    state.editForm = res.data;
  }
};
const eclose = () => {
  eForm.value.resetFields();
};
const editParams = async () => {
  const res = await that.$API.reqMAttr(cateId.value, state.editForm.attr_id, {
    attr_name: state.editForm.attr_name,
    attr_sel: activeName.value,
  });
  if (res.meta.status == 200) {
    ElMessage.success("修改成功");
    dialogVisible.value = false;
    getParamsData();
  } else {
    ElMessage.error("修改失败");
  }
};
const del = (attrId) => {
  ElMessageBox.confirm("是否删除该属性(该操作无法撤回)", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await that.$API.reqDelAttr(cateId.value, attrId);
      if (res.meta.status == 200) {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
      }
      getParamsData();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
//添加新标签
 let TagInput = ref(null)
  const showInput = (block) => {
      block.inputVisible = true
      next()
    }
   const next = () => {
      nextTick(() => {
        if (TagInput.value !== null) {
        }
      })
    }
    const handleInputConfirm = async (block) => {
      block.inputVisible = false
      console.log(isRef(block.inputVisible));
      block.attr_vals.push(block.inputValue.trim())
      block.inputValue = ''
      const res =await that.$API.reqMAtt(cateId.value,block.attr_id, {
          attr_name: block.attr_name,
          attr_sel: block.attr_sel,
          attr_vals: block.attr_vals.join(' ')
        })
         if (res.meta.status !== 200) {
        ElMessage.error('更新失败')
      }
      ElMessage.success('更新成功')
    }
     async function handleClose(index, block) {
      block.inputVisible = false
      block.attr_vals.splice(index, 1)
    const res=  await that.$API.reqDelAttr(cateId.value,block.attr_id,)
      if (res.meta.status !== 200) {
         ElMessage.error('删除失败')
      }
      ElMessage.success('删除成功')
    }
//未选择分类时金庸
let isBtnDisabled = computed(() => {
  if (state.selectValue.length !== 3) {
    return true;
  } else {
    return false;
  }
});
//计算第三级id
let cateId = computed(() => {
  if (state.selectValue.length == 3) {
    return state.selectValue[2];
  } else {
    return null;
  }
});
const { proxy: that } = getCurrentInstance();
const handleChange = () => {
  getParamsData();
};
  const inputVisible=ref(false)
  const inputValue=ref('')
//获取参数数据
const getParamsData = async () => {
  //选中的不是三级分类
  if (state.selectValue.length !== 3) {
    state.selectValue = [];
    return;
  }

  const res = await that.$API.reqAttr(cateId.value, { sel: activeName.value });
  if (res.meta.status == 200) {
    res.data.forEach((item) => {
      item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
      item.inputVisible = toRef(state,'inputVisible');
      item.inputValue = toRef(state,'inputValue');
     

    });
    if (activeName.value == "many") {
      state.manyData = res.data;
    } else {
      state.onlyData = res.data;
    }
  } else {
    ElMessage.error("获取失败");
  }
};
const handleClick = () => {
  getParamsData();
}
//获取分类数据
const getCateList = async () => {
  const res = await that.$API.reqCateList();
  if (res.meta.status == 200) {
    state.cateList = res.data;
  } else {
    ElMessage.error("获取失败");
  }
}

onMounted(() => {
  getCateList();
})
</script>

<script>
export default {
  name: "Params",
};
</script>
<style lang='less' scoped>
.cat_opt {
  margin-top: 15px;
}
.demo-tabs {
  width: 80%;
}
.el-tag{
  margin: 0 7px 0 7px
}
.input-new-tag{
  width: 50px;
}
</style>