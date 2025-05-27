<template>
    <!-- <n-modal v-model:show="chooseModelVisible"> -->
    <n-card :title="$t('模型选择')" segmented class="w-600">
        <n-input-group class="mb-10">
            <n-input :placeholder="$t('搜索模型')" v-model:value="modelListFilterKey_test"></n-input>
        </n-input-group>
        <n-scrollbar style="max-height: 350px;">
        <!-- 常用模型 -->
        <template v-if="modelListSource['commonModelList'] && modelListSource['commonModelList'].length && !modelListFilterKey_test">
            <div class="common-use">
                <div class="common-tit">{{ $t("常用模型") }}</div>
                <div class="model-item" v-for="item in modelListSource['commonModelList']" :key="item.model"
                    @click="changeCurrentModel(item.model, item)">
                    <div class="item-label">
                        <span>{{ item.title }}</span>
                        <n-tag v-for="cap in item.capability.filter((i: string) => ['vision', 'tools'].includes(i))"
                            :key="cap" type="info" ghost>{{ cap }}</n-tag>
                    </div>
                    <i class="i-tdesign:check-circle w-16 h-16 text-[var(--bt-theme-color)]"
                        v-if="item.title == showModel_test"></i>
                </div>
            </div>
        </template>
        <template v-else>
            <div></div>
        </template>
        <n-divider style="margin: 5px 0;"></n-divider>
        <!-- 模型列表 -->
        <div v-for="(value, key) in showModelList_test" :key="key" class="model-category">
            <div class="categort-name">
                <span class="name">{{ key }}</span>
            </div>
            <div class="model-item" v-for="item in value" :key="item.model"
                @click="changeCurrentModel(item.model, item)">
                <div class="item-label">
                    <span>{{ item.title }}</span>
                    <n-tag v-for="cap in item.capability.filter((i: string) => ['vision', 'tools'].includes(i))"
                        :key="cap" type="info" ghost>{{ cap }}</n-tag>
                </div>
                <i class="i-tdesign:check-circle w-16 h-16 text-[var(--bt-theme-color)]"
                    v-if="item.title == showModel_test"></i>
            </div>
        </div>
        </n-scrollbar>
    </n-card>
    <!-- </n-modal> -->
</template>

<script setup lang="ts">
import { changeCurrentModel } from "@/views/Header/controller"
import { getThirdPartyApiStoreData } from '@/views/ThirdPartyApi/store';
import { getHeaderStoreData } from '../store';
import { getChatToolsStoreData } from '@/views/ChatTools/store';
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n()
const { chooseModelVisible } = getHeaderStoreData()
const { currentSupplierName, } = getThirdPartyApiStoreData()
const { modelList, modelListSource, currentModel, modelListFilterKey, showModel, showModelList } = getHeaderStoreData()
const { chatMask } = getChatToolsStoreData()

// 展示模型列表
const showModel_test = ref(false)
// 用于过滤数据的关键字
const modelListFilterKey_test = ref("")
// 计算：根据过滤条件生成展示模型列表
const showModelList_test = computed(() => {
    const newList: any = {};
    for (const key in modelListSource.value) {
      if (key !== "commonModelList") {
        if (modelListFilterKey_test.value) {
          newList[key] = modelListSource.value[key].filter((item: any) => item.model.includes(modelListFilterKey_test.value.toLowerCase()));
        } else {
          newList[key] = modelListSource.value[key];
        }
      }
    }
    return newList;
  })
// 匹配服务商的列表集合
const supplierCollection: any = {
    Ollama: "Ollama",
    qanwen: "百炼-通义千问"
}

// watch(showModel, (val) => {
//     if (val) {
//         chatMask.value = {
//             status: false,
//             notice: ""
//         }
//     } else {
//         chatMask.value = {
//             status: true,
//             notice: $t("当前对话使用的模型已被禁用或删除，请重新启用或切换模型", [currentModel.value])
//         }
//     }
// }, { immediate: true })
</script>

<style scoped lang="scss">
@use "@/assets/base.scss";

.model-category {
    .categort-name {
        height: 40px;
        @include base.row-flex-between;
        cursor: pointer;
        background: base.$gray-2;
        box-sizing: border-box;
        padding: 0 10px;

        .name {
            font-weight: bold;
        }
    }
}

.model-item {
    padding: 5px;
    transition: .2s;
    cursor: pointer;
    @include base.row-flex-between;

    &:hover {
        background-color: var(--bt-theme-color-hover)
    }

    .item-label {
        @include base.row-flex-between;
        justify-content: flex-start;
    }
}

.common-use {
    box-sizing: border-box;
    margin: 10px 0;

    .common-tit {
        background: base.$gray-2;
        height: 40px;
        @include base.row-flex-between;
        box-sizing: border-box;
        padding: 0 10px;
        font-weight: bold;
    }
}
</style>